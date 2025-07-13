import React, { useState } from 'react';
import * as times from '../../support/times.ts';
import { Cog, Plus, RotateCcw } from 'lucide-react';
import { api } from '../../api.ts';

interface TimeTravelProps {
    onTimeOffsetChange: (offsetMinutes: number) => void;
}

export default function TimeTravel({ onTimeOffsetChange }: TimeTravelProps) {
    const [timeOffset, setTimeOffset] = useState(0);

    const handleTimeSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.valueAsNumber;
        setTimeOffset(value);
        onTimeOffsetChange(value);
    };

    return (
        <div className="px-4 py-2 bg-gray-100 border-t border-gray-200">
            <div className="flex items-center gap-3">
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
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
                        step={10}
                        value={timeOffset}
                        onChange={handleTimeSliderChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                            background: '#E5E7EB',
                            WebkitAppearance: 'none',
                            appearance: 'none',
                        }}
                    />

                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>-12h</span>
                        <span>Now</span>
                        <span>+12h</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
