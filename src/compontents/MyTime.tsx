import * as times from "../support/times.ts";
import {useEffect, useState} from "react";

interface Props {
    timeOffsetMinutes?: number,
    currentDate: Date,
}

export default function MyTime({currentDate, timeOffsetMinutes}: Props) {
    const [currentDateWithOffset, setCurrentDateWithOffset] = useState<Date>(currentDate);
    const timezone = times.getCurrentTimezone();
    const formatDate = times.formatDate(currentDateWithOffset, timezone);
    const formatTime = times.formatTime(currentDateWithOffset, timezone);

    const timeZoneName = new Intl.DateTimeFormat("en-US", {
        timeZone: times.getCurrentTimezone(),
        timeZoneName: "short",
    }).formatToParts(currentDateWithOffset).find((part) => part.type === "timeZoneName")?.value

    useEffect(() => {
        setCurrentDateWithOffset(times.calculateTimeOffset(currentDate, timeOffsetMinutes || 0));
    }, [timeOffsetMinutes]);

    return (
        <div className="px-4 py-4 bg-gray-50 border-b border-gray-200 relative">
            {/*<div className="absolute top-3 right-5">*/}
            {/*  <Crown className="h-2.5 w-2.5 text-[#E57C00]" />*/}
            {/*</div>*/}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative">
                        <div
                            className="h-10 w-10 ring-2 ring-[#E57C00] shadow-md rounded-full overflow-hidden bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm">
                            <img
                                src="https://images.godruoyi.com/gblog/assets/brand_logo.Z0NyS6D-_2cLiuT.webp"
                                alt="Me"
                                className="w-full h-full object-cover"
                            />
                            <span style={{display: "none"}}>Me</span>
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-gray-900">Lianbo</p>
                            {/*<span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">*/}
                            {/*  Owner*/}
                            {/*</span>*/}
                        </div>
                        <p className="text-xs text-gray-600 font-medium">{timeZoneName}</p>
                    </div>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                    <p className="text-lg font-mono font-bold text-gray-900">{formatTime}</p>
                    <p className="text-xs text-gray-600 font-medium">{formatDate}</p>
                </div>
            </div>
        </div>
    )
}