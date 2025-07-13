import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { api } from '../api';
import * as times from '../support/times.ts';
import timezones from '../assets/timezones.json';
import '../assets/css/new_friend.css';
import Upload from '../compontents/images/Upload.tsx';

export default function NewFriend() {
    const [friendName, setFriendName] = useState('');
    const [friendAvatar, setFriendAvatar] = useState<string | null>(null);
    const [selectedTimezone, setSelectedTimezone] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const updateTime = () => {
            setCurrentTime(new Date());
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);

        setFriendName('');
        setFriendAvatar(null);
        setSelectedTimezone('');

        return () => clearInterval(interval);
    }, []);

    const handleSave = async () => {
        if (!friendName.trim() || !selectedTimezone) {
            return;
        }

        const timezone = timezones.find(tz => tz.value === selectedTimezone);
        if (!timezone) {
            console.error('invalid timezone selected:', selectedTimezone);
            return;
        }

        try {
            await api.addFriend({
                name: friendName.trim(),
                avatar: friendAvatar || '',
                timezone: timezone.value,
                city: timezone.city,
                country: timezone.country,
            });

            setFriendName('');
            setFriendAvatar(null);
            setSelectedTimezone('');
            const appWindow = getCurrentWindow();
            await appWindow.close();
        } catch (error) {
            console.error('error saving friend:', error);
        }
    };

    const canSave = friendName.trim() && selectedTimezone;

    return (
        <div className="bg-[#F6F6F6] flex flex-col pb-6">
            <div className="px-6">
                <div className="py-4">
                    <div className="text-left">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Add New Friend</h1>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Connect with friends around the world and keep track of their local time and timezone.
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-md border border-gray-200 shadow-lg p-6">
                    <div className="flex flex-col items-center space-y-6">
                        <div className="relative w-full">
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="flex flex-col items-start text-left">
                                    <div className="text-xs text-gray-500 mb-1">MY TIME</div>
                                    <div className="text-xl font-mono font-bold text-gray-800 tracking-wider">
                                        {times.formatTimeToHHMMSS(currentTime)}
                                    </div>
                                </div>

                                <div className="flex-shrink-0">
                                    <Upload className="w-32 h-32" avatar={friendAvatar || ''} onAvatarChange={setFriendAvatar} />
                                </div>

                                <div className="flex flex-col items-end text-right">
                                    <div className="text-xs text-gray-500 mb-1"> FRIEND'S TIME </div>
                                    <div className="text-xl font-mono font-bold text-gray-800 tracking-wider">
                                        {selectedTimezone ? times.formatTimeToHHMMSS(currentTime, selectedTimezone) : '00:00:00'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full space-y-4">
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Friend's Name</label>
                                <input
                                    type="text"
                                    value={friendName}
                                    onChange={e => setFriendName(e.target.value)}
                                    placeholder="Enter your friend's name"
                                    className="w-full px-2 py-1 text-sm text-gray-600 bg-white border border-gray-300
                                        rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                                        focus:border-blue-500 transition-all duration-200 placeholder-gray-400
                                        hover:border-gray-400"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Friend's Timezone</label>
                                <div className="relative">
                                    <select
                                        value={selectedTimezone}
                                        onChange={e => setSelectedTimezone(e.target.value)}
                                        className={`w-full px-2 py-1 text-sm bg-white border border-gray-300 rounded-md shadow-sm
                                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                            transition-all duration-200 appearance-none cursor-pointer
                                            hover:border-gray-400 pr-10
                                            ${selectedTimezone === '' ? 'text-gray-400' : 'text-gray-600'}`}
                                    >
                                        <option value="" disabled>
                                            Select a timezone
                                        </option>
                                        {timezones.map(timezone => (
                                            <option key={timezone.value} value={timezone.value}>
                                                {timezone.label}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown
                                        size={16}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-10 mt-6">
                    <button
                        onClick={handleSave}
                        className={`px-5 py-2.5 text-sm w-full font-medium rounded-md transition-all duration-150
                                  focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-opacity-50
                                  shadow-sm ${
                                      canSave
                                          ? 'text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
                                          : 'text-gray-500 bg-gray-100 cursor-not-allowed border border-gray-300'
                                  }`}
                    >
                        Add Friend
                    </button>
                </div>
            </div>
        </div>
    );
}
