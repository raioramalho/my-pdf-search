// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn log(log: &str) {
    println!("fn:logger: {}", log);
}

#[tauri::command]
fn greet(name: &str) -> String {
    println!("fn:greet: {}", name);
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn set_file_name(window: tauri::Window, file_name: &str) {
    println!("fn:set_file_name: {}", file_name);
    let _ = window.emit("file_name_event", file_name);
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![log, greet, set_file_name])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
