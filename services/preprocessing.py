import pandas as pd
import re
from typing import List, Dict


class LogAnalyzer:
    def __init__(self):
        self.error_regex = re.compile(
            r'(error|failed|fatal|abort|crash|cannot|undefined reference)',
            re.IGNORECASE
        )
        self.noise_filter = re.compile(
            r'installed|added|found|skipped|done|warning',
            re.IGNORECASE
        )
        self.context_before = 2
        self.context_after = 5

    def preprocess_log(self, log_line: str) -> str:
        error_blocks = []
        chunks = re.split(r'(\s{2,}|\t)', log_line)

        i = 0
        while i < len(chunks):
            chunk = chunks[i]

            if self.noise_filter.search(chunk):
                i += 1
                continue

            if self.error_regex.search(chunk):
                start = max(0, i - self.context_before)
                end = min(len(chunks), i + self.context_after + 1)
                context = chunks[start:end]
                error_blocks.append(" ".join(context).strip())
                i = end
            else:
                i += 1

        return "\n".join(error_blocks) if error_blocks else ""


def parse_logs_from_memory(logs: List[Dict[str, str]]) -> pd.DataFrame:
    analyzer = LogAnalyzer()
    entries = []
    for item in logs:
        cleaned = analyzer.preprocess_log(item["error"])
        entries.append({
            "filename": item["filename"],
            "error": cleaned
        })
    return pd.DataFrame(entries)
