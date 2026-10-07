# UniApp

University self-enrolment system built for **32555 Fundamentals of Software Development**.  
Students can register, log in, enrol in subjects, and view their grades. Admins can manage student records, group students by grade, and partition pass/fail lists.

The project is split into three parts:

```
UniApp/
├── backend/     Python — CLI app + FastAPI REST API
├── frontend/    React (Vite) — web UI that calls the backend API
├── database/    Data persistence layer (students.data + changes.log)
```

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| **Python** | 3.10+ | Backend CLI & API |
| **Node.js** | 18+ | Frontend dev server |
| **npm** | 9+ | Frontend dependency management |

---

## Quick Start

### 1. Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn api.main:app --reload
```

The API will be available at **http://127.0.0.1:8000** with interactive docs at **http://127.0.0.1:8000/docs**.

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Opens at **http://localhost:5173**. The Vite dev server proxies `/api/*` requests to the FastAPI backend on port 8000, so **both servers must be running**.

### 3. CLI (alternative)

The original command-line interface is still available:

```bash
cd backend
python main.py
```

---

## Project Structure

```
UniApp/
├── backend/
│   ├── main.py              # CLI entry point
│   ├── cliuniapp.py          # CLI menus and flow
│   ├── requirements.txt      # Python dependencies (fastapi, uvicorn)
│   ├── api/
│   │   ├── main.py           # FastAPI app, routes, and CORS config
│   │   ├── service.py        # Business logic layer for the API
│   │   └── schemas.py        # Pydantic request/response models
│   └── models/
│       ├── database.py       # File-based persistence (students.data)
│       ├── student.py        # Student model (validation, enrolment)
│       ├── subject.py        # Subject model (code, mark, grade)
│       ├── admin.py          # Admin operations
│       ├── grade.py          # Grade enum (HD, D, C, P, Z)
│       ├── activity_log.py   # Append-only change log
│       └── storage.py        # Data-file path config
│
├── frontend/
│   ├── vite.config.js        # Dev server + API proxy config
│   ├── package.json          # Dependencies (React 18, React Router 6)
│   └── src/
│       ├── App.jsx           # Route definitions
│       ├── api.js            # HTTP client for the backend
│       ├── auth.jsx          # Auth context (student session state)
│       ├── styles.css        # Global styles
│       ├── components/       # Reusable UI components
│       │   ├── Layout.jsx
│       │   ├── AdminNav.jsx
│       │   ├── GradeMark.jsx
│       │   ├── Notice.jsx
│       │   ├── RequireStudent.jsx
│       │   └── StudentRow.jsx
│       └── pages/            # Page-level views
│           ├── Home.jsx
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── StudentDashboard.jsx
│           ├── ChangePassword.jsx
│           ├── AdminStudents.jsx
│           ├── AdminGrades.jsx
│           ├── AdminPassFail.jsx
│           └── NotFound.jsx
│
├── database/
│   ├── students.data         # Pickled student records
│   └── README.md
│
└── changes.log               # Append-only activity log
```

---

## Frontend Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page with feature overview |
| `/login` | Login | Student sign-in form |
| `/register` | Register | New student registration |
| `/student` | Dashboard | View enrolled subjects, enrol/drop subjects |
| `/student/password` | Change Password | Update student password |
| `/admin` | Admin Students | List all students, remove/clear |
| `/admin/grades` | Admin Grades | Students grouped by grade |
| `/admin/pass-fail` | Admin Pass/Fail | Students partitioned into pass/fail |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `POST` | `/register` | Register a new student |
| `POST` | `/login` | Log in with email + password |
| `GET` | `/students/{sid}` | Get student by ID |
| `GET` | `/students/{sid}/subjects` | List student's subjects |
| `POST` | `/students/{sid}/subjects` | Enrol in a random subject |
| `DELETE` | `/students/{sid}/subjects/{code}` | Drop a subject |
| `PUT` | `/students/{sid}/password` | Change password |
| `GET` | `/admin/students` | List all students |
| `GET` | `/admin/students/grouped` | Group students by grade |
| `GET` | `/admin/students/partition` | Partition students into pass/fail |
| `DELETE` | `/admin/students/{sid}` | Remove a student |
| `DELETE` | `/admin/students` | Clear all student data |
| `GET` | `/admin/log` | View recent changes |

Full interactive docs: **http://127.0.0.1:8000/docs** (when the backend is running).

---

## Business Rules

- **Email** must match `firstname.lastname@university.com` (the dot between first and last name is required).
- **Password** must start with an uppercase letter, contain at least 5 letters total, and end with at least 3 digits (e.g. `Helloworld123`).
- A student can enrol in **at most 4 subjects**.
- Each subject receives a random mark (25–100) and a letter grade:

  | Grade | Range |
  |-------|-------|
  | HD (High Distinction) | 85–100 |
  | D (Distinction) | 75–84 |
  | C (Credit) | 65–74 |
  | P (Pass) | 50–64 |
  | Z (Fail) | below 50 |

- A student **passes** overall if their average mark across all subjects is ≥ 50.
- All changes (register, enrol, drop, password change, remove, clear) are recorded in `changes.log`.
