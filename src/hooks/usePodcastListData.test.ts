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

// Mock console.error to avoid noise in tests
const mockConsoleError = vi.fn();
// eslint-disable-next-line no-console
console.error = mockConsoleError;

const mockApiResponse = {
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
    mockConsoleError.mockClear();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return initial state with null data and no error', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => usePodcastListData());

    expect(result.current[0]).toBeNull(); // data
    expect(result.current[1]).toBeNull(); // error
  });

  it('should fetch data successfully and update state', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    const { result } = renderHook(() => usePodcastListData());

    await waitFor(() => {
      expect(result.current[0]).toEqual(expectedPodcastData);
    });

    expect(result.current[1]).toBeNull(); // no error
    expect(mockFetch).toHaveBeenCalledWith(
      'https://corsproxy.io/?url=' +
      encodeURIComponent('https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json'),
      { signal: expect.any(AbortSignal) }
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
      expect(result.current[1]).toContain('An unknown error occurred');
    });

    expect(result.current[0]).toBeNull(); // data should be null
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });

  it('should handle HTTP error responses', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () => Promise.resolve({}),
    });

    const { result } = renderHook(() => usePodcastListData());

    await waitFor(() => {
      expect(result.current[1]).toContain('An unknown error occurred');
    });

    expect(result.current[0]).toBeNull(); // data should be null
  });

  it('should handle JSON parsing errors', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ contents: 'invalid-json' }),
    });

    const { result } = renderHook(() => usePodcastListData());

    await waitFor(() => {
      expect(result.current[1]).toContain('An unknown error occurred');
    });

    expect(result.current[0]).toBeNull(); // data should be null
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

    await waitFor(() => {
      expect(result.current[0]).toEqual(expectedPodcastData);
    });

    expect(mockFetch).toHaveBeenCalled(); // should fetch new data
  });

  it('should handle malformed cached data gracefully', async () => {
    localStorageMock.getItem.mockReturnValue('invalid-json');

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    const { result } = renderHook(() => usePodcastListData());

    await waitFor(() => {
      expect(result.current[0]).toEqual(expectedPodcastData);
    });

    expect(mockFetch).toHaveBeenCalled(); // should fetch since cache is invalid
    expect(mockConsoleError).toHaveBeenCalledWith('Error parsing cached data:', expect.any(SyntaxError));
  });

  it('should call localStorage.getItem with correct key', () => {
    renderHook(() => usePodcastListData());

    expect(localStorageMock.getItem).toHaveBeenCalledWith('podcastListData');
  });

  it('should transform API data correctly', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    const complexApiResponse = {
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
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(complexApiResponse),
    });

    const { result } = renderHook(() => usePodcastListData());

    await waitFor(() => {
      expect(result.current[0]).toBeTruthy();
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

  it('should properly abort fetch request on unmount', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { unmount } = renderHook(() => usePodcastListData());

    unmount();

    // AbortController.abort should have been called
    expect(mockConsoleError).toHaveBeenCalledWith('Fetch aborted');
  });

  it('should handle cached data with missing date property', async () => {
    const invalidCachedData = {
      podcasts: expectedPodcastData,
      // Missing date property
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(invalidCachedData));

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    const { result } = renderHook(() => usePodcastListData());

    await waitFor(() => {
      expect(result.current[0]).toEqual(expectedPodcastData);
    });

    // Should fetch new data because date calculation will fail
    expect(mockFetch).toHaveBeenCalled();
  });

  it('should handle cached data with missing podcasts property', async () => {
    const invalidCachedData = {
      date: 1640995200000,
      // Missing podcasts property
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(invalidCachedData));
    mockDateNow.mockReturnValue(1640995200000 + (12 * 60 * 60 * 1000)); // 12 hours later

    const { result } = renderHook(() => usePodcastListData());

    expect(result.current[0]).toBeUndefined(); // Should be undefined for missing podcasts
    expect(result.current[1]).toBeNull(); // No error
  });
});
