from fastapi import FastAPI
from backend.routers.test import r as test_router

app = FastAPI()
app.include_router(test_router)
