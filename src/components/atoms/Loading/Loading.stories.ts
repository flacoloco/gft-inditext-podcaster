import type { Meta, StoryObj } from '@storybook/react-vite';
import { Loading } from '../index';

const meta: Meta<typeof Loading> = {
  component: Loading,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isLoading: {
      control: 'boolean',
      description: 'Whether to show the loading spinner or not',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const IsLoading: Story = {
  args: {
    isLoading: true,
  },
};

export const NotLoading: Story = {
  args: {
    isLoading: false,
  },
};

export const Interactive: Story = {
  args: {
    isLoading: true,
  },
  argTypes: {
    isLoading: {
      control: 'boolean',
    },
  },
};
