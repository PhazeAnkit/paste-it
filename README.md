# Paste It

**Paste It** is a simple Pastebin‑like web application that allows users to create text pastes and share a link to view them.  
Each paste can optionally expire after a given amount of time or after being viewed a limited number of times.

The project is implemented as a **small monorepo** with a React frontend and a Node.js backend, designed to work both in local development and as a single production service.

---

## Features

- Create a paste containing arbitrary text
- Generate a shareable URL to view the paste
- Optional constraints:
  - Time‑based expiry (TTL)
  - View‑count limit
- Pastes become unavailable once any configured constraint is reached
- Simple UI for creating and viewing pastes
- Deterministic time support for testing expiry logic
- Health check endpoint reporting infrastructure status

---

## Project Structure

```
.
├── front-end/          # React + Vite frontend
├── back-end/           # Express + Prisma backend
├── pnpm-workspace.yaml
├── package.json
└── pnpm-lock.yaml
```

---

## Tech Stack

### Frontend
- React
- Vite
- React Router

### Backend
- Node.js
- Express
- Prisma ORM

### Persistence
- PostgreSQL (Neon)
- Redis (health check + future extensibility)

---

## API Overview

### Health Check

**GET /api/healthz**

Checks connectivity to Redis and the database.

Healthy response:
```json
{
  "ok": true,
  "services": {
    "redis": "up",
    "database": "up"
  }
}
```

Unhealthy response returns **HTTP 503**.

---

### Create Paste

**POST /api/pastes**

Request body:
```json
{
  "content": "Hello world",
  "ttl_seconds": 60,
  "max_views": 5
}
```

Rules:
- `content` is required and must be a non‑empty string
- `ttl_seconds` is optional (integer ≥ 1)
- `max_views` is optional (integer ≥ 1)

Response:
```json
{
  "id": "<paste-id>",
  "url": "https://your-app/p/<paste-id>"
}
```

---

### Fetch Paste (API)

**GET /api/pastes/:id**

Successful response:
```json
{
  "content": "Hello world",
  "remaining_views": 4,
  "expires_at": "2026-01-01T00:00:00.000Z"
}
```

Notes:
- `remaining_views` is `null` if unlimited
- `expires_at` is `null` if no TTL
- Each successful fetch counts as one view

Unavailable cases:
- Missing paste
- Expired paste
- View limit exceeded

All unavailable cases return:
- **HTTP 404**
- JSON error body

---

### View Paste (HTML)

**GET /p/:id**

- Returns an HTML page containing the paste content
- Returns **HTTP 404** if the paste is unavailable
- Paste content is rendered safely (no script execution)

---

## Deterministic Time Support

For testing expiry logic:

- Set environment variable:
  ```bash
  TEST_MODE=1
  ```
- Send request header:
  ```
  x-test-now-ms: <milliseconds since epoch>
  ```

If the header is absent, the system uses real wall‑clock time.

---

## Running Locally

### Install dependencies
```bash
pnpm install  //from root directory
```

### Development mode
```bash
cd front-end && pnpm dev  //from root directory
cd back-end && pnpm dev   //from root directory
```

### Production build
```bash
pnpm build   //from root directory
```

### Run production server
```bash
cd back-end && pnpm start  //from root directory
```

---

## Environment Variables(.env in back-end directory )

| Variable | Description |
|--------|-------------|
| DATABASE_URL | PostgreSQL connection string |
| FRONTEND_BASE_URL | Base URL used when generating paste links |
| TEST_MODE | Enable deterministic time testing |

---

## Design Notes

- Backend and frontend are deployed as a **single service** in production
- The backend serves the frontend's static build
- Prisma is used for persistence with PostgreSQL (Neon)
- Redis is used for health checks and future extensibility
- No client‑side caching library (e.g., React Query) is used, as it would be overkill for this use case

---
