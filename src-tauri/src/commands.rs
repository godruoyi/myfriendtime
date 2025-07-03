use crate::entities::Friend;

#[tauri::command]
#[specta::specta]
pub fn get_friends_command() -> Result<Vec<Friend>, String> {
    let friends = vec![
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
    ];

    Ok(friends)
}

#[tauri::command]
#[specta::specta]
pub fn greet_command(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
