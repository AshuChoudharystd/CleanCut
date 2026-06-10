# CleanCut

Full-stack e-commerce platform with a customer storefront, admin dashboard, and Node.js API.

## Project structure

- `backend/` — Express + MongoDB API
- `frontend/` — Customer React storefront (Vite)
- `admin/` — Admin React dashboard (Vite)
- `tests/` — Automated behavior and contract tests

## Prerequisites

- Node.js 20+
- MongoDB database
- Cloudinary account (for product images)

## Environment setup

### Backend

Copy `backend/.env.example` to `backend/.env` and fill in values:

```
PORT=3000
MONGO_URI=mongodb+srv://...
USER_JWT_SECRET=<strong-random-secret>
ADMIN_JWT_SECRET=<strong-random-secret>
Cloudinary_NAME=...
Cloudinary_API_KEY=...
Cloudinary_API_SECRET=...
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

### Frontend / Admin

Set `VITE_BACKEND_URL` in `frontend/.env` and `admin/.env`:

```
VITE_BACKEND_URL=http://localhost:3000/api/v1
```

## Development

```bash
# Backend
cd backend && npm install && npm run dev

# Customer frontend
cd frontend && npm install && npm run dev

# Admin dashboard
cd admin && npm install && npm run dev
```

## Production build

```bash
cd backend && npm run build && npm start
cd frontend && npm run build
cd admin && npm run build
```

## Testing

From the repo root:

```bash
npm test
```

This runs API behavior tests and source-contract regression tests.

## Security notes

- Auth uses short-lived access tokens (15 min) + long-lived refresh tokens in httpOnly cookies
- Clients automatically refresh sessions when access tokens expire
- CORS is restricted to origins listed in `ALLOWED_ORIGINS`
- Order totals are calculated server-side with stock validation
- Public admin self-registration is disabled — seed admin accounts manually

## Seeding an admin account

Create an admin document directly in MongoDB or use a one-time setup script. The `/admin/signup` route is intentionally unavailable.
