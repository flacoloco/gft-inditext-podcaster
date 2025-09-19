import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePodcastListData } from './usePodcastListData';
import type { PodcastItemProps } from './usePodcastListData';

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock Date.now for consistent testing
const mockDateNow = vi.fn();
Date.now = mockDateNow;

const mockApiResponse = {
    contents: JSON.stringify({
        feed: {
            entry: [
                {
                    'im:artist': { label: 'Test Author 1' },
                    'im:name': { label: 'Test Podcast 1' },
                    'im:image': [{ label: 'https://test.com/image1.jpg' }],
                    summary: { label: 'Test summary 1' },
                    title: { label: 'Test Podcast 1' },
                    id: { attributes: { 'im:id': '123' } },
                },
                {
                    'im:artist': { label: 'Test Author 2' },
                    'im:name': { label: 'Test Podcast 2' },
                    'im:image': [{ label: 'https://test.com/image2.jpg' }],
                    summary: { label: 'Test summary 2' },
                    title: { label: 'Test Podcast 2' },
                    id: { attributes: { 'im:id': '456' } },
                },
            ],
        },
    }),
};

const expectedPodcastData: PodcastItemProps[] = [
    {
        'im:artist': 'Test Author 1',
        'im:name': 'Test Podcast 1',
        'im:image': 'https://test.com/image1.jpg',
        summary: 'Test summary 1',
        title: 'Test Podcast 1',
        id: '123',
    },
    {
        'im:artist': 'Test Author 2',
        'im:name': 'Test Podcast 2',
        'im:image': 'https://test.com/image2.jpg',
        summary: 'Test summary 2',
        title: 'Test Podcast 2',
        id: '456',
    },
];

describe('usePodcastListData', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorageMock.getItem.mockReturnValue(null);
        mockDateNow.mockReturnValue(1640995200000); // Fixed timestamp
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should return initial state with null data, no error, and loading false', () => {
        localStorageMock.getItem.mockReturnValue(null);

        const { result } = renderHook(() => usePodcastListData());

        expect(result.current[0]).toBeNull(); // data
        expect(result.current[1]).toBeNull(); // error
        expect(result.current[2]).toBe(true); // isLoading (starts as true when fetching)
    });

    it('should fetch data successfully and update state', async () => {
        localStorageMock.getItem.mockReturnValue(null);
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockApiResponse),
        });

        const { result } = renderHook(() => usePodcastListData());

        await waitFor(() => {
            expect(result.current[2]).toBe(false); // isLoading should be false
        });

        expect(result.current[0]).toEqual(expectedPodcastData); // data should match expected
        expect(result.current[1]).toBeNull(); // no error
        expect(mockFetch).toHaveBeenCalledWith(
            'https://api.allorigins.win/get?url=' +
            encodeURIComponent('https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json')
        );
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            'podcastListData',
            JSON.stringify({ date: 1640995200000, podcasts: expectedPodcastData })
        );
    });

    it('should handle fetch errors correctly', async () => {
        localStorageMock.getItem.mockReturnValue(null);
        const testError = new Error('Network error');
        mockFetch.mockRejectedValueOnce(testError);

        const { result } = renderHook(() => usePodcastListData());

        await waitFor(() => {
            expect(result.current[2]).toBe(false); // isLoading should be false
        });

        expect(result.current[0]).toBeNull(); // data should be null
        expect(result.current[1]).toEqual(testError); // error should match
        expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it('should handle HTTP error responses', async () => {
        localStorageMock.getItem.mockReturnValue(null);
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
        });

        const { result } = renderHook(() => usePodcastListData());

        await waitFor(() => {
            expect(result.current[2]).toBe(false); // isLoading should be false
        });

        expect(result.current[0]).toBeNull(); // data should be null
        expect(result.current[1]).toBeInstanceOf(Error);
        expect(result.current[1]?.message).toBe('HTTP error! status: 404');
    });

    it('should handle JSON parsing errors', async () => {
        localStorageMock.getItem.mockReturnValue(null);
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ contents: 'invalid-json' }),
        });

        const { result } = renderHook(() => usePodcastListData());

        await waitFor(() => {
            expect(result.current[2]).toBe(false); // isLoading should be false
        });

        expect(result.current[0]).toBeNull(); // data should be null
        expect(result.current[1]).toBeInstanceOf(Error);
    });

    it('should use cached data when available and fresh (less than 24 hours old)', () => {
        const cachedData = {
            date: 1640995200000, // Current mock time
            podcasts: expectedPodcastData,
        };
        localStorageMock.getItem.mockReturnValue(JSON.stringify(cachedData));
        mockDateNow.mockReturnValue(1640995200000 + (12 * 60 * 60 * 1000)); // 12 hours later

        const { result } = renderHook(() => usePodcastListData());

        expect(result.current[0]).toEqual(expectedPodcastData); // should use cached data
        expect(result.current[1]).toBeNull(); // no error
        expect(result.current[2]).toBe(false); // not loading
        expect(mockFetch).not.toHaveBeenCalled(); // should not fetch
    });

    it('should fetch new data when cached data is stale (older than 24 hours)', async () => {
        const staleData = {
            date: 1640995200000, // Current mock time
            podcasts: expectedPodcastData,
        };
        localStorageMock.getItem.mockReturnValue(JSON.stringify(staleData));
        mockDateNow.mockReturnValue(1640995200000 + (25 * 60 * 60 * 1000)); // 25 hours later (stale)

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockApiResponse),
        });

        const { result } = renderHook(() => usePodcastListData());

        // Should start loading since cache is stale
        expect(result.current[2]).toBe(true);

        await waitFor(() => {
            expect(result.current[2]).toBe(false); // isLoading should be false after fetch
        });

        expect(mockFetch).toHaveBeenCalled(); // should fetch new data
        expect(result.current[0]).toEqual(expectedPodcastData);
    });

    it('should handle malformed cached data gracefully', async () => {
        localStorageMock.getItem.mockReturnValue('invalid-json');

        // Mock console.error to avoid noise in test output
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockApiResponse),
        });

        const { result } = renderHook(() => usePodcastListData());

        await waitFor(() => {
            expect(result.current[2]).toBe(false); // isLoading should be false
        });

        expect(mockFetch).toHaveBeenCalled(); // should fetch since cache is invalid
        expect(result.current[0]).toEqual(expectedPodcastData);

        consoleSpy.mockRestore();
    });

    it('should handle unknown errors and convert them to Error instances', async () => {
        localStorageMock.getItem.mockReturnValue(null);
        mockFetch.mockRejectedValueOnce('string error'); // Non-Error object

        const { result } = renderHook(() => usePodcastListData());

        await waitFor(() => {
            expect(result.current[2]).toBe(false); // isLoading should be false
        });

        expect(result.current[0]).toBeNull(); // data should be null
        expect(result.current[1]).toBeInstanceOf(Error);
        expect(result.current[1]?.message).toBe('An unknown error occurred');
    });

    it('should call localStorage.getItem with correct key', () => {
        renderHook(() => usePodcastListData());

        expect(localStorageMock.getItem).toHaveBeenCalledWith('podcastListData');
    });

    it('should transform API data correctly', async () => {
        localStorageMock.getItem.mockReturnValue(null);
        const complexApiResponse = {
            contents: JSON.stringify({
                feed: {
                    entry: [
                        {
                            'im:artist': { label: 'Complex Author' },
                            'im:name': { label: 'Complex Podcast' },
                            'im:image': [
                                { label: 'https://test.com/small.jpg' },
                                { label: 'https://test.com/large.jpg' },
                            ],
                            summary: { label: 'Complex summary with special chars: &amp; &lt; &gt;' },
                            title: { label: 'Complex Title' },
                            id: { attributes: { 'im:id': '789' } },
                        },
                    ],
                },
            }),
        };

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(complexApiResponse),
        });

        const { result } = renderHook(() => usePodcastListData());

        await waitFor(() => {
            expect(result.current[2]).toBe(false);
        });

        const expectedTransformed = [
            {
                'im:artist': 'Complex Author',
                'im:name': 'Complex Podcast',
                'im:image': 'https://test.com/small.jpg', // Should use first image
                summary: 'Complex summary with special chars: &amp; &lt; &gt;',
                title: 'Complex Title',
                id: '789',
            },
        ];

        expect(result.current[0]).toEqual(expectedTransformed);
    });
});
