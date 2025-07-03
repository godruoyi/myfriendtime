#[derive(serde::Serialize, serde::Deserialize, Clone, specta::Type)]
pub struct Friend {
    pub id: String,
    pub name: String,
    pub avatar: String,
    pub timezone: String, // "America/Toronto"
    pub city: String,
    pub country: String,
}
