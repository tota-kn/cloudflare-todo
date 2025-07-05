# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a full-stack Cloudflare Todo application using a pnpm workspace monorepo:

- **back/**: Hono-based API server deployed to Cloudflare Workers
- **front/**: React Router v7 SSR application deployed to Cloudflare Pages
- **shared/**: Type definitions shared between frontend and backend

## Development Commands

### Root Level
```bash
# Install dependencies
pnpm install

# Work with backend
pnpm back [command]

# Work with frontend  
pnpm front [command]
```

### Backend (back/)
```bash
# Start development server
pnpm dev              # Runs on localhost:8787 with local env

# Lint and fix
pnpm lint

# Deploy
pnpm deploy:dev       # Deploy to dev environment
pnpm deploy:prd       # Deploy to production
```

### Frontend (front/)
```bash
# Start development server
pnpm dev              # Runs on localhost:5173 with local env

# Build application
pnpm build

# Type checking
pnpm typecheck        # Generates CF types, RR types, and runs tsc

# Deploy
pnpm deploy:dev       # Build and deploy to dev
pnpm deploy:prd       # Build and deploy to production

# Preview production build
pnpm preview
```

## Architecture

### Backend Architecture
- **Framework**: Hono with TypeScript
- **Structure**: Modular route-based organization in `src/function/`
- **Validation**: Zod schemas with `@hono/zod-validator`
- **Entry Point**: `src/index.ts` - composes all routes into main app
- **Type Safety**: Routes export types that are consumed by frontend

### Frontend Architecture
- **Framework**: React Router v7 with SSR
- **Deployment**: Cloudflare Pages with Workers integration
- **Entry Points**: 
  - `app/root.tsx` - Root layout and error boundary
  - `workers/app.ts` - Cloudflare Worker entry point
- **Routing**: File-based routing in `app/routes/`
- **API Client**: Hono RPC client with full type safety from backend routes
- **Styling**: TailwindCSS

### Type Sharing Strategy
- Backend routes export `RouteType` from `src/index.ts`
- `shared/client.ts` re-exports this as `ClientType`
- Frontend uses `hc<ClientType>()` for fully typed API client
- This creates end-to-end type safety from backend to frontend

### Environment Configuration
Both apps use Wrangler with environment-specific configs:
- **local**: `http://localhost:5173` CORS origin
- **dev**: `https://todo-front-dev.omen-bt.workers.dev` CORS origin  
- **prd**: `https://todo-front-prd.omen-bt.workers.dev` CORS origin

## Key Files

- `back/src/index.ts` - Main backend entry point and route composition
- `front/app/client.ts` - Typed API client configuration
- `front/workers/app.ts` - Cloudflare Worker request handler
- `shared/client.ts` - Type bridge between backend and frontend
- `**/wrangler.jsonc` - Cloudflare Workers configuration

## Development Workflow

1. Backend changes: Edit routes in `back/src/function/`, types automatically flow to frontend
2. Frontend changes: Use typed client in loaders/actions, full IntelliSense available
3. Both apps can be developed simultaneously with hot reload
4. Deploy separately to Cloudflare Workers (backend) and Pages (frontend)