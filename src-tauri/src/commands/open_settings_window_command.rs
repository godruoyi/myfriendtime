use tauri::Manager;

#[tauri::command]
pub fn open_settings_window_command(app: tauri::AppHandle) -> Result<(), String> {
    println!("Opening settings window...");

    if let Some(window) = app.get_window("settings") {
        if let Ok(true) = window.is_visible() {
            println!("Settings window is already visible, focusing.");
            window.set_focus().map_err(|e| e.to_string())?;
        } else {
            println!("Settings window was hidden, showing and focusing.");
            window.show().map_err(|e| e.to_string())?;
            window.center().map_err(|e| e.to_string())?;
            window.set_focus().map_err(|e| e.to_string())?;
        }
    } else {
        println!("Settings window not found, creating it from config.");
        let window_config = app
            .config()
            .app
            .windows
            .iter()
            .find(|w| w.label == "settings")
            .cloned()
            .ok_or_else(|| {
                "Settings window configuration not found in tauri.conf.json".to_string()
            })?;

        let new_window = tauri::WindowBuilder::from_config(&app, &window_config)
            .map_err(|e| e.to_string())?
            .build()
            .map_err(|e| e.to_string())?;

        new_window.set_focus().map_err(|e| e.to_string())?;
    }

    Ok(())
}
