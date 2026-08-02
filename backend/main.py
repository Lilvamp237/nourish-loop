from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import overview, forecast, plans, feedback, analytics

app = FastAPI(title="NourishLoop API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(overview.router, prefix="/api")
app.include_router(forecast.router, prefix="/api")
app.include_router(plans.router, prefix="/api")
app.include_router(feedback.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")


@app.get("/api/health")
def health():
    return {"status": "ok"}
