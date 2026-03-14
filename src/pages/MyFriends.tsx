import { useEffect, useState, useRef } from 'react';
import { api, Friend } from '../api';
import { listen } from '@tauri-apps/api/event';
import { LazyStore } from '@tauri-apps/plugin-store';
import TimeTravel from '../compontents/ui/TimeTravel.tsx';
import FriendItem from '../compontents/ui/FriendItem.tsx';
import MyTime from '../compontents/ui/MyTime.tsx';
import CalendarView from '../compontents/ui/CalendarView.tsx';

import '../assets/css/my_friends.css';

export default function MyFriends() {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const [userName, setUserName] = useState<string>('Me');
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [timeOffsetMinutes, setTimeOffsetMinutes] = useState(0);
    const [calendarViewEnabled, setCalendarViewEnabled] = useState(false);
    const [rebasedFriendId, setRebasedFriendId] = useState<string | null>(null);
    const listenerSetupRef = useRef(false);
    const selectedDateRef = useRef<{ year: number; month: number; day: number } | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            if (selectedDateRef.current) {
                const { year, month, day } = selectedDateRef.current;
                now.setFullYear(year, month, day);
            }
            setCurrentDate(now);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchFriends = async () => {
            const result = await api.getFriends();
            setFriends(result);
        };

        const loadUserSettings = async () => {
            const store = new LazyStore('user-settings.json', { autoSave: true, defaults: {} });
            const name = await store.get<string>('user_name');
            const avatarPath = await store.get<string>('user_avatar_path');
            const calendarView = await store.get<boolean>('calendar_view_enabled');
            const rebasedId = await store.get<string | null>('rebased_friend_id');

            setUserName(name || 'MyFriendTime');
            setUserAvatar(avatarPath || null);
            setCalendarViewEnabled(calendarView ?? false);
            setRebasedFriendId(rebasedId || null);

            store.onChange((key, value) => {
                if (key === 'user_name') {
                    setUserName(value as string);
                } else if (key === 'user_avatar_path') {
                    setUserAvatar(value as string);
                } else if (key === 'calendar_view_enabled') {
                    setCalendarViewEnabled(value as boolean);
                } else if (key === 'rebased_friend_id') {
                    setRebasedFriendId(value as string | null);
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
            unlisten = await listen<Friend>('friend-added', event => {
                const friend = event.payload as Friend;
                setFriends(prev => [...prev, friend]);
            });
        };

        setupEventListener();

        return () => {
            unlisten?.();
        };
    }, []);

    const handleRebase = async (friendId: string) => {
        setRebasedFriendId(friendId);
        const store = new LazyStore('user-settings.json', { autoSave: true, defaults: {} });
        await store.set('rebased_friend_id', friendId);
    };

    const handleCancelRebase = async () => {
        setRebasedFriendId(null);
        const store = new LazyStore('user-settings.json', { autoSave: true, defaults: {} });
        await store.set('rebased_friend_id', null);
    };

    return (
        <div className="bg-white rounded-md overflow-hidden">
            <MyTime currentDate={currentDate} timeOffsetMinutes={timeOffsetMinutes} userAvatar={userAvatar} userName={userName} />

            <div className="max-h-96 bg-white overflow-y-auto space-y-0 scrollbar-hide">
                {friends.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500">
                        <p className="text-sm">No friends added yet</p>
                        <p className="text-xs text-gray-400 mt-1">Click + to add your first friend</p>
                    </div>
                ) : (
                    friends.map(friend => (
                        <FriendItem
                            friend={friend}
                            key={friend.id}
                            timeOffsetMinutes={timeOffsetMinutes}
                            currentDate={currentDate}
                            isRebased={rebasedFriendId === friend.id}
                            onRebaseClick={() => handleRebase(friend.id)}
                            onCancelRebase={handleCancelRebase}
                        />
                    ))
                )}
            </div>

            {calendarViewEnabled && (
                <CalendarView
                    currentDate={currentDate}
                    onDateSelect={date => {
                        const today = new Date();
                        if (
                            date.getFullYear() === today.getFullYear() &&
                            date.getMonth() === today.getMonth() &&
                            date.getDate() === today.getDate()
                        ) {
                            selectedDateRef.current = null;
                        } else {
                            selectedDateRef.current = { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() };
                        }
                        setCurrentDate(date);
                    }}
                />
            )}
            <TimeTravel onTimeOffsetChange={v => setTimeOffsetMinutes(v)} />
        </div>
    );
}
