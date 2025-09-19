import type { Meta, StoryObj } from '@storybook/react-vite';
import { EpisodesList } from './EpisodesList';

const meta: Meta<typeof EpisodesList> = {
  component: EpisodesList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onEpisodeClick: { action: 'episode clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockEpisodes = [
  {
    trackName: 'Episode 1: Introduction to React Hooks',
    trackTimeMillis: 2732000, // 45:32 in milliseconds
    releaseDate: '2023-12-01',
  },
  {
    trackName: 'Episode 2: State Management with Context API',
    trackTimeMillis: 2295000, // 38:15 in milliseconds
    releaseDate: '2023-11-28',
  },
  {
    trackName: 'Episode 3: Building Reusable Components',
    trackTimeMillis: 3140000, // 52:20 in milliseconds
    releaseDate: '2023-11-25',
  },
  {
    trackName: 'Episode 4: TypeScript Best Practices',
    trackTimeMillis: 2468000, // 41:08 in milliseconds
    releaseDate: '2023-11-22',
  },
  {
    trackName: 'Episode 5: Testing React Applications',
    trackTimeMillis: 2985000, // 49:45 in milliseconds
    releaseDate: '2023-11-19',
  },
];

export const Default: Story = {
  args: {
    episodes: mockEpisodes,
  },
};

export const SingleEpisode: Story = {
  args: {
    episodes: [mockEpisodes[0]],
  },
};

export const EmptyList: Story = {
  args: {
    episodes: [],
  },
};
