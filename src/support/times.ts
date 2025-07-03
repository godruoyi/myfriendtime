export const getCurrentTimezone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export const calculateTimeOffset = (base: Date, offset: number) => {
    return new Date(base.getTime() + offset * 60 * 1000)
}

export const formatTime = (date: Date, timezone: string) => {
    return new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    }).format(date)
}

export const formatDate = (date: Date, timezone: string) => {
    return new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        weekday: "short",
        month: "short",
        day: "numeric",
    }).format(date)
}

export const formatTimeOffset = (offset: number) => {
    if (offset === 0) {
        return "Now"
    }

    const hours = Math.floor(Math.abs(offset) / 60)
    const minutes = Math.abs(offset) % 60
    const sign = offset > 0 ? "+" : "-"
    if (hours === 0) {
        return `${sign}${minutes}m`
    }

    return minutes === 0 ? `${sign}${hours}h` : `${sign}${hours}h ${minutes}m`
}