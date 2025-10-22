// frontend/src/routes/AppRoutes.jsx - CON BrowserRouter
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
            <Layout>
                <Routes>
                    {/* Rutas Públicas */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/registro" element={<RegisterPage />} />
                    <Route path="/eventos" element={<EventsPage />} />
                    <Route path="/evento/:id" element={<EventDetailPage />} />
                    <Route path="/resultados" element={<ResultsPage />} />
                    <Route path="/contacto" element={<ContactPage />} />
                    <Route path="/plus" element={<SubscriptionPage />} />

                    {/* Rutas Privadas de Usuario */}
                    <Route element={<PrivateRoute />}>
                        <Route element={<UserAccountLayout />}>
                            <Route path="/cuenta/dashboard" element={<EnhancedDashboardPage />} />
                            <Route path="/cuenta/perfil" element={<ProfilePage />} />
                            <Route path="/cuenta/historial" element={<HistoryPage />} />
                            <Route path="/cuenta/inscripciones" element={<MyRegistrationsPage />} />
                            <Route path="/cuenta/equipos" element={<MyTeamsPage />} />
                            <Route path="/cuenta/configuracion" element={<div>Configuración - Próximamente</div>} />
                        </Route>
                    </Route>

                    {/* Rutas de Organizador */}
                    <Route element={<OrganizerRoute />}>
                        <Route path="/organizador/dashboard" element={<OrganizerDashboardPage />} />
                        <Route path="/organizador/eventos/nuevo" element={<CreateEventPage />} />
                        <Route path="/organizador/eventos/editar/:id" element={<CreateEventPage />} />
                    </Route>

                    {/* Rutas de Administrador */}
                    <Route element={<AdminRoute />}>
                        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                        <Route path="/admin/eventos" element={<ManageEventsPage />} />
                        <Route path="/admin/usuarios" element={<ManageUsersPage />} />
                        <Route path="/admin/consultas" element={<QueriesPage />} />
                        <Route path="/admin/configuracion" element={<SystemSettingsPage />} />
                    </Route>

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