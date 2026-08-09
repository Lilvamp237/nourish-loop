# NourishLoop

A closed-loop, human-in-the-loop decision-support platform for nutritious, affordable, and low-waste school meal planning in Sri Lanka.

NourishLoop predicts daily meal demand, optimises recommendations against nutrition and budget constraints, and learns from what actually happened — attendance, consumption, leftovers — to improve the next recommendation. A human always reviews, approves, modifies, or rejects the AI's suggestion before it is finalised.

---

## Why two dashboards?

The platform serves two roles with different responsibilities:

| | **Meal Planner** | **Coordinator** |
|---|---|---|
| Job | Day-to-day operator: review AI-generated plans, approve or adjust, and log meal outcomes | Oversight: track nutrition, cost, and waste trends across the term |
| Pages | Today · Meal Plan · Feedback | Overview · Demand Forecast · Analytics |

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
State & ML layer (state.py · demand model · optimiser)
```

- **Frontend** — Next.js (App Router) + React + TypeScript + Tailwind CSS + shadcn/ui + Recharts
- **Backend** — FastAPI serving predictions and optimised meal plans
- **Feedback loop** — consumption data submitted after each meal updates demand model weights via exponential moving average, so each recommendation improves over time

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

API available at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:3000`. Set the backend URL in `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Open it

Go to `http://localhost:3000` and select your role — **Meal Planner** or **Coordinator**.

---

## Project structure

```
nourish-loop/
├── backend/
│   ├── main.py                 # FastAPI app, CORS, router registration
│   ├── state.py                # Feedback state and model weight updates
│   └── routers/
│       ├── overview.py         # GET  /api/overview
│       ├── forecast.py         # GET  /api/forecast
│       ├── plans.py            # POST /api/plans/generate  (+ approve/reject/modify)
│       ├── feedback.py         # POST /api/feedback  (+ retrain)
│       ├── analytics.py        # GET  /api/analytics
│       └── simulation.py       # GET  /api/simulation/timelapse
│
└── frontend/
    └── src/
        ├── app/
        │   ├── page.tsx                    # Role-selection landing page
        │   └── dashboard/
        │       ├── planner/                # Meal Planner views
        │       └── coordinator/            # Coordinator views
        ├── components/
        │   ├── DashboardShell.tsx          # Shared sidebar shell, role-aware
        │   ├── TimelapseDemo.tsx           # Loop-learning replay animation
        │   └── charts/                     # Recharts wrappers
        └── lib/
            ├── api.ts                      # Typed fetch client
            └── types.ts                    # Shared TypeScript interfaces
```

---

## Data sources

- **Sri Lankan Food Composition Table** — Medical Research Institute (2011), nutritional values per 100 g
- **Department of Census & Statistics** — weekly retail price bulletin for ingredient costing
- **Ministry of Education** — school meal guidelines for nutritional targets and meal structure

---

## License

Apache 2.0 — see [LICENSE](LICENSE).
