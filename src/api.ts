import { invoke } from '@tauri-apps/api/core';

export interface Friend {
    id: string;
    name: string;
    avatar: string;
    timezone: string;
    city: string;
    country: string;
}

export interface Settings {
    userName: string;
    userAvatarPath: string;
    startup: boolean;
}

export interface AddFriendRequest {
    name: string;
    avatar: string;
    timezone: string;
    city: string;
    country: string;
}

export namespace api {
    export async function addFriend(request: AddFriendRequest): Promise<Friend> {
        return await invoke<Friend>('add_friend_command', { request });
    }

    export async function getFriends(): Promise<Friend[]> {
        return await invoke<Friend[]>('get_friends_command');
    }

    // Image-related API calls
    export async function readImageAsBase64(filePath: string): Promise<string> {
        return await invoke<string>('read_image_as_base64', { filePath });
    }

    // Autostart-related API calls
    export async function isAutostartEnabled(): Promise<boolean> {
        return await invoke<boolean>('is_autostart_enabled');
    }

    export async function enableAutostart(): Promise<void> {
        await invoke('enable_autostart');
    }

    export async function disableAutostart(): Promise<void> {
        await invoke('disable_autostart');
    }

    // Window-related API calls
    export async function openSettingsWindow(): Promise<void> {
        await invoke('open_settings_window_command');
    }

    export async function openNewFriendWindow(): Promise<Friend> {
        return await invoke<Friend>('open_new_friend_window_command');
    }

    export async function exit_app(): Promise<void> {
        await invoke('exit_app_command');
    }
}
