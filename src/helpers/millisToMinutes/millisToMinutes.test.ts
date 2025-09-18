import { describe, it, expect } from 'vitest';
import { millisToMinutes } from './millisToMinutes';

describe('millisToMinutes', () => {
    it('should convert milliseconds to MM:SS format correctly', () => {
        // Test exact minutes
        expect(millisToMinutes(60000)).toBe('01:00'); // 1 minute
        expect(millisToMinutes(120000)).toBe('02:00'); // 2 minutes

        // Test minutes with seconds
        expect(millisToMinutes(90000)).toBe('01:30'); // 1 minute 30 seconds
        expect(millisToMinutes(150000)).toBe('02:30'); // 2 minutes 30 seconds

        // Test edge cases
        expect(millisToMinutes(0)).toBe('00:00'); // 0 milliseconds
        expect(millisToMinutes(1000)).toBe('00:01'); // 1 second
        expect(millisToMinutes(59000)).toBe('00:59'); // 59 seconds

        // Test longer durations
        expect(millisToMinutes(3661000)).toBe('61:01'); // 1 hour 1 minute 1 second
        expect(millisToMinutes(7200000)).toBe('120:00'); // 2 hours

        // Test realistic podcast durations
        expect(millisToMinutes(2732000)).toBe('45:32'); // 45 minutes 32 seconds
        expect(millisToMinutes(2295000)).toBe('38:15'); // 38 minutes 15 seconds
        expect(millisToMinutes(3140000)).toBe('52:20'); // 52 minutes 20 seconds
    });

    it('should handle fractional milliseconds by flooring', () => {
        expect(millisToMinutes(1500)).toBe('00:01'); // 1.5 seconds -> 1 second
        expect(millisToMinutes(60500)).toBe('01:00'); // 60.5 seconds -> 60 seconds
        expect(millisToMinutes(90999)).toBe('01:30'); // 90.999 seconds -> 90 seconds
    });

    it('should pad single digits with zeros', () => {
        expect(millisToMinutes(5000)).toBe('00:05'); // 5 seconds
        expect(millisToMinutes(65000)).toBe('01:05'); // 1 minute 5 seconds
        expect(millisToMinutes(605000)).toBe('10:05'); // 10 minutes 5 seconds
    });

    it('should handle very large durations', () => {
        expect(millisToMinutes(36000000)).toBe('600:00'); // 10 hours
        expect(millisToMinutes(86400000)).toBe('1440:00'); // 24 hours
    });
});
