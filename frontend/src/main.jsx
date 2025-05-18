import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './App.jsx';
import {ThemeProvider} from './ThemeContext';
import {AnalysisProvider} from './AnalysisContext';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider>
                <AnalysisProvider>
                    <App/>
                </AnalysisProvider>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);