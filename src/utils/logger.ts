type level = 'info' | 'warn' | 'error';
const levels: level[] = ['info', 'warn', 'error'];

export default function logger(message: string, level: level) {
    const timestamp = new Date().toISOString();
    console[level](`[${timestamp}] [${level}] ${message}`);
}
