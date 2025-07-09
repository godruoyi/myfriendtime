import { useState, useRef, useEffect } from 'react';
import Upload from '../images/Upload';

export default function SettingProfile(props: { username?: string; avatar?: string; onChange?: (key: string, value: any) => void }) {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const [ownerName, setOwnerName] = useState(props.username || 'MyFriendTime');
    const [ownerAvatar, setOwnerAvatar] = useState<string | null>(props.avatar || null);
    const [currentTime, setCurrentTime] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setOwnerName(props.username || 'MyFriendTime');
        setOwnerAvatar(props.avatar || null);
    }, [props.username, props.avatar]);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
            });
            setCurrentTime(timeString);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mx-auto px-10 py-2">
            <div className="flex items-stretch space-x-12">
                <div className="flex flex-col items-center justify-between space-y-4 flex-shrink-0">
                    <div className="flex flex-col items-center space-y-4">
                        <Upload
                            className="w-40 h-40"
                            avatar={ownerAvatar || ''}
                            onAvatarChange={(avatar: string) => {
                                setOwnerAvatar(avatar);
                                props.onChange?.('user_avatar_path', avatar);
                            }}
                        />
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
                        <p className="text-sm text-gray-500 text-center max-w-32">Click to Change Your Profile Avatar</p>
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Your Name</label>
                            <input
                                type="text"
                                value={ownerName}
                                onChange={e => {
                                    setOwnerName(e.target.value);
                                    props.onChange?.('user_name', e.target.value);
                                }}
                                className="text-3xl font-light text-gray-900 bg-transparent border-0 focus:outline-none focus:ring-0 w-full placeholder-gray-400 tracking-tight px-0 py-2"
                                placeholder="Your name"
                                maxLength={10}
                            />
                        </div>
                    </div>
                    <div className="h-px bg-gray-200"></div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">Local Time</h3>

                        <div className="flex items-end justify-between">
                            <div className="flex items-center space-x-3">
                                <p className="text-4xl font-mono font-bold text-gray-900 tracking-wider leading-none">{currentTime}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-600">{timeZone}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
