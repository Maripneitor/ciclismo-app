// src/context/ThemeContext.jsx
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

    const applyTheme = (isDark) => {
        if (isDark) {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
        }
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem('darkMode');
        if (savedTheme !== null) {
            const isDark = JSON.parse(savedTheme);
            setDarkMode(isDark);
            applyTheme(isDark);
        } else {
            applyTheme(true);
        }
    }, []);

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
        applyTheme(newDarkMode);
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