// Prevents additional console window on Windows in release.
#![cfg_attr(
  not(debug_assertions),
  windows_subsystem = "windows"
)]

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
      if cfg!(any(windows, target_os = "macos")) {
        use window_shadows::set_shadow;
        let window = app.get_window("main").unwrap();
        set_shadow(&window, true).unwrap_or_default();
      }

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
