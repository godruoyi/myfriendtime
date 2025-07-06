import { Camera, Clock } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function SettingProfile() {
    const [ownerName, setOwnerName] = useState("Me")
    const [ownerAvatar, setOwnerAvatar] = useState("https://images.godruoyi.com/gblog/assets/brand_logo.Z0NyS6D-_2cLiuT.webp")
    const [currentTime, setCurrentTime] = useState("")
    const [timeZone, setTimeZone] = useState("")
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

        return () => clearInterval(interval)
    }, [])

    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setOwnerAvatar(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOwnerName(e.target.value)
    }

    return (
        <div className="mx-auto px-10 py-8">
            <div className="flex items-start space-x-12">
                {/* Avatar Section - Left Side */}
                <div className="flex flex-col items-center space-y-4 flex-shrink-0">
                    <div className="relative group rounded-full cursor-pointer" onClick={handleAvatarClick}>
                        <img
                            src={ownerAvatar}
                            alt="Profile Avatar"
                            className="object-cover rounded-full w-40 h-40 transition-all duration-300 relative z-10"
                        />
                        <div className="absolute inset-0 bg-gray-500 opacity-0 group-hover:opacity-50 rounded-full transition-all duration-300 flex items-center justify-center z-20">
                            <Camera className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
                        </div>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
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
