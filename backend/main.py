import sys

from cliuniapp import CLIUniApp

sys.stdin.reconfigure(encoding="utf-8", errors="replace")
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

app = CLIUniApp()
app.main()
