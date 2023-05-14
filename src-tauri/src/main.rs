// Prevents additional console window on Windows in release.
#![cfg_attr(
  not(debug_assertions),
  windows_subsystem = "windows"
)]

use std::collections::HashMap;
use std::sync::{Mutex, Arc};

use futures_util::{StreamExt, SinkExt};
use tokio::task::JoinHandle;
use tokio_util::sync::CancellationToken;

use tauri::Window;
use tauri::api::dialog;
use tauri::api::shell;

use tauri::{
  SystemTray,
  SystemTrayEvent,
  CustomMenuItem,
  SystemTrayMenu,
  SystemTrayMenuItem,
  Manager
};

use tokio_tungstenite::{connect_async, tungstenite::protocol::Message};

async fn create_websocket_connection(
  account_id: String,
  window_handle: Window,
  cancellation_token: CancellationToken
) {
  let window = window_handle.clone();
  let emitter_id = format!("gateway/{}", account_id);

  let (ws_remote, _) = connect_async("wss://gateway.discord.gg/?v=10&encoding=json")
    .await
    .unwrap();
  let (write, read) = ws_remote.split();

  let write_clone = Arc::new(tokio::sync::Mutex::new(write));
  let inside_cancellation_token = CancellationToken::new();
  let inside_cancellation_token_clone = inside_cancellation_token.clone();
  
  let event_listener_id = window.listen(format!("gateway/{account_id}").as_str(), move | event | {
    let message = String::from(event.payload().unwrap());
    let write_clone = write_clone.clone(); // assuming you have a clone of write_clone
    let inside_cancellation_token_clone = inside_cancellation_token.clone();

    tokio::spawn(async move {
      let mut write = write_clone.lock().await;
      
      if message == "\"destroy\"" {
        println!("-> Closing because of front-end request...");
        inside_cancellation_token_clone.cancel();
        write.close().await.unwrap();
        println!("<- Closed");
      }
      else if write.send(Message::Text(message)).await.is_err() {
        println!("-> Closing because can't send to remote...");
        inside_cancellation_token_clone.cancel();
      }
    });
  });

  let read_future = read
    .take_until(cancellation_token.cancelled())
    .for_each(|message| async {
      let message = message.unwrap().into_text().unwrap();
      window.emit(&emitter_id, message).unwrap();
    });

  tokio::select! {
    _ = read_future => (),
    _ = cancellation_token.cancelled() => (),
    _ = inside_cancellation_token_clone.cancelled() => (),
  }

  println!("-> Will unlisten {event_listener_id}");
  window.unlisten(event_listener_id);
}

fn create_window_gateway_listener(window_handle: Window) {
  let main_window = window_handle.clone();

  // Maintain a map of active WebSocket connections.
  let active_connections: Arc<Mutex<HashMap<String, JoinHandle<()>>>> = Arc::new(Mutex::new(HashMap::new()));

  main_window.listen("gateway", move | event | {
    let account_id = event.payload().unwrap().replace("\"", "");
    let account_id_clone = account_id.clone();
    
    let mut cancellation_token = CancellationToken::new();
    
    // Check if a connection for the `account_id` already exists.
    let mut active_connections = active_connections.lock().unwrap();
    if let Some(existing_connection) = active_connections.get(&account_id) {
      cancellation_token.cancel();
      existing_connection.abort();

      println!("<- Aborted connection.");
      cancellation_token = CancellationToken::new();
    }

    let cloned_cancellation_token = cancellation_token.clone();
    let window_handle_clone = window_handle.clone();

    let join_handle = tokio::spawn(async move {
      println!("-> Creating new connection");

      create_websocket_connection(
        account_id.to_string(),
        window_handle_clone,
        cloned_cancellation_token
      )
      .await;
    });

    // Add the new connection to the `active_connections` map.
    active_connections.insert(account_id_clone, join_handle);
  });
}

fn main() {
  let tray_menu = SystemTrayMenu::new()
    .add_item(
      CustomMenuItem::new("title".to_string(), "SolidCord").disabled()
    )
    .add_native_item(
      SystemTrayMenuItem::Separator
    )
    .add_item(
      CustomMenuItem::new("github".to_string(), "Report issue on GitHub")
    )
    .add_native_item(
      SystemTrayMenuItem::Separator
    )
    .add_item(
      CustomMenuItem::new("open".to_string(), "Open")
    )
    .add_item(
      CustomMenuItem::new("hide".to_string(), "Hide")
    )
    .add_item(
      CustomMenuItem::new("exit".to_string(), "Exit")
    );
  
  let system_tray = SystemTray::new().with_menu(tray_menu);

  tauri::Builder::default()
    .setup(| app | {
      let window = app.get_window("main").unwrap();

      if cfg!(any(windows, target_os = "macos")) {
        use window_shadows::set_shadow;
        set_shadow(&window, true).unwrap_or_default();
      }

      create_window_gateway_listener(window);

      Ok(())
    })
    .system_tray(system_tray)
    .on_system_tray_event(| app, event | match event {
      SystemTrayEvent::LeftClick {
        position: _,
        size: _,
        ..
      } => {
        let window = app.get_window("main").unwrap();
        
        if window.set_focus().is_err() {
          println!("[on_system_tray_event][:LeftClick] error when trying to set main window focus.");
        }
      }
      SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
        "github" => {
          let url = "http://github.com/Vexcited/SolidCord/issues";

          // Open URL with system default browser.
          let result = shell::open(&app.shell_scope(), url, None);
          if result.is_err() {
            let window = app.get_window("main").unwrap();
            dialog::message(
              Some(&window),
              "Open URL",
              format!("Can't open '{}' in the system's default browser.", url)
            );
          }
        }
        "open" => {
          let window = app.get_window("main").unwrap();
          window.show().unwrap();
          window.set_focus().unwrap();
        }
        "hide" => {
          let window = app.get_window("main").unwrap();
          window.hide().unwrap();
        }
        "exit" => {
          std::process::exit(0);
        }
        _ => {}
      },
      _ => {}
    })
    .run(tauri::generate_context!())
    .expect("Error while running SolidCord.");
}
