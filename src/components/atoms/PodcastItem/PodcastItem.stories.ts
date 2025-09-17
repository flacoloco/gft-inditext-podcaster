import type { Meta, StoryObj } from '@storybook/react-vite';
import { PodcastItem } from '../index';

const meta: Meta<typeof PodcastItem> = {
  component: PodcastItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    imageUrl: {
      control: 'text',
      description: 'URL of the podcast cover image',
    },
    title: {
      control: 'text',
      description: 'Title of the podcast',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const imageUrl = 'https://is1-ssl.mzstatic.com/image/thumb/Podcasts211/v4/3e/e4/59/3ee459ec-ca6a-8963-06a4-360f3059876c/mza_2940575243774001153.jpg/55x55bb.png';

export const Default: Story = {
  args: {
    author: 'John Doe',
    imageUrl,
    title: 'The Amazing Tech Podcast',
  },
};

export const LongTitle: Story = {
  args: {
    author: 'John Public',
    imageUrl,
    title: 'This is a Very Long Podcast Title That Should Wrap Properly',
  },
};

export const ShortTitle: Story = {
  args: {
    author: 'JD Plink',
    imageUrl,
    title: 'Fun Show',
  },
};

export const RealExample: Story = {
  args: {
    author: 'Joe Rogan',
    imageUrl,
    title: 'The Joe Rogan Experience',
  },
};
