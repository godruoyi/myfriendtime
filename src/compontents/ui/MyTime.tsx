import * as times from '../../support/times.ts';
import { useEffect, useState } from 'react';

interface Props {
    timeOffsetMinutes?: number;
    currentDate: Date;
    userAvatar?: string | null;
    userName?: string;
}

export default function MyTime({ currentDate, timeOffsetMinutes, userAvatar, userName }: Props) {
    const [currentDateWithOffset, setCurrentDateWithOffset] = useState<Date>(currentDate);
    const timezone = times.getCurrentTimezone();
    const formatDate = times.formatDate(currentDateWithOffset, timezone);
    const formatTime = times.formatTime(currentDateWithOffset, timezone);
    const defaultAvatar = 'icon.svg';
    const userAvatarSrc = userAvatar || defaultAvatar;

    useEffect(() => {
        setCurrentDateWithOffset(times.calculateTimeOffset(currentDate, timeOffsetMinutes || 0));
    }, [timeOffsetMinutes, currentDate]);

    return (
        <div className="bg-gray-100 py-4 px-4 pb-2 border-b border-gray-200 relative">
            <div className="flex justify-between">
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col gap-1.5">
                        <img src={userAvatarSrc} alt={userName || 'Me'} className="w-14 h-14 object-cover rounded-md" />
                        <div className="text-sm font-mono font-bold text-[#1f2937] truncate">{userName || 'Me'}</div>
                    </div>
                </div>
                <div className="text-right flex-shrink-0 flex flex-col justify-between">
                    <div className="self-end space-y-2">
                        <p className="text-sm font-bold text-gray-600 font-medium">{formatDate}</p>
                        <p className="text-xs text-gray-600 font-medium">{timezone}</p>
                    </div>
                    <p className="text-xl font-mono font-bold text-[#1f2937]">{formatTime}</p>
                </div>
            </div>
        </div>
    );
}
