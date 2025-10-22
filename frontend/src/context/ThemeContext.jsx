// frontend/src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(true);
    const [mounted, setMounted] = useState(false);

    const applyTheme = (isDark) => {
        const htmlElement = document.documentElement;
        const bodyElement = document.body;
        
        bodyElement.classList.remove('dark-theme', 'light-theme');
        htmlElement.removeAttribute('data-bs-theme');
        
        if (isDark) {
            htmlElement.setAttribute('data-bs-theme', 'dark');
            bodyElement.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            htmlElement.setAttribute('data-bs-theme', 'light');
            bodyElement.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        }
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const initialTheme = savedTheme === 'light' ? false : 
                           savedTheme === 'dark' ? true : prefersDark;
        
        setDarkMode(initialTheme);
        applyTheme(initialTheme);
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            applyTheme(darkMode);
        }
    }, [darkMode, mounted]);

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    };

    const value = {
        darkMode,
        toggleDarkMode,
        setDarkMode
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useThemeEffect = () => {
    const { darkMode } = useTheme();

    useEffect(() => {
        const htmlElement = document.documentElement;
        const bodyElement = document.body;
        
        bodyElement.classList.remove('dark-theme', 'light-theme');
        htmlElement.removeAttribute('data-bs-theme');
        
        if (darkMode) {
            htmlElement.setAttribute('data-bs-theme', 'dark');
            bodyElement.classList.add('dark-theme');
        } else {
            htmlElement.setAttribute('data-bs-theme', 'light');
            bodyElement.classList.add('light-theme');
        }
    }, [darkMode]);
};