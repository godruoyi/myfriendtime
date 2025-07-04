use crate::entities::Friend;
use crate::support;
use tauri::Manager;

#[tauri::command]
pub fn get_friends_command(app: tauri::AppHandle) -> Result<Vec<Friend>, String> {
    let data_dir = app
        .path()
        .app_local_data_dir()
        .expect("failed to get app local data directory");

    let friends = support::storage::get_friends(&data_dir).map_err(|e| e)?;

    Ok(friends)
}
