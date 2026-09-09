import re
import json
import random

from models.subject import Subject

TAB = "        "


class Student:
    def __init__(self, id="", name="", email="", password=""):
        self.id = id
        self.name = name
        self.email = email
        self.password = password
        self.subjects = []

    # ---------- checks / helpers ----------
    def validate_email(self, email):
        # must end with the @university.com domain
        return re.match(r"^[\w.\-]+@university\.com$", email)

    def validate_password(self, password):
        # capital letter first, at least 5 letters in total, then 3+ digits
        return re.match(r"^[A-Z][A-Za-z]{4,}[0-9]{3,}$", password)

    def generate_id(self):
        return str(random.randint(1, 999999)).zfill(6)

    def ask_credentials(self):
        # keep asking until email and password are the right format
        while True:
            email = input(TAB + "Email: ")
            password = input(TAB + "Password: ")
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
        email, password = self.ask_credentials()

        students = db.read_students()
        for s in students:
            if s.email == email:
                print(TAB + "Student " + s.name + " already exists")
                return

        self.email = email
        self.password = password
        self.name = input(TAB + "Name: ")
        # keep generating until the id is not used by another student
        used = []
        for s in students:
            used.append(s.id)
        self.id = self.generate_id()
        while self.id in used:
            self.id = self.generate_id()
        print(TAB + "Enrolling Student " + self.name)
        db.add_student(self)

    def login(self, db):
        # ask for credentials, then load the matching student's data into self.
        # returns True if the login worked.
        print(TAB + "Student Sign In")
        email, password = self.ask_credentials()

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

    def remove_subject(self, db):
        code = input(TAB + "Remove Subject by ID: ")
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
        new_password = input(TAB + "New Password: ")
        while True:
            confirm = input(TAB + "Confirm Password: ")
            if confirm == new_password:
                break
            print(TAB + "Password does not match - try again")
        self.password = new_password
        db.save_student(self)

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
