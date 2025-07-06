use crate::entities::Friend;
use crate::support::storage::insert_friend;
use tauri::{AppHandle, Manager, Emitter};
use uuid::Uuid;

#[derive(serde::Deserialize)]
pub struct AddFriendRequest {
    pub name: String,
    pub avatar: String,
    pub timezone: String,
    pub city: String,
    pub country: String,
}

#[tauri::command]
pub async fn add_friend_command(
    app: AppHandle,
    request: AddFriendRequest,
) -> Result<Friend, String> {
    let data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data dir: {}", e))?;

    // Create new friend with generated ID
    let friend = Friend {
        id: Uuid::new_v4().to_string(),
        name: request.name,
        avatar: request.avatar,
        timezone: request.timezone,
        city: request.city,
        country: request.country,
    };

    // Save to file
    insert_friend(&data_dir, friend.clone())?;

    // Emit event to notify main window about the new friend
    app.emit("friend-added", &friend)
        .map_err(|e| format!("Failed to emit event: {}", e))?;

    Ok(friend)
}
