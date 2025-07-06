use tauri::{command, AppHandle, Manager};
use crate::support::storage::delete_friend;

#[command]
pub async fn delete_friend_command(app_handle: AppHandle, friend_id: String) -> Result<(), String> {
    let data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))?;

    delete_friend(&data_dir, &friend_id)?;

    println!("Friend with ID {} deleted successfully", friend_id);
    Ok(())
}
