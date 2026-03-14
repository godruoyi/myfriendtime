import React, { useState } from 'react';
import * as times from '../../support/times.ts';
import { Cog, Plus, RotateCcw } from 'lucide-react';
import { api } from '../../api.ts';

interface TimeTravelProps {
    onTimeOffsetChange: (offsetMinutes: number) => void;
}

export default function TimeTravel({ onTimeOffsetChange }: TimeTravelProps) {
    const [timeOffset, setTimeOffset] = useState(0);

    // Get current time in minutes (0-1440)
    const getCurrentTimeInMinutes = (): number => {
        const now = new Date();
        return now.getHours() * 60 + now.getMinutes();
    };

    // Round to nearest half-hour (整点/半点)
    const roundToHalfHour = (minutes: number): number => {
        return Math.round(minutes / 30) * 30;
    };

    const handleTimeSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sliderValue = e.target.valueAsNumber;

        // Calculate the target time in minutes
        const currentTimeMinutes = getCurrentTimeInMinutes();
        const targetTimeMinutes = (currentTimeMinutes + sliderValue) % 1440;

        // Round to nearest half-hour
        const roundedTargetMinutes = roundToHalfHour(targetTimeMinutes);

        // Calculate the new offset based on rounded time
        let newOffset = roundedTargetMinutes - currentTimeMinutes;

        // Handle day wraparound
        if (newOffset > 720) {
            newOffset -= 1440;
        } else if (newOffset < -720) {
            newOffset += 1440;
        }

        setTimeOffset(newOffset);
        onTimeOffsetChange(newOffset);
    };

    return (
        <div className="px-4 py-2 bg-gray-100 border-t border-gray-200">
            <div className="flex items-center gap-3">
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button onClick={api.openSettingsWindow} className="rounded transition-colors">
                                <Cog className="h-4 w-4 text-gray-600" />
                            </button>
                            <button onClick={api.openNewFriendWindow} className="rounded transition-colors">
                                <Plus className="h-4 w-4 text-gray-600" />
                            </button>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-xs font-mono text-gray-700">{times.formatTimeOffset(timeOffset)}</span>
                            {timeOffset !== 0 && (
                                <button
                                    onClick={() => {
                                        setTimeOffset(0);
                                        onTimeOffsetChange(0);
                                    }}
                                    className="rounded transition-colors flex items-center justify-center"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>
                    <input
                        type="range"
                        min={-720}
                        max={720}
                        step={1}
                        value={timeOffset}
                        onChange={handleTimeSliderChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                            background: '#E5E7EB',
                            WebkitAppearance: 'none',
                            appearance: 'none',
                        }}
                    />

                    {/*<div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>-12h</span>
                        <span>Now</span>
                        <span>+12h</span>
                    </div>*/}
                </div>
            </div>
        </div>
    );
}
