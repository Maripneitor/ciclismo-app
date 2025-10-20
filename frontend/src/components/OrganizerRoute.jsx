// src/components/OrganizerRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner, Container, Alert } from 'react-bootstrap';

const OrganizerRoute = () => {
  const { isAuthenticated, isOrganizer, loading } = useAuth();

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isOrganizer) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <h4>Acceso Restringido</h4>
          <p>Necesitas ser organizador para acceder a esta sección.</p>
        </Alert>
      </Container>
    );
  }

  return <Outlet />;
};

export default OrganizerRoute;