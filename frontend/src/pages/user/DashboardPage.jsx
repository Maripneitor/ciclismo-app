import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { eventsAPI } from '../../services/api';

const DashboardPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    completedEvents: 0,
    totalDistance: 0,
    upcomingEvents: 0
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await eventsAPI.getAll();
      setEvents(response.data);
      
      const upcoming = response.data.filter(event => 
        new Date(event.fecha) > new Date()
      ).length;
      
      setStats({
        totalEvents: response.data.length,
        completedEvents: response.data.length - upcoming,
        totalDistance: response.data.reduce((sum, event) => sum + (event.distancia || 0), 0),
        upcomingEvents: upcoming
      });
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingEvents = events
    .filter(event => new Date(event.fecha) > new Date())
    .slice(0, 3);

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>Mi Dashboard</h2>
          <p className="text-muted">Bienvenido/a de vuelta, {user?.nombre}!</p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-primary">{stats.upcomingEvents}</h3>
              <p className="text-muted mb-0">Próximos Eventos</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-success">{stats.completedEvents}</h3>
              <p className="text-muted mb-0">Completados</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-warning">{stats.totalDistance}km</h3>
              <p className="text-muted mb-0">Distancia Total</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-info">{stats.totalEvents}</h3>
              <p className="text-muted mb-0">Total Eventos</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={6}>
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">Mi Próximo Evento</h5>
            </Card.Header>
            <Card.Body>
              {upcomingEvents.length > 0 ? (
                <div>
                  <h6>{upcomingEvents[0].nombre}</h6>
                  <p className="text-muted mb-2">
                    {upcomingEvents[0].ubicacion}
                  </p>
                  <p className="text-muted mb-2">
                    {new Date(upcomingEvents[0].fecha).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-muted mb-3">
                    {upcomingEvents[0].distancia} km • {upcomingEvents[0].tipo}
                  </p>
                  <div className="d-flex gap-2">
                    <Button variant="primary" size="sm">
                      Ver Detalles
                    </Button>
                    <Button variant="outline-secondary" size="sm">
                      Preparación
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-3">
                  <p className="text-muted mb-3">No tienes eventos próximos.</p>
                  <Button as={Link} to="/eventos" variant="primary">
                    Explorar Eventos
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">Mi Progreso</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Objetivo de Distancia (200km)</span>
                  <span>45%</span>
                </div>
                <ProgressBar now={45} variant="primary" />
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Eventos Mensuales (3 eventos)</span>
                  <span>33%</span>
                </div>
                <ProgressBar now={33} variant="success" />
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Entrenamientos Semanales</span>
                  <span>67%</span>
                </div>
                <ProgressBar now={67} variant="warning" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={12}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Acciones Rápidas</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex gap-3 flex-wrap">
                <Button as={Link} to="/eventos" variant="primary">
                  Explorar Eventos
                </Button>
                <Button as={Link} to="/cuenta/perfil" variant="outline-primary">
                  Editar Perfil
                </Button>
                <Button as={Link} to="/cuenta/historial" variant="outline-success">
                  Ver Historial
                </Button>
                <Button as={Link} to="/resultados" variant="outline-info">
                  Ver Resultados
                </Button>
                {(user?.role === 'organizador' || user?.role === 'admin') && (
                  <Button as={Link} to="/admin/eventos" variant="outline-warning">
                    Gestionar Eventos
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={12}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Próximos Eventos</h5>
              <Button as={Link} to="/eventos" variant="outline-primary" size="sm">
                Ver Todos
              </Button>
            </Card.Header>
            <Card.Body>
              {upcomingEvents.length > 0 ? (
                <Row>
                  {upcomingEvents.map((event) => (
                    <Col md={4} key={event.id} className="mb-3">
                      <Card className="h-100">
                        <Card.Body>
                          <h6>{event.nombre}</h6>
                          <p className="text-muted small mb-1">
                            {event.ubicacion}
                          </p>
                          <p className="text-muted small mb-2">
                            {new Date(event.fecha).toLocaleDateString()}
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="badge bg-primary">
                              {event.distancia}km
                            </span>
                            <Button variant="outline-primary" size="sm">
                              Inscribirse
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">No hay eventos próximos disponibles.</p>
                  <Button as={Link} to="/eventos" variant="primary">
                    Descubrir Eventos
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardPage;