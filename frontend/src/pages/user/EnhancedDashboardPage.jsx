// frontend/src/pages/EnhancedDashboardPage.jsx - CORREGIDO
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { eventsAPI, registrationsAPI, usersAPI } from '../../services/api';

const EnhancedDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({
    userStats: null,
    recentRegistrations: [],
    upcomingEvents: [],
    loading: true
  });
  const [error, setError] = useState('');

  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    try {
      setError('');
      setDashboardData(prev => ({ ...prev, loading: true }));

      // Cargar datos en paralelo
      const [registrations, events, userProfile] = await Promise.all([
        registrationsAPI.getMyRegistrations(), // CORREGIDO: usar getMyRegistrations en lugar de getAll
        eventsAPI.getAll(),
        usersAPI.getProfile().catch(() => null) // Opcional
      ]);

      // Filtrar eventos próximos
      const upcomingEvents = events
        .filter(event => new Date(event.fecha) > new Date())
        .slice(0, 5);

      // Preparar estadísticas
      const userStats = {
        totalRegistrations: registrations.length,
        upcomingEvents: upcomingEvents.length,
        completedEvents: registrations.filter(reg => 
          reg.evento?.estado === 'Finalizado'
        ).length
      };

      setDashboardData({
        userStats,
        recentRegistrations: registrations.slice(0, 5),
        upcomingEvents,
        loading: false
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Error cargando datos del dashboard');
      setDashboardData(prev => ({ ...prev, loading: false }));
    }
  };

  if (!isAuthenticated) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <h4>Acceso Requerido</h4>
          <p>Debes iniciar sesión para acceder al dashboard.</p>
        </Alert>
      </Container>
    );
  }

  if (dashboardData.loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Cargando dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h2 fw-bold">
            ¡Bienvenido, {user?.nombre_completo || user?.email}!
          </h1>
          <p className="text-muted">
            Resumen de tu actividad en Maripneitor Ciclismo
          </p>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Estadísticas */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Body>
              <h3 className="text-primary fw-bold">
                {dashboardData.userStats?.totalRegistrations || 0}
              </h3>
              <p className="text-muted mb-0">Inscripciones Totales</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Body>
              <h3 className="text-success fw-bold">
                {dashboardData.userStats?.upcomingEvents || 0}
              </h3>
              <p className="text-muted mb-0">Próximos Eventos</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Body>
              <h3 className="text-warning fw-bold">
                {dashboardData.userStats?.completedEvents || 0}
              </h3>
              <p className="text-muted mb-0">Eventos Completados</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Próximos Eventos */}
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Próximos Eventos</h5>
            </Card.Header>
            <Card.Body>
              {dashboardData.upcomingEvents.length === 0 ? (
                <p className="text-muted text-center">No tienes eventos próximos</p>
              ) : (
                dashboardData.upcomingEvents.map(event => (
                  <div key={event.evento_id} className="border-bottom pb-2 mb-2">
                    <h6 className="mb-1">{event.nombre}</h6>
                    <small className="text-muted">
                      {new Date(event.fecha).toLocaleDateString('es-ES')} • {event.ubicacion}
                    </small>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Inscripciones Recientes */}
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Inscripciones Recientes</h5>
            </Card.Header>
            <Card.Body>
              {dashboardData.recentRegistrations.length === 0 ? (
                <p className="text-muted text-center">No tienes inscripciones recientes</p>
              ) : (
                dashboardData.recentRegistrations.map(registration => (
                  <div key={registration.inscripcion_id} className="border-bottom pb-2 mb-2">
                    <h6 className="mb-1">{registration.evento?.nombre}</h6>
                    <small className="text-muted">
                      Nº Dorsal: {registration.numero_dorsal} • 
                      {new Date(registration.fecha_inscripcion).toLocaleDateString('es-ES')}
                    </small>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EnhancedDashboardPage;