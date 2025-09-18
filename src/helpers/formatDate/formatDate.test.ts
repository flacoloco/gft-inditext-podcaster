import { describe, it, expect } from 'vitest';
import { formatDate } from './formatDate';

describe('formatDate', () => {
    it('should convert ISO date string to DD/MM/YYYY format', () => {
        expect(formatDate('2023-12-01')).toBe('01/12/2023');
        expect(formatDate('2023-11-28')).toBe('28/11/2023');
        expect(formatDate('2023-01-15')).toBe('15/01/2023');
    });

    it('should handle different months correctly', () => {
        expect(formatDate('2023-01-01')).toBe('01/01/2023'); // January
        expect(formatDate('2023-02-14')).toBe('14/02/2023'); // February
        expect(formatDate('2023-03-17')).toBe('17/03/2023'); // March
        expect(formatDate('2023-04-22')).toBe('22/04/2023'); // April
        expect(formatDate('2023-05-05')).toBe('05/05/2023'); // May
        expect(formatDate('2023-06-10')).toBe('10/06/2023'); // June
        expect(formatDate('2023-07-25')).toBe('25/07/2023'); // July
        expect(formatDate('2023-08-30')).toBe('30/08/2023'); // August
        expect(formatDate('2023-09-12')).toBe('12/09/2023'); // September
        expect(formatDate('2023-10-18')).toBe('18/10/2023'); // October
        expect(formatDate('2023-11-03')).toBe('03/11/2023'); // November
        expect(formatDate('2023-12-31')).toBe('31/12/2023'); // December
    });

    it('should handle different years correctly', () => {
        expect(formatDate('2020-05-15')).toBe('15/05/2020');
        expect(formatDate('2021-05-15')).toBe('15/05/2021');
        expect(formatDate('2022-05-15')).toBe('15/05/2022');
        expect(formatDate('2024-05-15')).toBe('15/05/2024');
        expect(formatDate('2025-05-15')).toBe('15/05/2025');
    });

    it('should handle edge cases for days', () => {
        expect(formatDate('2023-01-01')).toBe('01/01/2023'); // First day of month
        expect(formatDate('2023-01-31')).toBe('31/01/2023'); // Last day of January
        expect(formatDate('2023-02-28')).toBe('28/02/2023'); // Last day of February (non-leap year)
        expect(formatDate('2024-02-29')).toBe('29/02/2024'); // Leap year February
    });

    it('should handle dates with full ISO format by extracting date portion', () => {
        // The function should work with just the date portion regardless of what follows
        expect(formatDate('2023-12-01T10:30:00Z')).toBe('01/12/2023');
        expect(formatDate('2023-11-28T14:45:30.123Z')).toBe('28/11/2023');
    });

    it('should maintain zero padding in output', () => {
        expect(formatDate('2023-01-01')).toBe('01/01/2023'); // Both month and day are 01
        expect(formatDate('2023-01-09')).toBe('09/01/2023'); // Day is 09
        expect(formatDate('2023-09-01')).toBe('01/09/2023'); // Month is 09
        expect(formatDate('2023-12-25')).toBe('25/12/2023'); // No padding needed
    });
});
