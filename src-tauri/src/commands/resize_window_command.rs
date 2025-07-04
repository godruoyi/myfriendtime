use tauri::{command, AppHandle, LogicalSize, Manager, PhysicalSize};

#[command]
pub async fn resize_settings_window(app: AppHandle, height: f64) -> Result<(), String> {
    let window = app
        .get_webview_window("settings")
        .ok_or("Settings window not found")?;

    // 获取当前窗口大小和缩放因子
    let current_size = window.outer_size().map_err(|e| e.to_string())?;
    let scale_factor = window.scale_factor().map_err(|e| e.to_string())?;

    println!("Current window size: {:?}", current_size);
    println!("Scale factor: {}", scale_factor);
    println!("Requested height: {}", height);

    // 对于 macOS，我们需要考虑标题栏和系统装饰
    #[cfg(target_os = "macos")]
    let adjusted_height = height;

    #[cfg(not(target_os = "macos"))]
    let adjusted_height = height + 30.0; // 其他系统的额外装饰高度

    // 使用 LogicalSize 来确保正确的 DPI 处理
    let new_size = LogicalSize::new(current_size.width as f64 / scale_factor, adjusted_height);

    println!("Setting window size to: {:?}", new_size);

    window.set_size(new_size).map_err(|e| e.to_string())?;

    Ok(())
}

#[command]
pub async fn get_window_size(app: AppHandle) -> Result<(u32, u32), String> {
    let window = app
        .get_webview_window("settings")
        .ok_or("Settings window not found")?;

    let size = window.outer_size().map_err(|e| e.to_string())?;
    let inner_size = window.inner_size().map_err(|e| e.to_string())?;
    let scale_factor = window.scale_factor().map_err(|e| e.to_string())?;

    println!("Outer size: {:?}", size);
    println!("Inner size: {:?}", inner_size);
    println!("Scale factor: {}", scale_factor);

    Ok((size.width, size.height))
}
