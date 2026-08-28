from models.database import Database
from models.admin import Admin
from models.student import Student

TAB = "        "


class CLIUniApp:
    def __init__(self):
        self.db = Database()

    def main(self):
        while True:
            choice = input("University System: (A)dmin, (S)tudent, or X : ").strip().lower()
            if choice == "a":
                self.admin_menu()
            elif choice == "s":
                self.student_menu()
            elif choice == "x":
                print("Thank You")
                break

    # ---------- student system ----------
    def student_menu(self):
        while True:
            choice = input(TAB + "Student System (l/r/x): ").strip().lower()
            if choice == "l":
                student = Student()
                if student.login(self.db):
                    self.course_menu(student)
            elif choice == "r":
                Student().register(self.db)
            elif choice == "x":
                break

    def course_menu(self, student):
        while True:
            choice = input(TAB + "Student Course Menu (c/e/r/s/x): ").strip().lower()
            if choice == "c":
                student.change_password(self.db)
            elif choice == "e":
                student.enrol_subject(self.db)
            elif choice == "r":
                student.remove_subject(self.db)
            elif choice == "s":
                student.view_enrolment()
            elif choice == "x":
                break

    # ---------- admin system ----------
    def admin_menu(self):
        admin = Admin(self.db)
        while True:
            choice = input(TAB + "Admin System (c/g/p/r/s/x): ").strip().lower()
            if choice == "c":
                admin.clear_database()
            elif choice == "g":
                admin.group_students()
            elif choice == "p":
                admin.partition_students()
            elif choice == "r":
                admin.remove_student()
            elif choice == "s":
                admin.show_students()
            elif choice == "x":
                break
