// src/components/Header.jsx
import { NavLink } from 'react-router-dom';
import ThemeSwitcher from './ThemeSwitcher';
import './Header.css';

export default function Header() {
  /** функция-шаблон, чтобы не писать класс для двух состояний каждый раз */
  const linkClass = ({ isActive }) =>
    [
      'px-3 py-2 rounded-lg transition-colors',
      isActive
        ? 'font-semibold text-blue-600 dark:text-blue-400'
        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400',
    ].join(' ');

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-6
                        px-4 py-2 shadow-md backdrop-blur bg-white/80 dark:bg-gray-900/80">
      <nav className="flex gap-4">
        <NavLink to="/"        className={linkClass}>О&nbsp;сайте</NavLink>
        <NavLink to="/analyzer" className={linkClass}>Анализ&nbsp;логов</NavLink>
      </nav>

      {/* кнопка переключения темы */}
      <ThemeSwitcher />
    </header>
  );
}
