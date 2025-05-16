from fastapi import APIRouter, UploadFile, File, HTTPException
from services import preprocessing, clustering, postprocessing
from typing import List
from uuid import uuid4
import os
import shutil
from pydantic import BaseModel


class ErrorEntry(BaseModel):
    filename: str
    error: str


class ClusterGroup(BaseModel):
    cluster: int
    files: List[ErrorEntry]


r = APIRouter()

ALLOWED_EXTENSIONS = {".txt", ".rar"}


def is_valid_extension(filename: str) -> bool:
    return any(filename.lower().endswith(ext) for ext in ALLOWED_EXTENSIONS)


@r.post("/analyze", response_model=List[ClusterGroup])
async def analyze(files: List[UploadFile] = File(...)):
    upload_id = str(uuid4())
    upload_dir = f"./uploads/{upload_id}"
    os.makedirs(upload_dir, exist_ok=True)

    try:
        for file in files:
            if not is_valid_extension(file.filename):
                raise HTTPException(
                    status_code=400,
                    detail=f"Недопустимый формат файла: {file.filename}. "
                           f"Разрешены только форматы: {' '.join(ALLOWED_EXTENSIONS)}."
                )
            file_path = os.path.join(upload_dir, file.filename)
            with open(file_path, "wb") as f:
                f.write(await file.read())

        df = preprocessing.parse_files_to_dataframe(upload_dir)
        clustered_df = clustering.cluster(df)
        result = postprocessing.group_by_cluster(clustered_df)
    except Exception as e:
        shutil.rmtree(upload_dir, ignore_errors=True)
        raise e

    shutil.rmtree(upload_dir, ignore_errors=True)

    return result
