import { Camera } from 'lucide-react';
import { useEffect, useState } from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import { api } from '../../api';

interface UploadProps {
    avatar?: string;
    onAvatarChange?: (avatar: string) => void;
    className?: string;
}

export default function Upload(props: UploadProps) {
    const [friendAvatar, setFriendAvatar] = useState<string | null>(props.avatar || null);
    const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);

    useEffect(() => {
        setFriendAvatar(props.avatar || '');
    }, [props.avatar]);

    const openImageDialog = async () => {
        try {
            const selected = await open({
                title: 'Select an Image',
                multiple: false,
                filters: [
                    {
                        name: 'Images',
                        extensions: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg', 'avif'],
                    },
                ],
            });

            if (selected && typeof selected === 'string') {
                const base64Data = await api.readImageAsBase64(selected);
                setFriendAvatar(base64Data);
                props.onAvatarChange?.(base64Data);
            }
        } catch (error) {
            console.error('error opening image dialog:', error);
        }
    };

    return (
        <div
            className="relative cursor-pointer group"
            onClick={openImageDialog}
            onMouseEnter={() => setIsHoveringAvatar(true)}
            onMouseLeave={() => setIsHoveringAvatar(false)}
        >
            <div className={`rounded-full overflow-hidden bg-gray-100 shadow-xl border-4 border-white ${props.className}`}>
                {friendAvatar ? (
                    <img src={friendAvatar} alt="Friend Avatar" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <DefaultAvatar />
                    </div>
                )}
            </div>
            <div
                className={`absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center transition-all duration-300 ${isHoveringAvatar ? 'opacity-80' : 'opacity-0'}`}
            >
                <div className="bg-white bg-opacity-90 rounded-full p-3 shadow-md">
                    <Camera size={24} className="text-gray-700" />
                </div>
            </div>
        </div>
    );
}

function DefaultAvatar() {
    return (
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="text-gray-400">
            <path
                d="M40 36C44.4183 36 48 32.4183 48 28C48 23.5817 44.4183 20 40 20C35.5817 20 32 23.5817 32 28C32 32.4183 35.5817 36 40 36Z"
                fill="currentColor"
            />
            <path
                d="M40 42C30.3349 42 22.5 49.8349 22.5 59.5C22.5 60.8807 23.6193 62 25 62H55C56.3807 62 57.5 60.8807 57.5 59.5C57.5 49.8349 49.6651 42 40 42Z"
                fill="currentColor"
            />
        </svg>
    );
}
