import React, { useState } from 'react';
import '../styles/Analyzer.css';

export default function Analyzer() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleAnalyzeClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/analyze');
      if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="analyzer-wrapper" role="main" aria-label="File upload and analysis panel">
      <section className="analyzer-content">
        <h1 className="analyzer-title">Анализ логов по кнопке</h1>
        <button onClick={handleAnalyzeClick} disabled={loading} style={{marginBottom: 20}}>
          {loading ? 'Загрузка...' : 'Запустить анализ'}
        </button>

        {error && <div style={{color: 'red'}}>Ошибка: {error}</div>}

        {!data && !loading && <div>Панель пустая. Нажмите кнопку для анализа.</div>}

        {data && (
          <div className="clusters-list">
            {data.map((clusterObj, i) => (
              <div key={i} className="cluster">
                <h2>Кластер: {clusterObj.cluster}</h2>
                <ul>
                  {clusterObj.files.map((file, j) => (
                    <li key={j} style={{marginBottom: 10, borderBottom: '1px solid #ccc', paddingBottom: 5}}>
                      <strong>Файл:</strong> {file.filename} <br />
                      <strong>Hash:</strong> {file.hash} <br />
                      <strong>Epoch:</strong> {file.epoch} <br />
                      <strong>Version:</strong> {file.version} <br />
                      <strong>Release:</strong> {file.release} <br />
                      <strong>Arch:</strong> {file.arch} <br />
                      <strong>Updated:</strong> {file.updated} <br />
                      <strong>Ftbfs since:</strong> {file.ftbfs_since} <br />
                      <strong>Url:</strong> <a href={file.url} target="_blank" rel="noreferrer">{file.url}</a> <br />
                      {file.error && <span style={{color: 'red'}}><strong>Ошибка:</strong> {file.error}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
