import FileUploadPanel from '../components/FileUploadPanel'
import '../styles/Analyzer.css'
import ThemeSwitcher from '../components/ThemeSwitcher'

export default function Analyzer() {
  return (
    
    <main className="analyzer-wrapper" role="main" aria-label="File upload and analysis panel">
      <section className="analyzer-content">
        <h1 className="analyzer-title">Загрузка файла для анализа</h1>
        <FileUploadPanel />
      </section>
    </main>
  )
}
