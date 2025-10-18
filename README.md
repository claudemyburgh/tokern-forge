# token-forge

A Laravel-based web application for managing digital tokens in Web3 environments.

## Project Overview

Token-forge is a full-stack web application built with Laravel and React, designed for creating and managing digital tokens. It leverages modern development tools and follows best practices for both backend and frontend development.

## Prerequisites

- PHP >= 8.2
- Composer
- Bun (package manager and runtime)
- Node.js (for Vite development server)

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd token-forge
   ```

2. Install PHP dependencies:
   ```bash
   composer install
   ```

3. Install frontend dependencies using Bun:
   ```bash
   bun install
   ```

4. Copy and configure the environment file:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. Run database migrations:
   ```bash
   php artisan migrate
   ```

## Development

Start the development server using Bun:
```bash
bun run dev
```

Build for production:
```bash
bun run build
```

## Available Scripts

- `bun run dev` - Start the development server
- `bun run build` - Build for production
- `bun run build:ssr` - Build for production with SSR support
- `bun run lint` - Run ESLint
- `bun run format` - Format code with Prettier
- `bun run types` - Check TypeScript types

## Technology Stack

### Backend
- Laravel 12
- PHP 8.2+
- Laravel Fortify (authentication)
- Laravel Sanctum (API tokens)
- Spatie Laravel Permission (roles & permissions)
- Spatie Media Library (file attachments)

### Frontend
- React 19
- TypeScript
- Vite
- Inertia.js
- Tailwind CSS
- Shadcn UI components
- Radix UI primitives

## Architecture

The application follows a monolithic architecture with a decoupled frontend using Inertia.js. This allows for server-side routing with client-side rendering without requiring a separate API layer.

## Security

- CSRF protection via Laravel
- Two-factor authentication available via Fortify
- Sanctum ensures secure API token handling
- Role-based access control via Spatie Permissions