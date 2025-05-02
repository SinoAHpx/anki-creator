/**
 * Format a date string in YYYY-MM-DD format to a user-friendly format
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Formatted date string (Today, Yesterday, or full date)
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateString === today.toISOString().split('T')[0]) {
        return 'Today';
    } else if (dateString === yesterday.toISOString().split('T')[0]) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

/**
 * Group history items by date
 * @param items - Array of history items with timestamp
 * @returns Grouped items by date
 */
export function groupByDate<T extends { timestamp: number }>(
    items: T[]
): Array<{ date: string; items: T[] }> {
    // Group by date (YYYY-MM-DD)
    const grouped: Record<string, T[]> = {};

    items.forEach(item => {
        const date = new Date(item.timestamp);
        const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format

        if (!grouped[dateKey]) {
            grouped[dateKey] = [];
        }

        grouped[dateKey].push(item);
    });

    // Sort dates in descending order (newest first)
    return Object.entries(grouped)
        .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
        .map(([date, dateItems]) => ({
            date,
            items: dateItems.sort((a, b) => b.timestamp - a.timestamp) // Sort by timestamp descending
        }));
}
