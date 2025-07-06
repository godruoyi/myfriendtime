use tauri::{command, AppHandle};
use tauri_plugin_autostart::MacosLauncher;
use tauri_plugin_autostart::ManagerExt;

#[command]
pub async fn enable_autostart(app_handle: AppHandle) -> Result<(), String> {
    let autostart_manager = app_handle.autolaunch();
    match autostart_manager.enable() {
        Ok(_) => {
            println!("Autostart enabled successfully");
            Ok(())
        },
        Err(e) => {
            eprintln!("Failed to enable autostart: {}", e);
            Err(format!("Failed to enable autostart: {}", e))
        }
    }
}

#[command]
pub async fn disable_autostart(app_handle: AppHandle) -> Result<(), String> {
    let autostart_manager = app_handle.autolaunch();

    match autostart_manager.disable() {
        Ok(_) => {
            println!("Autostart disabled successfully");
            Ok(())
        },
        Err(e) => {
            eprintln!("Failed to disable autolaunch: {}", e);
            Err(format!("Failed to disable autolaunch: {}", e))
        }
    }
}

#[command]
pub async fn is_autostart_enabled(app_handle: AppHandle) -> Result<bool, String> {
    let autostart_manager = app_handle.autolaunch();

    match autostart_manager.is_enabled() {
        Ok(enabled) => {
            println!("Autostart status: {}", enabled);
            Ok(enabled)
        },
        Err(e) => {
            eprintln!("Failed to check autostart status: {}", e);
            Err(format!("Failed to check autostart status: {}", e))
        }
    }
}
