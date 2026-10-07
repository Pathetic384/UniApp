# UniApp Frontend (React)

React + Vite frontend for the CLIUniApp FastAPI backend.

## Pages

| Route | Page | Backlog stories |
|---|---|---|
| `/` | Home – overview and grade scale | – |
| `/login` | Student login | 100–104 |
| `/register` | Student registration with live email/password rule checks | 200–203 |
| `/student` | Enrolment dashboard: 4 subject slots, enrol, remove, average and grade | 300–306 |
| `/student/password` | Change password | 400 |
| `/admin` | All students, remove one student, clear database | 500, 503, 504 |
| `/admin/grades` | Students grouped by grade (HD/D/C/P/Z) | 501 |
| `/admin/pass-fail` | PASS / FAIL partition | 502 |

## Running it

1. Start the backend from the `backend` folder (port 8000):
   ```
   uvicorn api.main:app --reload --port 8000
   ```
2. In this folder:
   ```
   npm install
   npm run dev
   ```
3. Open http://localhost:5173

The Vite dev server proxies `/api/*` to `http://127.0.0.1:8000`, so no CORS setup is needed.
To point at a different backend, create `.env` with `VITE_API_URL=http://host:port`
(you will then need `CORSMiddleware` in `api/main.py`).

## Structure

```
src/
  api.js          API client + shared business rules (grades, 4-subject cap, validation)
  auth.jsx        Logged-in student state (per browser tab)
  App.jsx         Routes
  components/     Layout, admin sub-nav, grade chip, notices, route guard
  pages/          One file per page
  styles.css
```

## Assumptions about API responses

- `/login` and `/register` return a `StudentOut` (`id, name, email, subjects, average, grade, passed`).
- `/admin/students/grouped` returns an object keyed by grade (`{"HD": [...], ...}`); a list of `{grade, students}` also works.
- `/admin/students/partition` returns `{"PASS": [...], "FAIL": [...]}`.
- Errors return `{"detail": "..."}` (from `handle_api_error`).

If your backend returns a different shape, adjust the matching function in `src/api.js` or the page.
