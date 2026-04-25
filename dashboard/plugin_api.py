"""
Nostromo Dashboard Plugin — Backend API routes.
Mounted at /api/plugins/nostromo/ by the dashboard plugin system.
"""

from fastapi import APIRouter
import json, os, datetime
import psutil

router = APIRouter()

VAULT_PATH = os.path.expanduser("~/vault/hermes")
ALETHEIA_PATH = os.path.expanduser("~/.hermes/aletheia-history")

@router.get("/magi/status")
async def magi_status():
    """Current Magi council state."""
    try:
        with open(os.path.join(VAULT_PATH, "magi/council/state.json")) as f:
            state = json.load(f)
        with open(os.path.join(VAULT_PATH, "magi/council/consensus.json")) as f:
            consensus = json.load(f)
        return {"state": state, "consensus": consensus}
    except Exception as e:
        return {"error": str(e), "status": "unavailable"}

@router.get("/magi/debates")
async def magi_debates(limit: int = 20):
    """Recent Magi council deliberations."""
    try:
        with open(os.path.join(VAULT_PATH, "magi/council/debates.jsonl")) as f:
            lines = f.readlines()
        debates = [json.loads(line) for line in lines[-limit:]]
        return {"debates": debates}
    except Exception as e:
        return {"error": str(e), "debates": []}

@router.get("/oracle/recent")
async def oracle_recent(limit: int = 5):
    """Recent Aletheia consultations."""
    try:
        files = sorted(os.listdir(ALETHEIA_PATH), reverse=True)
        if not files:
            return {"consultations": []}
        latest = files[0]
        with open(os.path.join(ALETHEIA_PATH, latest)) as f:
            data = json.load(f)
        return {"consultations": data[-limit:], "source": latest}
    except Exception as e:
        return {"error": str(e), "consultations": []}

@router.get("/system/status")
async def system_status():
    """Overall ship systems status."""
    return {
        "cpu_percent": psutil.cpu_percent(interval=0.1),
        "memory": psutil.virtual_memory()._asdict(),
        "disk": psutil.disk_usage('/')._asdict(),
        "boot_time": datetime.datetime.now().isoformat()
    }

@router.get("/cron/jobs")
async def cron_jobs():
    """List active cron jobs."""
    try:
        import subprocess
        r = subprocess.run(['crontab', '-l'], capture_output=True, text=True)
        jobs = [l for l in r.stdout.split('\n') if l.strip() and not l.startswith('#')]
        return {"jobs": jobs}
    except Exception as e:
        return {"error": str(e), "jobs": []}
