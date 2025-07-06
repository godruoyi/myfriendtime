"use client"

import { useCallback, useState } from "react"

import '../assets/css/settings.css';
import { Bug, Cog, Info, UserCog } from "lucide-react";
import SettingGeneral from "../compontents/SettingGeneral.tsx";
import SettingAbout from "../compontents/SettingAbout.tsx";
import SettingProfile from "../compontents/SettingProfile.tsx";
import { getCurrentWindow } from '@tauri-apps/api/window';


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

    const appWindow = getCurrentWindow();
    const handleDragStart = useCallback(async (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            return;
        }

        try {
            await appWindow.startDragging();
        } catch (error) {
            console.error("Failed to start dragging:", error);
        }
    }, []);


    return (
        <div className="">
            <div onMouseDown={handleDragStart}>
                <div className="pt-8 flex-shrink-0 bg-red pb-2 border-b border-gray-200">
                    <nav className="flex justify-center">
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
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                    {renderContent()}
                </div>
            </div>
        </div>
    )
}
