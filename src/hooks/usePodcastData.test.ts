import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePodcastData } from './usePodcastData';

// Define Episode type as used in the hook (from Episode component, not EpisodesList)
type Episode = {
    trackId: number;
    trackName: string;
    description: string;
    episodeUrl: string;
    releaseDate: string;
    trackTimeMillis: number;
};

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
        results: [
            // First result is the podcast info (should be sliced out)
            {
                wrapperType: 'track',
                kind: 'podcast',
                collectionName: 'Test Podcast',
            },
            // Actual episodes start from index 1
            {
                trackId: 1001,
                trackName: 'Episode 1',
                description: 'First episode description',
                episodeUrl: 'https://test.com/episode1.mp3',
                releaseDate: '2023-01-01T00:00:00Z',
                trackTimeMillis: 3600000,
            },
            {
                trackId: 1002,
                trackName: 'Episode 2',
                description: 'Second episode description',
                episodeUrl: 'https://test.com/episode2.mp3',
                releaseDate: '2023-01-02T00:00:00Z',
                trackTimeMillis: 2700000,
            },
        ],
    }),
};

const expectedEpisodeData: Episode[] = [
    {
        trackId: 1001,
        trackName: 'Episode 1',
        description: 'First episode description',
        episodeUrl: 'https://test.com/episode1.mp3',
        releaseDate: '2023-01-01T00:00:00Z',
        trackTimeMillis: 3600000,
    },
    {
        trackId: 1002,
        trackName: 'Episode 2',
        description: 'Second episode description',
        episodeUrl: 'https://test.com/episode2.mp3',
        releaseDate: '2023-01-02T00:00:00Z',
        trackTimeMillis: 2700000,
    },
];

describe('usePodcastData', () => {
    const testPodcastId = '123456';

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

        const { result } = renderHook(() => usePodcastData(testPodcastId));

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

        const { result } = renderHook(() => usePodcastData(testPodcastId));

        await waitFor(() => {
            expect(result.current[2]).toBe(false); // isLoading should be false
        });

        expect(result.current[0]).toEqual(expectedEpisodeData); // data should match expected
        expect(result.current[1]).toBeNull(); // no error
        expect(mockFetch).toHaveBeenCalledWith(
            'https://api.allorigins.win/get?url=' +
            encodeURIComponent(`https://itunes.apple.com/lookup?id=${testPodcastId}&media=podcast&entity=podcastEpisode&limit=20`)
        );
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            `podcastData_${testPodcastId}`,
            JSON.stringify({ date: 1640995200000, episodes: expectedEpisodeData })
        );
    });

    it('should handle fetch errors correctly', async () => {
        localStorageMock.getItem.mockReturnValue(null);
        const testError = new Error('Network error');
        mockFetch.mockRejectedValueOnce(testError);

        const { result } = renderHook(() => usePodcastData(testPodcastId));

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
            status: 500,
        });

        const { result } = renderHook(() => usePodcastData(testPodcastId));

        await waitFor(() => {
            expect(result.current[2]).toBe(false); // isLoading should be false
        });

        expect(result.current[0]).toBeNull(); // data should be null
        expect(result.current[1]).toBeInstanceOf(Error);
        expect(result.current[1]?.message).toBe('HTTP error! status: 500');
    });

    it('should handle JSON parsing errors', async () => {
        localStorageMock.getItem.mockReturnValue(null);
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ contents: 'invalid-json' }),
        });

        const { result } = renderHook(() => usePodcastData(testPodcastId));

        await waitFor(() => {
            expect(result.current[2]).toBe(false); // isLoading should be false
        });

        expect(result.current[0]).toBeNull(); // data should be null
        expect(result.current[1]).toBeInstanceOf(Error);
    });

    it('should use cached data when available and fresh (less than 24 hours old)', () => {
        const cachedData = {
            date: 1640995200000, // Current mock time
            episodes: expectedEpisodeData,
        };
        localStorageMock.getItem.mockReturnValue(JSON.stringify(cachedData));
        mockDateNow.mockReturnValue(1640995200000 + (12 * 60 * 60 * 1000)); // 12 hours later

        const { result } = renderHook(() => usePodcastData(testPodcastId));

        expect(result.current[0]).toEqual(expectedEpisodeData); // should use cached data
        expect(result.current[1]).toBeNull(); // no error
        expect(result.current[2]).toBe(false); // not loading
        expect(mockFetch).not.toHaveBeenCalled(); // should not fetch
    });

    it('should fetch new data when cached data is stale (older than 24 hours)', async () => {
        const staleData = {
            date: 1640995200000, // Current mock time
            episodes: expectedEpisodeData,
        };
        localStorageMock.getItem.mockReturnValue(JSON.stringify(staleData));
        mockDateNow.mockReturnValue(1640995200000 + (25 * 60 * 60 * 1000)); // 25 hours later (stale)

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockApiResponse),
        });

        const { result } = renderHook(() => usePodcastData(testPodcastId));

        // Should start loading since cache is stale
        expect(result.current[2]).toBe(true);

        await waitFor(() => {
            expect(result.current[2]).toBe(false); // isLoading should be false after fetch
        });

        expect(mockFetch).toHaveBeenCalled(); // should fetch new data
        expect(result.current[0]).toEqual(expectedEpisodeData);
    });

    it('should handle malformed cached data gracefully', async () => {
        localStorageMock.getItem.mockReturnValue('invalid-json');

        // Mock console.error to avoid noise in test output
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockApiResponse),
        });

        const { result } = renderHook(() => usePodcastData(testPodcastId));

        await waitFor(() => {
            expect(result.current[2]).toBe(false); // isLoading should be false
        });

        // The hook should handle the JSON parsing error and fall back to fetching
        expect(mockFetch).toHaveBeenCalled(); // should fetch since cache is invalid
        expect(result.current[0]).toEqual(expectedEpisodeData);

        consoleSpy.mockRestore();
    });

    it('should handle unknown errors and convert them to Error instances', async () => {
        localStorageMock.getItem.mockReturnValue(null);
        mockFetch.mockRejectedValueOnce('string error'); // Non-Error object

        const { result } = renderHook(() => usePodcastData(testPodcastId));

        await waitFor(() => {
            expect(result.current[2]).toBe(false); // isLoading should be false
        });

        expect(result.current[0]).toBeNull(); // data should be null
        expect(result.current[1]).toBeInstanceOf(Error);
        expect(result.current[1]?.message).toBe('An unknown error occurred');
    });

    it('should call localStorage.getItem with correct key based on podcastId', () => {
        renderHook(() => usePodcastData(testPodcastId));

        expect(localStorageMock.getItem).toHaveBeenCalledWith(`podcastData_${testPodcastId}`);
    });

    it('should handle different podcastId values', async () => {
        const differentPodcastId = '789012';
        localStorageMock.getItem.mockReturnValue(null);
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockApiResponse),
        });

        const { result } = renderHook(() => usePodcastData(differentPodcastId));

        expect(localStorageMock.getItem).toHaveBeenCalledWith(`podcastData_${differentPodcastId}`);

        await waitFor(() => {
            expect(result.current[2]).toBe(false);
        });

        expect(mockFetch).toHaveBeenCalledWith(
            'https://api.allorigins.win/get?url=' +
            encodeURIComponent(`https://itunes.apple.com/lookup?id=${differentPodcastId}&media=podcast&entity=podcastEpisode&limit=20`)
        );
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            `podcastData_${differentPodcastId}`,
            JSON.stringify({ date: 1640995200000, episodes: expectedEpisodeData })
        );
    });

    it('should correctly slice first result from API response', async () => {
        localStorageMock.getItem.mockReturnValue(null);
        const apiResponseWithPodcastInfo = {
            contents: JSON.stringify({
                results: [
                    // This should be sliced out
                    {
                        wrapperType: 'track',
                        kind: 'podcast',
                        collectionName: 'Test Podcast Info',
                        collectionId: 123456,
                    },
                    // These should remain
                    {
                        trackId: 2001,
                        trackName: 'Only Episode',
                        description: 'Single episode',
                        episodeUrl: 'https://test.com/single.mp3',
                    },
                ],
            }),
        };

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(apiResponseWithPodcastInfo),
        });

        const { result } = renderHook(() => usePodcastData(testPodcastId));

        await waitFor(() => {
            expect(result.current[2]).toBe(false);
        });

        const expectedSlicedData = [
            {
                trackId: 2001,
                trackName: 'Only Episode',
                description: 'Single episode',
                episodeUrl: 'https://test.com/single.mp3',
            },
        ];

        expect(result.current[0]).toEqual(expectedSlicedData);
    });

    it('should handle empty results array', async () => {
        localStorageMock.getItem.mockReturnValue(null);
        const emptyApiResponse = {
            contents: JSON.stringify({
                results: [],
            }),
        };

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(emptyApiResponse),
        });

        const { result } = renderHook(() => usePodcastData(testPodcastId));

        await waitFor(() => {
            expect(result.current[2]).toBe(false);
        });

        expect(result.current[0]).toEqual([]); // Should be empty array after slicing
        expect(result.current[1]).toBeNull();
    });

    it('should handle results array with only podcast info (no episodes)', async () => {
        localStorageMock.getItem.mockReturnValue(null);
        const podcastOnlyResponse = {
            contents: JSON.stringify({
                results: [
                    {
                        wrapperType: 'track',
                        kind: 'podcast',
                        collectionName: 'Test Podcast',
                    },
                ],
            }),
        };

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(podcastOnlyResponse),
        });

        const { result } = renderHook(() => usePodcastData(testPodcastId));

        await waitFor(() => {
            expect(result.current[2]).toBe(false);
        });

        expect(result.current[0]).toEqual([]); // Should be empty array after slicing first element
        expect(result.current[1]).toBeNull();
    });

    it('should re-fetch when podcastId changes', async () => {
        localStorageMock.getItem.mockReturnValue(null);
        mockFetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockApiResponse),
        });

        const { result, rerender } = renderHook(
            (podcastId: string) => usePodcastData(podcastId),
            { initialProps: 'first-id' }
        );

        await waitFor(() => {
            expect(result.current[2]).toBe(false);
        });

        expect(mockFetch).toHaveBeenCalledTimes(1);

        // Change podcastId
        rerender('second-id');

        await waitFor(() => {
            expect(result.current[2]).toBe(false);
        });

        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(mockFetch).toHaveBeenLastCalledWith(
            'https://api.allorigins.win/get?url=' +
            encodeURIComponent('https://itunes.apple.com/lookup?id=second-id&media=podcast&entity=podcastEpisode&limit=20')
        );
    });
});
