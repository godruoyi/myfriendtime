use tauri::Manager;

#[tauri::command]
pub fn open_new_friend_window_command(app: tauri::AppHandle) -> Result<(), String> {
    println!("Opening new friend window...");

    let window = app
        .get_window("new_friend")
        .ok_or("cannot find 'new_friend' window")?;

    if let Ok(true) = window.is_visible() {
        window.set_focus().map_err(|e| e.to_string())?;
    } else {
        window.show().map_err(|e| e.to_string())?;
        window.center().map_err(|e| e.to_string())?;
        window.set_focus().map_err(|e| e.to_string())?;
    }

    Ok(())
}

#[tauri::command]
pub fn open_settings_window_command(app: tauri::AppHandle) -> Result<(), String> {
    println!("Opening settings window...");

    let window = app
        .get_window("settings")
        .ok_or("cannot find 'settings' window")?;

    if let Ok(true) = window.is_visible() {
        window.set_focus().map_err(|e| e.to_string())?;
    } else {
        window.show().map_err(|e| e.to_string())?;
        window.center().map_err(|e| e.to_string())?;
        window.set_focus().map_err(|e| e.to_string())?;
    }

    Ok(())
}
