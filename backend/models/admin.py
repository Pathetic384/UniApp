from models.grade import Grade

TAB = "        "


class Admin:
    def __init__(self, db):
        self.db = db

    def describe(self, student):
        # John Smith :: 673358 --> GRADE:  C - MARK: 68.25
        avg = student.average()
        grade = Grade.from_mark(avg).value
        if len(grade) == 1:
            grade = " " + grade
        return student.name + " :: " + student.id + " --> GRADE: " + grade + " - MARK: " + format(avg, ".2f")

    def join(self, students):
        text = ""
        for i in range(len(students)):
            text = text + self.describe(students[i])
            if i < len(students) - 1:
                text = text + ", "
        return text

    def show_students(self):
        students = self.db.read_students()
        print(TAB + "Student List")
        if len(students) == 0:
            print(TAB + TAB + "< Nothing to Display >")
        else:
            for s in students:
                print(TAB + s.name + " :: " + s.id + " --> Email: " + s.email)

    def group_students(self):
        students = self.db.read_students()
        print(TAB + "Grade Grouping")
        if len(students) == 0:
            print(TAB + TAB + "< Nothing to Display >")
            return
        grades = [Grade.Z, Grade.P, Grade.C, Grade.D, Grade.HD]
        for g in grades:
            group = []
            for s in students:
                if Grade.from_mark(s.average()) == g:
                    group.append(s)
            if len(group) > 0:
                print(TAB + g.value + "  --> [" + self.join(group) + "]")

    def partition_students(self):
        students = self.db.read_students()
        print(TAB + "PASS/FAIL Partition")
        fail_list = []
        pass_list = []
        for s in students:
            if s.average() >= 50:
                pass_list.append(s)
            else:
                fail_list.append(s)
        print(TAB + "FAIL --> [" + self.join(fail_list) + "]")
        print(TAB + "PASS --> [" + self.join(pass_list) + "]")

    def remove_student(self):
        student_id = input(TAB + "Remove by ID: ").strip()
        if self.db.remove_student(student_id):
            print(TAB + "Removing Student " + student_id + " Account")
            self.db.log.record("REMOVE", "Admin removed student " + student_id)
        else:
            print(TAB + "Student " + student_id + " does not exist")

    def clear_database(self):
        print(TAB + "Clearing students database")
        answer = input(TAB + "Are you sure you want to clear the database (Y)ES/(N)O: ").strip().lower()
        if answer == "y":
            count = len(self.db.read_students())
            self.db.clear()
            print(TAB + "Students data cleared")
            self.db.log.record("CLEAR", "Admin cleared the database (" + str(count) + " students removed)")

    def show_log(self):
        entries = self.db.log.read_entries(20)
        print(TAB + "Recent Changes")
        if len(entries) == 0:
            print(TAB + TAB + "< Nothing to Display >")
        else:
            for e in entries:
                print(TAB + e)
