import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import EventsPage from '../pages/EventsPage';
import DashboardPage from '../pages/DashboardPage';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/events" element={<EventsPage />} />

          {/* Rutas protegidas */}
          {isAuthenticated && (
            <Route path="/dashboard" element={<DashboardPage />} />
          )}

          {/* Ruta 404 */}
          <Route path="*" element={
            <div className="container text-center py-5">
              <h1>404 - Página no encontrada</h1>
              <p>La página que buscas no existe.</p>
            </div>
          } />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default AppRoutes;