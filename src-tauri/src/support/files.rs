use crate::entities::Friend;
use std::fs;
use std::path::{Path, PathBuf};

pub fn get_friends(data_dir: &Path) -> Result<Vec<Friend>, String> {
    ensure_data_dir_exists(data_dir)?;

    let friends_file = get_friends_file_path(data_dir);
    let default_friends = get_default_friends();

    if !friends_file.exists() {
        println!("Friends file does not exist, create this file and write empty data.");

        write_friends_data(data_dir, &default_friends)?;
        return Ok(vec![]);
    }

    let friends_data =
        fs::read_to_string(&friends_file).map_err(|e| format!("Cannot read friends file: {e}"))?;

    if friends_data.trim().is_empty() {
        println!("Friends file is empty, returning empty list.");
        return Ok(vec![]);
    }

    let friends: Vec<Friend> = serde_json::from_str(&friends_data)
        .map_err(|e| format!("Cannot parse friends data: {e}"))?;

    if friends.is_empty() {
        println!("No friends found in the file, returning empty list.");

        return Ok(default_friends);
    }

    Ok(friends)
}

pub fn insert_friend(data_dir: &Path, friend: Friend) -> Result<(), String> {
    let mut friends = get_friends(data_dir)?;

    // If friend exists, update it; otherwise insert new one
    if let Some(index) = friends.iter().position(|f| f.id == friend.id) {
        friends[index] = friend;
    } else {
        friends.push(friend);
    }

    write_friends_data(data_dir, &friends)
}

pub fn delete_friend(data_dir: &Path, friend_id: &str) -> Result<(), String> {
    let mut friends = get_friends(data_dir)?;

    let initial_len = friends.len();
    friends.retain(|f| f.id != friend_id);

    // Only write if something was actually removed
    if friends.len() != initial_len {
        write_friends_data(data_dir, &friends)?;
    }

    Ok(())
}

pub fn write_friends_data(data_dir: &Path, friends: &[Friend]) -> Result<(), String> {
    ensure_data_dir_exists(data_dir)?;

    let friends_file = get_friends_file_path(data_dir);
    let friends_data = serde_json::to_string_pretty(friends)
        .map_err(|e| format!("Cannot serialize friends data: {e}"))?;

    fs::write(&friends_file, friends_data)
        .map_err(|e| format!("Cannot write friends file: {e}"))?;

    println!("Successfully wrote {} friends to file", friends.len());
    Ok(())
}

pub fn get_default_friends() -> Vec<Friend> {
    vec![
        Friend {
            id: "1".to_string(),
            name: "Jinchuan Li".to_string(),
            avatar: "https://picsum.photos/32/32?random=1".to_string(),
            timezone: "America/Los_Angeles".to_string(),
            city: "Los Angeles".to_string(),
            country: "USA".to_string(),
        },
        Friend {
            id: "2".to_string(),
            name: "Vicky Chen".to_string(),
            avatar: "https://picsum.photos/32/32?random=2".to_string(),
            timezone: "America/New_York".to_string(),
            city: "New York".to_string(),
            country: "USA".to_string(),
        },
        Friend {
            id: "3".to_string(),
            name: "Tony".to_string(),
            avatar: "https://picsum.photos/32/32?random=3".to_string(),
            timezone: "Asia/Ho_Chi_Minh".to_string(),
            city: "Ho Chi Minh City".to_string(),
            country: "Vietnam".to_string(),
        },
        Friend {
            id: "4".to_string(),
            name: "Emma Wilson".to_string(),
            avatar: "https://picsum.photos/32/32?random=4".to_string(),
            timezone: "Asia/Tokyo".to_string(),
            city: "Tokyo".to_string(),
            country: "Japan".to_string(),
        },
        Friend {
            id: "5".to_string(),
            name: "Monica Chen".to_string(),
            avatar: "https://picsum.photos/32/32?random=5".to_string(),
            timezone: "America/Toronto".to_string(),
            city: "Toronto".to_string(),
            country: "Canada".to_string(),
        },
    ]
}

fn get_friends_file_path(data_dir: &Path) -> PathBuf {
    data_dir.join("friends.json")
}

fn ensure_data_dir_exists(data_dir: &Path) -> Result<(), String> {
    fs::create_dir_all(data_dir).map_err(|e| format!("cannot create data directory: {e}"))
}
