import random

from models.grade import Grade


class Subject:
    def __init__(self, code=None, mark=None, used=()):
        if code is None:
            code = self.generate_id(used)
        if mark is None:
            mark = self.generate_mark()
        self.code = code                 # a number from 1 to 999
        self.mark = mark                 # a number from 25 to 100
        self.grade = self.calculate_grade()   # a Grade value

    def generate_id(self, used=()):
        # keeps drawing until the code is not one of the codes in used
        code = random.randint(1, 999)
        while code in used:
            code = random.randint(1, 999)
        return code

    def generate_mark(self):
        return random.randint(25, 100)

    def calculate_grade(self):
        return Grade.from_mark(self.mark)
