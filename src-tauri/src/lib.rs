mod commands;
mod entities;
mod support;

use tauri::tray::{MouseButton, MouseButtonState, TrayIconEvent};
use tauri::Manager;
use tauri_plugin_positioner::{Position, WindowExt};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(target_os = "macos")]
            app.set_activation_policy(tauri::ActivationPolicy::Accessory);

            Ok(())
        })
        .on_tray_icon_event(on_tray_icon_event)
        .on_menu_event(on_menu_event)
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            None,
        ))
        .on_window_event(on_window_event)
        .invoke_handler(tauri::generate_handler![
            commands::friends::get_friends_command,
            commands::friends::add_friend_command,
            commands::friends::delete_friend_command,
            commands::windows::open_settings_window_command,
            commands::windows::open_new_friend_window_command,
            commands::systems::read_image_as_base64_command,
            commands::systems::enable_autostart_command,
            commands::systems::disable_autostart_command,
            commands::systems::is_autostart_enabled_command,
            commands::systems::exit_app_command,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn on_window_event(window: &tauri::Window, event: &tauri::WindowEvent) {
    match event {
        tauri::WindowEvent::Focused(false) => {
            let app_handle = window.app_handle().clone();
            tauri::async_runtime::spawn(async move {
                let is_any_app_window_focused = app_handle
                    .windows()
                    .values()
                    .any(|w| w.is_focused().unwrap_or(false));

                if !is_any_app_window_focused {
                    if let Some(main_window) = app_handle.get_window("main") {
                        main_window.hide().unwrap();
                    }
                }
            });
        }
        tauri::WindowEvent::CloseRequested { api, .. } => {
            api.prevent_close();
            window.hide().unwrap();
        }
        _ => {}
    }
}

fn on_menu_event(_app: &tauri::AppHandle, event: tauri::menu::MenuEvent) {
    println!("Menu event: {:?}", event);

    match event.id.as_ref() {
        "Hello" => {
            println!("Hello menu item clicked");
        }
        _ => {}
    }
}

fn on_tray_icon_event(app: &tauri::AppHandle, event: tauri::tray::TrayIconEvent) {
    tauri_plugin_positioner::on_tray_event(app, &event);

    if let TrayIconEvent::Click {
        id,
        button,
        button_state,
        ..
    } = event
    {
        if id == "tray-icon" && button == MouseButton::Left && button_state == MouseButtonState::Up
        {
            let window = app.get_window("main").unwrap();
            if window.is_visible().unwrap() {
                window.hide().unwrap();
            } else {
                window.move_window(Position::TrayBottomCenter).unwrap();
                window.show().unwrap();
                window.set_focus().unwrap();
            }
        }
    }
}
