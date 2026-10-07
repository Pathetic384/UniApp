import sys

from cliuniapp import CLIUniApp

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

app = CLIUniApp()
app.main()
