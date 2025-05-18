import { useNavigate } from 'react-router-dom';
import React, { useEffect, useContext, useState } from 'react'; // Добавляем useState
import { AnalysisContext } from '../AnalysisContext';
import '../styles/Analyzer.css'; // Убедимся, что стили импортированы

export default function Analyzer() {
    const navigate = useNavigate();
    const { analysisData, hasAnalyzed } = useContext(AnalysisContext);

    // Состояние для отслеживания открытых кластеров: { clusterIndex: boolean }
    const [openClusters, setOpenClusters] = useState({});

    // Состояние для отслеживания открытых файлов: { 'clusterIndex_fileIndex': boolean }
    const [openFiles, setOpenFiles] = useState({});

    useEffect(() => {
        // Если анализ не был произведен или нет данных, перенаправляем на главную
        if (!hasAnalyzed || !analysisData) {
            navigate('/');
        }
    }, [hasAnalyzed, analysisData, navigate]);

    if (!hasAnalyzed || !analysisData) {
        // Можно вернуть null или индикатор загрузки, если App.jsx не гарантирует защиту
        return <p>Загрузка данных анализа или нет данных для отображения...</p>;
    }

    const dataToDisplay = analysisData;

    const toggleCluster = (clusterIndex) => {
        setOpenClusters(prev => ({
            ...prev,
            [clusterIndex]: !prev[clusterIndex]
        }));
        // Опционально: при закрытии кластера, закрыть все файлы внутри него
        if (openClusters[clusterIndex]) { // если кластер был открыт и сейчас закрывается
            const newOpenFiles = {...openFiles};
            (dataToDisplay[clusterIndex].files || []).forEach((_, fileIndex) => {
                newOpenFiles[`${clusterIndex}_${fileIndex}`] = false;
            });
            setOpenFiles(newOpenFiles);
        }
    };

    const toggleFile = (clusterIndex, fileIndex) => {
        setOpenFiles(prev => ({
            ...prev,
            [`${clusterIndex}_${fileIndex}`]: !prev[`${clusterIndex}_${fileIndex}`]
        }));
    };

    return (
        <div className="analyzer-wrapper">
            <div className="analyzer-content">
                <h1 className="analyzer-title">Результаты анализа</h1>

                {Array.isArray(dataToDisplay) && dataToDisplay.length > 0 ? (
                    <div className="clusters-list">
                        {dataToDisplay.map((cluster, clusterIdx) => (
                            <div key={clusterIdx} className="cluster-item">
                                <div
                                    className={`cluster-header ${openClusters[clusterIdx] ? 'opened' : 'closed'}`}
                                    onClick={() => toggleCluster(clusterIdx)}
                                    role="button" // для доступности
                                    tabIndex={0} // для доступности
                                    onKeyDown={(e) => e.key === 'Enter' && toggleCluster(clusterIdx)} // для доступности
                                >
                                    <h2>
                                        {/* Индикатор будет через CSS ::before */}
                                        Кластер: {cluster.cluster_id || cluster.cluster || `Кластер ${clusterIdx + 1}`}
                                    </h2>
                                </div>

                                {openClusters[clusterIdx] && (cluster.files && cluster.files.length > 0) && (
                                    <ul className="files-list">
                                        {cluster.files.map((file, fileIdx) => (
                                            <li key={fileIdx} className="file-item">
                                                <div
                                                    className={`file-header ${openFiles[`${clusterIdx}_${fileIdx}`] ? 'opened' : 'closed'}`}
                                                    onClick={() => toggleFile(clusterIdx, fileIdx)}
                                                    role="button"
                                                    tabIndex={0}
                                                    onKeyDown={(e) => e.key === 'Enter' && toggleFile(clusterIdx, fileIdx)}
                                                >
                                                    {/* Индикатор будет через CSS ::before */}
                                                    <strong>Файл:</strong> {file.filename}
                                                </div>

                                                {openFiles[`${clusterIdx}_${fileIdx}`] && (
                                                    <div className="file-details">
                                                        <p><strong>Hash:</strong> {file.hash}</p>
                                                        <p><strong>Версия:</strong> {file.version}-{file.release}</p>
                                                        <p><strong>Архитектура:</strong> {file.arch}</p>
                                                        <p><strong>Обновлено:</strong> {file.updated}</p>
                                                        <p><strong>Ошибка:</strong> {file.error || 'Нет данных'}</p>
                                                        <p><strong>URL:</strong> <a href={file.url} target="_blank"
                                                                                    rel="noreferrer">{file.url}</a></p>
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {/* Сообщение, если кластер открыт, но в нем нет файлов */}
                                {openClusters[clusterIdx] && (!cluster.files || cluster.files.length === 0) && (
                                    <p className="no-files-message">В этом кластере нет файлов для отображения.</p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Нет данных для отображения.</p>
                )}
            </div>
        </div>
    );
}