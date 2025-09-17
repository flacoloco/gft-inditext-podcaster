# Project Structure and Guidelines

This document provides an overview of the project structure and guidelines for GitHub Copilot to assist with development.

## Project Overview
This is a React project built with:
- React
- TypeScript
- Vite
- React Router

Shared dependencies:
- react
- react-dom
- react-router-dom

## Directory Structure
```
src/
├── components/
│   ├── atoms/        # Basic building blocks (buttons, inputs, text)
│   ├── molecules/    # Simple combinations of atoms
│   ├── organisms/    # Complex combinations of molecules
│   ├── templates/    # Page-level component layouts
│   └── pages/        # Specific implementations of templates
│       ├── Home/
│       │   └── Home.tsx
│       └── Contact/
│           └── Contact.tsx
└── App.tsx
```

## Key Components and Features

### Routing
- Uses React Router for navigation
- Main routes:
  - `/` - Home page

### Page Components
Each page component is organized in its own directory for better scalability:
- `Home/` - Main landing page
- `Contact/` - Contact information page

## Development Guidelines

### Atomic Design Structure
The project follows Atomic Design principles with five levels of components:

1. **Atoms** (`components/atoms/`)
   - Smallest possible components
   - Basic HTML elements enhanced for our design system
   - Examples: buttons, inputs, labels, icons

2. **Molecules** (`components/molecules/`)
   - Simple combinations of atoms
   - Serve one specific purpose
   - Examples: search forms, menu items, form groups

3. **Organisms** (`components/organisms/`)
   - Complex combinations of molecules and/or atoms
   - Represent distinct sections of the interface
   - Examples: headers, footers, forms

4. **Templates** (`components/templates/`)
   - Page-level component layouts
   - Define the structure of a page
   - Focus on the content structure rather than the content itself

5. **Pages** (`components/pages/`)
   - Specific instances of templates
   - Represent the actual content and final UI

### Component Structure
- Place each page component in its own directory
- Use the name of the component as the main component file
- Keep components focused and single-responsibility


### Routing
- Keep route definitions in `App.tsx`
- Follow the existing routing pattern for new pages

### Type Safety
- Use TypeScript types/interfaces
- Prefer type annotations for component props
- Use FC type for functional components

## Good Practices
- Keep components small and reusable
- Use descriptive names for components and variables
- Maintain consistent coding style
- Never use index as the component name
- Each component should have a single responsibility
- Each component should be inside its own directory and the name of the folder and the component should match
- Use functional components with hooks
- Follow the lint rules defined in the project
- Never use `any` type, always prefer specific types or generics
- Never use title in the meta object of Storybook
- Always use Storybook to document components
- Always use named exports for components
