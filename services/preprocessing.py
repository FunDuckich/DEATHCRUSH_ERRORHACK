import pandas as pd
from typing import List, Dict


def preprocess_log(log_text: str) -> str:
    ...


def parse_logs_from_memory(logs: List[Dict[str, str]]) -> pd.DataFrame:
    entries = []
    for item in logs:
        cleaned = preprocess_log(item["error"])
        entries.append({
            "filename": item["filename"],
            "error": cleaned
        })
    return pd.DataFrame(entries)
