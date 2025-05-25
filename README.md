# Проект команды DEATHCRUSH (Хакатон "ERRORHACK" 16.05 - 18.05)  
Основная задача заключалась в группировке (по сути кластеризации) логов сборки по ошибкам, которые в них содержались.

## Структура проекта
- | backend
    - | routers
      - init.py
    - main.py 
- | frontend
    - | src
      - | components
        - FileUploadPanel.jsx
        - Header.css
        - Header.jsx
        - ThemeSwitcher.css
        - ThemeSwitcher.jsx
      - | pages
        - About.jsx
        - Analyzer.jsx
      - | public
        - index.html
      - | styles
        - About.css
        - Analyzer.css
      - AnalysisContext.jsx
      - App.jsx
      - ThemeContext.jsx
      - index.css
      - main.jsx
    - .gitignore
    - README.md
    - eslint.config.js
    - index.html
    - package-lock.json
    - package.json
    - postcss.config.cjs
    - tailwind.config.js
    - vite.config.js 
- | services
    - clustering.py
    - postprocessing.py
    - prepocessing.py
- .gitignore
- CONTRIBUTION.md
- README.md
- package-lock.json  

## Сборка проекта  
# Бэкенд  
Python 3.11 обязательно (не выше)  
1. `pip install -r requirements.txt`  
2. Положить [дообученную модель BERTopic](https://drive.google.com/file/d/1kPnhQgNoj-_GUyKkrH-a5CZrkXBzYJrA/view) в папку services, переименовав файл в "model"
3. `uvicorn backend.main:app`
# Фронтенд  
Нужен Node.js на компе, react, все дела
1. `cd .\frontend\`
2. `npm install`
3. `npm run dev`
# Общее  
Бэк должен быть на порту 8000, фронт на 5173  
