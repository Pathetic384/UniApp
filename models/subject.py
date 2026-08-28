import random

from models.grade import Grade


class Subject:
    def __init__(self, code=None, mark=None):
        if code is None:
            code = self.generate_id()
        if mark is None:
            mark = self.generate_mark()
        self.code = code                 # a number from 1 to 999
        self.mark = mark                 # a number from 25 to 100
        self.grade = self.calculate_grade()   # a Grade value

    def generate_id(self):
        return random.randint(1, 999)

    def generate_mark(self):
        return random.randint(25, 100)

    def calculate_grade(self):
        return Grade.from_mark(self.mark)
