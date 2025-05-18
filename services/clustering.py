import numpy as np
import pandas as pd
from bertopic import BERTopic

model = BERTopic.load("services/model")


def cluster(df: pd.DataFrame) -> pd.DataFrame:
    clusters, probs = model.transform(df["error"])
    clusters_info = model.get_topic_info()[["Topic", "Name"]]
    clusters_names_map = dict(zip(clusters_info["Topic"], clusters_info["Name"]))
    topic_names = [clusters_names_map.get(topic, "Unknown") for topic in clusters]
    df["cluster"] = topic_names

    return df
