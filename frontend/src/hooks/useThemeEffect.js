import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export const useThemeEffect = () => {
    const { darkMode } = useTheme();

    useEffect(() => {
        // Asegurar que el tema se aplique incluso si el componente
        // no está usando directamente el contexto
        const htmlElement = document.documentElement;
        const bodyElement = document.body;
        
        if (darkMode) {
            htmlElement.setAttribute('data-bs-theme', 'dark');
            bodyElement.classList.add('dark-theme');
            bodyElement.classList.remove('light-theme');
        } else {
            htmlElement.setAttribute('data-bs-theme', 'light');
            bodyElement.classList.add('light-theme');
            bodyElement.classList.remove('dark-theme');
        }
    }, [darkMode]);
};