import formatDate from "./formatDate.js";
type level = 'info' | 'warn' | 'error';
const levels: level[] = ['info', 'warn', 'error'];

export default function logger(message: string, level: level) {
    const now = new Date().toISOString();
    const timestamp = formatDate(now);
    console[level](`[${timestamp}] [${level}] ${message}`);
}
