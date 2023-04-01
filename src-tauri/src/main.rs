// Prevents additional console window on Windows in release.
#![cfg_attr(
  not(debug_assertions),
  windows_subsystem = "windows"
)]

use tauri::{SystemTray, SystemTrayEvent, CustomMenuItem, SystemTrayMenu, SystemTrayMenuItem, Manager};
use window_shadows::set_shadow;

fn main() {
  let title = CustomMenuItem::new("title".to_string(), "SolidCord").disabled();
  let github = CustomMenuItem::new("github".to_string(), "Report issue on GitHub");
  // let updater = CustomMenuItem::new("updater".to_string(), "Updater");
  let quit = CustomMenuItem::new("quit".to_string(), "Quit");
  
  let tray_menu = SystemTrayMenu::new()
    .add_item(title)
    .add_native_item(SystemTrayMenuItem::Separator)
    .add_item(github)
    // .add_item(updater)
    .add_native_item(SystemTrayMenuItem::Separator)
    .add_item(quit);
  
  let system_tray = SystemTray::new().with_menu(tray_menu);

  tauri::Builder::default()
    .setup(| app | {
      let window = app.get_window("main").unwrap();
      set_shadow(&window, true).expect("Unsupported platform!");

      Ok(())
    })
    .system_tray(system_tray)
    .on_system_tray_event(|app, event| match event {
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
          if app.app_handle().shell_scope().open("http://github.com/Vexcited/SolidCord/issues", None).is_err() {
            println!("[on_system_tray_event][:MenuItemClick][=> github] error when trying to open url in browser.");
          }
        }
        "quit" => {
          std::process::exit(0);
        }
        _ => {}
      },
      _ => {}
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
