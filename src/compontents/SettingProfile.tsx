import { Camera } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { open } from '@tauri-apps/plugin-dialog'
import { invoke } from '@tauri-apps/api/core'
import { load } from '@tauri-apps/plugin-store'

export default function SettingProfile() {
    const [ownerName, setOwnerName] = useState("Me")
    const [ownerAvatar, setOwnerAvatar] = useState<string | null>(null)
    const [currentTime, setCurrentTime] = useState("")
    const [timeZone, setTimeZone] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        // Get timezone
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
        setTimeZone(tz)

        // Update time every second
        const updateTime = () => {
            const now = new Date()
            const timeString = now.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            })
            setCurrentTime(timeString)
        }

        updateTime()
        const interval = setInterval(updateTime, 1000)

        // Load user settings
        loadUserSettings()

        return () => clearInterval(interval)
    }, [])

    const loadUserSettings = async () => {
        setIsLoading(true)
        try {
            const store = await load('user-settings.json', { autoSave: true })

            const name = await store.get<string>('user_name')
            const avatarPath = await store.get<string>('user_avatar_path')

            setOwnerName(name || 'Me')
            setOwnerAvatar(avatarPath || null)
        } catch (error) {
            console.error('Error loading user settings:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const saveUserName = async (name: string) => {
        try {
            const store = await load('user-settings.json', { autoSave: true })
            await store.set('user_name', name)
            await store.save()
        } catch (error) {
            console.error('Error saving user name:', error)
        }
    }

    const saveUserAvatar = async (avatarPath: string | null) => {
        try {
            const store = await load('user-settings.json', { autoSave: true })
            if (avatarPath) {
                await store.set('user_avatar_path', avatarPath)
            } else {
                await store.delete('user_avatar_path')
            }
            await store.save()
        } catch (error) {
            console.error('Error saving user avatar:', error)
        }
    }

    const handleAvatarClick = async () => {
        try {
            const selected = await open({
                title: 'Select Your Avatar',
                multiple: false,
                filters: [
                    {
                        name: 'Images',
                        extensions: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg', 'avif']
                    }
                ]
            })

            if (selected && typeof selected === 'string') {
                // Use Tauri command to read file as base64
                const base64Data = await invoke<string>('read_image_as_base64', {
                    filePath: selected
                })
                setOwnerAvatar(base64Data)
                // Auto-save avatar
                await saveUserAvatar(base64Data)
            }
        } catch (error) {
            console.error('Error selecting avatar:', error)
        }
    }

    const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value
        setOwnerName(newName)
        // Auto-save name with debounce
        if (newName.trim()) {
            await saveUserName(newName.trim())
        }
    }

    const DefaultAvatar = () => (
        <svg width="100%" height="100%" viewBox="0 0 80 80" fill="none" className="text-gray-400">
            <circle cx="40" cy="40" r="40" fill="currentColor" fillOpacity="0.1" />
            <path
                d="M40 36C44.4183 36 48 32.4183 48 28C48 23.5817 44.4183 20 40 20C35.5817 20 32 23.5817 32 28C32 32.4183 35.5817 36 40 36Z"
                fill="currentColor"
            />
            <path
                d="M40 42C30.3349 42 22.5 49.8349 22.5 59.5C22.5 60.8807 23.6193 62 25 62H55C56.3807 62 57.5 60.8807 57.5 59.5C57.5 49.8349 49.6651 42 40 42Z"
                fill="currentColor"
            />
        </svg>
    )

    return (
        <div className="mx-auto px-10 py-8">
            <div className="flex items-start space-x-12">
                {/* Avatar Section - Left Side */}
                <div className="flex flex-col items-center space-y-4 flex-shrink-0">
                    <div className="relative group rounded-full cursor-pointer" onClick={handleAvatarClick}>
                        <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                            {ownerAvatar ? (
                                <img
                                    src={ownerAvatar}
                                    alt="Profile Avatar"
                                    className="object-cover w-full h-full transition-all duration-300"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center p-4">
                                    <DefaultAvatar />
                                </div>
                            )}
                        </div>
                        <div className="absolute inset-0 bg-gray-500 opacity-0 group-hover:opacity-50 rounded-full transition-all duration-300 flex items-center justify-center z-20">
                            <Camera className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
                        </div>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={() => { }}
                        className="hidden"
                    />
                    <p className="text-sm text-gray-500 text-center max-w-32">
                        Change your photo
                    </p>
                </div>


                {/* Content Section - Right Side */}
                <div className="flex-1 space-y-8">
                    {/* Name Section */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Your Name
                            </label>
                            <input
                                type="text"
                                value={ownerName}
                                onChange={handleNameChange}
                                className="text-3xl font-light text-gray-900 bg-transparent border-0 focus:outline-none focus:ring-0 w-full placeholder-gray-400 tracking-tight px-0 py-2"
                                placeholder="Your name"
                                maxLength={10}
                            />
                            <div className="h-px bg-gray-200 mt-2"></div>
                        </div>
                    </div>

                    {/* Time and Timezone Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-4">
                            Time Information
                        </h3>

                        <div className="bg-gray-50 rounded-xl">
                            <div className="flex items-end justify-between">
                                <div className="flex items-center space-x-3">
                                    <div>
                                        <p className="text-4xl font-mono font-bold text-gray-900 tracking-wider leading-none">
                                            {currentTime}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-600">
                                        {timeZone}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
