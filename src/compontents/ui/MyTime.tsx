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

    const timeZoneName = new Intl.DateTimeFormat('en-US', {
        timeZone: times.getCurrentTimezone(),
        timeZoneName: 'short',
    })
        .formatToParts(currentDateWithOffset)
        .find(part => part.type === 'timeZoneName')?.value;

    useEffect(() => {
        setCurrentDateWithOffset(times.calculateTimeOffset(currentDate, timeOffsetMinutes || 0));
    }, [timeOffsetMinutes]);

    return (
        <div className="bg-gray-50 px-4 pt-2 pb-4 border-b border-gray-200 relative">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative">
                        <div className="h-11 w-11 shadow-md rounded-full overflow-hidden bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm">
                            {userAvatar ? (
                                <img src={userAvatar} alt={userName || 'Me'} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gray-400 flex items-center justify-center">
                                    <svg width="11" height="11" viewBox="0 0 80 80" fill="none" className="text-white">
                                        <path
                                            d="M40 36C44.4183 36 48 32.4183 48 28C48 23.5817 44.4183 20 40 20C35.5817 20 32 23.5817 32 28C32 32.4183 35.5817 36 40 36Z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M40 42C30.3349 42 22.5 49.8349 22.5 59.5C22.5 60.8807 23.6193 62 25 62H55C56.3807 62 57.5 60.8807 57.5 59.5C57.5 49.8349 49.6651 42 40 42Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                </div>
                            )}
                            <span style={{ display: 'none' }}>{userName || 'Me'}</span>
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-gray-900">{userName || 'Me'}</p>
                        </div>
                        <p className="text-xs text-gray-600 font-medium">{timeZoneName}</p>
                    </div>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                    <p className="text-xl font-mono font-bold text-gray-900">{formatTime}</p>
                    <p className="text-xs text-gray-600 font-medium">{formatDate}</p>
                </div>
            </div>
        </div>
    );
}
