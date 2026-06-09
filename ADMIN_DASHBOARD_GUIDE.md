# FIT-IN Admin Dashboard Guide

## Setup

```bash
cd admin-dashboard
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
```

Copy `.env.example` to `.env` and set `VITE_API_URL` to your backend URL (default: `http://localhost:5000/api`).

Make sure the backend is running first:
```bash
cd backend && npm run dev   # http://localhost:5000
```

---

## Backend Analysis Summary

The Node.js backend (Express + MongoDB + TypeScript) exposes these domain areas:

| Domain | Route prefix | Admin access |
|---|---|---|
| Auth | `/api/auth` | Public login |
| User management | `/api/users` | Full CRUD + dashboard stats |
| Consumer profiles | `/api/consumers` | Read via user list |
| Coach profiles | `/api/coaches` | List + update |
| Exercises | `/api/exercises` | Full CRUD |
| Workout Sessions | `/api/workouts` | Full CRUD |
| Meal Plans | `/api/meal-plans` | Full CRUD |
| Meals | `/api/meals` | Full CRUD |
| Health Metrics | `/api/metrics` | Read per-user |
| Goals | `/api/goals` | Read per-user |
| AI Recommendations | `/api/recommendations` | Generate + delete |
| Notifications | `/api/notifications` | Read |

**Admin-only endpoints**: `GET /api/users/stats`, `GET /api/users`, `POST /api/users/coaches`, `POST /api/users/admins`, `DELETE /api/users/:id`

---

## Folder Structure

```
src/
├── api/              # fetch wrappers — one file per domain
│   ├── client.ts     # base fetch + JWT token helpers
│   ├── auth.ts
│   ├── users.ts
│   ├── coaches.ts
│   ├── metrics.ts
│   ├── recommendations.ts
│   ├── workouts.ts   # exercises + workout sessions
│   └── mealPlans.ts  # meals + meal plans
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx        # collapsible nav sidebar
│   │   ├── Topbar.tsx         # search + notifications + avatar
│   │   └── DashboardLayout.tsx # wraps Sidebar + Topbar + main
│   ├── cards/
│   │   └── StatCard.tsx       # KPI card with sparkline chart
│   └── charts/
│       ├── ActivityAreaChart.tsx  # Recharts area chart
│       ├── GoalDonutChart.tsx     # PieChart donut
│       ├── EngagementHeatmap.tsx  # grid heatmap
│       └── LiveActivityFeed.tsx   # real-time activity list
├── pages/
│   ├── auth/LoginPage.tsx
│   ├── dashboard/DashboardPage.tsx
│   ├── users/UsersPage.tsx
│   ├── coaches/CoachesPage.tsx
│   ├── analytics/AnalyticsPage.tsx
│   ├── ai/AIInsightsPage.tsx
│   ├── content/ContentPage.tsx
│   ├── health/HealthMonitorPage.tsx
│   └── settings/SettingsPage.tsx
├── routes/
│   └── ProtectedRoute.tsx    # redirects to /login if no token
├── types/
│   └── index.ts              # TypeScript interfaces mirroring backend models
├── App.tsx                   # BrowserRouter + all Routes
├── main.tsx                  # React entry point
└── index.css                 # Tailwind directives + component layer
```

---

## API Integration

### How API calls work

All API calls go through `src/api/client.ts` — a thin `fetch` wrapper (no Axios):

```typescript
// Automatically attaches JWT from localStorage
const response = await api.get<ApiResponse<User[]>>('/users');
const users = response.data;
```

The JWT token is stored in `localStorage` under key `fit_admin_token`. It is:
- **Saved** in `src/api/auth.ts` on successful login
- **Attached** to every request via the `request()` function in `client.ts`
- **Cleared** on logout

### Adding new API calls

1. Create or extend a file in `src/api/`
2. Use `api.get<ApiResponse<YourType>>(path)`, then return `res.data`
3. Import and call in your page component

---

## Authentication Flow

1. User visits any protected route → `ProtectedRoute` checks `localStorage` for token → redirects to `/login` if absent
2. `LoginPage` calls `POST /api/auth/login` → checks `user.role === 'Admin'` → stores token → navigates to `/`
3. All subsequent API calls automatically include `Authorization: Bearer <token>` header
4. Logout clears the token from localStorage and calls `POST /api/auth/logout`

**First admin account**: Use the backend seed script:
```bash
cd backend && npm run create:admin
```

---

## Chart System

All charts use **Recharts**. Each chart component:
- Accepts real data as props
- Falls back to generated mock data when props are empty (for development)
- Uses the project's green/purple/blue color palette

| Component | Type | Data source |
|---|---|---|
| `StatCard` | Sparkline AreaChart | Any numeric series |
| `ActivityAreaChart` | Area chart | User growth & sessions |
| `GoalDonutChart` | Pie/Donut | Consumer `goals[]` distribution |
| `EngagementHeatmap` | Custom grid | Daily active sessions |
| `LiveActivityFeed` | List | Mock feed (real-time webhook needed) |

---

## Dashboard Modules

| Page | Route | Data source |
|---|---|---|
| Dashboard | `/` | `/api/users/stats` + mock charts |
| Users | `/users` | `/api/users` |
| Coaches | `/coaches` | `/api/coaches` + `/api/users` |
| Analytics | `/analytics` | Mock aggregates (real endpoints TBD) |
| AI Insights | `/ai` | `/api/recommendations` + `/api/users` |
| Content | `/content` | `/api/exercises` + `/api/workouts` + `/api/meals` + `/api/meal-plans` |
| Health Monitor | `/health` | `/api/metrics/user/:id` |
| Settings | `/settings` | Local state (backend config TBD) |

---

## Missing Backend Endpoints

The following analytics features currently use mock/calculated data. These backend endpoints would unlock real data:

- `GET /api/analytics/overview` — platform-wide aggregate counts
- `GET /api/analytics/registrations?period=monthly` — time-series user registrations
- `GET /api/analytics/goal-distribution` — aggregate `goals[]` field across consumers
- `GET /api/analytics/calories?period=monthly` — average calories consumed platform-wide
- `GET /api/workouts/stats` — total sessions, intensity breakdown
