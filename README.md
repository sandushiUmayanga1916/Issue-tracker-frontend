# Issue Tracker — Frontend

React + Vite frontend for the Issue Tracker application.

## Live Demo

- **Frontend:** https://trackflowissuetracker.netlify.app
- **Backend API:** https://issuetrackerbackend.netlify.app/api

## Demo Credentials

```
Email:    demo@issueflow.dev
Password: demo1234
```

## Tech Stack

- **React 18** — UI library
- **Vite** — build tool and dev server
- **React Router v6** — client-side routing with protected routes
- **Zustand** — lightweight global state management
- **Axios** — HTTP client with JWT interceptors
- **react-hot-toast** — toast notifications

## Local Development

### Prerequisites

- Node.js >= 18
- Backend server running (see `/backend`)

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # .env is optional for local dev — Vite proxies /api to localhost:5000
   ```

3. **Start dev server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173)

4. **Build for production**
   ```bash
   npm run build
   ```

## Deployment (Netlify)

1. Push this repo to GitHub
2. Go to [netlify.com](https://netlify.com) → New Site → Import from Git
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variable in Netlify dashboard:

```
VITE_API_URL = https://issuetrackerbackend.netlify.app/api
```

5. Deploy — React Router is handled by `public/_redirects`

## Features

- **Authentication** — Register and login with JWT stored in localStorage
- **Dashboard** — Live status stats, distribution bar, recent issues
- **Issue list** — Paginated table with debounced search, filter, and sort
- **Issue detail** — Full metadata, status transitions with confirmation prompts
- **CRUD** — Create, edit, and delete issues via modals
- **Export** — Download all issues as CSV or JSON
- **Route guards** — Unauthenticated users redirected to login automatically

## Pages

| Route | Description |
|-------|-------------|
| `/login` | Login with email and password |
| `/register` | Create a new account |
| `/dashboard` | Stats overview and recent issues |
| `/issues` | Full issue list with search and filters |
| `/issues/:id` | Issue detail, edit, and status change |

## Project Structure

```
src/
├── api/
│   └── index.js        Axios client with JWT interceptor
├── store/
│   ├── authStore.js    User session (Zustand)
│   └── issuesStore.js  Issues, filters, pagination (Zustand)
├── hooks/
│   └── useDebounce.js  400ms debounce for search input
├── components/
│   ├── Layout.jsx      Sidebar + outlet wrapper
│   ├── Modal.jsx       Reusable modal
│   ├── ConfirmDialog.jsx  Confirmation prompts
│   ├── IssueForm.jsx   Shared create/edit form
│   ├── Badges.jsx      Status, priority, severity badges
│   └── Pagination.jsx  Page controls
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardPage.jsx
│   ├── IssuesPage.jsx
│   └── IssueDetailPage.jsx
├── App.jsx             Router + route guards
└── index.css           Global styles and design tokens
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL (e.g. `https://your-backend.netlify.app/api`) |