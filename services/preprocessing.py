import pandas as pd
import re
from typing import List, Dict


class LogAnalyzer:
    def __init__(self):
        # Расширенные паттерны для ошибок
        self.error_patterns = re.compile(
            r'(error:|failed\b|undefined reference|cannot find|No such file|exited with status|\bERROR\b|'
            r'make\[\d+]: \*\*\*|CMake Error|compilation terminated|implicit declaration|incompatible pointer type|'
            r'Bad exit status|missing:.*|illegal at document level)',
            re.IGNORECASE
        )
        # Паттерны для остановки захвата
        self.stop_patterns = re.compile(
            r'^(<\d+>|\[\d+]|\+ exit|\+ echo|Wrote:|Installing|Building|make\[\d+]: (Entering|Leaving) directory|'
            r'Command exited with non-zero status|RPM build errors:)'
        )
        # Фильтр шума
        self.noise_patterns = re.compile(
            r'(installed|added|found|skipped|done|warning:|\s*PASS:|\s*SKIP:|Problem opening /proc/meminfo|'
            r'\d+\.\d+user \d+\.\d+system|\d+inputs\+)',
            re.IGNORECASE
        )

    def preprocess_log(self, log: str) -> str:
        """
        Препроцессинг логов для извлечения информативных ошибок в виде одной строки.

        Args:
            log (str): Текст лога для обработки.

        Returns:
            str: Извлеченные ошибки, объединенные двойными переносами строк.
        """
        lines = log.split('\n')
        errors = []
        current_error = []
        in_error_block = False

        for line in lines:
            # Нормализация: замена уникальных идентификаторов и путей
            normalized_line = re.sub(r'/usr/src/tmp/rpm-tmp\.\d+', '/usr/src/tmp/rpm-tmp.XXXXX', line.strip())
            normalized_line = re.sub(r'CMakeLists\.txt:\d+', 'CMakeLists.txt:LINE', normalized_line)
            normalized_line = re.sub(r' \d+ \| ', ' LINE | ', normalized_line)

            # Проверка на стоп-сигналы
            if self.stop_patterns.search(normalized_line):
                if current_error:
                    errors.append("\n".join(current_error))
                    current_error = []
                in_error_block = False
                continue

            # Проверка на ошибку
            if self.error_patterns.search(normalized_line) and not self.noise_patterns.search(normalized_line):
                in_error_block = True
                current_error.append(normalized_line)
            elif in_error_block:
                # Продолжаем захватывать контекст, если строка не шумовая
                if not self.noise_patterns.search(normalized_line):
                    current_error.append(normalized_line)
                else:
                    # Завершаем блок ошибки
                    in_error_block = False
                    if current_error:
                        errors.append("\n".join(current_error))
                        current_error = []

        # Добавляем последнюю ошибку
        if current_error:
            errors.append("\n".join(current_error))

        # Дедупликация ошибок внутри лога
        unique_errors = []
        seen = set()
        for error in errors:
            error_key = error.lower().replace('line', '')  # Игнорируем регистр и номера строк
            if error_key and error_key not in seen:
                seen.add(error_key)
                unique_errors.append(error)

        # Объединяем ошибки в одну строку
        return "\n\n".join([err for err in unique_errors if err.strip()]) if unique_errors else ""


def parse_logs_from_memory(logs: List[Dict[str, str]]) -> pd.DataFrame:
    analyzer = LogAnalyzer()
    entries = []
    for item in logs:
        cleaned = analyzer.preprocess_log(item["error"])
        entries.append({
            "filename": item["filename"], "hash": item["hash"], "epoch": item["epoch"],
            "version": item["version"], "release": item["release"], "arch": item["arch"],
            "updated": item["updated"], "ftbfs_since": item["ftbfs_since"], "url": item["url"],
            "error": cleaned
        })
    return pd.DataFrame(entries)
