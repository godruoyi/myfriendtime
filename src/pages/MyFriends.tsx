import {useEffect, useState} from "react";
import {invoke} from "@tauri-apps/api/core";
import {Plus, Settings} from "lucide-react";
import TimeTravel from "../compontents/TimeTravel.tsx";
import FriendItem from "../compontents/FriendItem.tsx";
import MyTime from "../compontents/MyTime.tsx";
import {Friend} from "../types.ts";

import '../assets/css/my_friends.css'

export default function MyFriends() {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const currentDate = new Date();
    const [timeOffsetMinutes, setTimeOffsetMinutes] = useState(0)

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await invoke<Friend[]>('get_friends_command');
                setFriends(result);
            } catch (err) {
                setError(typeof err === 'string' ? err : 'Unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchFriends().then();
    }, []);

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
            console.error('Failed to add friend:', err);
            setError(typeof err === 'string' ? err : 'Failed to add friend');
        }
    }

    if (loading) {
        return <div className="p-4 text-center">正在加载朋友列表...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">错误: {error}</div>;
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
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
                        <Plus className="w-4 h-4"/>
                    </button>
                    <button
                        onClick={openSettings}
                        className="p-1 hover:bg-gray-100 rounded-md transition-colors flex items-center justify-end">
                        <Settings className="w-4 h-4"/>
                    </button>
                </div>
            </div>

            <MyTime currentDate={currentDate} timeOffsetMinutes={timeOffsetMinutes}/>

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

            <TimeTravel onTimeOffsetChange={(v) => setTimeOffsetMinutes(v)}/>
        </div>
    );
}