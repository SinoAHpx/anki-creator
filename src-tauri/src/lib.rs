// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

mod config;

use serde::{Deserialize, Serialize};
use tauri::Manager;
use tauri_plugin_global_shortcut::GlobalShortcutExt;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[derive(Debug, Serialize, Deserialize)]
struct ShortcutPayload {
    action: String,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_global_shortcut::Builder::default().build())
        .setup(|app| {
            let app_handle = app.handle();

            // Example of registering a shortcut that emits an event
            app.global_shortcut()
                .register("CommandOrControl+F", move || {
                    let _ = app_handle.emit_all(
                        "shortcut-triggered",
                        ShortcutPayload {
                            action: "focusSearch".to_string(),
                        },
                    );
                })?;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            register_shortcut,
            unregister_shortcut,
            unregister_all_shortcuts
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn register_shortcut(
    app_handle: tauri::AppHandle,
    shortcut: String,
    action: String,
) -> Result<(), String> {
    app_handle
        .global_shortcut()
        .register(&shortcut, move || {
            let _ = app_handle.emit_all(
                "shortcut-triggered",
                ShortcutPayload {
                    action: action.clone(),
                },
            );
        })
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn unregister_shortcut(app_handle: tauri::AppHandle, shortcut: String) -> Result<(), String> {
    app_handle
        .global_shortcut()
        .unregister(&shortcut)
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn unregister_all_shortcuts(app_handle: tauri::AppHandle) -> Result<(), String> {
    app_handle
        .global_shortcut()
        .unregister_all()
        .map_err(|e| e.to_string())
}
