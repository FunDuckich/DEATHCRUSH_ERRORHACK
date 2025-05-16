import pandas as pd
import os
import rarfile
import re


class LogAnalyzer:
    def __init__(self):
        # Регулярное выражение для поиска ошибок
        self.error_regex = re.compile(
            r'(error|failed|fatal|abort|crash|cannot|undefined reference)',
            re.IGNORECASE
        )

        # Фильтр ложных срабатываний
        self.noise_filter = re.compile(
            r'installed|added|found|skipped|done|warning',
            re.IGNORECASE
        )

        # Настройки контекста
        self.context_before = 2  # Чанков до ошибки
        self.context_after = 5  # Чанков после ошибки

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
                # Определяем границы контекста
                start = max(0, i - self.context_before)
                end = min(len(chunks), i + self.context_after + 1)

                # Собираем контекст
                context = chunks[start:end]
                error_blocks.append(" ".join(context).strip())

                # Пропускаем обработанные чанки
                i = end
            else:
                i += 1

        return "\n".join(error_blocks) if error_blocks else ""


def parse_files_to_dataframe(upload_dir: str) -> pd.DataFrame:
    entries = []
    analyzer = LogAnalyzer()
    for filename in os.listdir(upload_dir):
        path = os.path.join(upload_dir, filename)

        if filename.endswith(".txt"):
            with open(path, "r", encoding="utf-8", errors="ignore") as f:
                log = analyzer.preprocess_log(f.read())
                print(log)
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


analyzer = LogAnalyzer()
print(analyzer.preprocess_log(""))
