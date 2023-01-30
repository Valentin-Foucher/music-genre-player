export const getTimesampMillis = (date?: Date): number => {
    date = date ? date : new Date();
    return new Date().getTime();
}

export const getTimestamp = (date?: Date): number => {
    return getTimesampMillis(date) / 1000;
}

export const formatMillis = (ms: number): string => {
    const totalSeconds = ms / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    return `${Math.floor(totalSeconds / 60)}:${seconds < 10 ? `0${seconds}` : seconds}`;
}