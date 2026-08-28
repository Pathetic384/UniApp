from enum import Enum


class Grade(Enum):
    Z = "Z"
    P = "P"
    C = "C"
    D = "D"
    HD = "HD"

    @staticmethod
    def from_mark(mark):
        if mark < 50:
            return Grade.Z
        elif mark < 65:
            return Grade.P
        elif mark < 75:
            return Grade.C
        elif mark < 85:
            return Grade.D
        else:
            return Grade.HD
