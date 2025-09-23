import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePodcastData } from './usePodcastData';
import type { Episode } from '@src/components/molecules/EpisodesList/EpisodesList';

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

// Mock console.error to avoid noise in tests
const mockConsoleError = vi.fn();
// eslint-disable-next-line no-console
console.error = mockConsoleError;

const mockApiResponse = {
  results: [
    // First result is the podcast info (should be sliced out)
    {
      wrapperType: 'track',
      kind: 'podcast',
      collectionName: 'Test Podcast',
    },
    // Actual episodes start from index 1
    {
      trackId: '1001',
      trackName: 'Episode 1',
      releaseDate: '2023-01-01T00:00:00Z',
      trackTimeMillis: 3600000,
    },
    {
      trackId: '1002',
      trackName: 'Episode 2',
      releaseDate: '2023-01-02T00:00:00Z',
      trackTimeMillis: 2700000,
    },
  ],
};

const expectedEpisodeData: Episode[] = [
  {
    trackId: '1001',
    trackName: 'Episode 1',
    releaseDate: '2023-01-01T00:00:00Z',
    trackTimeMillis: 3600000,
  },
  {
    trackId: '1002',
    trackName: 'Episode 2',
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
    mockConsoleError.mockClear();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return initial state with null data and no error', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => usePodcastData(testPodcastId));

    expect(result.current[0]).toBeNull(); // data
    expect(result.current[1]).toBeNull(); // error
  });

  it('should fetch data successfully and update state', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    const { result } = renderHook(() => usePodcastData(testPodcastId));

    await waitFor(() => {
      expect(result.current[0]).toEqual(expectedEpisodeData);
    });

    expect(result.current[1]).toBeNull(); // no error
    expect(mockFetch).toHaveBeenCalledWith(
      'https://corsproxy.io/?url=' +
      encodeURIComponent(`https://itunes.apple.com/lookup?id=${testPodcastId}&media=podcast&entity=podcastEpisode&limit=20`),
      { signal: expect.any(AbortSignal) }
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
      expect(result.current[1]).toContain('An unknown error occurred');
    });

    expect(result.current[0]).toBeNull(); // data should be null
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
      expect(result.current[1]).toContain('HTTP error! status: 500');
    });

    expect(result.current[0]).toBeNull(); // data should be null
  });

  it('should handle JSON parsing errors', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ contents: 'invalid-json' }),
    });

    const { result } = renderHook(() => usePodcastData(testPodcastId));

    await waitFor(() => {
      expect(result.current[1]).toContain('An unknown error occurred');
    });

    expect(result.current[0]).toBeNull(); // data should be null
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

    await waitFor(() => {
      expect(result.current[0]).toEqual(expectedEpisodeData);
    });

    expect(mockFetch).toHaveBeenCalled(); // should fetch new data
  });

  it('should handle malformed cached data gracefully', async () => {
    localStorageMock.getItem.mockReturnValue('invalid-json');

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    const { result } = renderHook(() => usePodcastData(testPodcastId));

    await waitFor(() => {
      expect(result.current[0]).toEqual(expectedEpisodeData);
    });

    expect(mockFetch).toHaveBeenCalled(); // should fetch since cache is invalid
    expect(mockConsoleError).toHaveBeenCalledWith('Error parsing cached data:', expect.any(SyntaxError));
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
      expect(result.current[0]).toEqual(expectedEpisodeData);
    });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://corsproxy.io/?url=' +
      encodeURIComponent(`https://itunes.apple.com/lookup?id=${differentPodcastId}&media=podcast&entity=podcastEpisode&limit=20`),
      { signal: expect.any(AbortSignal) }
    );
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      `podcastData_${differentPodcastId}`,
      JSON.stringify({ date: 1640995200000, episodes: expectedEpisodeData })
    );
  });

  it('should correctly slice first result from API response', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    const apiResponseWithPodcastInfo = {
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
          trackId: '2001',
          trackName: 'Only Episode',
          releaseDate: '2023-01-01T00:00:00Z',
          trackTimeMillis: 1800000,
        },
      ],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(apiResponseWithPodcastInfo),
    });

    const { result } = renderHook(() => usePodcastData(testPodcastId));

    await waitFor(() => {
      expect(result.current[0]).toBeTruthy();
    });

    const expectedSlicedData = [
      {
        trackId: '2001',
        trackName: 'Only Episode',
        releaseDate: '2023-01-01T00:00:00Z',
        trackTimeMillis: 1800000,
      },
    ];

    expect(result.current[0]).toEqual(expectedSlicedData);
  });

  it('should handle empty results array', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    const emptyApiResponse = {
      results: [],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(emptyApiResponse),
    });

    const { result } = renderHook(() => usePodcastData(testPodcastId));

    await waitFor(() => {
      expect(result.current[0]).toEqual([]);
    });

    expect(result.current[1]).toBeNull();
  });

  it('should handle results array with only podcast info (no episodes)', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    const podcastOnlyResponse = {
      results: [
        {
          wrapperType: 'track',
          kind: 'podcast',
          collectionName: 'Test Podcast',
        },
      ],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(podcastOnlyResponse),
    });

    const { result } = renderHook(() => usePodcastData(testPodcastId));

    await waitFor(() => {
      expect(result.current[0]).toEqual([]);
    });

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
      expect(result.current[0]).toEqual(expectedEpisodeData);
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);

    // Change podcastId
    rerender('second-id');

    await waitFor(() => {
      expect(result.current[0]).toEqual(expectedEpisodeData);
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch).toHaveBeenLastCalledWith(
      'https://corsproxy.io/?url=' +
      encodeURIComponent('https://itunes.apple.com/lookup?id=second-id&media=podcast&entity=podcastEpisode&limit=20'),
      { signal: expect.any(AbortSignal) }
    );
  });

  it('should properly abort fetch request on unmount', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { unmount } = renderHook(() => usePodcastData(testPodcastId));

    unmount();

    // AbortController.abort should have been called
    expect(mockConsoleError).toHaveBeenCalledWith('Fetch aborted');
  });

  it('should handle cached data with missing date property', async () => {
    const invalidCachedData = {
      episodes: expectedEpisodeData,
      // Missing date property
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(invalidCachedData));

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    const { result } = renderHook(() => usePodcastData(testPodcastId));

    await waitFor(() => {
      expect(result.current[0]).toEqual(expectedEpisodeData);
    });

    // Should fetch new data because date calculation will fail
    expect(mockFetch).toHaveBeenCalled();
  });

  it('should handle cached data with missing episodes property', async () => {
    const invalidCachedData = {
      date: 1640995200000,
      // Missing episodes property
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(invalidCachedData));
    mockDateNow.mockReturnValue(1640995200000 + (12 * 60 * 60 * 1000)); // 12 hours later

    const { result } = renderHook(() => usePodcastData(testPodcastId));

    expect(result.current[0]).toBeUndefined(); // Should be undefined for missing episodes
    expect(result.current[1]).toBeNull(); // No error
  });

  it('should handle abort signal correctly', async () => {
    localStorageMock.getItem.mockReturnValue(null);

    const abortError = new Error('Aborted');
    abortError.name = 'AbortError';
    mockFetch.mockRejectedValueOnce(abortError);

    const { result } = renderHook(() => usePodcastData(testPodcastId));

    await waitFor(() => {
      expect(result.current[1]).toContain('An unknown error occurred');
    });

    expect(result.current[0]).toBeNull();
  });
});
