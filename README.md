# Issue Tracker — Frontend

React + Vite frontend for the Issue Tracker application.

## Tech Stack

- **React 18** — UI library
- **Vite** — build tool & dev server
- **React Router v6** — client-side routing
- **Zustand** — lightweight state management
- **Axios** — HTTP client with JWT interceptors
- **react-hot-toast** — toast notifications
- **date-fns** — date formatting

## Prerequisites

- Node.js >= 18
- Backend server running (see `/backend`)

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment** (optional)
   ```bash
   cp .env.example .env
   ```
   The Vite dev server proxies `/api` to `http://localhost:5000` automatically.

3. **Start dev server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173)

4. **Build for production**
   ```bash
   npm run build
   ```

## Features

- **Authentication** — Register/login with JWT stored in localStorage
- **Dashboard** — Status stats, progress bars, recent issues
- **Issue List** — Paginated table with search, filter, and sort
- **Issue Detail** — Full info, status transitions with confirmation prompts
- **CRUD** — Create, edit, delete issues via modals
- **Export** — Download issues as CSV or JSON
- **Debounced search** — Optimized API requests during typing

## Pages

| Route | Page |
|-------|------|
| `/login` | Login |
| `/register` | Register |
| `/dashboard` | Stats + recent issues |
| `/issues` | Full issue list |
| `/issues/:id` | Issue detail |

## Project Structure

```
src/
├── api/          # Axios client + endpoint helpers
├── components/   # Reusable UI components
├── hooks/        # Custom hooks (useDebounce)
├── pages/        # Page-level components
├── store/        # Zustand stores
└── index.css     # Global styles & design tokens
```
