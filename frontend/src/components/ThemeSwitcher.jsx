import { useEffect, useState } from 'react'

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState(() => {
    // При загрузке страницы смотрим, что в localStorage или дефолт — светлая
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme
    }
    // Можно попробовать определить системную тему:
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    return 'light'
  })

  // При смене theme меняем класс у body
  useEffect(() => {
    const body = document.body
    if (theme === 'dark') {
      body.classList.add('dark')
    } else {
      body.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  // Функция переключения темы
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Переключить тему"
      style={{
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        borderRadius: '0.5rem',
        border: 'none',
        backgroundColor: theme === 'dark' ? '#333' : '#ddd',
        color: theme === 'dark' ? '#eee' : '#111',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      {theme === 'light' ? '🌞 Светлая тема' : '🌙 Тёмная тема'}
    </button>
  )
}
