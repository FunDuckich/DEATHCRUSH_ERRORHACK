import pandas as pd


def cluster(df: pd.DataFrame) -> pd.DataFrame:
    df["cluster"] = "0"
    return df
