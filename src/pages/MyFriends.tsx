import { useEffect, useState, useRef } from 'react';
import { api, Friend } from '../api';
import { listen } from '@tauri-apps/api/event';
import { load } from '@tauri-apps/plugin-store';
import TimeTravel from '../compontents/ui/TimeTravel.tsx';
import FriendItem from '../compontents/ui/FriendItem.tsx';
import MyTime from '../compontents/ui/MyTime.tsx';

import '../assets/css/my_friends.css';

export default function MyFriends() {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const [userName, setUserName] = useState<string>('Me');
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [timeOffsetMinutes, setTimeOffsetMinutes] = useState(0);
    const listenerSetupRef = useRef(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

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
