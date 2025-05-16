import pandas as pd
import os
import rarfile


def preprocess_log(log_text: str) -> str:
    ...


def parse_files_to_dataframe(upload_dir: str) -> pd.DataFrame:
    entries = []

    for filename in os.listdir(upload_dir):
        path = os.path.join(upload_dir, filename)

        if filename.endswith(".txt"):
            with open(path, "r", encoding="utf-8", errors="ignore") as f:
                log = preprocess_log(f.read())
                entries.append({
                    "filename": filename,
                    "error": log
                })
        elif filename.endswith(".rar"):
            with rarfile.RarFile(path) as archive:
                for member in archive.infolist():
                    if member.filename.endswith(".txt"):
                        with archive.open(member) as file:
                            entries.append({
                                "filename": f"{filename}::{member.filename}",
                                "error": file.read().decode("utf-8", errors="ignore")
                            })
    return pd.DataFrame(entries)
