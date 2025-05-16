// src/App.jsx
import Header from './components/Header';
import { Routes, Route, Navigate } from 'react-router-dom';
import About     from './pages/About';
import Analyzer  from './pages/Analyzer';

export default function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/"          element={<About />}    />
        <Route path="/analyzer"  element={<Analyzer />} />
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
