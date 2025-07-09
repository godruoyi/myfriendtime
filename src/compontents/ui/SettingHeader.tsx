import { getCurrentWindow } from '@tauri-apps/api/window';
import { Cog, Info, UserCog } from 'lucide-react';
import { useCallback } from 'react';

interface SettingHeaderProps {
    activeTab: 'general' | 'about' | 'profile';
    setActiveTab: (tab: 'general' | 'about' | 'profile') => void;
}

export default function SettingHeader({ activeTab, setActiveTab }: SettingHeaderProps) {
    const tabs = [
        { id: 'general' as const, label: 'General', icon: <Cog className="w-5 h-5" /> },
        { id: 'profile' as const, label: 'Profile', icon: <UserCog className="w-5 h-5" /> },
        { id: 'about' as const, label: 'About', icon: <Info className="w-5 h-5" /> },
    ];

    const appWindow = getCurrentWindow();
    const handleDragStart = useCallback(async (e: any) => {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            return;
        }

        try {
            await appWindow.startDragging();
        } catch (error) {
            console.error('Failed to start dragging:', error);
        }
    }, []);

    return (
        <div onMouseDown={handleDragStart} className="select-none">
            <div className="pt-10 flex-shrink-0 pb-2 border-b border-gray-200 bg-white">
                <nav className="flex justify-center">
                    <div className="flex space-x-0.5 rounded-lg">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex flex-col py-1 px-2 items-center text-[10px] font-medium rounded-md transition-all duration-200 ${
                                    activeTab === tab.id
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
    );
}
