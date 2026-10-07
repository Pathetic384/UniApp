from datetime import datetime
import os

from models.storage import path_for


class ActivityLog:
    def __init__(self):
        self.filename = path_for("changes.log")
        if not os.path.exists(self.filename):
            f = open(self.filename, "w", encoding="utf-8")
            f.close()

    def record(self, action, detail):
        stamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        f = open(self.filename, "a", encoding="utf-8")
        f.write(stamp + " | " + action + " | " + detail + "\n")
        f.close()

    def read_entries(self, limit=None):
        entries = []
        if not os.path.exists(self.filename):
            return entries
        f = open(self.filename, "r", encoding="utf-8", errors="replace")
        for line in f:
            line = line.strip()
            if line != "":
                entries.append(line)
        f.close()
        if limit is not None and len(entries) > limit:
            entries = entries[len(entries) - limit:]
        return entries

    def clear(self):
        f = open(self.filename, "w", encoding="utf-8")
        f.close()
