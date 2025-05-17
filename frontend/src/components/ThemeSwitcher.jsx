// src/components/ThemeSwitcher.jsx
import React, { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';
import './ThemeSwitcher.css';

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="toggle-wrapper">
      <label className="switch">
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={toggleTheme}
          aria-label="Переключить тему"
        />
        <span className="slider" />
      </label>
    </div>
  );
}
