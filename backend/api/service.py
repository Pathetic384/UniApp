# api/service.py
# Business logic for the API. Reuses the model classes (Student, Subject,
# Database, Grade) but WITHOUT any console input()/print() so it can be
# called from HTTP handlers.

from models.database import Database
from models.student import Student
from models.subject import Subject
from models.grade import Grade

# One shared database (file: students.data). Swap this out for the team's
# real database by replacing the Database class - the rest stays the same.
db = Database()


class ApiError(Exception):
    """Raised for expected errors; carries an HTTP status and a message."""
    def __init__(self, status, detail):
        self.status = status
        self.detail = detail
        super().__init__(detail)


# ---------- helpers ----------
def _find_student(sid):
    for s in db.read_students():
        if s.id == sid:
            return s
    return None


# ---------- auth ----------
def register(name, email, password):
    checker = Student()
    if not checker.validate_email(email):
        raise ApiError(400, "Incorrect email format")
    if not checker.validate_password(password):
        raise ApiError(400, "Incorrect password format")

    for existing in db.read_students():
        if existing.email == email:
            raise ApiError(409, "Student " + existing.name + " already exists")

    student = Student()
    student.email = email
    student.password = password
    student.name = name
    # unique 6-digit id
    used = {s.id for s in db.read_students()}
    student.id = student.generate_id()
    while student.id in used:
        student.id = student.generate_id()

    db.add_student(student)
    db.log.record("REGISTER", student.name + " :: " + student.id + " (" + student.email + ")")
    return student


def login(email, password):
    for s in db.read_students():
        if s.email == email and s.password == password:
            return s
    raise ApiError(401, "Student does not exist")


def get_student(sid):
    student = _find_student(sid)
    if student is None:
        raise ApiError(404, "Student not found")
    return student


# ---------- subject enrolment ----------
def enrol(sid):
    student = get_student(sid)
    if len(student.subjects) >= 4:
        raise ApiError(409, "Students are allowed to enrol in 4 subjects only")
    subject = Subject()
    used = {s.code for s in student.subjects}
    while subject.code in used:
        subject = Subject()
    student.subjects.append(subject)
    db.save_student(student)
    db.log.record("ENROL", student.name + " :: " + student.id + " enrolled in Subject-" + str(subject.code).zfill(3))
    return student


def remove_subject(sid, code):
    student = get_student(sid)
    found = None
    for s in student.subjects:
        if str(s.code) == str(code) or str(s.code).zfill(3) == str(code):
            found = s
    if found is None:
        raise ApiError(404, "Subject not found")
    student.subjects.remove(found)
    db.save_student(student)
    db.log.record("DROP", student.name + " :: " + student.id + " dropped Subject-" + str(found.code).zfill(3))
    return student


def change_password(sid, current_password, new_password):
    student = get_student(sid)
    if current_password != student.password:
        raise ApiError(401, "Incorrect current password")
    if not student.validate_password(new_password):
        raise ApiError(400, "Incorrect password format")
    student.password = new_password
    db.save_student(student)
    db.log.record("PASSWORD", student.name + " :: " + student.id + " changed their password")
    return student


# ---------- admin ----------
def list_students():
    return db.read_students()


def group_by_grade():
    groups = {"Z": [], "P": [], "C": [], "D": [], "HD": []}
    for s in db.read_students():
        groups[Grade.from_mark(s.average()).value].append(s)
    return groups


def partition_pass_fail():
    result = {"PASS": [], "FAIL": []}
    for s in db.read_students():
        if s.average() >= 50:
            result["PASS"].append(s)
        else:
            result["FAIL"].append(s)
    return result


def remove_student(sid):
    if not db.remove_student(sid):
        raise ApiError(404, "Student not found")
    db.log.record("REMOVE", "Admin removed student " + sid)


def clear_all():
    count = len(db.read_students())
    db.clear()
    db.log.record("CLEAR", "Admin cleared the database (" + str(count) + " students removed)")


def recent_changes(limit=20):
    return db.log.read_entries(limit)
