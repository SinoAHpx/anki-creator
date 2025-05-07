// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use enigo::{
    Direction::{Click, Press, Release},
    Enigo, Key, Keyboard, Settings,
};

#[tauri::command]
fn press_copy_shortcut() {
    let mut enigo = Enigo::new(&Settings::default()).unwrap();

    #[cfg(target_os = "macos")]
    {
        enigo.key(Key::Meta, Press).unwrap_or_default();
        enigo.key(Key::Unicode('c'), Click).unwrap_or_default();
        enigo.key(Key::Meta, Release).unwrap_or_default();
    }

    #[cfg(not(target_os = "macos"))]
    {
        enigo.key(Key::Control, Press).unwrap_or_default();
        enigo.key(Key::Unicode('c'), Click).unwrap_or_default();
        enigo.key(Key::Control, Release).unwrap_or_default();
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_global_shortcut::Builder::default().build())
        .invoke_handler(tauri::generate_handler![press_copy_shortcut])
        .on_window_event(|window, event| {
            match event {
                tauri::WindowEvent::CloseRequested { api, .. } => {
                    // event.window().hide().unwrap();
                    window.hide().unwrap();
                    api.prevent_close();
                }
                _ => {}
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
