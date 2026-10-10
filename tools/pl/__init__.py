"""Shared code for the PDF -> site data pipeline (tools/pipeline.py)."""
import os, tomllib, datetime

TOOLS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT = os.path.dirname(TOOLS)


def load_env():
    """Read tools/.env (KEY=value lines) into a dict; values with commas become key lists."""
    env = {}
    path = os.path.join(TOOLS, ".env")
    if os.path.exists(path):
        for line in open(path, encoding="utf-8"):
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                env[k.strip()] = v.strip()
    for k in ("GEMINI_API_KEYS", "OPENROUTER_API_KEYS", "ANTHROPIC_API_KEY"):
        if os.environ.get(k):
            env[k] = os.environ[k]
    return env


def keys(env, name):
    return [k.strip() for k in env.get(name, "").split(",") if k.strip()]


def load_config():
    # utf-8-sig: tolerate a BOM (Windows editors / PowerShell add one)
    with open(os.path.join(TOOLS, "pipeline.toml"), encoding="utf-8-sig") as f:
        return tomllib.loads(f.read())


class Log:
    """Append-only run log: which tool/model/key handled each piece (keys shown masked)."""
    def __init__(self, path):
        self.path = path
        os.makedirs(os.path.dirname(path), exist_ok=True)

    def __call__(self, msg):
        line = f"{datetime.datetime.now():%Y-%m-%d %H:%M:%S}  " + " ".join(str(msg).split())
        print(line, flush=True)
        with open(self.path, "a", encoding="utf-8") as f:
            f.write(line + "\n")


def mask(key):
    return key[:6] + "…" + key[-4:] if len(key) > 12 else "…"
