// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::env;
use std::process::Command;
use tauri::Window;

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
fn set_file_name(app: tauri::Window, name: &str) {
    println!("fn:set_file_name: {}", name);
    let _ = app.emit("file_name_event", name);
}

#[tauri::command]
fn process_file(file_path: &str) {
   println!("fn:process_file: Starting process the file: {}", file_path);
}

#[tauri::command]
fn salvar_arquivo_pdf(app: Window, nome: String, conteudo: Vec<u8>) {
    println!("fn:salvar_arquivo_pdf: Salvando arquivo..");
    let caminho_arquivo = format!("./my-pdf-search-{}", nome);
    match fs::write(&caminho_arquivo, conteudo) {
        Ok(_) => {
            
            println!("Arquivo PDF salvo em: {}", caminho_arquivo);
            if let Ok(current_dir) = env::current_dir() {
                println!("O diretório atual é: {:?}", current_dir);
                let res = format!("{}{}",current_dir.display(),caminho_arquivo);
                app.emit("saved_file_event", res, );
            } else {
                println!("Não foi possível obter o diretório atual.");
            }
        },
        Err(e) => {
            eprintln!("Erro ao salvar o arquivo PDF: {}", e);
            // Se necessário, você pode emitir um evento aqui para notificar sobre o erro ao salvar o arquivo
        }
    }
}


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![log, greet, set_file_name, salvar_arquivo_pdf, process_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
