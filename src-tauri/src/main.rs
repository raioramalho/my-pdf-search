// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::fs::File;
use std::io::Write;
use std::env;
use tauri::Window;
use std::process::Command;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn log(log: &str) {
    println!("fn:logger: {}", log);
}

#[tauri::command]
fn criar_arquivo_python() -> Result<(), String> {
    let conteudo = r#"
#criado por Beatriz Brito e Alan Ramalho
#03032024

import sys

arquivo = sys.argv[1]

print("executei o python: "+arquivo)
"#;

    let nome_arquivo = "mypdfsearch.py";

    let mut file = match File::create(nome_arquivo) {
        Ok(file) => file,
        Err(e) => return Err(format!("Erro ao criar arquivo: {}", e)),
    };

    match file.write_all(conteudo.as_bytes()) {
        Ok(_) => Ok(()),
        Err(e) => Err(format!("Erro ao escrever no arquivo: {}", e)),
    }
}

#[tauri::command]
fn set_file_name(app: tauri::Window, name: &str) {
    println!("fn:set_file_name: {}", name);
    let _ = app.emit("file_name_event", name);
}

#[tauri::command]
fn process_file(path: &str, file: &str) -> Result<String, String> {
    let full_file_path = format!("{}{}", path, file);
    println!("fn:process_file: Starting process the file: {}", full_file_path);
    let output = Command::new("python3")
        .arg("mypdfsearch.py")
        .arg(full_file_path)
        .output()
        .map_err(|e| format!("fn:process_file: Erro ao executar o comando: {}", e))?;
    
    if output.status.success() {
        println!("Comando executando com sucesso!: {:?}", String::from_utf8_lossy(&output.stdout).to_string());
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}


#[tauri::command]
fn salvar_arquivo_pdf(app: Window, nome: String, conteudo: Vec<u8>) {
    println!("fn:salvar_arquivo_pdf: Salvando arquivo..");
    let caminho_arquivo = format!("my-pdf-search-{}", nome);
    match fs::write(&caminho_arquivo, conteudo) {
        Ok(_) => {
            println!("Arquivo PDF salvo em: {}", caminho_arquivo);
            if let Ok(current_dir) = env::current_dir() {
                println!("O diretório atual é: {:?}", current_dir);
                let res = format!("{}/{}", current_dir.display(), nome);
                let _ = app.emit("saved_file_event", res);
            } else {
                println!("Não foi possível obter o diretório atual.");
            }
        }
        Err(e) => {
            eprintln!("Erro ao salvar o arquivo PDF: {}", e);
            // Se necessário, você pode emitir um evento aqui para notificar sobre o erro ao salvar o arquivo
        }
    }
}

fn main() {
    tauri::Builder
        ::default()
        .invoke_handler(
            tauri::generate_handler![log, criar_arquivo_python, set_file_name, salvar_arquivo_pdf, process_file]
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
