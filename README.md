# CLIUniApp

University self-enrolment system. The project is split into three parts:

```
CLIUniApp/
├── backend/     Python — CLI app + FastAPI backend (models, api)
├── frontend/    (teammate) — UI that calls the backend API
└── database/    (teammate) — database layer
```

## Backend
See [`backend/README.md`](backend/README.md).

- Run the CLI:  `cd backend` then `python main.py`
- Run the API:  `cd backend` then `pip install -r requirements.txt` and
  `uvicorn api.main:app --reload` (docs at http://127.0.0.1:8000/docs)
