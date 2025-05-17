import {createContext, useState} from 'react';

export const AnalysisContext = createContext();

export const AnalysisProvider = ({children}) => {
    const [analysisData, setAnalysisData] = useState(null);
    const [hasAnalyzed, setHasAnalyzed] = useState(false);

    const updateAnalysis = (data) => {
        setAnalysisData(data);
        setHasAnalyzed(true);
    };

    const resetAnalysis = () => {
        setAnalysisData(null);
        setHasAnalyzed(false);
    };

    return (
        <AnalysisContext.Provider value={{analysisData, hasAnalyzed, updateAnalysis, resetAnalysis}}>
            {children}
        </AnalysisContext.Provider>
    );
};