# Employee Onboarding Application

This application provides a comprehensive UI for automating application provisioning when onboarding employees. It streamlines the process of managing employee access, roles, permissions, and application assignments during the onboarding workflow.

## The Problem

Onboarding employees can take too long due to not having the right access to applications needed to carry out work. The problem is usually to do with ownership - who is responsible for each application? This platform gives a central place to record this information and automates the process of access provisioning.

## Features

- **Employee Management**: Create and manage employee profiles
- **Role-Based Access Control**: Define and assign roles with specific permissions
- **Application Provisioning**: Automate access to various applications and systems
- **Contact Management**: Manage organizational contacts and relationships
- **Request Tracking**: Track and manage onboarding requests and their status
- **Admin Dashboard**: Administrative interface for system oversight

## Tech Stack

### Frontend Framework
- **Next.js 15.3.1** - React-based framework with App Router
- **React 18.2.0** - UI library
- **TypeScript** - Type-safe JavaScript

### Styling & UI Components
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Radix UI** - Headless UI components for accessibility
  - Avatar, Dialog, Label, Slot, Tabs components
- **Lucide React** - Icon library
- **Class Variance Authority** - Component variants management
- **Tailwind Merge** - Conditional Tailwind class merging

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **TypeScript 5** - Static type checking

### Notifications
- **Sonner** - Toast notification system

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Testing

This project uses Jest and React Testing Library for unit testing.

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode (for continuous integration)
npm run test:ci
```

### Test Structure

- **Unit Tests**: Located in `__tests__` folders next to the code they test
- **Test Utils**: Common testing utilities in `src/test-utils/`
- **Mocks**: Mock data and API responses in `src/test-utils/mocks.ts`

### Writing Tests

Tests are organized as follows:
- Component tests: `src/components/**/__tests__/*.test.tsx`
- Hook tests: `src/hooks/**/__tests__/*.test.ts`
- Utility tests: `src/lib/**/__tests__/*.test.ts`

### Coverage

The project maintains a 70% coverage threshold for:
- Branches
- Functions  
- Lines
- Statements

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (dashboard)/       # Dashboard layout group
│   │   ├── admin/         # Admin management
│   │   ├── applications/  # Application management
│   │   ├── contacts/      # Contact management
│   │   ├── employees/     # Employee management
│   │   ├── roles/         # Role management
│   │   └── users/         # User management
│   ├── login/             # Authentication
│   └── models/            # Data models
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
└── lib/                   # Utilities and API functions
```

## Environment Variables

Make sure to set up your environment variables:

```bash
NEXT_PUBLIC_BASE_URL=your_backend_api_url
```

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Tailwind CSS](https://tailwindcss.com/docs) - utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - low-level UI primitives
- [TypeScript](https://www.typescriptlang.org/docs/) - typed JavaScript
