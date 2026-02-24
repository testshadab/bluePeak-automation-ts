/**
 * Date formatting utilities for test data
 */

/**
 * Add months to a date, handling month overflow
 */
export function addMonthsLocal(date: Date, months: number): Date {
  const d = new Date(date);
  const day = d.getDate();
  d.setMonth(d.getMonth() + months);
  // If month rolled over (e.g., Jan 31 -> Mar 3), set to last day of previous month
  if (d.getDate() < day) d.setDate(0);
  return d;
}

/**
 * Add days to a date
 */
export function addDaysLocal(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Format a date with ordinal suffix (e.g., "1st January 2025")
 */
export function formatDateOrdinal(date: Date): string {
  const day = date.getDate();
  const suffix =
    day % 10 === 1 && day % 100 !== 11
      ? 'st'
      : day % 10 === 2 && day % 100 !== 12
        ? 'nd'
        : day % 10 === 3 && day % 100 !== 13
          ? 'rd'
          : 'th';
  const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
  const year = date.getFullYear();
  return `${day}${suffix} ${month} ${year}`;
}

