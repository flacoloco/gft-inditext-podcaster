import type { Meta, StoryObj } from '@storybook/react-vite';
import { EpisodeCard } from './EpisodeCard';

const meta: Meta<typeof EpisodeCard> = {
  component: EpisodeCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Episode card component that displays episode title, description, and audio player in a column layout. Fixed width of 400px.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Title of the episode',
    },
    description: {
      control: 'text',
      description: 'Description or summary of the episode content',
    },
    episodeUrl: {
      control: 'text',
      description: 'URL of the audio file for the episode',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Episode 1: Introduction to React Hooks',
    description: 'In this episode, we dive deep into React Hooks and how they revolutionized the way we write React components. We\'ll cover useState, useEffect, and custom hooks with practical examples.',
    episodeUrl: 'https://www.soundjay.com/misc/sounds/magic-chime-02.mp3',
  },
};

export const LongTitle: Story = {
  args: {
    title: 'Episode 42: Advanced State Management Patterns in React Applications with Redux Toolkit and Context API',
    description: 'A comprehensive guide to managing complex state in large React applications using modern tools and patterns.',
    episodeUrl: 'https://www.soundjay.com/misc/sounds/magic-chime-02.mp3',
  },
  parameters: {
    docs: {
      description: {
        story: 'Episode card with a longer title to test text wrapping and layout.',
      },
    },
  },
};

export const LongDescription: Story = {
  args: {
    title: 'Episode 3: Testing Strategies',
    description: 'Testing is a crucial part of software development that ensures your applications work as expected. In this comprehensive episode, we explore various testing strategies including unit testing, integration testing, and end-to-end testing. We\'ll discuss popular testing frameworks like Jest, React Testing Library, and Cypress. You\'ll learn how to write effective tests, mock dependencies, and create a robust testing pipeline for your React applications. We also cover best practices for test-driven development and how to maintain your test suites as your application grows.',
    episodeUrl: 'https://www.soundjay.com/misc/sounds/magic-chime-02.mp3',
  },
  parameters: {
    docs: {
      description: {
        story: 'Episode card with a longer description to test text wrapping and vertical spacing.',
      },
    },
  },
};

export const ShortContent: Story = {
  args: {
    title: 'Quick Tip #1',
    description: 'A short but useful tip.',
    episodeUrl: 'https://www.soundjay.com/misc/sounds/magic-chime-02.mp3',
  },
  parameters: {
    docs: {
      description: {
        story: 'Episode card with minimal content to test layout with shorter text.',
      },
    },
  },
};
