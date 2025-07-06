mod commands;
mod entities;
mod support;

use tauri::menu::{Menu, MenuItem, PredefinedMenuItem, Submenu};
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
        .menu(|handle| {
            Menu::with_items(
                handle,
                &[&Submenu::with_items(
                    handle,
                    "File",
                    true,
                    &[
                        &PredefinedMenuItem::close_window(handle, None)?,
                        &PredefinedMenuItem::quit(handle, None)?,
                        &PredefinedMenuItem::separator(handle)?,
                        #[cfg(target_os = "macos")]
                        &MenuItem::new(handle, "Hello", true, None::<&str>)?,
                    ],
                )?],
            )
        })
        .on_tray_icon_event(on_tray_icon_event)
        .on_menu_event(on_menu_event)
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_dialog::init())
        .on_window_event(|window, event| match event {
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
        })
        .invoke_handler(tauri::generate_handler![
            commands::greet_command::greet_command,
            commands::get_friends_command::get_friends_command,
            commands::add_friend_command::add_friend_command,
            commands::open_settings_window_command::open_settings_window_command,
            commands::open_new_friend_command::open_new_friend_window_command,
            commands::read_image_command::read_image_as_base64,
            commands::resize_window_command::resize_settings_window,
            commands::resize_window_command::get_window_size,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn on_menu_event(app: &tauri::AppHandle, event: tauri::menu::MenuEvent) {
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
        rect,
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
