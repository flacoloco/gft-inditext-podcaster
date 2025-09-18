import { describe, it, expect } from 'vitest';
import { formatDate, millisToMinutes } from './index';

describe('helpers index exports', () => {
    it('should export formatDate function', () => {
        expect(typeof formatDate).toBe('function');
        expect(formatDate('2023-12-01')).toBe('01/12/2023');
    });

    it('should export millisToMinutes function', () => {
        expect(typeof millisToMinutes).toBe('function');
        expect(millisToMinutes(60000)).toBe('01:00');
    });

    it('should export all expected helper functions', () => {
        // Verify that the main helper functions are available
        expect(formatDate).toBeDefined();
        expect(millisToMinutes).toBeDefined();
    });
});
