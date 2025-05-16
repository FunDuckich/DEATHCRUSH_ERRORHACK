import aiohttp
from fastapi import APIRouter, HTTPException
from typing import List
from pathlib import Path

from pydantic import BaseModel

from services import preprocessing, clustering, postprocessing

r = APIRouter()

DOWNLOAD_DIR = Path("logs")
EXTERNAL_API = "https://rdb.altlinux.org/api/export/beehive/ftbfs"
BRANCH = "sisyphus"


class ErrorEntry(BaseModel):
    filename: str
    error: str


class ClusterGroup(BaseModel):
    cluster: int
    files: List[ErrorEntry]


@r.get("/analyze", response_model=List[ClusterGroup])
async def init_analyzer():
    async with aiohttp.ClientSession() as session:
        async with session.get(EXTERNAL_API, params={"branch": BRANCH}) as resp:
            if resp.status != 200:
                raise HTTPException(status_code=404, detail="External API returned an error")
            data = await resp.json()

        ftbfs = data.get("ftbfs", [])
        logs_texts = []

        for entry in ftbfs:
            name = entry.get("name")
            url = entry.get("url")
            if not name or not url:
                continue
            try:
                async with session.get(url) as log_resp:
                    if log_resp.status == 200:
                        text = await log_resp.text()
                        logs_texts.append({
                            "filename": name,
                            "error": text
                        })
            except Exception:
                continue

        if not logs_texts:
            raise HTTPException(status_code=400, detail="Нет валидных логов для анализа")

        df = preprocessing.parse_logs_from_memory(logs_texts)
        clustered_df = clustering.cluster(df)
        result = postprocessing.group_by_cluster(clustered_df)

        return result
