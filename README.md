# Wafer Technology Assignment

This is a full-stack TODO app for the Wafer Technology assignment.
It includes:

- **Frontend**: React app in `frontend/`
- **Backend**: Node.js + Express + MongoDB in `backend/`

The goal is a simple task manager with login/register and task CRUD.

---

## Project structure

- `backend/`
  - `server.js` - Express API routes and auth handling
  - `db.js` - MongoDB connection helper
  - `models/Task.js`, `models/User.js` - Mongoose schemas
  - `middleware/auth.js` - JWT middleware

- `frontend/`
  - `src/Pages/` - React pages (`Auth`, `Home`, `AddTask`, `EditTask`)
  - `src/App.js` - router and token flow

---

## Requirements

- Node.js (v16+ recommended)
- npm
- MongoDB URI (Atlas or local)
- `.env` values:
  - `MONGO_URI`
  - `JWT_SECRET`
  - `REACT_APP_API_URL` (frontend)

---

## Local setup (clone + run)

1. Clone repository:

```bash
git clone https://github.com/your-user/wafer-technology-assignment.git
cd wafer-technology-assignment
```

2. Backend setup:

```bash
cd backend
npm install
# create .env with values:
# MONGO_URI=mongodb+srv://... or mongodb://localhost:27017/yourdb
# JWT_SECRET=some-secret
npm start
```

3. Frontend setup:

```bash
cd ../frontend
npm install
# create .env file in frontend/
# REACT_APP_API_URL=http://localhost:5000 (or expected API URL)
npm start
```

4. Open browser at `http://localhost:3000`

### Live demo

- Frontend: https://wafer-technology-assignment-djv9.vercel.app/
  
---

## Production build

- Frontend: `npm run build` (in `frontend/`)
- Backend: deploy anywhere (Heroku/Render/Vercel with Node API)

---

## GitHub fork/clone instructions

If someone wants to use your repo:

```bash
git clone https://github.com/<yourname>/wafer-technology-assignment.git
cd wafer-technology-assignment
# then follow backend/frontend steps above
```

---

## Notes

- The app uses JWT token in `localStorage`.
- API CORS allowlist is in `backend/server.js`.
- For deployment, update `REACT_APP_API_URL` to your backend URL and add origin to CORS list.
