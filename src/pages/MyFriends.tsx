import { useEffect, useState, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { load } from '@tauri-apps/plugin-store'
import { Plus, Settings } from "lucide-react";
import TimeTravel from "../compontents/TimeTravel.tsx";
import FriendItem from "../compontents/FriendItem.tsx";
import MyTime from "../compontents/MyTime.tsx";
import { Friend } from "../types.ts";

import '../assets/css/my_friends.css'

export default function MyFriends() {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const [userName, setUserName] = useState<string>("Me");
    const currentDate = new Date();
    const [timeOffsetMinutes, setTimeOffsetMinutes] = useState(0);
    const listenerSetupRef = useRef(false);

    useEffect(() => {
        console.log('MyFriends component mounted, setting up initial data fetch');
        const fetchFriends = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await invoke<Friend[]>('get_friends_command');
                console.log('Fetched friends:', result);
                setFriends(result);
            } catch (err) {
                setError(typeof err === 'string' ? err : 'Unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };

        const loadUserSettings = async () => {
            try {
                const store = await load('user-settings.json', { autoSave: true })

                const name = await store.get<string>('user_name')
                const avatarPath = await store.get<string>('user_avatar_path')

                setUserName(name || 'Me')
                setUserAvatar(avatarPath || null)
            } catch (error) {
                console.error('Error loading user settings:', error)
            }
        };

        fetchFriends().then();
        loadUserSettings().then();
    }, []);

    // Listen for friend-added events - Alternative: refresh on window focus
    useEffect(() => {
        // Prevent duplicate event listener setup
        if (listenerSetupRef.current) {
            console.log('Event listener already setup, skipping');
            return;
        }

        console.log('Setting up friend-added event listener');
        listenerSetupRef.current = true;
        let unlisten: (() => void) | null = null;

        const setupEventListener = async () => {
            try {
                unlisten = await listen<Friend>('friend-added', (event) => {
                    console.log('New friend added event received:', event.payload);
                    // Instead of adding to current list, just refresh all data
                    // This prevents duplicate issues
                    const refreshFriends = async () => {
                        try {
                            const result = await invoke<Friend[]>('get_friends_command');
                            console.log('Refreshed friends after event:', result);
                            setFriends(result);
                        } catch (err) {
                            console.error('Failed to refresh friends:', err);
                        }
                    };
                    refreshFriends();
                });
                console.log('Event listener setup complete');
            } catch (error) {
                console.error('Failed to setup event listener:', error);
                listenerSetupRef.current = false; // Reset on error
            }
        };

        setupEventListener();

        // Also listen for window focus to refresh user settings
        const handleWindowFocus = async () => {
            try {
                const store = await load('user-settings.json', { autoSave: true })

                const name = await store.get<string>('user_name')
                const avatarPath = await store.get<string>('user_avatar_path')

                setUserName(name || 'Me')
                setUserAvatar(avatarPath || null)
            } catch (error) {
                console.error('Error refreshing user settings:', error)
            }
        };

        window.addEventListener('focus', handleWindowFocus);

        // Cleanup on unmount
        return () => {
            console.log('Cleaning up friend-added event listener');
            if (unlisten) {
                unlisten();
            }
            window.removeEventListener('focus', handleWindowFocus);
            listenerSetupRef.current = false; // Reset for potential remount
        };
    }, []); // Empty dependency array to ensure this only runs once

    const openSettings = async () => {
        console.log("xx")
        try {
            await invoke('open_settings_window_command');
        } catch (err) {
            console.error('failed to open settings:', err);
        }
    }

    const newFriend = async () => {
        try {
            await invoke<Friend>('open_new_friend_window_command');
        } catch (err) {
            setError(typeof err === 'string' ? err : 'Failed to add friend');
        }
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            <div className="pl-4 pr-3 py-4 border-b border-gray-100 flex items-center justify-between">
                <h1 className="text-lg font-bold">
                    <span className="text-gray-900">MyFriend</span>
                    <span className="font-mono ml-0.5 text-[#E57C00]">Time</span>
                </h1>
                <div className="flex items-center">
                    <button
                        onClick={newFriend}
                        className="p-1 hover:bg-gray-100 rounded-md transition-colors flex items-center justify-end"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                    <button
                        onClick={openSettings}
                        className="p-1 hover:bg-gray-100 rounded-md transition-colors flex items-center justify-end">
                        <Settings className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <MyTime
                currentDate={currentDate}
                timeOffsetMinutes={timeOffsetMinutes}
                userAvatar={userAvatar}
                userName={userName}
            />

            <div className="max-h-96 overflow-y-auto">
                {friends.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500">
                        <div className="text-2xl mb-2">🌍</div>
                        <p className="text-sm">No friends added yet</p>
                        <p className="text-xs text-gray-400 mt-1">Click + to add your first friend</p>
                    </div>
                ) : (
                    friends.map((friend) => (
                        <FriendItem
                            friend={friend}
                            key={friend.id}
                            timeOffsetMinutes={timeOffsetMinutes}
                            currentDate={currentDate}
                        />
                    ))
                )}
            </div>

            <TimeTravel onTimeOffsetChange={(v) => setTimeOffsetMinutes(v)} />
        </div>
    );
}
