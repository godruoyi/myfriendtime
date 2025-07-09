'use client';

import { useEffect, useState } from 'react';
import SettingGeneral from '../compontents/ui/SettingGeneral.tsx';
import SettingAbout from '../compontents/ui/SettingAbout.tsx';
import SettingProfile from '../compontents/ui/SettingProfile.tsx';
import SettingHeader from '../compontents/ui/SettingHeader.tsx';
import { LazyStore } from '@tauri-apps/plugin-store';
import type { Settings } from '../api.ts';
import '../assets/css/settings.css';

type SettingsTab = 'general' | 'about' | 'profile';

export default function Settings() {
    const [activeTab, setActiveTab] = useState<SettingsTab>('general');
    const store = new LazyStore('user-settings.json', { autoSave: true });
    const [username, setUsername] = useState<string>('');
    const [userAvatarPath, setUserAvatarPath] = useState<string>('');
    const [startup, setStartup] = useState<boolean>(false);

    useEffect(() => {
        async function initializeSettings() {
            try {
                const name = await store.get<string>('user_name');
                const avatarPath = await store.get<string>('user_avatar_path');
                const startup = await store.get<boolean>('launch_at_startup');

                setUsername(name || 'MyFriendTime');
                setUserAvatarPath(avatarPath || '');
                setStartup(startup !== undefined ? startup : false);
            } catch (error) {
                console.error('Error initializing settings:', error);
            }
        }

        initializeSettings();
    }, []);

    const handleSettingsChange = async (key: string, value: any) => {
        store.set(key, value);
        if (key === 'user_name') {
            setUsername(value);
        } else if (key === 'user_avatar_path') {
            setUserAvatarPath(value);
        } else if (key === 'launch_at_startup') {
            setStartup(value);
        }
    };

    return (
        <div>
            <SettingHeader activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="flex-1 overflow-y-auto">
                <div className="px-6 pb-6 pt-4">
                    {activeTab === 'general' && <SettingGeneral startup={startup} onChange={handleSettingsChange} />}
                    {activeTab === 'about' && <SettingAbout />}
                    {activeTab === 'profile' && <SettingProfile username={username} avatar={userAvatarPath} onChange={handleSettingsChange} />}
                </div>
            </div>
        </div>
    );
}
