import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import type { JSX } from 'react';
import { Episode } from './Episode';

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
    Header: (): JSX.Element => <div data-testid='header'>Header Component</div>,
}));

vi.mock('@src/components/molecules', () => ({
    PodcastCard: ({
        author,
        image,
        title,
        description,
        onClick
    }: {
        author: string;
        image: string;
        title: string;
        description: string;
        onClick: () => void;
    }): JSX.Element => (
        <div data-testid='podcast-card' onClick={onClick}>
            <img src={image} alt={title} />
            <h2>{title}</h2>
            <p>{author}</p>
            <p>{description}</p>
        </div>
    ),
    EpisodeCard: ({
        title,
        description,
        episodeUrl
    }: {
        title: string;
        description: string;
        episodeUrl: string;
    }): JSX.Element => (
        <div data-testid='episode-card'>
            <h3>{title}</h3>
            <p>{description}</p>
            <audio src={episodeUrl} controls data-testid='audio-player' />
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

const mockEpisodeData = {
    episodes: [
        {
            trackId: 456,
            trackName: 'Test Episode',
            description: 'Test episode description',
            episodeUrl: 'https://test.com/episode.mp3',
        },
        {
            trackId: 789,
            trackName: 'Another Episode',
            description: 'Another episode description',
            episodeUrl: 'https://test.com/episode2.mp3',
        },
    ],
};

const renderEpisode = (): ReturnType<typeof render> => {
    return render(
        <BrowserRouter>
            <Episode />
        </BrowserRouter>
    );
};

describe('Episode', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorageMock.getItem.mockClear();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should render header component', () => {
        mockUseParams.mockReturnValue({ podcastId: '123', episodeId: '456' });
        localStorageMock.getItem.mockReturnValue(null);

        renderEpisode();

        expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('should navigate to home when podcasts list is missing', () => {
        mockUseParams.mockReturnValue({ podcastId: '123', episodeId: '456' });
        localStorageMock.getItem.mockReturnValue(null);

        renderEpisode();

        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('should navigate to home when episodes list is missing', () => {
        mockUseParams.mockReturnValue({ podcastId: '123', episodeId: '456' });
        localStorageMock.getItem.mockImplementation((key: string) => {
            if (key === 'podcastListData') return JSON.stringify(mockPodcastData);
            if (key === 'podcastData_123') return null;
            return null;
        });

        renderEpisode();

        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('should render podcast card when podcast data is available', () => {
        mockUseParams.mockReturnValue({ podcastId: '123', episodeId: '456' });
        localStorageMock.getItem.mockImplementation((key: string) => {
            if (key === 'podcastListData') return JSON.stringify(mockPodcastData);
            if (key === 'podcastData_123') return JSON.stringify(mockEpisodeData);
            return null;
        });

        renderEpisode();

        expect(screen.getByTestId('podcast-card')).toBeInTheDocument();
        expect(screen.getByText('Test Podcast')).toBeInTheDocument();
        expect(screen.getByText('Test Author')).toBeInTheDocument();
        expect(screen.getByText('Test podcast description')).toBeInTheDocument();
    });

    it('should render episode card when episode data is available', () => {
        mockUseParams.mockReturnValue({ podcastId: '123', episodeId: '456' });
        localStorageMock.getItem.mockImplementation((key: string) => {
            if (key === 'podcastListData') return JSON.stringify(mockPodcastData);
            if (key === 'podcastData_123') return JSON.stringify(mockEpisodeData);
            return null;
        });

        renderEpisode();

        expect(screen.getByTestId('episode-card')).toBeInTheDocument();
        expect(screen.getByText('Test Episode')).toBeInTheDocument();
        expect(screen.getByText('Test episode description')).toBeInTheDocument();
        expect(screen.getByTestId('audio-player')).toHaveAttribute('src', 'https://test.com/episode.mp3');
    });

    it('should find correct episode by trackId', () => {
        mockUseParams.mockReturnValue({ podcastId: '123', episodeId: '456' });
        localStorageMock.getItem.mockImplementation((key: string) => {
            if (key === 'podcastListData') return JSON.stringify(mockPodcastData);
            if (key === 'podcastData_123') return JSON.stringify(mockEpisodeData);
            return null;
        });

        renderEpisode();

        const episodeCard = screen.getByTestId('episode-card');
        expect(episodeCard).toBeInTheDocument();
        expect(episodeCard).toHaveTextContent('Test Episode');
    });

    it('should handle missing episode description', () => {
        const episodeWithoutDescription = {
            episodes: [
                {
                    trackId: 456,
                    trackName: 'Test Episode',
                    description: '',
                    episodeUrl: 'https://test.com/episode.mp3',
                },
            ],
        };

        mockUseParams.mockReturnValue({ podcastId: '123', episodeId: '456' });
        localStorageMock.getItem.mockImplementation((key: string) => {
            if (key === 'podcastListData') return JSON.stringify(mockPodcastData);
            if (key === 'podcastData_123') return JSON.stringify(episodeWithoutDescription);
            return null;
        });

        renderEpisode();

        expect(screen.getByText('No description available.')).toBeInTheDocument();
    });

    it('should not render episode card when episode is not found', () => {
        mockUseParams.mockReturnValue({ podcastId: '123', episodeId: '999' }); // Non-existent episode
        localStorageMock.getItem.mockImplementation((key: string) => {
            if (key === 'podcastListData') return JSON.stringify(mockPodcastData);
            if (key === 'podcastData_123') return JSON.stringify(mockEpisodeData);
            return null;
        });

        renderEpisode();

        expect(screen.getByTestId('podcast-card')).toBeInTheDocument();
        expect(screen.queryByTestId('episode-card')).not.toBeInTheDocument();
    });

    it('should not render podcast card when podcast is not found', () => {
        const emptyPodcastData = { podcasts: [] };

        mockUseParams.mockReturnValue({ podcastId: '999', episodeId: '456' }); // Non-existent podcast
        localStorageMock.getItem.mockImplementation((key: string) => {
            if (key === 'podcastListData') return JSON.stringify(emptyPodcastData);
            if (key === 'podcastData_999') return JSON.stringify(mockEpisodeData);
            return null;
        });

        renderEpisode();

        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.queryByTestId('podcast-card')).not.toBeInTheDocument();
        expect(screen.queryByTestId('episode-card')).not.toBeInTheDocument();
    });

    it('should navigate to podcast detail when podcast card is clicked', async () => {
        mockUseParams.mockReturnValue({ podcastId: '123', episodeId: '456' });
        localStorageMock.getItem.mockImplementation((key: string) => {
            if (key === 'podcastListData') return JSON.stringify(mockPodcastData);
            if (key === 'podcastData_123') return JSON.stringify(mockEpisodeData);
            return null;
        });

        const user = userEvent.setup();
        renderEpisode();

        const podcastCard = screen.getByTestId('podcast-card');
        await user.click(podcastCard);

        expect(mockNavigate).toHaveBeenCalledWith('/podcast/123');
    });

    it('should handle missing params gracefully', () => {
        mockUseParams.mockReturnValue({}); // No params
        localStorageMock.getItem.mockReturnValue(null);

        renderEpisode();

        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('should call localStorage.getItem with correct keys', () => {
        mockUseParams.mockReturnValue({ podcastId: '123', episodeId: '456' });
        localStorageMock.getItem.mockReturnValue(null);

        renderEpisode();

        expect(localStorageMock.getItem).toHaveBeenCalledWith('podcastListData');
        expect(localStorageMock.getItem).toHaveBeenCalledWith('podcastData_123');
    });
});
