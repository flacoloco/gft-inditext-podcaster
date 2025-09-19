# Podcaster - React TypeScript Podcast App

A modern podcast application built with React 19, TypeScript, and Vite. This app allows users to discover, browse, and listen to podcasts from the iTunes API.

### Installation & Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
# This creates the dist folder. Enter the folder and run any local http server (ex: npx http-server)
npm run build

# Preview production build
npm run preview

# Run Storybook
# This open the storybook into the browser to see the app components
npm run storybook

```

## 🚀 Features

- **Podcast Discovery**: Browse the top 100 podcasts from iTunes
- **Search Functionality**: Real-time search and filtering of podcasts
- **Podcast Details**: View detailed information about podcasts and their episodes
- **Episode Playback**: Listen to individual podcast episodes with HTML5 audio player
- **Responsive Design**: Mobile-friendly interface with styled-components
- **Caching**: Smart localStorage caching for improved performance
- **Loading States**: User-friendly loading indicators
- **Error Handling**: Graceful error handling with user feedback

## 🛠 Tech Stack

### Core Technologies
- **React 19.1.1** - Latest React with concurrent features
- **TypeScript** - Type-safe JavaScript development
- **Vite 7.1.2** - Fast build tool and dev server
- **React Router DOM 7.9.1** - Client-side routing
- **Styled Components 6.1.19** - CSS-in-JS styling

### Testing & Quality
- **Vitest 3.2.4** - Fast unit testing framework
- **React Testing Library 16.3.0** - Component testing utilities
- **Playwright** - End-to-end testing
- **Storybook 9.1.6** - Component development and documentation
- **ESLint 9.33.0** - Code linting with TypeScript support

### Development Tools
- **Storybook Addons**: a11y, docs, vitest integration
- **Coverage Reports**: Comprehensive test coverage with v8
- **Hot Module Replacement** - Fast development feedback

## 📱 Application Structure

### Pages
- **Home (`/`)** - Podcast discovery with search functionality
- **Podcast (`/podcast/:podcastId`)** - Podcast details and episode list
- **Episode (`/podcast/:podcastId/episode/:episodeId`)** - Individual episode player

### Component Architecture

#### Atomic Design Pattern
```
src/components/
├── atoms/          # Basic UI elements
│   ├── Header/     # Navigation header with loading state
│   ├── PodcastItem/# Individual podcast grid item
│   ├── SearchInput/# Search input with counter
│   └── Loading/    # Loading spinner component
├── molecules/      # Composite components
│   ├── PodcastCard/# Detailed podcast information card
│   ├── EpisodesList/# Episode listing component
│   └── EpisodeCard/# Individual episode player
├── templates/      # Layout components
│   └── Layout/     # Main application layout
└── pages/          # Route components
    ├── Home/       # Homepage with podcast grid
    ├── Podcast/    # Podcast detail page
    └── Episode/    # Episode playback page
```

### Custom Hooks

#### `usePodcastListData()`
- Fetches top 100 podcasts from iTunes API
- Implements smart caching with 24-hour expiration
- Returns `[data, error]` tuple
- Handles AbortController for cleanup
- Transforms API response to application format

#### `usePodcastData(podcastId: string)`
- Fetches episode data for specific podcast
- Parameter-based caching system
- Returns `[episodes, error]` tuple
- Filters out podcast info (first result)
- Implements error handling and data validation

### Utility Functions

#### `formatDate(date: string): string`
- Converts YYYY-MM-DD to YYYY/MM/DD format
- Used for episode release dates

#### `millisToMinutes(milliseconds: number): string`
- Converts episode duration from milliseconds to MM:SS format
- Handles hour-long episodes appropriately

## 🔧 API Integration

### iTunes API
- **Podcast List**: `https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json`
- **Episode Data**: `https://itunes.apple.com/lookup?id={podcastId}&media=podcast&entity=podcastEpisode&limit=20`

### CORS Handling
- Uses AllOrigins proxy: `https://api.allorigins.win/get?url=`
- Handles API limitations and cross-origin requests

### Caching Strategy
- **Podcast List**: 24-hour cache expiration
- **Episode Data**: Per-podcast caching with unlimited duration
- **LocalStorage**: Persistent client-side storage
- **Cache Keys**:
  - `podcastListData` - Main podcast list
  - `podcastData_{podcastId}` - Individual podcast episodes

## 🧪 Testing

### Test Coverage
- **103 total tests** across the application
- **Unit Tests**: 74 tests for hooks, components, and utilities
- **Storybook Tests**: 29 visual regression tests
- **Integration Tests**: Full user workflow testing

### Testing Strategy
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Test Categories
- **Hook Testing**: API calls, caching, error handling
- **Component Testing**: Rendering, user interactions, state management
- **Page Testing**: Navigation, data loading, error states
- **Helper Testing**: Utility function validation

## 🎨 Styling

### Styled Components
- CSS-in-JS with TypeScript support
- Component-scoped styling
- Theme consistency across components
- Responsive design patterns

### Design System
- Consistent spacing and typography
- Color scheme with proper contrast
- Interactive states and transitions
- Accessibility considerations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern browser with ES2020 support

### Development Workflow
1. **Component Development** - Use Storybook for isolated component development
2. **Testing** - Write tests alongside development with Vitest
3. **Type Safety** - Leverage TypeScript for robust development
4. **Code Quality** - ESLint ensures code standards

## 📦 Build & Deployment

### Production Build
```bash
npm run build
```
- TypeScript compilation with strict checking
- Vite optimizations and code splitting
- Static asset optimization
- Tree shaking for minimal bundle size

### Build Output
- Optimized JavaScript bundles
- CSS extraction and minification
- Asset fingerprinting for caching
- Source maps for debugging

## 🔍 Performance Features

### Optimization Strategies
- **Smart Caching**: Reduces API calls and improves load times
- **Code Splitting**: Route-based code splitting with React Router
- **Lazy Loading**: Component-level lazy loading where appropriate
- **Asset Optimization**: Image optimization and proper loading strategies

### User Experience
- **Loading States**: Clear feedback during data fetching
- **Error Boundaries**: Graceful error handling
- **Responsive Design**: Mobile-first approach
- **Accessibility**: ARIA labels and keyboard navigation

## 🤝 Contributing

### Development Guidelines
- Follow TypeScript strict mode
- Write comprehensive tests for new features
- Use Storybook for component documentation
- Maintain consistent code style with ESLint

### Code Organization
- Atomic design pattern for components
- Custom hooks for data fetching logic
- Utility functions for common operations
- Type definitions for API responses

---

Built with ❤️ using React, TypeScript, and modern web technologies.
```
