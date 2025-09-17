import type { Meta, StoryObj } from '@storybook/react-vite';
import { PodcastCard } from '../index';

const meta: Meta<typeof PodcastCard> = {
  component: PodcastCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    image: {
      control: 'text',
      description: 'URL of the podcast cover image',
    },
    title: {
      control: 'text',
      description: 'Title of the podcast',
    },
    description: {
      control: 'text',
      description: 'Description of the podcast',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback function when card is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const image = 'https://is1-ssl.mzstatic.com/image/thumb/Podcasts211/v4/3e/e4/59/3ee459ec-ca6a-8963-06a4-360f3059876c/mza_2940575243774001153.jpg/55x55bb.png';


export const Default: Story = {
  args: {
    image,
    title: 'The Amazing Tech Podcast',
    description: 'A weekly show covering the latest in technology, innovation, and digital trends. Join us for insightful discussions with industry experts.',
  },
};

export const LongTitle: Story = {
  args: {
    image,
    title: 'This is a Very Long Podcast Title That Should Be Truncated After Two Lines',
    description: 'Short description for this podcast with a very long title.',
  },
};

export const LongDescription: Story = {
  args: {
    image,
    title: 'Storytelling Podcast',
    description: 'This is a very long description that should be truncated after three lines. It contains detailed information about the podcast content, hosts, and what listeners can expect from each episode. The description continues with more details about the show format.',
  },
};

export const RealExample: Story = {
  args: {
    image,
    title: 'The Joe Rogan Experience',
    description: 'The Joe Rogan Experience podcast is a long form conversation hosted by comedian Joe Rogan with friends and guests that have included comedians, actors, musicians, MMA fighters, authors, artists, and beyond.',
  },
};
