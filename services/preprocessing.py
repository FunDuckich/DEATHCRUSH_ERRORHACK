import pandas as pd
import re
from typing import List, Dict

import re


class LogAnalyzer:
    def __init__(self):
        # Расширенные паттерны для обнаружения ошибок
        self.error_patterns = re.compile(
            r'(^error:|error\b.*\b(failed\b|undefined|cannot find|No such file|'
            r'exited with status|\bERROR\b|failed to|critical|segmentation fault|'
            r'command not found|syntax error|timeout|denied|could not|unable to|'
            r'not supported)|failed\b|undefined reference|cannot find|'
            r'No such file|exited with status|\bERROR\b|'
            r'make\[\d+]: \*\*\*|CMake Error|compilation terminated|'
            r'Bad exit status|missing:.*|illegal at document level|'
            r'traceback|segmentation fault|command not found|syntax error|'
            r'could not|unable to)',
            re.IGNORECASE
        )

        # Паттерны для остановки захвата контекста ошибки
        self.stop_patterns = re.compile(
            r'^(<\d+>|\[\d+]|\+ exit|\+ echo|Wrote:|Installing|Building|'
            r'make\[\d+]: (Entering|Leaving) directory|Command exited with|'
            r'RPM build errors:|OK|PASS|SKIP|\+\+\+|\-\-\-|===|\|\s*ID\s*\||'
            r'\+----|^\s*$|manila CLI is deprecated|^\s*\|.*\|\s*$|'
            r'^\s*\+\-+\+\s*$|^Processing|^Reading|^Updating|^Copying'
            r'^-- The [A-Z]+ compiler|Detecting |Performing Test)',
            re.IGNORECASE
        )
        self.noise_patterns = re.compile(
            r'(installed|added|found|checking|compiling|byteCompiling|skipped|done|'
            r'warning:|\s*PASS:|\s*SKIP:|Problem opening /proc/meminfo|'
            r'\d+\.\d+user \d+\.\d+system|\d+inputs\+|^\s*ok\b|test_.*\.\.\. ok|'
            r'deprecated|equivalent command is|^\s*\|.*\|\s*$|^\s*\+\-+\+\s*$|'
            r'^\s*\+[=-]+\+\s*$|^scan\b|^func:|^writing\b|^mod\b|^running cpan\b|'
            r'buildconf successful|autoreconf|libtoolize|^\s*mod_pod|Generating\b|'
            r'Writing Makefile|mkdir|saving arguments|^running\b|^copying\b|'
            r'^creating\b|^processing\b|^reading\b|^config\.|^configure\b|'
            r'^up-to-date\b|^generating\b|^applying\b'
            r'^\S+/\S+\.(pod|html|gif|png|jpg|cfg|dia)\b)',
            re.IGNORECASE
        )

        # Паттерн для определения табличных данных
        self.table_pattern = re.compile(r'^\s*\+[-=+]+\+.*$|^\s*\|.*\|.*$')

    def preprocess_log(self, log: str) -> str:
        """
        Улучшенный препроцессинг логов с фильтрацией таблиц и устаревших сообщений.
        """
        lines = log.split('\n')
        errors = []
        current_error = []
        in_error_block = False
        in_table = False

        for line in lines:
            # Пропускаем пустые строки
            if not line.strip():
                continue

            # Пропускаем таблицы целиком
            if self.table_pattern.match(line):
                in_table = True
                continue
            elif in_table:
                if not self.table_pattern.match(line):
                    in_table = False
                continue

            # Пропускаем устаревшие сообщения CLI
            if "manila CLI is deprecated" in line:
                continue

            # Нормализация строки
            normalized_line = re.sub(r'/usr/src/tmp/rpm-tmp\.\d+', '/usr/src/tmp/rpm-tmp.XXXXX', line.strip())
            normalized_line = re.sub(r'CMakeLists\.txt:\d+', 'CMakeLists.txt:LINE', normalized_line)
            normalized_line = re.sub(r' \d+ \| ', ' LINE | ', normalized_line)

            # Проверка стоп-сигналов
            if self.stop_patterns.search(normalized_line):
                if current_error:
                    errors.append("\n".join(current_error))
                    current_error = []
                in_error_block = False
                continue

            # Обнаружение ошибок
            if self.error_patterns.search(normalized_line) and not self.noise_patterns.search(normalized_line):
                in_error_block = True
                current_error.append(normalized_line)
            elif in_error_block:
                if not self.noise_patterns.search(normalized_line):
                    current_error.append(normalized_line)
                else:
                    in_error_block = False
                    if current_error:
                        errors.append("\n".join(current_error))
                        current_error = []

        # Добавляем последнюю ошибку
        if current_error:
            errors.append("\n".join(current_error))

        # Дедупликация ошибок
        unique_errors = []
        seen = set()
        for error in errors:
            # Усиленная нормализация для дедупликации
            error_key = re.sub(r'\d+|LINE|\s+', '', error.lower())
            if error_key and error_key not in seen:
                seen.add(error_key)
                unique_errors.append(error)

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
