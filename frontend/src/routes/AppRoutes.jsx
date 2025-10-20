import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import AdminRoute from '../components/AdminRoute';
import OrganizerRoute from '../components/OrganizerRoute';
import UserAccountLayout from '../components/layout/UserAccountLayout';
import Layout from '../components/layout/Layout';

import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import EventsPage from '../pages/EventsPage';
import ResultsPage from '../pages/ResultsPage';
import ContactPage from '../pages/ContactPage';
import SubscriptionPage from '../pages/SubscriptionPage';

import EnhancedDashboardPage from '../pages/user/EnhancedDashboardPage';
import ProfilePage from '../pages/user/ProfilePage';
import HistoryPage from '../pages/user/HistoryPage';

import OrganizerDashboardPage from '../pages/organizer/OrganizerDashboardPage';

import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import ManageEventsPage from '../pages/admin/ManageEventsPage';
import QueriesPage from '../pages/admin/QueriesPage';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/eventos" element={<EventsPage />} />
          <Route path="/resultados" element={<ResultsPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/plus" element={<SubscriptionPage />} />

          <Route element={<PrivateRoute />}>
            <Route element={<UserAccountLayout />}>
              <Route path="/cuenta/dashboard" element={<EnhancedDashboardPage />} />
              <Route path="/cuenta/perfil" element={<ProfilePage />} />
              <Route path="/cuenta/historial" element={<HistoryPage />} />
              <Route path="/cuenta/configuracion" element={<div>Configuración - Próximamente</div>} />
            </Route>
          </Route>

          <Route element={<OrganizerRoute />}>
            <Route path="/organizador/dashboard" element={<OrganizerDashboardPage />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/eventos" element={<ManageEventsPage />} />
            <Route path="/admin/consultas" element={<QueriesPage />} />
          </Route>

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