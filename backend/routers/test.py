from fastapi import APIRouter

r = APIRouter()


@r.get("/test")
async def test():
    return {"message": "Hello World"}
