// frontend/src/App.jsx - SIN Router
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from "./context/ThemeContext";
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/ErrorBoundary';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';
import './styles/index.css';
import './styles/theme.css';
import './styles/typography.css';
import './styles/animations.css';
import './styles/components/navigation.css';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          {/* ✅ NO hay Router aquí - ya está en AppRoutes */}
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;