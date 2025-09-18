import type { Meta, StoryObj } from '@storybook/react-vite';
import { Layout } from '../index';

const meta: Meta<typeof Layout> = {
    component: Layout,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {
        children: {
            description: 'Content to be rendered inside the layout',
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h1>Page Content</h1>
                <p>This is the main content area of the page.</p>
                <p>The Header component is automatically included at the top.</p>
            </div>
        ),
    },
};

export const WithLongContent: Story = {
    args: {
        children: (
            <div style={{ padding: '2rem' }}>
                <h1>Long Content Example</h1>
                <p>This layout handles long content gracefully.</p>
                {Array.from({ length: 20 }, (_, i) => (
                    <p key={i}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                ))}
            </div>
        ),
    },
};

export const WithMinimalContent: Story = {
    args: {
        children: (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>Minimal Content</h2>
                <p>Just a little bit of content.</p>
            </div>
        ),
    },
};
