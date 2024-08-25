use tauri::{window::Color, Manager};
use window_vibrancy::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
      .setup(|app| {
        let window = app.get_webview_window("main").unwrap();
        
        #[cfg(target_os = "macos")]
        apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
            .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

        #[cfg(target_os = "windows")]
        apply_mica(&window, Some(true))
            .expect("Unsupported platform! 'apply_mica' is only supported on Windows");

        Ok(())
    })
    .plugin(tauri_plugin_os::init())
    .plugin(tauri_plugin_http::init())
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_websocket::init())
    .run(tauri::generate_context!())
    .expect("Error while running SolidCord");
}
