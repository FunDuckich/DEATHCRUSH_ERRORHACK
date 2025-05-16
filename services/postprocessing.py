import pandas as pd
from typing import List, Dict, Any


def group_by_cluster(df: pd.DataFrame) -> List[Dict[str, Any]]:
    grouped: List[Dict[str, Any]] = []

    for cluster_id, group in df.groupby("cluster"):
        files = group[["filename", "error"]].to_dict(orient="records")
        grouped.append({
            "cluster": int(cluster_id),
            "files": files
        })

    return grouped
