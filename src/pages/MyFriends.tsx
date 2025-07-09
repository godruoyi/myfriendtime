import { useEffect, useState, useRef } from 'react';
import { api, Friend } from '../api';
import { listen } from '@tauri-apps/api/event';
import { load } from '@tauri-apps/plugin-store';
import { Cog, Plus } from 'lucide-react';
import TimeTravel from '../compontents/ui/TimeTravel.tsx';
import FriendItem from '../compontents/ui/FriendItem.tsx';
import MyTime from '../compontents/ui/MyTime.tsx';
import { invoke } from '@tauri-apps/api/core';

import '../assets/css/my_friends.css';

export default function MyFriends() {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const [userName, setUserName] = useState<string>('Me');
    const currentDate = new Date();
    const [timeOffsetMinutes, setTimeOffsetMinutes] = useState(0);
    const listenerSetupRef = useRef(false);

    useEffect(() => {
        const fetchFriends = async () => {
            const result = await api.getFriends();
            setFriends(result);
        };

        const loadUserSettings = async () => {
            const store = await load('user-settings.json', { autoSave: true });
            const name = await store.get<string>('user_name');
            const avatarPath = await store.get<string>('user_avatar_path');

            setUserName(name || 'MyFriendTime');
            setUserAvatar(avatarPath || null);

            store.onChange((key, value) => {
                if (key === 'user_name') {
                    setUserName(value as string);
                } else if (key === 'user_avatar_path') {
                    setUserAvatar(value as string);
                }
            });
        };

        fetchFriends().then();
        loadUserSettings().then();
    }, []);

    useEffect(() => {
        if (listenerSetupRef.current) {
            return;
        }

        listenerSetupRef.current = true;
        let unlisten: (() => void) | null = null;

        const setupEventListener = async () => {
            try {
                unlisten = await listen<Friend>('friend-added', event => {
                    const friend = event.payload as Friend;
                    setFriends(prev => [...prev, friend]);
                });
            } catch (error) {
                listenerSetupRef.current = false;
            }
        };

        setupEventListener();

        return () => {
            unlisten?.();
            listenerSetupRef.current = false;
        };
    }, []);

    return (
        <div className="bg-white rounded-xl overflow-hidden">
            <div className="bg-gray-50 pl-4 pr-3 py-4 flex items-center justify-between">
                <div className="flex items-center">
                    <h1 className="text-lg font-bold">
                        <span className="text-gray-900">MyFriend</span>
                        <span className="font-mono ml-0.5 text-[#E57C00]">Time</span>
                    </h1>
                </div>
                <div className="flex items-center">
                    <button onClick={api.openNewFriendWindow} className="w-7 h-7 rounded-full flex items-center justify-center transition-colors">
                        <Plus className="h-5 w-5 text-gray-600" />
                    </button>
                    <button onClick={api.openSettingsWindow} className="w-7 h-7 rounded-full flex items-center justify-center transition-colors">
                        <Cog className="h-5 w-5 text-gray-600" />
                    </button>
                </div>
            </div>

            <MyTime currentDate={currentDate} timeOffsetMinutes={timeOffsetMinutes} userAvatar={userAvatar} userName={userName} />

            <div className="max-h-96 bg-white overflow-y-auto space-y-0 scrollbar-hide">
                {friends.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500">
                        <p className="text-sm">No friends added yet</p>
                        <p className="text-xs text-gray-400 mt-1">Click + to add your first friend</p>
                    </div>
                ) : (
                    friends.map(friend => (
                        <FriendItem friend={friend} key={friend.id} timeOffsetMinutes={timeOffsetMinutes} currentDate={currentDate} />
                    ))
                )}
            </div>

            <TimeTravel onTimeOffsetChange={v => setTimeOffsetMinutes(v)} />
        </div>
    );
}
