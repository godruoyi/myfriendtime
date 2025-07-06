import { useState, useEffect } from "react"
import { Camera, ChevronDown } from "lucide-react"
import { open } from '@tauri-apps/plugin-dialog'
import { invoke } from '@tauri-apps/api/core'
import { getCurrentWindow } from "@tauri-apps/api/window"
import type { Friend } from '../types'

import '../assets/css/new_friend.css';

const timezones = [
    { label: "New York (EST)", value: "America/New_York", city: "New York", country: "United States" },
    { label: "Los Angeles (PST)", value: "America/Los_Angeles", city: "Los Angeles", country: "United States" },
    { label: "Chicago (CST)", value: "America/Chicago", city: "Chicago", country: "United States" },
    { label: "London (GMT)", value: "Europe/London", city: "London", country: "United Kingdom" },
    { label: "Tokyo (JST)", value: "Asia/Tokyo", city: "Tokyo", country: "Japan" },
    { label: "Sydney (AEDT)", value: "Australia/Sydney", city: "Sydney", country: "Australia" },
    { label: "Berlin (CET)", value: "Europe/Berlin", city: "Berlin", country: "Germany" },
    { label: "Shanghai (CST)", value: "Asia/Shanghai", city: "Shanghai", country: "China" },
    { label: "Paris (CET)", value: "Europe/Paris", city: "Paris", country: "France" },
    { label: "Toronto (EST)", value: "America/Toronto", city: "Toronto", country: "Canada" },
]

const DefaultAvatar = () => (
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
)

export default function NewFriend() {
    const [friendName, setFriendName] = useState("")
    const [friendAvatar, setFriendAvatar] = useState<string | null>(null)
    const [selectedTimezone, setSelectedTimezone] = useState("")
    const [currentTime, setCurrentTime] = useState(new Date())
    const [isHoveringAvatar, setIsHoveringAvatar] = useState(false)

    useEffect(() => {
        const updateTime = () => {
            setCurrentTime(new Date())
        }

        updateTime()
        const interval = setInterval(updateTime, 1000)

        return () => clearInterval(interval)
    }, [])

    // Clear form when component mounts (when window opens)
    useEffect(() => {
        // Reset form state when window opens
        setFriendName("")
        setFriendAvatar(null)
        setSelectedTimezone("")
        setIsHoveringAvatar(false)
    }, [])

    const formatTime = (date: Date, timeZone?: string) => {
        const options: Intl.DateTimeFormatOptions = {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }
        if (timeZone) {
            options.timeZone = timeZone
        }
        return date.toLocaleTimeString('en-US', options)
    }

    const handleAvatarClick = async () => {
        try {
            const selected = await open({
                title: 'Select Friend Avatar',
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
                setFriendAvatar(base64Data)
            }
        } catch (error) {
            console.error('Error selecting avatar:', error)
        }
    }

    const handleSave = async () => {
        if (!friendName.trim() || !selectedTimezone) {
            return
        }

        const timezone = timezones.find((tz) => tz.value === selectedTimezone)
        if (!timezone) return

        try {
            // Call Tauri command to save friend
            const savedFriend = await invoke<Friend>('add_friend_command', {
                request: {
                    name: friendName.trim(),
                    avatar: friendAvatar || '', // Use empty string if no avatar
                    timezone: timezone.value,
                    city: timezone.city,
                    country: timezone.country,
                }
            })

            console.log('Friend saved successfully:', savedFriend)

            // Clear form state for next use
            setFriendName("")
            setFriendAvatar(null)
            setSelectedTimezone("")
            setIsHoveringAvatar(false)

            // Hide window after successful save (use hide instead of close)
            const appWindow = getCurrentWindow()
            await appWindow.close()
        } catch (error) {
            console.error('Error saving friend:', error)
            // TODO: Show error message to user
        }
    }

    const canSave = friendName.trim() && selectedTimezone

    return (
        <div className="bg-[#F6F6F6] flex flex-col pb-6">
            <div className="px-6">
                <div className="py-4">
                    <div className="text-left">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Add New Friend
                        </h1>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Connect with friends around the world and keep track of their local time zones
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-md border border-gray-200 shadow-lg p-6">
                    <div className="flex flex-col items-center space-y-6">
                        <div className="relative w-full pb-8">
                            <svg
                                className="absolute inset-0 w-full h-full z-0"
                                viewBox="0 0 100 50"
                                preserveAspectRatio="none"
                            >
                                <path
                                    d="M 12 28 L 12 46 L 86 46 L 86 28"
                                    className="stroke-current text-gray-800 opacity-80"
                                    strokeWidth="0.6"
                                    fill="none"
                                    strokeDasharray="2 1.6"
                                />
                            </svg>

                            <div className="relative z-10 flex items-center justify-between">
                                <div className="flex flex-col items-start text-left">
                                    <div className="text-xs text-gray-500 mb-1">MY TIME</div>
                                    <div className="text-xl font-mono font-bold text-gray-800 tracking-wider">
                                        {formatTime(currentTime)}
                                    </div>
                                </div>

                                <div className="flex-shrink-0">
                                    <div
                                        className="relative cursor-pointer group"
                                        onClick={handleAvatarClick}
                                        onMouseEnter={() => setIsHoveringAvatar(true)}
                                        onMouseLeave={() => setIsHoveringAvatar(false)}
                                    >
                                        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 shadow-xl border-4 border-white">
                                            {friendAvatar ? (
                                                <img
                                                    src={friendAvatar}
                                                    alt="Friend Avatar"
                                                    className="w-full h-full object-cover"
                                                />
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
                                </div>

                                <div className="flex flex-col items-end text-right">
                                    <div className="text-xs text-gray-500 mb-1"> FRIEND'S TIME </div>
                                    <div className="text-xl font-mono font-bold text-gray-800 tracking-wider">
                                        {selectedTimezone
                                            ? formatTime(currentTime, selectedTimezone)
                                            : '00:00:00'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full space-y-4">
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Friend's Name
                                </label>
                                <input
                                    type="text"
                                    value={friendName}
                                    onChange={(e) => setFriendName(e.target.value)}
                                    placeholder="Enter your friend's name"
                                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm
                                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                           transition-all duration-200 placeholder-gray-400 hover:border-gray-400"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Friend's Timezone
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedTimezone}
                                        onChange={(e) => setSelectedTimezone(e.target.value)}
                                        className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm
                                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                               transition-all duration-200 appearance-none cursor-pointer
                                               hover:border-gray-400 pr-10"
                                    >
                                        <option value="" disabled>Select a timezone</option>
                                        {timezones.map((timezone) => (
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
                                  shadow-sm ${canSave
                                ? 'text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
                                : 'text-gray-500 bg-gray-100 cursor-not-allowed border border-gray-300'
                            }`}
                    >
                        Add Friend
                    </button>
                </div>
            </div>
        </div>
    )
}
