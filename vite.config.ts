/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// https://vite.dev/config/
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
    },
  },
  test: {
    projects: [
      {
        resolve: {
          alias: {
            '@src': path.resolve(__dirname, './src'),
          },
        },
        test: {
          name: 'unit',
          include: ['**/*.{test,spec}.{js,ts,tsx}'],
          exclude: ['**/*.stories.{js,ts,tsx}', '**/node_modules/**'],
          environment: 'jsdom',
          setupFiles: ['./src/test-setup.ts'],
          globals: true
        }
      },
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(__dirname, '.storybook')
          })],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [{
              browser: 'chromium'
            }]
          },
          setupFiles: ['.storybook/vitest.setup.ts']
        }
      }
    ],

    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        '**/index.{js,ts,tsx}',
        '**/*.d.ts',
        '**/*.stories.{js,ts,tsx}',
        '**/*.styles.{js,ts,tsx}'
      ],
    }
  },
});
