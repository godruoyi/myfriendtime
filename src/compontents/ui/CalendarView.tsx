import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarViewProps {
    currentDate: Date;
    onDateSelect: (date: Date) => void;
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function CalendarView({ currentDate, onDateSelect }: CalendarViewProps) {
    const [viewYear, setViewYear] = useState(currentDate.getFullYear());
    const [viewMonth, setViewMonth] = useState(currentDate.getMonth());

    const today = new Date();

    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

    const prevMonth = () => {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear(y => y - 1);
        } else {
            setViewMonth(m => m - 1);
        }
    };

    const nextMonth = () => {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear(y => y + 1);
        } else {
            setViewMonth(m => m + 1);
        }
    };

    const handleDayClick = (day: number) => {
        const newDate = new Date(currentDate);
        newDate.setFullYear(viewYear);
        newDate.setMonth(viewMonth);
        newDate.setDate(day);
        onDateSelect(newDate);
    };

    const isSelected = (day: number) =>
        currentDate.getFullYear() === viewYear && currentDate.getMonth() === viewMonth && currentDate.getDate() === day;

    const isToday = (day: number) => today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day;

    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);

    return (
        <div className="px-4 py-2 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between mb-1">
                <button onClick={prevMonth} className="p-0.5 rounded hover:bg-gray-100 transition-colors">
                    <ChevronLeft className="h-4 w-4 text-gray-600" />
                </button>
                <span className="text-xs font-medium text-gray-700">
                    {MONTH_NAMES[viewMonth]} {viewYear}
                </span>
                <button onClick={nextMonth} className="p-0.5 rounded hover:bg-gray-100 transition-colors">
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                </button>
            </div>
            <div className="grid grid-cols-7">
                {DAY_NAMES.map(d => (
                    <div key={d} className="text-center text-[10px] text-gray-400 font-medium py-0.5">
                        {d}
                    </div>
                ))}
                {cells.map((day, idx) => (
                    <div key={idx} className="flex items-center justify-center py-0.5">
                        {day !== null ? (
                            <button
                                onClick={() => handleDayClick(day)}
                                className={`w-6 h-6 text-[11px] rounded-full flex items-center justify-center transition-colors
                                    ${isSelected(day) ? 'bg-blue-500 text-white' : isToday(day) ? 'bg-gray-200 text-gray-800 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                {day}
                            </button>
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    );
}
