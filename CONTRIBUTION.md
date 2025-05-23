## 1. Ветки и работа с Git

### Основные ветки

- `master` — стабильный код для продакшена
- `dev` — ветка для интеграции новых функций и исправлений

---

### Создание и использование веток

- Для работы создавать новые ветки с префиксами от ветки dev:
  - `feature/имя_функции` — новые возможности
  - `bugfix/описание` — исправление багов
  - `docs/описание` — изменения в документации (.md файлы)

- Никогда не работай напрямую в ветках `main` и `dev`

---

### Как работать с ветками

1. **Создание новой ветки:**

   - В правом нижнем углу PyCharm кликни на название текущей ветки (например, `master`).
   - Выбери **New Branch**.
   - Введи имя ветки (например, `feature/login`).
   - Нажми **Create** — PyCharm переключится на новую ветку.

2. **Переключение между ветками:**

   - Кликни пкм на название ветки.
   - Нажми **Checkout**.

3. **Коммит изменений:**

   - После изменений нажми **Commit** (кнопка сверху слева или Ctrl+K).
   - Выбери файлы для коммита, напиши сообщение и нажми **Commit** или **Commit and Push**.

4. **Отправка ветки на GitHub (Push):**

   - Если не сделал пуш сразу, нажми **VCS > Git > Push**.
   - Подтверди отправку ветки на удалённый репозиторий.

5. **Подтягивание изменений (Pull):**

   - Через меню **VCS > Git > Pull** подтяни обновления из удалённого репозитория (например, из `origin/dev`).

---

### Создание Pull Request (PR)

- После пуша ветки на GitHub:
  - Открой репозиторий в браузере.
  - GitHub предложит создать PR.
  - Заполни описание и создай PR в ветку `dev` (скажи, что новый PR готов команде).

---

## 2. Правила коммитов

- Пиши короткие, понятные сообщения

- Используй глаголы в настоящем или прошедшем времени.

---

## 3. Работа с ветками для документации

- Изменения в `.md` файлах делай в ветках с префиксом `docs/`.
- Такие изменения тоже мержь в `dev` и потом в `main`.

---

## 4. Форматирование кода

- Backend: придерживайся PEP8.
- Frontend: следуй eslint-конфигурации проекта.
- Используй норм наименование переменных.

---

## 5. Работа с конфликтами

- Если возникают конфликты при слиянии — решай их аккуратно.
- При необходимости консультируйся с коллегами.

---

## 6. Помощь и вопросы

- Если что-то непонятно — пиши в командный чат или ответственному за часть проекта.
