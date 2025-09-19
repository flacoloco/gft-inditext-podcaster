import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from '../index';

const meta: Meta<typeof Header> = {
  component: Header,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Header component with podcast application title and loading indicator. Includes navigation link to home page.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isLoading: {
      control: 'boolean',
      description: 'Controls whether the loading indicator is shown',
      defaultValue: false,
    },
  },
  decorators: [
    (Story: () => ReactElement): ReactElement => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Header with loading indicator visible, typically shown during data fetching operations.',
      },
    },
  },
};

export const NotLoading: Story = {
  args: {
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Header in its default state without loading indicator.',
      },
    },
  },
};
