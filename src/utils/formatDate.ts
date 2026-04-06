export default function formatDate(isoString: string): string {
    if (!isoString) return '—';

    const d = new Date(isoString);    
    if (typeof d !== 'object') return 'Invalid date';

    return d.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};
