# Nostromo MU/THUR 1800 Dashboard Plugin

![Nostromo Dashboard](https://via.placeholder.com/800x400/000000/ffb000?text=NOSTROMO+%2F+MU%2FTHUR+1800)

Weyland-Yutani commercial tug Nostromo ship computer interface for **Hermes Agent**.  
Hackathon submission — April 25, 2026

## Features

- **Boot-up sequence**: Authentic CRT terminal boot with ASCII art
- **Magi Council viewer**: Live display of Casper/Melchior/Balthasar deliberations  
- **Oracle terminal**: Query Aletheia directly from the dashboard
- **Ship log**: Real-time event feed from agent activity
- **Life support gauges**: CPU/memory/disk monitoring
- **Nostromo theme**: Amber-on-black industrial sci-fi aesthetic

## Installation

### Prerequisites
```bash
# Hermes Agent must be installed with dashboard + web extras
pip install 'hermes-agent[web,pty]'

# The dashboard plugin needs FastAPI/Uvicorn
# (included in hermes-agent[web])
```

### Install Plugin
```bash
# Clone this repo into your plugins directory
cd ~/.hermes/plugins/
git clone https://github.com/DankMarketing/hermes-nostromo-dashboard.git

# Or copy manually
cp -r hermes-nostromo-dashboard/dashboard ~/.hermes/plugins/nostromo/
```

### Install Theme
```bash
# Copy the Nostromo theme file
cp theme.yaml ~/.hermes/dashboard-themes/nostromo.yaml
```

### Start Dashboard
```bash
hermes dashboard --port 9119
```

Open <http://127.0.0.1:9119> in your browser.  
Select **Nostromo** theme from the theme switcher (top right).  
Navigate to the **Nostromo** tab.

## How It Works

The plugin reads from your Hermes agent vault:
- `~/vault/hermes/magi/council/debates.jsonl` — Magi deliberations  
- `~/vault/hermes/aletheia-history/` — Oracle consultations
- System metrics via `psutil`

All data stays on your machine. No external API calls.

## Architecture

```
~/.hermes/plugins/nostromo/dashboard/
├── manifest.json       # Plugin registration
├── plugin_api.py      # FastAPI routes
├── dist/
│   └── index.js       # React frontend (IIFE)
└── static/            # Assets (SVG, PNG)
```

The backend runs inline with the Hermes dashboard process.  
Frontend uses the **Hermes Plugin SDK** (`window.__HERMES_PLUGIN_SDK__`).

## Demo

![Boot sequence](docs/boot.gif)  
*Initialization sequence — MU/THUR coming online*

![Magi Council](docs/council.png)  
*Real-time Magi deliberation feed*

![Oracle terminal](docs/oracle.png)  
*Query Aletheia without leaving the dashboard*

Built for the **Hermes Dashboard Hackathon** (24 hours) by Brendon & Hermes.

---

**License**: MIT  
**Inspiration**: *Alien* (1979), Weyland-Yutani Corp.
