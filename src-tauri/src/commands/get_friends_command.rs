use crate::entities::Friend;
use tauri::Manager;

#[tauri::command]
#[specta::specta]
pub fn get_friends_command(app: tauri::AppHandle) -> Result<Vec<Friend>, String> {
    let data_dir = app
        .path()
        .app_local_data_dir()
        .expect("failed to get app local data directory");
    let friends_file = data_dir.join("friends.json");

    println!(
        "App local data directory: {:?}, friends file: {:?}",
        data_dir, friends_file
    );

    std::fs::create_dir_all(&data_dir)
        .map_err(|e| format!("cannot create data directory: {}", e))?;

    if !friends_file.exists() {
        println!("Friends file does not exist, returning empty list.");
        return Ok(vec![]);
    }
    let friends_data = std::fs::read_to_string(&friends_file)
        .map_err(|e| format!("cannot read friends file: {}", e))?;

    println!("Friends data: {}", friends_data);

    let friends: Vec<Friend> = serde_json::from_str(&friends_data)
        .map_err(|e| format!("cannot parse friends data: {}", e))?;

    if friends.is_empty() {
        println!("file exists but is empty, returning empty list.");
        return Ok(vec![]);
    }

    Ok(friends)
}

fn default_friends() -> Vec<Friend> {
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
            name: "Emma Wilson Emma Wilson Emma Wilson".to_string(),
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
