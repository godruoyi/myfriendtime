use base64::{engine::general_purpose, Engine as _};
use std::{fs, path::Path};
use tauri::AppHandle;
use tauri_plugin_autostart::ManagerExt;

#[tauri::command]
pub fn exit_app_command(app_handle: tauri::AppHandle) {
    app_handle.exit(0);
}

#[tauri::command]
pub async fn enable_autostart_command(app_handle: AppHandle) -> Result<(), String> {
    let autostart_manager = app_handle.autolaunch();
    match autostart_manager.enable() {
        Ok(_) => Ok(()),
        Err(e) => {
            eprintln!("Failed to enable autostart: {}", e);
            Err(format!("Failed to enable autostart: {}", e))
        }
    }
}

#[tauri::command]
pub async fn disable_autostart_command(app_handle: AppHandle) -> Result<(), String> {
    let autostart_manager = app_handle.autolaunch();

    match autostart_manager.disable() {
        Ok(_) => Ok(()),
        Err(e) => {
            eprintln!("Failed to disable autolaunch: {}", e);
            Err(format!("Failed to disable autolaunch: {}", e))
        }
    }
}

#[tauri::command]
pub async fn is_autostart_enabled_command(app_handle: AppHandle) -> Result<bool, String> {
    let autostart_manager = app_handle.autolaunch();

    match autostart_manager.is_enabled() {
        Ok(enabled) => Ok(enabled),
        Err(e) => {
            eprintln!("Failed to check autostart status: {}", e);
            Err(format!("Failed to check autostart status: {}", e))
        }
    }
}

#[tauri::command]
pub fn read_image_as_base64_command(file_path: String) -> Result<String, String> {
    let path = Path::new(&file_path);

    if !path.exists() {
        return Err("File does not exist".to_string());
    }

    match fs::read(path) {
        Ok(bytes) => {
            let extension = path
                .extension()
                .and_then(|ext| ext.to_str())
                .unwrap_or("")
                .to_lowercase();

            let mime_type = match extension.as_str() {
                "png" => "image/png",
                "jpg" | "jpeg" => "image/jpeg",
                "gif" => "image/gif",
                "bmp" => "image/bmp",
                "webp" => "image/webp",
                "svg" => "image/svg+xml",
                _ => "image/png", // default fallback
            };

            let base64_string = general_purpose::STANDARD.encode(&bytes);
            let data_url = format!("data:{};base64,{}", mime_type, base64_string);

            Ok(data_url)
        }
        Err(err) => Err(format!("Failed to read file: {}", err)),
    }
}
