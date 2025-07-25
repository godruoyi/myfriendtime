export const getCurrentTimezone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const calculateTimeOffset = (base: Date, offset: number) => {
    return new Date(base.getTime() + offset * 60 * 1000);
};

export const formatTime = (date: Date, timezone: string) => {
    return new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    }).format(date);
};

export const formatTimeToHHMMSS = (date: Date, timeZone?: string) => {
    const options: Intl.DateTimeFormatOptions = {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };
    if (timeZone) {
        options.timeZone = timeZone;
    }

    return date.toLocaleTimeString('en-US', options);
};

export const formatDate = (date: Date, timezone: string) => {
    return new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    }).format(date);
};

export const formatDateWithoutWeek = (date: Date, timezone: string) => {
    return new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        month: 'short',
        day: 'numeric',
    }).format(date);
};

export const formatTimeOffset = (offset: number) => {
    if (offset === 0) {
        return 'Now';
    }

    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;
    const sign = offset > 0 ? '+' : '-';
    if (hours === 0) {
        return `${sign}${minutes}m`;
    }

    return minutes === 0 ? `${sign}${hours}h` : `${sign}${hours}h ${minutes}m`;
};

function getUtcOffset(date: Date, timeZone: string): number {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour12: false,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    });

    const parts = formatter.formatToParts(date);
    const partsMap = new Map(parts.map(p => [p.type, p.value]));

    const targetTimeAsUTCTimestamp = Date.UTC(
        parseInt(partsMap.get('year')!, 10),
        parseInt(partsMap.get('month')!, 10) - 1,
        parseInt(partsMap.get('day')!, 10),
        parseInt(partsMap.get('hour')!, 10),
        parseInt(partsMap.get('minute')!, 10),
        parseInt(partsMap.get('second')!, 10)
    );

    return (date.getTime() - targetTimeAsUTCTimestamp) / (3600 * 1000);
}

export function getOffsetFromLocal(date: Date, timeZone: string): string {
    const targetOffset = getUtcOffset(date, timeZone);
    const localOffset = date.getTimezoneOffset() / 60;

    const finalOffset = targetOffset - localOffset;

    const roundedOffset = Math.round(finalOffset * 10) / 10;

    const absOffset = Math.abs(roundedOffset);
    const offsetStr = absOffset % 1 === 0 ? absOffset.toFixed(0) : absOffset.toFixed(1);
    return `${-roundedOffset >= 0 ? '+' : '-'}${offsetStr}h`;
}
