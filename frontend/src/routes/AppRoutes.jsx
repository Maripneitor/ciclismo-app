// frontend/src/routes/AppRoutes.jsx - CORREGIDO
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import AdminRoute from '../components/AdminRoute';
import OrganizerRoute from '../components/OrganizerRoute';
import UserAccountLayout from '../components/layout/UserAccountLayout';
import Layout from '../components/layout/Layout';

// Páginas públicas
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import EventsPage from '../pages/EventsPage';
import EventDetailPage from '../pages/EventDetailPage';
import ResultsPage from '../pages/ResultsPage';
import ContactPage from '../pages/ContactPage';
import SubscriptionPage from '../pages/SubscriptionPage';

// Páginas de usuario
import EnhancedDashboardPage from '../pages/user/EnhancedDashboardPage';
import ProfilePage from '../pages/user/ProfilePage';
import HistoryPage from '../pages/user/HistoryPage';
import MyRegistrationsPage from '../pages/user/MyRegistrationsPage';
import MyTeamsPage from '../pages/user/MyTeamsPage';

// Páginas de organizador
import OrganizerDashboardPage from '../pages/organizer/OrganizerDashboardPage';
import CreateEventPage from '../pages/organizer/CreateEventPage';

// Páginas de administrador
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import ManageEventsPage from '../pages/admin/ManageEventsPage';
import ManageUsersPage from '../pages/admin/ManageUsersPage';
import QueriesPage from '../pages/admin/QueriesPage';
import SystemSettingsPage from '../pages/admin/SystemSettingsPage';

const AppRoutes = () => {
    return (
        <BrowserRouter>
            {/* ❌ QUITAR Layout de aquí - se maneja en cada ruta */}
            <Routes>
                {/* Rutas Públicas CON Layout */}
                <Route path="/" element={<Layout><HomePage /></Layout>} />
                <Route path="/login" element={<Layout><LoginPage /></Layout>} />
                <Route path="/registro" element={<Layout><RegisterPage /></Layout>} />
                <Route path="/eventos" element={<Layout><EventsPage /></Layout>} />
                <Route path="/evento/:id" element={<Layout><EventDetailPage /></Layout>} />
                <Route path="/resultados" element={<Layout><ResultsPage /></Layout>} />
                <Route path="/contacto" element={<Layout><ContactPage /></Layout>} />
                <Route path="/plus" element={<Layout><SubscriptionPage /></Layout>} />

                {/* Rutas Privadas de Usuario */}
                <Route element={<PrivateRoute />}>
                    <Route path="/cuenta/*" element={<UserAccountLayout />}>
                        <Route path="dashboard" element={<EnhancedDashboardPage />} />
                        <Route path="perfil" element={<ProfilePage />} />
                        <Route path="historial" element={<HistoryPage />} />
                        <Route path="inscripciones" element={<MyRegistrationsPage />} />
                        <Route path="equipos" element={<MyTeamsPage />} />
                        <Route path="configuracion" element={<div>Configuración - Próximamente</div>} />
                    </Route>
                </Route>

                {/* Rutas de Organizador CON Layout */}
                <Route element={<OrganizerRoute />}>
                    <Route path="/organizador/dashboard" element={<Layout><OrganizerDashboardPage /></Layout>} />
                    <Route path="/organizador/eventos/nuevo" element={<Layout><CreateEventPage /></Layout>} />
                    <Route path="/organizador/eventos/editar/:id" element={<Layout><CreateEventPage /></Layout>} />
                </Route>

                {/* Rutas de Administrador CON Layout */}
                <Route element={<AdminRoute />}>
                    <Route path="/admin/dashboard" element={<Layout><AdminDashboardPage /></Layout>} />
                    <Route path="/admin/eventos" element={<Layout><ManageEventsPage /></Layout>} />
                    <Route path="/admin/usuarios" element={<Layout><ManageUsersPage /></Layout>} />
                    <Route path="/admin/consultas" element={<Layout><QueriesPage /></Layout>} />
                    <Route path="/admin/configuracion" element={<Layout><SystemSettingsPage /></Layout>} />
                </Route>

                {/* Ruta 404 CON Layout */}
                <Route path="*" element={
                    <Layout>
                        <div className="container text-center py-5">
                            <h1>404 - Página no encontrada</h1>
                            <p>La página que buscas no existe.</p>
                        </div>
                    </Layout>
                } />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;