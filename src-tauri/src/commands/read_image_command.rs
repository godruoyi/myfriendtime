use std::fs;
use std::path::Path;
use base64::{Engine as _, engine::general_purpose};

#[tauri::command]
pub fn read_image_as_base64(file_path: String) -> Result<String, String> {
    let path = Path::new(&file_path);

    // Check if file exists
    if !path.exists() {
        return Err("File does not exist".to_string());
    }

    // Read file content
    match fs::read(path) {
        Ok(bytes) => {
            // Get file extension to determine MIME type
            let extension = path.extension()
                .and_then(|ext| ext.to_str())
                .unwrap_or("")
                .to_lowercase();

            let mime_type = match extension.as_str() {
                "png" => "image/png",
                "jpg" | "jpeg" => "image/jpeg",
                "gif" => "image/gif",
                "bmp" => "image/bmp",
                "webp" => "image/webp",
                "svg" => "image/svg+xml",
                _ => "image/png", // default fallback
            };

            // Convert to base64
            let base64_string = general_purpose::STANDARD.encode(&bytes);
            let data_url = format!("data:{};base64,{}", mime_type, base64_string);

            Ok(data_url)
        }
        Err(err) => Err(format!("Failed to read file: {}", err)),
    }
}
