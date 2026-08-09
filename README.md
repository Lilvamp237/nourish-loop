# NourishLoop

A closed-loop, human-in-the-loop decision-support platform for nutritious, affordable, and low-waste school meal planning in Sri Lanka.

NourishLoop doesn't stop at generating a menu. It predicts demand, optimises meal recommendations against nutrition and budget constraints, and then **learns from what actually happened** — attendance, consumption, leftovers — to improve the next recommendation. A human (the meal planner) always reviews, approves, modifies, or rejects the AI's suggestion before it ships.

> **Status:** Working prototype with a fully interactive frontend and a mock FastAPI backend that simulates the closed feedback loop in memory. The real ML models (demand forecasting, constrained optimisation) are the next phase — see [Roadmap](#roadmap).

---

## Why two dashboards?

The platform serves two different people who do two different jobs, so it ships as two different apps behind one login screen:

| | **Meal Planner** (`/dashboard/planner`) | **Coordinator** (`/dashboard/coordinator`) |
|---|---|---|
| Job | Day-to-day operator: decide what to cook, act on the AI's plan, log outcomes | Oversight: track nutrition, cost, and waste trends over time |
| Pages | **Today** — daily status + quick actions<br>**Meal Plan** — generate, approve, modify, or reject a recommendation<br>**Feedback** — log actual consumption & leftovers | **Overview** — KPIs, hero impact stat, live loop simulation<br>**Forecast** — demand deep-dive with SHAP explainability<br>**Analytics** — full historical trends, savings, model audit |

Each role has its own sidebar showing only what it needs, with a one-click "Switch view" link to jump to the other role during a walkthrough.

---

## Architecture

```
Browser
   │
   ▼
Next.js (App Router, TypeScript, Tailwind, Recharts)  ── port 3000
   │  REST / JSON
   ▼
FastAPI (Python)                                        ── port 8000
   │
   ▼
In-memory simulation state (state.py)
```

- **Frontend** — Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui + Recharts.
- **Backend** — FastAPI serving mock data today; designed to be swapped for real ML inference (scikit-learn/LightGBM demand model + PuLP optimiser) without changing the frontend contract.
- **State** — `backend/state.py` holds an in-memory store standing in for a database. It's what makes the demo *real*: feedback submissions actually update consumption rates, which actually change what the optimiser recommends next time.

---

## Getting started

### Prerequisites
- Python 3.11+
- Node.js 18+

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Runs at `http://localhost:8000`. Interactive API docs at `http://localhost:8000/docs`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:3000`. Reads the backend URL from `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Open it

Go to `http://localhost:3000` and pick a role — **I am the Meal Planner** or **I am the Coordinator**.

---

## The closed loop, demonstrated

This is the core pitch, and it's live in the mock backend — not just described in a slide:

1. Go to **Meal Plan**, generate a plan for a date. Note the top-ranked meal and its "waste risk" badge.
2. Go to **Feedback**, log 2–3 submissions for that same meal with heavy leftovers (e.g. consumed well below what was prepared).
3. Go back to **Meal Plan** and regenerate. The meal's consumption rate has dropped (exponential moving average, α = 0.3), its risk badge flips toward "High," and a cheaper-or-safer alternative takes over rank #1 — with an explanation citing the updated rate.
4. On **Overview**, hit **"Play Simulation"** to watch a compressed 9-week version of this same learning process, with realistic ups and downs (a price spike, an exam-week attendance dip, two model retrains) rather than a smooth fake line.

Other things worth clicking:
- **Approve / Modify Servings / Reject & Show Alternative** on the top meal in Meal Plan — the human-in-the-loop control that keeps a person accountable for the final call.
- **Retrain** button on Feedback, once 5+ new records are logged — bumps the model version and MAE, which is reflected live in the Coordinator's Forecast and Analytics pages.

---

## Project structure

```
nourish-loop/
├── backend/
│   ├── main.py                 # FastAPI app, CORS, router registration
│   ├── state.py                # In-memory simulation state (consumption rates, feedback log, plan status)
│   └── routers/
│       ├── overview.py         # GET  /api/overview        — Coordinator landing KPIs
│       ├── forecast.py         # GET  /api/forecast         — 5-day demand forecast + SHAP factors
│       ├── plans.py            # POST /api/plans/generate   — meal recommendation + approve/reject/modify
│       ├── feedback.py         # POST /api/feedback         — consumption/leftover logging + retrain
│       ├── analytics.py        # GET  /api/analytics        — historical trends
│       └── simulation.py       # GET  /api/simulation/timelapse — 9-week loop-learning replay
│
└── frontend/
    └── src/
        ├── app/
        │   ├── page.tsx                    # Role-selection landing page
        │   └── dashboard/
        │       ├── planner/                # Meal Planner: today, recommendations, feedback
        │       └── coordinator/            # Coordinator: overview, forecast, analytics
        ├── components/
        │   ├── DashboardShell.tsx          # Shared sidebar shell, parametrised by role
        │   ├── TimelapseDemo.tsx           # 9-week animated loop-learning replay
        │   ├── charts/                     # Recharts wrappers (attendance, waste, nutrition, SHAP, etc.)
        │   └── ui/                         # shadcn/ui primitives
        └── lib/
            ├── api.ts                      # Typed fetch client for the FastAPI backend
            └── types.ts                    # Shared TypeScript interfaces matching the API responses
```

---

## Data sources (target, for the production version)

- **Sri Lankan Food Composition Table** (Medical Research Institute, 2011) — nutritional values per 100g
- **Department of Census & Statistics** weekly retail price bulletin — ingredient pricing
- **Ministry of Education** school meal guidelines — nutritional targets and meal structure

The current prototype hard-codes representative values from these sources; the roadmap below covers wiring up live ingestion.

---

## Roadmap

**Phase 2 — real models, replacing the mock backend one piece at a time:**
- PostgreSQL schema (schools, foods, ingredients, retail prices, meal plans, feedback logs, model runs)
- Demand forecasting: gradient-boosted trees (scikit-learn/LightGBM) trained on attendance history, with SHAP for the explainability layer already wired into the UI
- Meal optimisation: PuLP/CBC constrained solver replacing the hand-authored candidate lists in `plans.py`
- Real ingestion pipelines for the Food Composition Table and weekly price bulletins
- Persistent feedback loop (currently in-memory, resets on server restart)

**Beyond the hackathon:**
- Multi-school / district rollout
- Sinhala and Tamil interfaces
- Offline data entry for low-connectivity schools
- Image-assisted plate-leftover estimation

---

## License

Apache 2.0 — see [LICENSE](LICENSE).
