import React from "react";

const SettingsRow = ({ label, description, children }: {
    label: string,
    description?: string | React.ReactNode,
    children: React.ReactNode
}) => (

    <div className="grid grid-cols-2 items-start gap-2 py-2">
        <div className="text-right h-6 flex items-center justify-end">
            <label className="text-sm text-gray-700">{label}:</label>
        </div>
        <div className="text-left">
            <div className="h-6 flex items-center">
                {children}
            </div>
            {description && (
                <div className="text-xs text-gray-500 mt-1 mb-1">{description}</div>
            )}
        </div>
    </div>
);

export default function SettingGeneral() {
    return (
        <div className="flex-1">
            <SettingsRow label="Startup">
                <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-700 border-gray-300 rounded" />
                <span className="ml-2 text-sm text-gray-600">
                    Start at Login
                </span>
            </SettingsRow>
            <SettingsRow
                label="Check for Updates"
                description={
                    <span>
                        Current version:{" "}
                        <button
                            className="text-blue-600 hover:text-blue-800 underline font-mono text-xs"
                            onClick={() => {
                                // Handle version click (e.g., show changelog)
                            }}
                        >
                            v1.0.0
                        </button>
                    </span>
                }
            >
                <button
                    className="border border-gray-300 rounded-md px-2 text-[12px] text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-1"
                >
                    Check for Updates
                </button>
            </SettingsRow>
            <SettingsRow
                label="Send Feedback"
                description={
                    <span>
                        Submit issues or suggestions on{" "}
                        <a
                            href="https://github.com/godruoyi/myfriendtime"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                        >
                            GitHub
                        </a>
                    </span>
                }
            >
                <button
                    className="border border-gray-300 rounded-md px-2 text-[12px] text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-1"
                >
                    Send Feedback
                </button>
            </SettingsRow>
            <SettingsRow label="Quit Application">
                <button
                    className="border border-gray-300 rounded-md px-2 text-[12px] text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-1"
                >
                    Quit MyFriendTime
                </button>
            </SettingsRow>
        </div>
    )
}
