"use client"

import { useState } from "react"

import '../assets/css/settings.css';
import { Bug, Cog, Info, UserCog } from "lucide-react";
import SettingGeneral from "../compontents/SettingGeneral.tsx";
import SettingAbout from "../compontents/SettingAbout.tsx";
import SettingProfile from "../compontents/SettingProfile.tsx";

type SettingsTab = "general" | "about" | "profile";


export default function Settings() {
    const [activeTab, setActiveTab] = useState<SettingsTab>("general")
    const [launchAtStartup, setLaunchAtStartup] = useState(false)

    const tabs = [
        { id: "general" as const, label: "General", icon: <Cog className="w-5 h-5" /> },
        { id: "profile" as const, label: "Profile", icon: <UserCog className="w-5 h-5" /> },
        { id: "about" as const, label: "About", icon: <Info className="w-5 h-5" /> },
    ]

    const handleCheckForUpdates = () => console.log("Checking for updates...");
    const handleSendFeedback = () => console.log("Opening feedback...");
    const handleQuit = () => console.log("Quitting application...");

    const renderAboutSettings = () => (
        <div className="text-center py-8">
            x
        </div>
    )

    const renderContent = () => {
        switch (activeTab) {
            case "general":
                return <SettingGeneral />
            case "about":
                return <SettingAbout />
            case "profile":
                return <SettingProfile />
            default:
                return null
        }
    }

    return (
        <div>
            <div className="flex-shrink-0 pt-8 bg-red pb-2 border-b border-gray-200">
                <nav className="flex justify-center" data-tauri-drag-region>
                    <div className="flex space-x-0.5 rounded-lg backdrop-blur-sm">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex flex-col py-1 px-2 items-center text-[10px] font-medium rounded-md transition-all duration-200 ${activeTab === tab.id
                                    ? 'bg-[#EFEFEF] text-[#0066EB] shadow-sm'
                                    : 'text-gray-500 hover:bg-[#EFEFEF] transition-colors'
                                    }`}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </nav>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                    {renderContent()}
                </div>
            </div>
        </div>
    )
}
