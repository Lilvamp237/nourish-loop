from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import overview, forecast, plans, feedback, analytics, simulation

app = FastAPI(title="NourishLoop API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    # Next.js auto-bumps to 3001/3002/etc. when 3000 is already taken (common on
    # Windows dev machines), so match any localhost/127.0.0.1 port rather than a
    # single hardcoded one — otherwise the frontend silently CORS-fails on
    # whichever machine has something else already listening on 3000.
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(overview.router, prefix="/api")
app.include_router(forecast.router, prefix="/api")
app.include_router(plans.router, prefix="/api")
app.include_router(feedback.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(simulation.router, prefix="/api")


@app.get("/api/health")
def health():
    return {"status": "ok"}
