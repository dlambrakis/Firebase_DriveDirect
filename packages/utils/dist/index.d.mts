/**
 * Formats a date string or Date object into a more readable format.
 * @param date The date to format.
 * @param formatString The desired output format.
 * @returns A formatted date string.
 */
declare const formatDate: (date: string | Date, formatString?: string) => string;
/**
 * Formats a date string or Date object into a short date and time format.
 * e.g., "Jan 1, 5:00 PM"
 * @param date The date to format.
 * @returns A formatted date-time string.
 */
declare const formatDateTimeShort: (date: string | Date) => string;

/**
 * Defines the shape of the filters used for searching and filtering vehicles.
 */
interface VehicleFilters {
    searchTerm?: string;
    makes?: string[];
    models?: string[];
    locations?: string[];
    bodyTypes?: string[];
    transmissions?: string[];
    fuelTypes?: string[];
    drivetrains?: string[];
    engineSizes?: string[];
    features?: string[];
    minYear?: number;
    maxYear?: number;
    minPrice?: number;
    maxPrice?: number;
    minMileage?: number;
    maxMileage?: number;
    sortBy?: string;
    pageNumber?: number;
    pageSize?: number;
}

declare const formatFilterValue: (key: string, value: any, allFilters: Partial<VehicleFilters>) => string;
declare const formatFilterLabel: (key: string) => string;
declare const getActiveFilters: (filters: Partial<VehicleFilters>) => [string, string | number | string[]][];

/**
 * Formats a number into a South African Rand (ZAR) currency string.
 * @param price The number to format.
 * @returns A string like "R 150,000".
 */
declare const formatPrice: (price: number) => string;
/**
 * Formats a number into a mileage string with "km".
 * @param mileage The number to format.
 * @returns A string like "123,456 km".
 */
declare const formatMileage: (mileage: number) => string;

export { formatDate, formatDateTimeShort, formatFilterLabel, formatFilterValue, formatMileage, formatPrice, getActiveFilters };
