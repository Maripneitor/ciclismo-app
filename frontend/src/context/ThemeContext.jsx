// frontend/src/context/ThemeContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    // Intentar obtener del localStorage
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    // Si no hay valor guardado, usar preferencia del sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Guardar en localStorage
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    
    // Aplicar tema al documento
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    if (darkMode) {
      htmlElement.setAttribute('data-bs-theme', 'dark');
      bodyElement.setAttribute('data-theme', 'dark');
    } else {
      htmlElement.setAttribute('data-bs-theme', 'light');
      bodyElement.setAttribute('data-theme', 'light');
    }
  }, [darkMode]);

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