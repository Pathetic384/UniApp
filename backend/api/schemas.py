# api/schemas.py
# Request/response shapes for the API (Pydantic models).

from pydantic import BaseModel

from models.grade import Grade


# ---------- requests ----------
class RegisterIn(BaseModel):
    email: str
    password: str


class LoginIn(BaseModel):
    email: str
    password: str


class PasswordIn(BaseModel):
    new_password: str


# ---------- responses ----------
class SubjectOut(BaseModel):
    code: str          # 3-digit, e.g. "007"
    mark: int
    grade: str         # "Z" / "P" / "C" / "D" / "HD"


class StudentOut(BaseModel):
    id: str            # 6-digit, e.g. "002340"
    name: str
    email: str
    subjects: list[SubjectOut]
    average: float
    grade: str         # overall grade from the average mark
    passed: bool       # average >= 50


class MessageOut(BaseModel):
    message: str


# ---------- converters ----------
def subject_to_out(subject) -> SubjectOut:
    return SubjectOut(
        code=str(subject.code).zfill(3),
        mark=subject.mark,
        grade=subject.grade.value,
    )


def student_to_out(student) -> StudentOut:
    avg = student.average()
    return StudentOut(
        id=student.id,
        name=student.name,
        email=student.email,
        subjects=[subject_to_out(s) for s in student.subjects],
        average=round(avg, 2),
        grade=Grade.from_mark(avg).value,
        passed=avg >= 50,
    )
