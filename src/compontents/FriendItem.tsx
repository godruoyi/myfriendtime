import type {Friend} from '../bindings';
import * as times from "../support/times.ts";
import {useEffect, useState} from "react";
import {Moon, Sun} from "lucide-react";

interface Props {
    friend: Friend,
    timeOffsetMinutes?: number,
    currentDate: Date,
}

export default function FriendItem({friend, timeOffsetMinutes, currentDate}: Props) {
    const [currentDateWithOffset, setCurrentDateWithOffset] = useState<Date>(currentDate);
    const formatDate = times.formatDate(currentDateWithOffset, friend.timezone);
    const formatTime = times.formatTime(currentDateWithOffset, friend.timezone);

    useEffect(() => {
        setCurrentDateWithOffset(times.calculateTimeOffset(currentDate, timeOffsetMinutes || 0));
    }, [timeOffsetMinutes]);

    const {IconComponent, IconColor} = calculateTimeIcon(friend.timezone, currentDateWithOffset)

    return (
        <div
            key={friend.id}
            className="px-4 py-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
        >
            <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                    <div
                        className="h-8 w-8 ring-2 ring-gray-200 shadow-sm rounded-full overflow-hidden bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white text-xs">
                        <img
                            src={friend.avatar}
                            alt={friend.name}
                            className="w-full h-full object-cover"
                        />
                        <span style={{display: "none"}}>
                          {friend.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                        </span>
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{friend.name}</p>
                    <p className="text-xs text-gray-500 truncate">
                        {friend.city}, {friend.country}
                    </p>
                </div>

                <div className="flex-shrink-0">
                    <IconComponent className="h-4 w-4" color={IconColor}/>
                </div>

                <div className="text-right flex-shrink-0">
                    <p className="text-sm font-mono font-semibold text-gray-900">{formatTime}</p>
                    <p className="text-xs text-gray-500">{formatDate}</p>
                </div>
            </div>
        </div>
    )
}

function calculateTimeIcon(timezone: string, currentDate: Date) {
    const hour = Number.parseInt(
        new Intl.DateTimeFormat("en-US", {
            timeZone: timezone,
            hour: "2-digit",
            hour12: false,
        }).format(currentDate),
    )

    if (hour >= 6 && hour < 18) {
        return {
            IconComponent: Sun,
            IconColor: "#E57C00",
        }
    }

    return {
        IconComponent: Moon,
        IconColor: "#993DC8",
    }
}