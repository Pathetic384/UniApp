import os

PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def path_for(filename):
    return os.path.join(PROJECT_DIR, filename)
