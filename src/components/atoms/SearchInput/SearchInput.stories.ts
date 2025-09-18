import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchInput } from '../index';

const meta: Meta<typeof SearchInput> = {
  component: SearchInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the search input',
    },
    value: {
      control: 'text',
      description: 'Current value of the search input',
    },
    onChange: {
      action: 'changed',
      description: 'Callback function when input value changes',
    },
    count: {
      control: 'number',
      description: 'Optional count to display before the input',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Search podcasts...',
  },
};

export const WithValue: Story = {
  args: {
    placeholder: 'Search podcasts...',
    value: 'tech podcasts',
  },
};

export const WithCount: Story = {
  args: {
    placeholder: 'Search podcasts...',
    count: 100,
  },
};

export const WithCountAndValue: Story = {
  args: {
    placeholder: 'Search podcasts...',
    value: 'javascript',
    count: 0,
  },
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Find your favorite show...',
    count: 256,
  },
};
