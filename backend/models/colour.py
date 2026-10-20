import os
import sys

# the colours used by the sample output in the brief
CYAN = "\033[96m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
RESET = "\033[0m"


def _supported():
    # piped output and NO_COLOR get plain text, so nothing can leak escape codes
    if os.environ.get("NO_COLOR") is not None:
        return False
    if not sys.stdout.isatty():
        return False
    if os.name == "nt":
        # ask the Windows console to interpret escape codes
        try:
            import ctypes
            handle = ctypes.windll.kernel32.GetStdHandle(-11)
            mode = ctypes.c_ulong()
            ctypes.windll.kernel32.GetConsoleMode(handle, ctypes.byref(mode))
            ctypes.windll.kernel32.SetConsoleMode(handle, mode.value | 0x0004)
        except Exception:
            return False
    return True


ENABLED = _supported()


def paint(colour, text):
    if not ENABLED:
        return text
    return colour + text + RESET


def menu(text):
    return paint(CYAN, text)


def title(text):
    return paint(GREEN, text)


def note(text):
    return paint(YELLOW, text)


def alert(text):
    return paint(RED, text)
