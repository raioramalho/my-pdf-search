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
fn file_dropped(window: tauri::Window,file: &str) {
    println!("fn:file_dropped: {}", file);
    let send = window.emit("file_dropped_event", file);
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![log, greet, file_dropped])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
