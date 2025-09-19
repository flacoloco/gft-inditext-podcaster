# Helpers

This directory contains utility helper functions used throughout the podcast application.

## Available Helpers

### `formatDate(dateString: string): string`
Converts an ISO date string (YYYY-MM-DD) to DD/MM/YYYY format.

**Example:**
```typescript
import { formatDate } from '@src/helpers';

formatDate('2023-12-01'); // Returns '01/12/2023'
```

### `millisToMinutes(milliseconds: number): string`
Converts milliseconds to MM:SS time format.

**Example:**
```typescript
import { millisToMinutes } from '@src/helpers';

millisToMinutes(90000); // Returns '01:30' (1 minute 30 seconds)
millisToMinutes(3661000); // Returns '61:01' (1 hour 1 minute 1 second)
```

## Testing

All helper functions have comprehensive unit tests with 100% coverage.

### Running Tests

```bash
# Run all unit tests
npm test

# Run only helper tests
npx vitest run --project unit src/helpers

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Files

- `formatDate/formatDate.test.ts` - Tests for date formatting
- `millisToMinutes/millisToMinutes.test.ts` - Tests for time conversion
- `index.test.ts` - Tests for helper exports

All tests include edge cases, error conditions, and realistic usage scenarios to ensure reliability.
