mod commands;
mod entities;
mod support;

use tauri::menu::{Menu, MenuItem, PredefinedMenuItem, Submenu};
use tauri::tray::{MouseButton, MouseButtonState, TrayIconEvent};
use tauri::{Manager, Position, Size};

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
                    cloned_window.hide().unwrap(); // todo when click setting page should not close main window
                }
            });

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
        .invoke_handler(tauri::generate_handler![
            commands::greet_command::greet_command,
            commands::get_friends_command::get_friends_command,
            commands::open_settings_window_command::open_settings_window_command,
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
}
