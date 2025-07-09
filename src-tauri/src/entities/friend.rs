#[derive(serde::Serialize, serde::Deserialize, Clone)]
pub struct Friend {
    pub id: String,
    pub name: String,
    pub avatar: String,
    pub timezone: String, // "America/Toronto"
    pub city: String,
    pub country: String,
}

#[derive(serde::Deserialize)]
pub struct AddFriendRequest {
    pub name: String,
    pub avatar: String,
    pub timezone: String,
    pub city: String,
    pub country: String,
}
