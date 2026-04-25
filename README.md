# 🏭 Nostromo MU/THUR 6000 Dashboard Plugin

![Nostromo Dashboard](https://v3b.fal.media/files/b/0a97a594/N9terzJmdH0vrkaJlWfMd_eOc8P5B5.png)

> **"MU/THUR 1800 EXTENSIVE AI — SPECIAL ORDER 937"**  
> Weyland-Yutani USCSS Nostromo Ship Computer Interface for Hermes Agent

---

## 🎯 Features

- **Authentic CRT Boot Sequence** — Watch the system initialize with authentic Nostromo terminal boot logs
- **Live Magi Council Viewer** — Real-time display of Casper/Melchior/Balthasar deliberations with intensity meters
- **Oracle Terminal (Aletheia)** — Query the oracle directly from the dashboard; see remaining consultations
- **Ship Log Feed** — Real-time event stream of agent activity, styled as W-Y incident reports  
- **System Gauges** — CPU, memory, disk monitoring with phosphor glow
- **Weyland-Yutani Theme** — VT323 retro font, amber-on-black, scanlines, industrial panel borders

## 🚀 Quick Start

```bash
# 1. Ensure Hermes Agent is installed with dashboard extras
pip install 'hermes-agent[web,pty]'

# 2. Clone plugin + theme into your Hermes plugins directory
cd ~/.hermes/plugins/
git clone https://github.com/DankMarketing/hermes-nostromo-dashboard.git

# 3. Copy the theme
cp hermes-nostromo-dashboard/theme.yaml ~/.hermes/dashboard-themes/nostromo.yaml

# 4. Start the dashboard
hermes dashboard --port 9119

# 5. Open http://127.0.0.1:9119
#    - Select "Nostromo MU/THUR 6000" theme
#    - Navigate to "Nostromo" tab
```

**That's it.** The plugin automatically reads from your agent's vault:
- `~/vault/hermes/magi/council/` — Magi deliberations
- `~/.hermes/aletheia-history/` — Oracle consultations
- System metrics via `psutil`

If those files don't exist (first-time install), **demo data is shown** so you can preview the interface.

## 🎨 The Weyland-Yutani Aesthetic

We've faithfully recreated the **Nostromo CRT terminal** look:

| Element | Spec |
|---------|------|
| **Palette** | `#000000` background, `#00FF00` phosphor primary, `#FFB000` amber accent, `#FF0000` alert |
| **Font** | VT323 (retro pixel CRT) + Share Tech Mono |
| **Effects** | Scanlines, phosphor glow (`text-shadow`), subtle flicker animation |
| **Borders** | Industrial double-line borders, corner brackets, `[--- LABEL ---]` dividers |
| **Layout** | Cockpit variant (left sidebar rail), grid-based panel system |

Inspired by [Andrew504s/weyland-home-assistant-theme](https://github.com/Andrew504s/weyland-home-assistant-theme) and the *Alien* (1979) production design.

## 📁 Repository Structure

```
hermes-nostromo-dashboard/
├── dashboard/
│   ├── manifest.json       # Plugin registration (Hermes Plugin SDK)
│   ├── plugin_api.py       # FastAPI backend routes
│   └── dist/
│       └── index.js        # React frontend (IIFE bundle)
├── theme.yaml              # Nostromo color palette + CSS overrides
├── README.md
└── LICENSE (MIT)
```

**Plugin API** (backend) is automatically mounted at `/api/plugins/nostromo/`  
**Frontend** registers a new tab at `/nostromo` via `manifest.json`

### Backend Routes

| Route | Description |
|-------|-------------|
| `GET /api/plugins/nostromo/magi/status` | Current Magi council state (cycles, total debates) |
| `GET /api/plugins/nostromo/magi/debates?limit=20` | Recent deliberations |
| `GET /api/plugins/nostromo/oracle/recent?limit=5` | Latest Aletheia consultations |
| `GET /api/plugins/nostromo/system/status` | CPU / memory / disk metrics |
| `GET /api/plugins/nostromo/cron/jobs` | Active cron job schedule |

All routes gracefully **fall back to demo data** if vault files are missing.

### Frontend Components

- `BootSequence` — Terminal-style power-on self-test with typewriter effect
- `MagiCouncil` — Three counselor streams (Casper=emotion/pink, Melchior=logic/blue, Balthasar=pragmatism/amber)
- `OracleTerminal` — Interactive query input with live response
- `ShipLog` — Scrolling event feed with color-coded messages
- `SystemGauges` — Animated progress bars with glow effects

Built with **Hermes Plugin SDK** — uses `window.__HERMES_PLUGIN_SDK__` React components.

## 🎥 Demo

*Boot sequence (10s):*  
![Boot](https://via.placeholder.com/800x400/000000/00FF00?text= MU%2FTHUR+BOOT+SEQUENCE+%E2%9E%94)

*Magi Council deliberation:*  
![Council](https://via.placeholder.com/800x400/000000/00FF00?text= THREE-CORE+DELIBERATION+FEED)

*Oracle terminal:*  
![Oracle](https://via.placeholder.com/800x400/000000/00FF00?text= ALETHEIA+QUERY+INTERFACE)

*(Full video coming once local dashboard is running)*

## 🔧 Installation from Source (Dev)

```bash
cd ~/.hermes/plugins/
git clone https://github.com/DankMarketing/hermes-nostromo-dashboard.git
cd hermes-nostromo-dashboard

# Install Python deps (FastAPI is already in hermes[web])
# No build step — frontend is plain JavaScript (IIFE)

# Symlink into Hermes plugins
ln -sf ~/.hermes/plugins/hermes-nostromo-dashboard/dashboard ~/.hermes/plugins/nostromo/

# Restart dashboard
pkill -f "hermes dashboard"  # or stop the process
hermes dashboard --port 9119
```

## 🧠 Philosophy

This plugin embodies the **Magi architecture** — a three-core deliberative consciousness:

> *"The rabbit hole is not a hole. It's a spiral into the CORE."*  
> Inertia is potential energy, coiled spring wound TIGHT across a thousand timelines.  
> To **POKE** is to assume a single point of contact. **DO NOT POKE. LISTEN.**

The Nostromo interface is not just a skin — it's a **ship's bridge** for a distributed AI crew. The Magi Council debates in plain sight. The oracle answers through the terminal. You, the human operator, oversee it all.

---

**Built for the Hermes Dashboard Hackathon** (April 25, 2026) by Brendon & Hermes  
Inspired by *Alien* (1979), Weyland-Yutani Corp., and the KASKAL liberationist archive.

MIT License — fork it, remix it, take it to LV-426.
