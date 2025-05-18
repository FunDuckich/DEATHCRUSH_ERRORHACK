import { useContext } from 'react'
import Header from './components/Header'
import { Routes, Route, Navigate } from 'react-router-dom'
import About from './pages/About'
import Analyzer from './pages/Analyzer'
import { AnalysisContext } from './AnalysisContext'

export default function App() {
    const context = useContext(AnalysisContext)

    if (!context) {
        return <div style={{ padding: 20, color: 'red' }}>Context не доступен. Проверь обёртку AnalysisProvider.</div>
    }

    const { hasAnalyzed } = context

    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<About />} />
                <Route
                    path="/analyzer"
                    element={hasAnalyzed ? <Analyzer /> : <Navigate to="/" replace />}
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    )
}
