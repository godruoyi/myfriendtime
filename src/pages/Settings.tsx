"use client"

import {useState, useRef} from "react"
import '../assets/css/settings.css';
import {AnimatePresence, motion} from "framer-motion";

type SettingsTab = "general" | "about"

export default function Settings() {
    const [activeTab, setActiveTab] = useState<SettingsTab>("general")
    const [launchAtStartup, setLaunchAtStartup] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const tabs = [
        {id: "general" as const, label: "General", icon: "⚙️"},
        {id: "about" as const, label: "About", icon: "ℹ️"},
    ]

    const handleCheckForUpdates = () => {
        // TODO: Implement update check
        console.log("Checking for updates...")
    }

    const handleSendFeedback = () => {
        // TODO: Open feedback form or email
        console.log("Opening feedback...")
    }

    const handleQuit = () => {
        // TODO: Implement quit functionality
        console.log("Quitting application...")
    }

    const renderGeneralSettings = () => (
        <div className="space-y-6">
            <div className="space-y-4">
                {/* Launch at Startup */}
                <div className="flex items-center justify-between">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Launch at startup</label>
                        <p className="text-xs text-gray-500 mt-1">Automatically start MyFriendTime when you log in</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={launchAtStartup}
                            onChange={(e) => setLaunchAtStartup(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div
                            className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                <hr className="border-gray-200"/>

                {/* Check for Updates */}
                <div className="flex items-center justify-between">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Software Update</label>
                        <p className="text-xs text-gray-500 mt-1">Keep MyFriendTime up to date</p>
                    </div>
                    <button
                        onClick={handleCheckForUpdates}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 bg-transparent"
                    >
                        <span>⬇️</span>
                        Check for Updates
                    </button>
                </div>

                <hr className="border-gray-200"/>

                <div className="flex items-center justify-between">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Feedback</label>
                        <p className="text-xs text-gray-500 mt-1">Help us improve MyFriendTime</p>
                    </div>
                    <button
                        onClick={handleSendFeedback}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 bg-transparent"
                    >
                        <span>💬</span>
                        Send Feedback
                    </button>
                </div>

                <hr className="border-gray-200"/>

                {/* Quit Application */}
                <div className="flex items-center justify-between">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Application</label>
                        <p className="text-xs text-gray-500 mt-1">Quit MyFriendTime</p>
                    </div>
                    <button
                        onClick={handleQuit}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 border border-red-200 hover:bg-red-50 bg-transparent rounded-md"
                    >
                        <span>🚪</span>
                        Quit App
                    </button>
                </div>
            </div>
        </div>
    )

    const renderAboutSettings = () => (
        <div className="flex items-start gap-8">
            {/* App Icon */}
            <div className="flex-shrink-0">
                <div
                    className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-2xl">MFT</span>
                </div>
            </div>

            {/* App Information */}
            <div className="flex-1 space-y-4">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">MyFriendTime</h3>
                    <p className="text-sm text-gray-500 mt-1">Version 1.0.0</p>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                        Keep track of your friends around the world and never miss the perfect time to connect.
                    </p>
                </div>

                <hr className="border-gray-200"/>

                {/* Developer Info */}
                <div className="space-y-3">
                    <div>
                        <p className="text-sm font-medium text-gray-700">Developer</p>
                        <div className="flex items-center justify-between mt-1">
                            <p className="text-sm text-gray-600">Lianbo Zhang</p>
                            <button className="text-blue-600 hover:text-blue-700 h-6 w-6 p-0">
                                <span>🔗</span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-700">Designer</p>
                        <div className="flex items-center justify-between mt-1">
                            <p className="text-sm text-gray-600">Lianbo Zhang</p>
                            <button className="text-blue-600 hover:text-blue-700 h-6 w-6 p-0">
                                <span>🔗</span>
                            </button>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-200"/>

                {/* Links */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <button
                            className="flex items-center gap-2 px-3 py-1.5 text-xs border border-gray-300 rounded-md hover:bg-gray-50 bg-transparent">
                            <span>🐙</span>
                            GitHub
                        </button>
                        <button
                            className="flex items-center gap-2 px-3 py-1.5 text-xs border border-gray-300 rounded-md hover:bg-gray-50 bg-transparent">
                            <span>🐦</span>
                            Twitter
                        </button>
                        <button
                            className="flex items-center gap-2 px-3 py-1.5 text-xs border border-gray-300 rounded-md hover:bg-gray-50 bg-transparent">
                            <span>📧</span>
                            Email
                        </button>
                    </div>
                </div>

                {/* Copyright */}
                <div className="pt-2">
                    <p className="text-xs text-gray-400">© 2024 MyFriendTime. All rights reserved.</p>
                </div>
            </div>
        </div>
    )

    const renderContent = () => {
        switch (activeTab) {
            case "general":
                return renderGeneralSettings()
            case "about":
                return renderAboutSettings()
            default:
                return renderGeneralSettings()
        }
    }

    return (
        <div ref={containerRef} className="">

            {/* Top Navigation Tabs */}
            <div className="bg-gray-50 border-b border-gray-200 flex-shrink-0">
                <div className="flex justify-center py-2">
                    <nav className="flex space-x-1 rounded-md shadow-sm">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? "bg-gray-100 text-gray-900 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                }`}
                            >
                                <span className="text-sm">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white flex-1">
                <div className="p-6">{renderContent()}</div>
            </div>
        </div>
    )
}
