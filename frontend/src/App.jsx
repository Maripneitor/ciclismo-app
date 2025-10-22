// frontend/src/App.jsx - CORREGIDO
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from "./context/ThemeContext";
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/ErrorBoundary';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';
import './styles/index.css';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider> {/* ✅ AuthProvider debe envolver todo */}
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;