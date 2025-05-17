import React, { useState } from 'react' // добавляем React и useState
import { motion } from 'framer-motion'
import {
  FiSearch,
  FiCheckCircle,
  FiUpload,
  FiShield,
  FiSettings,
  FiZap,
  FiUsers,
} from 'react-icons/fi'
import '../styles/About.css'

export default function About({ darkMode }) {
  // Анимация появления
  const fadeIn = {
    hidden: { opacity: 0, y: 24 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.12, duration: 0.6, ease: 'easeOut' },
    }),
  }

  // --- Логика для кнопки Анализа ---
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  async function handleAnalyzeClick() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/analyze')
      if (!res.ok) throw new Error(`Ошибка: ${res.status}`)
      const json = await res.json()
      setData(json)
    } catch (err) {
      setError(err.message)
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`about-wrapper${darkMode ? ' dark' : ''}`}>
      <motion.section
        className="about-card glass"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        custom={0}
      >
        {/* === Содержимое About (твой исходный код) === */}
        <h1 className="about-title">LogClust</h1>

        {/* 1. Что делает сервис */}
        <motion.article variants={fadeIn} custom={1} className="about-block">
          <h2>
            <FiSearch className="ic" /> Что делает наш сервис?
          </h2>
          <div className="block-highlight">
            <strong>LogClust</strong> — это
            <span className="highlight"> умный анализатор логов</span>, который
            помогает инженерам быстро выявлять и понимать причины сбоёв.
          </div>
          <p>
            Загрузите <code>.txt</code> или <code>.rar</code> — и мы
            автоматически:
          </p>
          <ul className="about-list">
            <li>распакуем файлы и прочитаем их содержимое;</li>
            <li>выделим важные ошибки и сообщения;</li>
            <li>
              <span className="highlight">сгруппируем</span> логи по типам
              проблем;
            </li>
            <li>
              покажем <span className="highlight">интерактивную визуализацию</span>{' '}
              кластеров.
            </li>
          </ul>
          <div className="block-tip">
            🔍 <strong>Пример:</strong> если в 15 логах встречается «timeout on
            DB connection» — они попадут в один кластер!
          </div>
        </motion.article>

        {/* 2. Ключевые функции */}
        <motion.article variants={fadeIn} custom={2} className="about-block">
          <h2>
            <FiCheckCircle className="ic" /> Ключевые функции
          </h2>
          <ul className="about-list">
            <li>массовая загрузка логов per drag-and-drop;</li>
            <li>автоматическая распаковка архивов;</li>
            <li>
              <span className="highlight">
                интеллектуальная кластеризация
              </span>{' '}
              похожих сообщений;
            </li>
            <li>визуализация ошибок — графы, heat-карты, фильтры;</li>
            <li>
              <span className="highlight">экспорт отчётов</span> в PDF / CSV для
              команды.
            </li>
          </ul>
          <div className="block-highlight">
            💡 Экономит <strong>часы ручного разбора</strong> после инцидента.
          </div>
        </motion.article>

        {/* 3. Как это работает */}
        <motion.article variants={fadeIn} custom={3} className="about-block">
          <h2>
            <FiZap className="ic" /> Как это работает?
          </h2>
          <ol className="about-list">
            <li>Вы загружаете файл логов (или архив).</li>
            <li>
              Алгоритм извлекает текст и ищет{' '}
              <span className="highlight">ключевые сообщения</span>.
            </li>
            <li>
              <span className="highlight">LogClust группирует</span> сообщения с
              похожими шаблонами.
            </li>
            <li>Вы получаете визуальное представление проблем.</li>
          </ol>
          <div className="block-tip">
            🧠 В основе — <strong>NLP-анализ</strong> +{' '}
            <strong>кластеризация</strong> с учётом контекста.
          </div>
        </motion.article>

        {/* 4. Безопасность */}
        <motion.article variants={fadeIn} custom={4} className="about-block">
          <h2>
            <FiShield className="ic" /> Безопасность
          </h2>
          <ul className="about-list">
            <li>
              Файлы хранятся <span className="highlight">только временно</span>{' '}
              и удаляются через час.
            </li>
            <li>Данные обрабатываются локально на сервере, без сторонних API.</li>
            <li>
              Вы можете <span className="highlight">удалить свои данные</span> в
              любой момент вручную.
            </li>
          </ul>
          <div className="block-highlight">
            🔐 Мы не сохраняем метаданные или историю загрузок.&nbsp;Всё —
            полностью анонимно.
          </div>
        </motion.article>

        {/* 5. Для кого */}
        <motion.article variants={fadeIn} custom={5} className="about-block">
          <h2>
            <FiUsers className="ic" /> Для кого это?
          </h2>
          <ul className="about-list">
            <li>DevOps-инженеры, ищущие сбои в логах;</li>
            <li>техподдержка, разбирающая инциденты клиентов;</li>
            <li>QA-инженеры, анализирующие autotest-репорты;</li>
            <li>
              разработчики, которым надо быстро понять,{' '}
              <strong>что пошло не так</strong>.
            </li>
          </ul>
          <div className="block-tip">
            🚀 <strong>LogClust</strong> — ваш <em>личный ассистент</em> по
            логам.
          </div>
        </motion.article>
            <motion.div 
              variants={fadeIn} 
              custom={6} 
              style={{ marginTop: '2rem', textAlign: 'right' }} // вместо center — left
            >
              <button 
                onClick={() => alert('Кнопка нажата!')} 
                className="analyze-btn"
              >
                Запустить анализ
              </button>
            </motion.div>

      </motion.section>
    </div>
  )
}
