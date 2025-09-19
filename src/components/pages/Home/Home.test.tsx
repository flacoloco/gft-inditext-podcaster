import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import type { JSX } from 'react';
import { Home } from './Home';

// Mock the custom hook
const mockUsePodcastListData = vi.fn();
vi.mock('@src/hooks', () => ({
    usePodcastListData: (): ReturnType<typeof mockUsePodcastListData> => mockUsePodcastListData(),
}));

// Mock the atoms components
vi.mock('@src/components/atoms', () => ({
    Header: ({ isLoading }: { isLoading: boolean }): JSX.Element => (
        <div data-testid='header' data-loading={isLoading}>
            Header Component
        </div>
    ),
    SearchInput: ({
        placeholder,
        value,
        onChange,
        count
    }: {
        placeholder: string;
        value: string;
        onChange: (value: string) => void;
        count: number;
    }): JSX.Element => (
        <div data-testid='search-input'>
            <input
                placeholder={placeholder}
                value={value}
                onChange={(e): void => onChange(e.target.value)}
                data-testid='search-input-field'
            />
            <span data-testid='count'>{count}</span>
        </div>
    ),
    PodcastItem: ({
        author,
        imageUrl,
        title,
        onClick
    }: {
        author: string;
        imageUrl: string;
        title: string;
        onClick: () => void;
    }): JSX.Element => (
        <div data-testid='podcast-item' onClick={onClick}>
            <img src={imageUrl} alt={title} />
            <h3>{title}</h3>
            <p>{author}</p>
        </div>
    ),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: (): typeof mockNavigate => mockNavigate,
    };
});

const mockPodcastData = [
    {
        id: '1',
        'im:name': 'Test Podcast 1',
        'im:artist': 'Test Author 1',
        'im:image': 'https://test.com/image1.jpg',
        summary: 'Test summary 1',
        title: 'Test Podcast 1',
    },
    {
        id: '2',
        'im:name': 'Test Podcast 2',
        'im:artist': 'Test Author 2',
        'im:image': 'https://test.com/image2.jpg',
        summary: 'Test summary 2',
        title: 'Test Podcast 2',
    },
    {
        id: '3',
        'im:name': 'Another Show',
        'im:artist': 'Different Author',
        'im:image': 'https://test.com/image3.jpg',
        summary: 'Different summary',
        title: 'Another Show',
    },
];

const renderHome = (): ReturnType<typeof render> => {
    return render(
        <BrowserRouter>
            <Home />
        </BrowserRouter>
    );
};

describe('Home', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should render loading state correctly', () => {
        mockUsePodcastListData.mockReturnValue([null, null, true]);

        renderHome();

        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('header')).toHaveAttribute('data-loading', 'true');
        expect(screen.queryByTestId('search-input')).not.toBeInTheDocument();
    });

    it('should render error state and not crash', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        mockUsePodcastListData.mockReturnValue([null, new Error('Test error'), false]);

        renderHome();

        expect(consoleErrorSpy).toHaveBeenCalledWith(new Error('Test error'));
        // When there's an error, the component returns null, so nothing should be rendered
        expect(document.body).toHaveTextContent('');

        consoleErrorSpy.mockRestore();
    });

    it('should render podcasts when data is loaded successfully', async () => {
        mockUsePodcastListData.mockReturnValue([mockPodcastData, null, false]);

        renderHome();

        await waitFor(() => {
            expect(screen.getByTestId('search-input')).toBeInTheDocument();
        });

        expect(screen.getByTestId('header')).toHaveAttribute('data-loading', 'false');
        expect(screen.getAllByTestId('podcast-item')).toHaveLength(3);
        expect(screen.getByText('Test Podcast 1')).toBeInTheDocument();
        expect(screen.getByText('Test Author 1')).toBeInTheDocument();
        expect(screen.getByText('Another Show')).toBeInTheDocument();
        expect(screen.getByTestId('count')).toHaveTextContent('3');
    });

    it('should filter podcasts based on search input', async () => {
        mockUsePodcastListData.mockReturnValue([mockPodcastData, null, false]);
        const user = userEvent.setup();

        renderHome();

        await waitFor(() => {
            expect(screen.getByTestId('search-input-field')).toBeInTheDocument();
        });

        const searchInput = screen.getByTestId('search-input-field');

        // Search for "test" - should match "Test Podcast 1" and "Test Podcast 2"
        await user.type(searchInput, 'test');

        await waitFor(() => {
            expect(screen.getByTestId('count')).toHaveTextContent('2');
        });

        expect(screen.getAllByTestId('podcast-item')).toHaveLength(2);
        expect(screen.getByText('Test Podcast 1')).toBeInTheDocument();
        expect(screen.getByText('Test Podcast 2')).toBeInTheDocument();
        expect(screen.queryByText('Another Show')).not.toBeInTheDocument();
    });

    it('should filter podcasts case-insensitively', async () => {
        mockUsePodcastListData.mockReturnValue([mockPodcastData, null, false]);
        const user = userEvent.setup();

        renderHome();

        await waitFor(() => {
            expect(screen.getByTestId('search-input-field')).toBeInTheDocument();
        });

        const searchInput = screen.getByTestId('search-input-field');

        // Search for "ANOTHER" in uppercase - should match "Another Show"
        await user.type(searchInput, 'ANOTHER');

        await waitFor(() => {
            expect(screen.getByTestId('count')).toHaveTextContent('1');
        });

        expect(screen.getAllByTestId('podcast-item')).toHaveLength(1);
        expect(screen.getByText('Another Show')).toBeInTheDocument();
        expect(screen.queryByText('Test Podcast 1')).not.toBeInTheDocument();
    });

    it('should show all podcasts when search is cleared', async () => {
        mockUsePodcastListData.mockReturnValue([mockPodcastData, null, false]);
        const user = userEvent.setup();

        renderHome();

        await waitFor(() => {
            expect(screen.getByTestId('search-input-field')).toBeInTheDocument();
        });

        const searchInput = screen.getByTestId('search-input-field');

        // First filter
        await user.type(searchInput, 'test');

        await waitFor(() => {
            expect(screen.getByTestId('count')).toHaveTextContent('2');
        });

        // Clear the search
        await user.clear(searchInput);

        await waitFor(() => {
            expect(screen.getByTestId('count')).toHaveTextContent('3');
        });

        expect(screen.getAllByTestId('podcast-item')).toHaveLength(3);
    });

    it('should navigate to podcast detail when podcast item is clicked', async () => {
        mockUsePodcastListData.mockReturnValue([mockPodcastData, null, false]);
        const user = userEvent.setup();

        renderHome();

        await waitFor(() => {
            expect(screen.getByText('Test Podcast 1')).toBeInTheDocument();
        });

        const firstPodcastItem = screen.getAllByTestId('podcast-item')[0];
        await user.click(firstPodcastItem);

        expect(mockNavigate).toHaveBeenCalledWith('/podcast/1');
    });

    it('should show correct count when no podcasts match search', async () => {
        mockUsePodcastListData.mockReturnValue([mockPodcastData, null, false]);
        const user = userEvent.setup();

        renderHome();

        await waitFor(() => {
            expect(screen.getByTestId('search-input-field')).toBeInTheDocument();
        });

        const searchInput = screen.getByTestId('search-input-field');

        // Search for something that doesn't exist
        await user.type(searchInput, 'nonexistent');

        await waitFor(() => {
            expect(screen.getByTestId('count')).toHaveTextContent('0');
        });

        expect(screen.queryAllByTestId('podcast-item')).toHaveLength(0);
    });

    it('should handle search input placeholder correctly', async () => {
        mockUsePodcastListData.mockReturnValue([mockPodcastData, null, false]);

        renderHome();

        await waitFor(() => {
            expect(screen.getByTestId('search-input-field')).toBeInTheDocument();
        });

        const searchInput = screen.getByTestId('search-input-field');
        expect(searchInput).toHaveAttribute('placeholder', 'Filter podcasts...');
    });
});
