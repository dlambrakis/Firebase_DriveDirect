import { format, parseISO } from 'date-fns';

/**
 * Formats a date string or Date object into a more readable format.
 * @param date The date to format.
 * @param formatString The desired output format.
 * @returns A formatted date string.
 */
export const formatDate = (
  date: string | Date,
  formatString: string = 'MMMM d, yyyy'
): string => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    return format(dateObj, formatString);
  } catch (error) {
    console.error('Error formatting date:', date, error);
    return '';
  }
};

/**
 * Formats a date string or Date object into a short date and time format.
 * e.g., "Jan 1, 5:00 PM"
 * @param date The date to format.
 * @returns A formatted date-time string.
 */
export const formatDateTimeShort = (date: string | Date): string => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    return format(dateObj, 'MMM d, p');
  } catch (error) {
    console.error('Error formatting date:', date, error);
    return '';
  }
};
