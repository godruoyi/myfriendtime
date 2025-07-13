import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import { ask, message } from '@tauri-apps/plugin-dialog';
import { open } from '@tauri-apps/plugin-shell';
import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

export default function SettingGeneral(props: { startup?: boolean; onChange?: (key: string, value: any) => void }) {
    const startupSetting = props.startup ?? false;
    const [launchAtStartup, setLaunchAtStartup] = useState(startupSetting);
    const [isCheckingUpdates, setIsCheckingUpdates] = useState(false);

    useEffect(() => {
        const checkAutostart = async () => {
            const isEnabled = await api.isAutostartEnabled();
            setLaunchAtStartup(isEnabled);
        };

        checkAutostart();
    }, []);

    useEffect(() => {
        if (props.startup !== undefined) {
            setLaunchAtStartup(props.startup);
        }
    }, [props.startup]);

    const handleLaunchAtStartupChange = async (checked: boolean) => {
        const originalValue = launchAtStartup;
        setLaunchAtStartup(checked);

        try {
            if (checked) {
                await api.enableAutostart();
            } else {
                await api.disableAutostart();
            }
            props.onChange?.('launch_at_startup', checked);
        } catch (error) {
            setLaunchAtStartup(originalValue);
            await message(`Failed to ${checked ? 'enable' : 'disable'} launch at startup.`, {
                title: 'Startup Setting Error',
                kind: 'error',
            });
        }
    };

    const checkUpdates = async () => {
        setIsCheckingUpdates(true);
        try {
            const update = await check();
            if (update) {
                const answer = await ask(`A new version ${update.version} is available. Would you like to update?`, {
                    title: 'New Update Available',
                    kind: 'warning',
                });
                if (answer) {
                    await update.downloadAndInstall();
                    await relaunch();
                }
            }
        } finally {
            setIsCheckingUpdates(false);
        }
    };

    return (
        <div className="flex-1 text-center">
            <SettingsRow label="Startup">
                <input
                    type="checkbox"
                    checked={launchAtStartup}
                    onChange={e => handleLaunchAtStartupChange(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-700 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">Start at Login</span>
            </SettingsRow>

            <SettingsRow
                label="Check for Updates"
                description={
                    <span>
                        Click to automatically update your app or manually install the latest version from{' '}
                        <a
                            href="#"
                            onClick={async e => {
                                e.preventDefault();
                                await open('https://github.com/godruoyi/myfriendtime/releases');
                            }}
                            className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
                        >
                            GitHub Releases
                        </a>
                        .
                    </span>
                }
            >
                <button
                    className="border border-gray-300 rounded-md px-2 text-[12px] text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-1 disabled:opacity-60"
                    onClick={checkUpdates}
                    disabled={isCheckingUpdates}
                >
                    {isCheckingUpdates ? (
                        <span className="flex items-center gap-1">
                            <svg className="animate-spin h-4 w-4 text-gray-500" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                            Checking...
                        </span>
                    ) : (
                        'Check for Updates'
                    )}
                </button>
            </SettingsRow>

            <SettingsRow
                label="Send Feedback"
                description={
                    <span>
                        Submit issues or suggestions on{' '}
                        <a
                            href="#"
                            onClick={async e => {
                                e.preventDefault();
                                await open('https://github.com/godruoyi/myfriendtime');
                            }}
                            className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
                        >
                            GitHub
                        </a>
                    </span>
                }
            >
                <button
                    className="border border-gray-300 rounded-md px-2 text-[12px] text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-1"
                    onClick={async () => {
                        await open('https://github.com/godruoyi/myfriendtime');
                    }}
                >
                    Send Feedback
                </button>
            </SettingsRow>

            <SettingsRow label="Quit Application">
                <button
                    onClick={api.exit_app}
                    className="border border-gray-300 rounded-md px-2 text-[12px] text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-1"
                >
                    Quit MyFriendTime
                </button>
            </SettingsRow>
        </div>
    );
}

const SettingsRow = ({ label, description, children }: { label: string; description?: string | React.ReactNode; children: React.ReactNode }) => (
    <div className="grid grid-cols-2 items-start gap-2 py-2">
        <div className="text-right h-6 flex items-center justify-end">
            <label className="text-sm text-gray-700">{label}:</label>
        </div>
        <div className="text-left">
            <div className="h-6 flex items-center">{children}</div>
            {description && <div className="text-xs text-gray-500 mt-1 mb-1">{description}</div>}
        </div>
    </div>
);
