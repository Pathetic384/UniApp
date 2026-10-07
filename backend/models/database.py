import os
import json

from models.activity_log import ActivityLog
from models.storage import path_for
from models.student import Student, load_student


class Database:
    def __init__(self):
        self.filename = path_for("database/students.data")
        self.log = ActivityLog()
        # create the file if it does not exist yet
        if not os.path.exists(self.filename):
            f = open(self.filename, "w", encoding="utf-8")
            f.close()

    def read_students(self):
        students = []
        if not os.path.exists(self.filename):
            return students
        f = open(self.filename, "r", encoding="utf-8", errors="replace")
        for line in f:
            line = line.strip()
            if line != "":
                data = json.loads(line)
                students.append(load_student(data))
        f.close()
        return students

    def write_students(self, students):
        f = open(self.filename, "w", encoding="utf-8")
        for s in students:
            f.write(s.to_json() + "\n")
        f.close()

    def add_student(self, student):
        students = self.read_students()
        students.append(student)
        self.write_students(students)

    def save_student(self, student):
        # update one student that is already saved in the file
        students = self.read_students()
        found = False
        for i in range(len(students)):
            if students[i].id == student.id:
                students[i] = student
                found = True
        if not found:
            return False
        self.write_students(students)
        return True

    def remove_student(self, student_id):
        # returns True if a student was removed
        students = self.read_students()
        found = None
        for s in students:
            if s.id == student_id:
                found = s
        if found is None:
            return False
        students.remove(found)
        self.write_students(students)
        return True

    def clear(self):
        f = open(self.filename, "w", encoding="utf-8")
        f.close()
