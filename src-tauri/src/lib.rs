use tauri::tray::{MouseButton, MouseButtonState, TrayIconEvent};
use tauri::{Manager, Position, Size};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(target_os = "macos")]
            app.set_activation_policy(tauri::ActivationPolicy::Accessory);

            let main_window = app.get_window("main").unwrap();
            let cloned_window = main_window.clone();
            main_window.on_window_event(move |event| {
                if let tauri::WindowEvent::Focused(false) = event {
                    cloned_window.hide().unwrap();
                }
            });

            Ok(())
        })
        .on_tray_icon_event(|app, event| {
            if let TrayIconEvent::Click {
                id,
                rect,
                button,
                button_state,
                ..
            } = event
            {
                if id == "tray-icon"
                    && button == MouseButton::Left
                    && button_state == MouseButtonState::Up
                {
                    let window = app.get_window("main").unwrap();
                    if window.is_visible().unwrap() {
                        window.hide().unwrap();
                    } else {
                        // todo: replace with tauri_plugin_positioner
                        let scale_factor = window.scale_factor().unwrap_or(1.0);

                        let tray_position = match rect.position {
                            Position::Physical(p) => p,
                            Position::Logical(p) => p.to_physical(scale_factor),
                        };

                        let tray_size = match rect.size {
                            Size::Physical(s) => s,
                            Size::Logical(s) => s.to_physical(scale_factor),
                        };

                        let window_size = window.outer_size().unwrap();
                        let physical_pos = tauri::PhysicalPosition {
                            x: tray_position.x + (tray_size.width as i32 / 2)
                                - (window_size.width as i32 / 2),
                            y: tray_position.y + tray_size.height as i32,
                        };

                        window.set_position(physical_pos).unwrap();
                        window.show().unwrap();
                        window.set_focus().unwrap();
                    }
                }
            }
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
