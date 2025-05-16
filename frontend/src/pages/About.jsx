import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FiSearch, FiCheckCircle, FiUpload, FiShield, FiSettings, FiSun, FiMoon
} from 'react-icons/fi'
import '../styles/About.css'

export default function About() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode')
    return savedTheme === 'true'
  })

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode)
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  const toggleTheme = () => setDarkMode(prev => !prev)

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  }

  return (
    <div className="about-wrapper">
      <motion.div
        className="about-card"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        custom={0}
      >

        <h1 className="about-title">LogClust</h1>

        <motion.div variants={fadeIn} custom={1}>
          <h2><FiSearch /> Что делает наш сервис?</h2>
          <p>
            <strong>LogClust</strong> — это веб-сервис, который автоматически анализирует загруженные логи, 
            выявляет схожие ошибки и группирует их в кластеры. Сервис поддерживает загрузку одного или 
            нескольких лог-файлов в формате <code>.txt</code> или архивов <code>.rar</code>. 
            Пользователь получает удобную визуализацию: список кластеров с возможностью 
            просмотреть названия логов, отнесённых к каждому кластеру.
          </p>
        </motion.div>

        <motion.div variants={fadeIn} custom={2}>
          <h2><FiCheckCircle /> Ключевые функции</h2>
          <ul className="about-list">
            <li>Загрузка множества файлов логов (.txt, .rar)</li>
            <li>Автоматическая распаковка и предварительная обработка файлов</li>
            <li>Кластеризация логов с помощью алгоритмов машинного обучения</li>
            <li>Отображение списка кластеров ошибок</li>
            <li>Просмотр логов, входящих в конкретный кластер</li>
            <li>Удобный и быстрый веб-интерфейс</li>
          </ul>
        </motion.div>

        <motion.div variants={fadeIn} custom={3}>
          <h2><FiUpload /> Примеры интерфейса</h2>
          <h4>Загрузка файлов</h4>
          <pre className="about-pre">
            [ + Перетащите сюда файлы или нажмите для загрузки ]
            ✓ logs_01.txt
            ✓ errors_part2.rar
          </pre>

          <h4>Отображение кластеров</h4>
          <pre className="about-pre">
            Кластер 0 (Проблемы с подключением): 15 логов
            Кластер 1 (Ошибка базы данных): 8 логов
            Кластер 2 (Timeout ошибки): 12 логов
          </pre>
        </motion.div>

        <motion.div variants={fadeIn} custom={4}>
          <h2><FiSettings /> Как это работает внутри?</h2>
          <ul className="about-list">
            <li>Парсинг логов</li>
            <li>Обработка текста (TF-IDF, токенизация и др.)</li>
            <li>Кластеризация (DBSCAN, KMeans и др.)</li>
            <li>Интерфейс: React + Flask (или другой стек)</li>
          </ul>
        </motion.div>

        <motion.div variants={fadeIn} custom={5}>
          <h2><FiShield /> Безопасность</h2>
          <ul className="about-list">
            <li>Файлы обрабатываются локально и не сохраняются дольше сессии</li>
            <li>Можно развернуть внутри корпоративной сети</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  )
}
