import {useLocation, useNavigate} from 'react-router-dom'
import React, {useEffect} from 'react'

export default function Analyzer() {
    const location = useLocation()
    const navigate = useNavigate()
    const data = location.state

    useEffect(() => {
        if (!data) {
            navigate('/')
        }
    }, [data, navigate])

    if (!data) return null

    return (
        <div style={{padding: '2rem'}}>
            <h1>Результаты анализа</h1>

            {Array.isArray(data) && data.length > 0 ? (
                data.map((cluster, idx) => (
                    <div
                        key={idx}
                        style={{
                            border: '1px solid #ccc',
                            marginBottom: '1rem',
                            padding: '1rem',
                            borderRadius: '8px',
                            backgroundColor: '#f9f9f9'
                        }}
                    >
                        <h2>Кластер: {cluster.cluster || 'Без имени'}</h2>

                        {cluster.files.map((file, i) => (
                            <div
                                key={i}
                                style={{
                                    borderTop: '1px solid #ddd',
                                    marginTop: '0.5rem',
                                    paddingTop: '0.5rem'
                                }}
                            >
                                <p><strong>Файл:</strong> {file.filename}</p>
                                <p><strong>Hash:</strong> {file.hash}</p>
                                <p><strong>Версия:</strong> {file.version}-{file.release}</p>
                                <p><strong>Архитектура:</strong> {file.arch}</p>
                                <p><strong>Обновлено:</strong> {file.updated}</p>
                                <p><strong>Ошибка:</strong> {file.error || 'Нет данных'}</p>
                                <p><strong>URL:</strong> <a href={file.url} target="_blank"
                                                            rel="noreferrer">{file.url}</a></p>
                            </div>
                        ))}
                    </div>
                ))
            ) : (
                <p>Нет данных для отображения.</p>
            )}
        </div>
    )
}
