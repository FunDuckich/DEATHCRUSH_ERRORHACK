import aiohttp
import asyncio
from fastapi import APIRouter, HTTPException
from typing import List
from pathlib import Path

from pydantic import BaseModel

from services import preprocessing, clustering, postprocessing
import time

r = APIRouter()

DOWNLOAD_DIR = Path("logs")
EXTERNAL_API = "https://rdb.altlinux.org/api/export/beehive/ftbfs"
BRANCH = "sisyphus"


class ErrorEntry(BaseModel):
    filename: str
    error: str


class ClusterGroup(BaseModel):
    cluster: str
    files: List[ErrorEntry]


async def fetch_log(session, url):
    try:
        async with session.get(url) as log_resp:
            if log_resp.status == 200:
                return await log_resp.text()
            return None
    except Exception:
        return None


@r.get("/analyze", response_model=List[ClusterGroup])
async def init_analyzer():
    async with aiohttp.ClientSession() as session:
        start_time = time.time()
        async with session.get(EXTERNAL_API, params={"branch": BRANCH}) as resp:
            if resp.status != 200:
                raise HTTPException(status_code=404, detail="Не удалось спарсить ссылки на логи")
            data = await resp.json()

        ftbfs = data.get("ftbfs", [])
        tasks = []
        for entry in ftbfs:
            name = entry.get("name")
            url = entry.get("url")
            if name and url:
                tasks.append(fetch_log(session, url))

        logs = await asyncio.gather(*tasks)
        logs_texts = [
            {"filename": entry["name"], "error": log_text}
            for entry, log_text in zip(ftbfs, logs) if log_text is not None
        ]

        parse_time = time.time() - start_time
        print(parse_time)
        if not logs_texts:
            raise HTTPException(status_code=400, detail="Нет валидных логов для анализа")
        start_time = time.time()
        df = preprocessing.parse_logs_from_memory(logs_texts)
        preprocessing_time = time.time() - start_time
        print(preprocessing_time)
        clustered_df = clustering.cluster(df)
        result = postprocessing.group_by_cluster(clustered_df)

        return result
