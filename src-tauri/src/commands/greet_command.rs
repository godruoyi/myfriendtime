#[tauri::command]
#[specta::specta]
pub fn greet_command(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
