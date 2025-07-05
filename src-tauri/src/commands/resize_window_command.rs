use tauri::{command, AppHandle, Manager};

#[command]
pub async fn resize_settings_window(app: AppHandle, height: f64) -> Result<(), String> {
    let window = app
        .get_webview_window("settings")
        .ok_or("Settings window not found")?;

    // 获取当前窗口大小
    let size = window.outer_size().map_err(|e| e.to_string())?;

    // 保持宽度不变，只调整高度
    let new_size = tauri::PhysicalSize::new(size.width, height as u32);

    window.set_size(new_size).map_err(|e| e.to_string())?;

    Ok(())
}

#[command]
pub async fn get_window_size(app: AppHandle) -> Result<(u32, u32), String> {
    let window = app
        .get_webview_window("settings")
        .ok_or("Settings window not found")?;

    let size = window.outer_size().map_err(|e| e.to_string())?;
    Ok((size.width, size.height))
}
