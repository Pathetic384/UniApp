#run uvicorn api.main:app --reload
#docs: http://127.0.0.1:8000/docs

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from api import service
from api.schemas import (
    RegisterIn, LoginIn, PasswordIn,
    StudentOut, SubjectOut, MessageOut, LogOut,
    student_to_out, subject_to_out,
)

app = FastAPI(title="UniApp API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(service.ApiError)
def handle_api_error(request, exc: service.ApiError):
    return JSONResponse(status_code=exc.status, content={"detail": exc.detail})


@app.get("/")
def root():
    return {"message": "UniApp API. See /docs for the endpoints."}


@app.post("/register", response_model=StudentOut, tags=["student"])
def register(body: RegisterIn):
    return student_to_out(service.register(body.name, body.email, body.password))


@app.post("/login", response_model=StudentOut, tags=["student"])
def login(body: LoginIn):
    return student_to_out(service.login(body.email, body.password))


@app.get("/students/{sid}", response_model=StudentOut, tags=["student"])
def get_student(sid: str):
    return student_to_out(service.get_student(sid))


@app.get("/students/{sid}/subjects", response_model=list[SubjectOut], tags=["subjects"])
def list_subjects(sid: str):
    student = service.get_student(sid)
    return [subject_to_out(s) for s in student.subjects]


@app.post("/students/{sid}/subjects", response_model=StudentOut, tags=["subjects"])
def enrol(sid: str):
    return student_to_out(service.enrol(sid))


@app.delete("/students/{sid}/subjects/{code}", response_model=StudentOut, tags=["subjects"])
def remove_subject(sid: str, code: str):
    return student_to_out(service.remove_subject(sid, code))


@app.put("/students/{sid}/password", response_model=StudentOut, tags=["student"])
def change_password(sid: str, body: PasswordIn):
    return student_to_out(service.change_password(sid, body.current_password, body.new_password))


@app.get("/admin/students", response_model=list[StudentOut], tags=["admin"])
def admin_list_students():
    return [student_to_out(s) for s in service.list_students()]


@app.get("/admin/students/grouped", tags=["admin"])
def admin_group_by_grade():
    groups = service.group_by_grade()
    return {g: [student_to_out(s) for s in members] for g, members in groups.items()}


@app.get("/admin/students/partition", tags=["admin"])
def admin_partition():
    parts = service.partition_pass_fail()
    return {k: [student_to_out(s) for s in members] for k, members in parts.items()}


@app.delete("/admin/students/{sid}", response_model=MessageOut, tags=["admin"])
def admin_remove_student(sid: str):
    service.remove_student(sid)
    return MessageOut(message="Removing Student " + sid + " Account")


@app.delete("/admin/students", response_model=MessageOut, tags=["admin"])
def admin_clear_all():
    service.clear_all()
    return MessageOut(message="Students data cleared")


@app.get("/admin/log", response_model=LogOut, tags=["admin"])
def admin_recent_changes(limit: int = 20):
    return LogOut(entries=service.recent_changes(limit))
