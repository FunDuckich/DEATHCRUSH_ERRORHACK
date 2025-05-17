// src/App.jsx
import Header from './components/Header';
import { Routes, Route, Navigate } from 'react-router-dom';
import About from './pages/About';
import Analyzer from './pages/Analyzer';
import { ThemeProvider } from './ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <Header />
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/analyzer" element={<Analyzer />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}
