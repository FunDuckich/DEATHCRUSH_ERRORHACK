import { Routes, Route, Navigate } from 'react-router-dom'
import About     from './pages/About'
import Analyzer  from './pages/Analyzer'

export default function App() {
  return (
    <Routes>
      {/* стартовая («/») — страница О сайте */}
      <Route path="/" element={<About />} />

      {/* страница с загрузкой логов */}
      <Route path="/analyzer" element={<Analyzer />} />

      {/* если ввели неизвестный путь — отправляем на корень */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
