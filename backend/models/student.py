import re
import json
import random

from models.subject import Subject

TAB = "        "
BACK = "x"
EMAIL_PATTERN = r"^[A-Za-z]+\.[A-Za-z]+@university\.com$"
PASSWORD_PATTERN = r"^[A-Z][A-Za-z]{5,}[0-9]{3,}$"


class Student:
    def __init__(self, id="", name="", email="", password=""):
        self.id = id
        self.name = name
        self.email = email
        self.password = password
        self.subjects = []

    # ---------- checks / helpers ----------
    def validate_email(self, email):
        # firstname.lastname on the @university.com domain
        return re.match(EMAIL_PATTERN, email)

    def validate_password(self, password):
        # capital letter first, at least 5 more letters, then 3+ digits
        return re.match(PASSWORD_PATTERN, password)

    def generate_id(self):
        return str(random.randint(1, 999999)).zfill(6)

    def ask_credentials(self):
        # keep asking until email and password are the right format, or x to go back
        while True:
            email = input(TAB + "Email: ").strip()
            if email.lower() == BACK:
                return None
            password = input(TAB + "Password: ").strip()
            if password.lower() == BACK:
                return None
            if self.validate_email(email) and self.validate_password(password):
                print(TAB + "email and password formats acceptable")
                return email, password
            else:
                print(TAB + "Incorrect email or password format")

    def average(self):
        if len(self.subjects) == 0:
            return 0
        total = 0
        for s in self.subjects:
            total = total + s.mark
        return total / len(self.subjects)

    # ---------- use-case actions ----------
    def register(self, db):
        print(TAB + "Student Sign Up")
        credentials = self.ask_credentials()
        if credentials is None:
            return
        email, password = credentials

        students = db.read_students()
        for s in students:
            if s.email == email:
                print(TAB + "Student " + s.name + " already exists")
                return

        self.email = email
        self.password = password
        self.name = input(TAB + "Name: ").strip()
        # keep generating until the id is not used by another student
        used = []
        for s in students:
            used.append(s.id)
        self.id = self.generate_id()
        while self.id in used:
            self.id = self.generate_id()
        print(TAB + "Enrolling Student " + self.name)
        db.add_student(self)
        db.log.record("REGISTER", self.name + " :: " + self.id + " (" + self.email + ")")

    def login(self, db):
        # ask for credentials, then load the matching student's data into self.
        # returns True if the login worked.
        print(TAB + "Student Sign In")
        credentials = self.ask_credentials()
        if credentials is None:
            return False
        email, password = credentials

        for s in db.read_students():
            if s.email == email and s.password == password:
                self.id = s.id
                self.name = s.name
                self.email = s.email
                self.password = s.password
                self.subjects = s.subjects
                return True
        print(TAB + "Student does not exist")
        return False

    def enrol_subject(self, db):
        if len(self.subjects) >= 4:
            print(TAB + "Students are allowed to enrol in 4 subjects only")
            return
        # keep generating until the code is not one the student already has
        used = []
        for s in self.subjects:
            used.append(s.code)
        subject = Subject()
        while subject.code in used:
            subject = Subject()
        self.subjects.append(subject)
        print(TAB + "Enrolling in Subject-" + str(subject.code))
        print(TAB + "You are now enrolled in " + str(len(self.subjects)) + " out of 4 subjects")
        db.save_student(self)
        db.log.record("ENROL", self.name + " :: " + self.id + " enrolled in Subject-" + str(subject.code).zfill(3))

    def remove_subject(self, db):
        code = input(TAB + "Remove Subject by ID: ").strip()
        found = None
        for s in self.subjects:
            if str(s.code) == code or str(s.code).zfill(3) == code:
                found = s
        if found is None:
            print(TAB + "Subject " + code + " does not exist")
        else:
            self.subjects.remove(found)
            print(TAB + "Droping Subject-" + str(found.code))
            print(TAB + "You are now enrolled in " + str(len(self.subjects)) + " out of 4 subjects")
            db.save_student(self)
            db.log.record("DROP", self.name + " :: " + self.id + " dropped Subject-" + str(found.code).zfill(3))

    def view_enrolment(self):
        print(TAB + "Showing " + str(len(self.subjects)) + " subjects")
        for s in self.subjects:
            code = str(s.code).zfill(3)
            grade = s.grade.value
            if len(grade) == 1:
                grade = " " + grade
            print(TAB + "[ Subject::" + code + " -- mark = " + str(s.mark) + " -- grade = " + grade + " ]")

    def change_password(self, db):
        print(TAB + "Updating Password")
        current = input(TAB + "Current Password: ").strip()
        if current.lower() == BACK:
            return
        if current != self.password:
            print(TAB + "Incorrect current password")
            return
        while True:
            new_password = input(TAB + "New Password: ").strip()
            if new_password.lower() == BACK:
                return
            if self.validate_password(new_password):
                break
            print(TAB + "Incorrect password format")
        while True:
            confirm = input(TAB + "Confirm Password: ").strip()
            if confirm.lower() == BACK:
                return
            if confirm == new_password:
                break
            print(TAB + "Password does not match - try again")
        self.password = new_password
        db.save_student(self)
        db.log.record("PASSWORD", self.name + " :: " + self.id + " changed their password")

    # ---------- saving / loading ----------
    def to_json(self):
        subject_list = []
        for s in self.subjects:
            code = str(s.code).zfill(3)     # 7 -> "007"
            subject_list.append({"code": code, "mark": s.mark, "grade": s.grade.value})
        data = {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "password": self.password,
            "subjects": subject_list,
        }
        return json.dumps(data, separators=(",", ":"))


def load_student(data):
    student = Student(data["id"], data["name"], data["email"], data["password"])
    for s in data["subjects"]:
        student.subjects.append(Subject(int(s["code"]), s["mark"]))
    return student
