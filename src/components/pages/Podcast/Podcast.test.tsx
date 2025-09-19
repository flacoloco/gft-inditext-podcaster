import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import type { JSX } from 'react';
import { Podcast } from './Podcast';

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

// Mock the custom hook
const mockUsePodcastData = vi.fn();
vi.mock('@src/hooks', () => ({
    usePodcastData: (): ReturnType<typeof mockUsePodcastData> => mockUsePodcastData(),
}));

// Mock helpers
vi.mock('@src/helpers', () => ({
    formatDate: (date: string): string => date.replace(/-/g, '/'),
}));

// Mock useParams and useNavigate
const mockNavigate = vi.fn();
const mockUseParams = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useParams: (): ReturnType<typeof mockUseParams> => mockUseParams(),
        useNavigate: (): typeof mockNavigate => mockNavigate,
    };
});

// Mock components
vi.mock('@src/components/atoms', () => ({
    Header: ({ isLoading }: { isLoading?: boolean }): JSX.Element => (
        <div data-testid='header' data-loading={isLoading || false}>
            Header Component
        </div>
    ),
}));

vi.mock('@src/components/molecules', () => ({
    PodcastCard: ({
        author,
        image,
        title,
        description
    }: {
        author: string;
        image: string;
        title: string;
        description: string;
    }): JSX.Element => (
        <div data-testid='podcast-card'>
            <img src={image} alt={title} />
            <h2>{title}</h2>
            <p>{author}</p>
            <p>{description}</p>
        </div>
    ),
    EpisodesList: ({
        episodes,
        onEpisodeClick
    }: {
        episodes: Array<{ trackId: number; trackName: string; trackTimeMillis: number; releaseDate: string }>;
        onEpisodeClick?: (episode: { trackId: number; trackName: string; trackTimeMillis: number; releaseDate: string }) => void;
    }): JSX.Element => (
        <div data-testid='episodes-list'>
            {episodes.map((episode) => (
                <div
                    key={episode.trackId}
                    data-testid='episode-item'
                    onClick={(): void => onEpisodeClick?.(episode)}
                >
                    <h3>{episode.trackName}</h3>
                    <span>{episode.releaseDate}</span>
                </div>
            ))}
        </div>
    ),
}));

const mockPodcastData = {
    podcasts: [
        {
            id: '123',
            'im:name': 'Test Podcast',
            'im:artist': 'Test Author',
            'im:image': 'https://test.com/image.jpg',
            summary: 'Test podcast description',
            title: 'Test Podcast',
        },
    ],
};

const mockEpisodeData = [
    {
        trackId: 1,
        trackName: 'Episode 1',
        trackTimeMillis: 3600000,
        releaseDate: '2023-01-01',
    },
    {
        trackId: 2,
        trackName: 'Episode 2',
        trackTimeMillis: 2400000,
        releaseDate: '2023-01-02',
    },
];

const renderPodcast = (): ReturnType<typeof render> => {
    return render(
        <BrowserRouter>
            <Podcast />
        </BrowserRouter>
    );
};

describe('Podcast', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorageMock.getItem.mockClear();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should render loading state correctly', () => {
        mockUseParams.mockReturnValue({ podcastId: '123' });
        mockUsePodcastData.mockReturnValue([null, null, true]);
        localStorageMock.getItem.mockReturnValue(JSON.stringify(mockPodcastData));

        renderPodcast();

        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('header')).toHaveAttribute('data-loading', 'true');
    });

    it('should render error state and not crash', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        mockUseParams.mockReturnValue({ podcastId: '123' });
        mockUsePodcastData.mockReturnValue([null, new Error('Test error'), false]);
        localStorageMock.getItem.mockReturnValue(JSON.stringify(mockPodcastData));

        const { container } = renderPodcast();

        expect(consoleErrorSpy).toHaveBeenCalledWith('Test error');
        expect(container.firstChild).toBeNull(); // Component returns null on error

        consoleErrorSpy.mockRestore();
    });

    it('should navigate to home when podcasts list is missing', () => {
        mockUseParams.mockReturnValue({ podcastId: '123' });
        mockUsePodcastData.mockReturnValue([null, null, false]);
        localStorageMock.getItem.mockReturnValue(null);

        renderPodcast();

        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('should render podcast card when podcast data is available', async () => {
        mockUseParams.mockReturnValue({ podcastId: '123' });
        mockUsePodcastData.mockReturnValue([mockEpisodeData, null, false]);
        localStorageMock.getItem.mockReturnValue(JSON.stringify(mockPodcastData));

        renderPodcast();

        await waitFor(() => {
            expect(screen.getByTestId('podcast-card')).toBeInTheDocument();
        });

        expect(screen.getByText('Test Podcast')).toBeInTheDocument();
        expect(screen.getByText('Test Author')).toBeInTheDocument();
        expect(screen.getByText('Test podcast description')).toBeInTheDocument();
    });

    it('should render episodes list when episode data is available', async () => {
        mockUseParams.mockReturnValue({ podcastId: '123' });
        mockUsePodcastData.mockReturnValue([mockEpisodeData, null, false]);
        localStorageMock.getItem.mockReturnValue(JSON.stringify(mockPodcastData));

        renderPodcast();

        await waitFor(() => {
            expect(screen.getByTestId('episodes-list')).toBeInTheDocument();
        });

        expect(screen.getAllByTestId('episode-item')).toHaveLength(2);
        expect(screen.getByText('Episode 1')).toBeInTheDocument();
        expect(screen.getByText('Episode 2')).toBeInTheDocument();
        expect(screen.getByText('2023/01/01')).toBeInTheDocument();
        expect(screen.getByText('2023/01/02')).toBeInTheDocument();
    });

    it('should not render episodes list when no episodes are available', async () => {
        mockUseParams.mockReturnValue({ podcastId: '123' });
        mockUsePodcastData.mockReturnValue([[], null, false]);
        localStorageMock.getItem.mockReturnValue(JSON.stringify(mockPodcastData));

        renderPodcast();

        await waitFor(() => {
            expect(screen.getByTestId('podcast-card')).toBeInTheDocument();
        });

        expect(screen.queryByTestId('episodes-list')).not.toBeInTheDocument();
    });

    it('should navigate to episode detail when episode is clicked', async () => {
        mockUseParams.mockReturnValue({ podcastId: '123' });
        mockUsePodcastData.mockReturnValue([mockEpisodeData, null, false]);
        localStorageMock.getItem.mockReturnValue(JSON.stringify(mockPodcastData));

        const user = userEvent.setup();
        renderPodcast();

        await waitFor(() => {
            expect(screen.getByText('Episode 1')).toBeInTheDocument();
        });

        const firstEpisode = screen.getAllByTestId('episode-item')[0];
        await user.click(firstEpisode);

        expect(mockNavigate).toHaveBeenCalledWith('/podcast/123/episode/1');
    });

    it('should handle data parsing errors gracefully', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        mockUseParams.mockReturnValue({ podcastId: '123' });

        // Mock data that will cause parsing error in the useEffect
        const malformedData = [{ invalid: 'data' }];
        mockUsePodcastData.mockReturnValue([malformedData, null, false]);
        localStorageMock.getItem.mockReturnValue(JSON.stringify(mockPodcastData));

        renderPodcast();

        await waitFor(() => {
            expect(screen.getByTestId('podcast-card')).toBeInTheDocument();
        });

        // Should still render podcast card but no episodes
        expect(screen.queryByTestId('episodes-list')).not.toBeInTheDocument();
        expect(consoleErrorSpy).toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
    });

    it('should not render podcast card when podcast is not found', () => {
        const emptyPodcastData = { podcasts: [] };

        mockUseParams.mockReturnValue({ podcastId: '999' }); // Non-existent podcast
        mockUsePodcastData.mockReturnValue([mockEpisodeData, null, false]);
        localStorageMock.getItem.mockReturnValue(JSON.stringify(emptyPodcastData));

        renderPodcast();

        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.queryByTestId('podcast-card')).not.toBeInTheDocument();
        expect(screen.queryByTestId('episodes-list')).not.toBeInTheDocument();
    });

    it('should call localStorage.getItem with correct key', () => {
        mockUseParams.mockReturnValue({ podcastId: '123' });
        mockUsePodcastData.mockReturnValue([null, null, false]);
        localStorageMock.getItem.mockReturnValue(null);

        renderPodcast();

        expect(localStorageMock.getItem).toHaveBeenCalledWith('podcastListData');
    });

    it('should handle missing podcastId parameter', () => {
        mockUseParams.mockReturnValue({}); // No podcastId
        mockUsePodcastData.mockReturnValue([null, null, false]);
        localStorageMock.getItem.mockReturnValue(JSON.stringify(mockPodcastData));

        renderPodcast();

        // Should still render header but no content
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.queryByTestId('podcast-card')).not.toBeInTheDocument();
    });

    it('should format episode dates correctly', async () => {
        mockUseParams.mockReturnValue({ podcastId: '123' });
        mockUsePodcastData.mockReturnValue([mockEpisodeData, null, false]);
        localStorageMock.getItem.mockReturnValue(JSON.stringify(mockPodcastData));

        renderPodcast();

        await waitFor(() => {
            expect(screen.getByTestId('episodes-list')).toBeInTheDocument();
        });

        // Dates should be formatted from YYYY-MM-DD to YYYY/MM/DD
        expect(screen.getByText('2023/01/01')).toBeInTheDocument();
        expect(screen.getByText('2023/01/02')).toBeInTheDocument();
    });
});
