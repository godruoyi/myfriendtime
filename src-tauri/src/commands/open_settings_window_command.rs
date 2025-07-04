use tauri::Manager;

#[tauri::command]
pub fn open_settings_window_command(app: tauri::AppHandle) -> Result<(), String> {
    println!("Opening settings window...");

    if let Some(window) = app.get_window("settings") {
        window.show().unwrap();
        window.set_focus().unwrap();
    } else {
        let window_config = app
            .config()
            .app
            .windows
            .iter()
            .find(|w| w.label == "settings")
            .unwrap();

        let x = tauri::WindowBuilder::from_config(&app, &window_config.clone())
            .expect("Failed to build window from config")
            .build()
            .expect("Failed to create settings window");

        x.show().unwrap();
        x.set_focus().unwrap();
    }

    Ok(())
}
