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

    const timeZoneName = new Intl.DateTimeFormat('en-US', {
        timeZone: times.getCurrentTimezone(),
        timeZoneName: 'short',
    })
        .formatToParts(currentDateWithOffset)
        .find(part => part.type === 'timeZoneName')?.value;

    useEffect(() => {
        setCurrentDateWithOffset(times.calculateTimeOffset(currentDate, timeOffsetMinutes || 0));
    }, [timeOffsetMinutes, currentDate]);

    return (
        <div className="bg-gray-100 p-4 pb-2 border-b border-gray-200 relative">
            <div className="flex justify-between">
                <div className="flex-1 min-w-0 ">
                    <div className="flex flex-col gap-1.5">
                        <img src={userAvatarSrc} alt={userName || 'Me'} className="w-12 h-12 object-cover rounded-md border-2 border-white" />
                        <p className="text-base font-mono font-bold text-[#1f2937] truncate">{userName || 'Me'}</p>
                    </div>
                </div>

                <div className="text-right flex-shrink-0 ml-3 flex flex-col justify-between">
                    <p className="text-2xl font-mono font-bold text-[#1f2937]">{formatTime}</p>
                    <div className="self-end">
                        <p className="text-sm text-gray-600 font-medium">{formatDate}</p>
                        <p className="text-xs text-gray-600 font-medium">{timeZoneName}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
