use crate::entities::{AddFriendRequest, Friend};
use crate::support;
use tauri::{AppHandle, Emitter, Manager};
use uuid::Uuid;

#[tauri::command]
pub async fn add_friend_command(
    app: AppHandle,
    request: AddFriendRequest,
) -> Result<Friend, String> {
    let data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data dir: {e}"))?;

    let friend = Friend {
        id: Uuid::new_v4().to_string(),
        name: request.name,
        avatar: request.avatar,
        timezone: request.timezone,
        city: request.city,
        country: request.country,
    };

    support::storage::insert_friend(&data_dir, friend.clone())?;
    app.emit("friend-added", &friend)
        .map_err(|e| format!("Failed to emit 'friend-added' event: {e}"))?;

    Ok(friend)
}

#[tauri::command]
pub async fn delete_friend_command(app_handle: AppHandle, friend_id: String) -> Result<(), String> {
    let data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {e}"))?;

    support::storage::delete_friend(&data_dir, &friend_id)?;

    println!("friend with ID {friend_id} deleted successfully");

    Ok(())
}

#[tauri::command]
pub fn get_friends_command(app: tauri::AppHandle) -> Result<Vec<Friend>, String> {
    let data_dir = app
        .path()
        .app_local_data_dir()
        .expect("failed to get app local data directory");

    let friends = support::storage::get_friends(&data_dir)?;

    Ok(friends)
}
