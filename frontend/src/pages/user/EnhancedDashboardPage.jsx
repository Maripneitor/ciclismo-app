// src/pages/user/EnhancedDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  ProgressBar, 
  Alert,
  Badge,
  Spinner,
  ListGroup
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { eventsAPI, usersAPI, registrationsAPI } from '../../services/api';

const EnhancedDashboardPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [eventsResponse, registrationsResponse, userEventsResponse] = await Promise.all([
        eventsAPI.getAll(),
        registrationsAPI.getAll().catch(() => []),
        usersAPI.getUserEvents().catch(() => [])
      ]);

      const eventsData = eventsResponse.data || eventsResponse;
      setEvents(Array.isArray(eventsData) ? eventsData : []);
      setRegistrations(Array.isArray(registrationsResponse) ? registrationsResponse : []);
      setUserEvents(Array.isArray(userEventsResponse) ? userEventsResponse : []);

      const now = new Date();
      const upcomingEvents = eventsData.filter(event => 
        event.fecha && new Date(event.fecha) > now
      );
      const completedEvents = eventsData.filter(event => 
        event.fecha && new Date(event.fecha) <= now
      );

      const calculatedStats = {
        total_usuarios: 0,
        total_eventos: eventsData.length,
        total_inscripciones: registrationsResponse.length || 0,
        total_admins: 0,
        total_organizadores: 0,
        upcomingEvents: upcomingEvents.length,
        completedEvents: completedEvents.length,
        myRegistrations: registrationsResponse.length || 0,
        totalDistance: eventsData.reduce((sum, event) => 
          sum + (parseFloat(event.distancia_km || event.distancia) || 0), 0
        ),
        participationRate: eventsData.length > 0 ? 
          Math.round(((registrationsResponse.length || 0) / eventsData.length) * 100) : 0
      };
      setStats(calculatedStats);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Error cargando datos del dashboard. Usando datos de demostración.');
      
      setEvents([
        {
          evento_id: 1,
          nombre: 'Gran Fondo Sierra Nevada',
          descripcion: 'Evento de montaña en la sierra nevada',
          fecha: '2024-02-15T08:00:00',
          ubicacion: 'Granada, España',
          distancia_km: 120,
          tipo: 'montaña',
          estado: 'Próximo',
          cuota_inscripcion: 50.00
        },
        {
          evento_id: 2,
          nombre: 'Carrera Nocturna Madrid',
          descripcion: 'Carrera urbana nocturna por el centro de Madrid',
          fecha: '2024-02-20T20:00:00',
          ubicacion: 'Madrid, España',
          distancia_km: 45,
          tipo: 'urbano',
          estado: 'Próximo',
          cuota_inscripcion: 25.00
        }
      ]);
      
      setUserEvents([]);
      setRegistrations([]);
      setStats({
        total_usuarios: 1247,
        total_eventos: 89,
        total_inscripciones: 2543,
        total_admins: 3,
        total_organizadores: 15,
        upcomingEvents: 2,
        completedEvents: 0,
        myRegistrations: 0,
        totalDistance: 165,
        participationRate: 25
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const now = new Date();
    
    const eventsToUse = userEvents.length > 0 ? userEvents : events;
    
    const upcomingEvents = eventsToUse.filter(event => 
      event.fecha && new Date(event.fecha) > now
    );
    
    const completedEvents = eventsToUse.filter(event => 
      event.fecha && new Date(event.fecha) <= now
    );
    
    const totalDistance = eventsToUse.reduce((sum, event) => 
      sum + (parseInt(event.distancia_km || event.distancia) || 0), 0
    );

    const personalStats = {
      upcomingEvents: upcomingEvents.length,
      completedEvents: completedEvents.length,
      totalDistance,
      totalEvents: eventsToUse.length,
      userSpecificData: userEvents.length > 0,
      myRegistrations: registrations.length,
      participationRate: stats?.participationRate || 0
    };

    if (stats) {
      return {
        ...personalStats,
        advancedStats: true,
        communityStats: stats
      };
    }

    return personalStats;
  };

  const getEventTypeIcon = (type) => {
    const icons = {
      'ruta': '',
      'montaña': '',
      'montana': '',
      'urbano': '',
      'competitivo': '',
      'recreativo': ''
    };
    return icons[type] || '';
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Próximo': return 'warning';
      case 'En Curso': return 'success';
      case 'Finalizado': return 'secondary';
      default: return 'secondary';
    }
  };

  const dashboardStats = calculateStats();
  const upcomingEvents = events
    .filter(event => event.fecha && new Date(event.fecha) > new Date())
    .slice(0, 3);

  const myUpcomingRegistrations = registrations
    .filter(reg => reg.evento && new Date(reg.evento.fecha) > new Date())
    .slice(0, 3);

  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="text-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p className="mt-2 text-muted">Cargando tu dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h1 className="h2 mb-1">Mi Dashboard</h1>
              <p className="text-muted mb-0">
                Bienvenido/a de vuelta, <strong>{user?.nombre || user?.nombre_completo}</strong>!
              </p>
              {!dashboardStats.userSpecificData && (
                <small className="text-warning">
                  Mostrando eventos generales. Inscríbete en eventos para ver tus estadísticas personales.
                </small>
              )}
            </div>
            <Badge bg="primary" className="fs-6">
              {user?.rol?.toUpperCase()}
            </Badge>
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="warning" onClose={() => setError('')} dismissible>
          <strong>Atención:</strong> {error}
        </Alert>
      )}

      <Row className="mb-4">
        <Col md={2}>
          <Card className="stat-card h-100 text-center">
            <Card.Body>
              <div className="stat-icon text-primary">Próximos</div>
              <h3 className="text-primary mt-2">{dashboardStats.upcomingEvents}</h3>
              <p className="text-muted mb-0">Próximos</p>
              <small className="text-muted">Eventos</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="stat-card h-100 text-center">
            <Card.Body>
              <div className="stat-icon text-success">Completados</div>
              <h3 className="text-success mt-2">{dashboardStats.completedEvents}</h3>
              <p className="text-muted mb-0">Eventos</p>
              <small className="text-muted">Completados</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="stat-card h-100 text-center">
            <Card.Body>
              <div className="stat-icon text-warning">Distancia</div>
              <h3 className="text-warning mt-2">{dashboardStats.totalDistance}km</h3>
              <p className="text-muted mb-0">Distancia</p>
              <small className="text-muted">Total</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="stat-card h-100 text-center">
            <Card.Body>
              <div className="stat-icon text-info">Total</div>
              <h3 className="text-info mt-2">{dashboardStats.totalEvents}</h3>
              <p className="text-muted mb-0">Total</p>
              <small className="text-muted">Eventos</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="stat-card h-100 text-center">
            <Card.Body>
              <div className="stat-icon text-secondary">Inscripciones</div>
              <h3 className="text-secondary mt-2">{dashboardStats.myRegistrations}</h3>
              <p className="text-muted mb-0">Mis</p>
              <small className="text-muted">Inscripciones</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="stat-card h-100 text-center">
            <Card.Body>
              <div className="stat-icon text-dark">Participación</div>
              <h3 className="text-dark mt-2">{dashboardStats.participationRate}%</h3>
              <p className="text-muted mb-0">Tasa de</p>
              <small className="text-muted">Participación</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={6}>
          <Card className="h-100">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Mis Próximas Inscripciones</h5>
              <Badge bg="light" text="dark">
                {myUpcomingRegistrations.length}
              </Badge>
            </Card.Header>
            <Card.Body>
              {myUpcomingRegistrations.length > 0 ? (
                <ListGroup variant="flush">
                  {myUpcomingRegistrations.map(registration => (
                    <ListGroup.Item key={registration.inscripcion_id} className="px-0">
                      <div className="d-flex align-items-center">
                        <span className="fs-5 me-3">
                          {getEventTypeIcon(registration.evento?.tipo)}
                        </span>
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{registration.evento?.nombre}</h6>
                          <small className="text-muted">
                            {registration.evento?.fecha ? 
                              new Date(registration.evento.fecha).toLocaleDateString('es-ES') : 
                              'Fecha por definir'
                            }
                          </small>
                        </div>
                        <Badge bg={getStatusVariant(registration.evento?.estado)}>
                          {registration.evento?.estado}
                        </Badge>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <div className="text-center py-4">
                  <div className="text-muted mb-3 fs-1">Sin inscripciones</div>
                  <p className="text-muted">No tienes inscripciones próximas.</p>
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
                  <span>{Math.min(100, Math.round((dashboardStats.totalDistance / 200) * 100))}%</span>
                </div>
                <ProgressBar 
                  now={Math.min(100, Math.round((dashboardStats.totalDistance / 200) * 100))} 
                  variant="primary" 
                  animated 
                />
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Participación en Eventos</span>
                  <span>{Math.min(100, Math.round((dashboardStats.completedEvents / 5) * 100))}%</span>
                </div>
                <ProgressBar 
                  now={Math.min(100, Math.round((dashboardStats.completedEvents / 5) * 100))} 
                  variant="success" 
                  animated 
                />
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Nivel de Actividad</span>
                  <span>{Math.min(100, Math.round((dashboardStats.totalEvents / 10) * 100))}%</span>
                </div>
                <ProgressBar 
                  now={Math.min(100, Math.round((dashboardStats.totalEvents / 10) * 100))} 
                  variant="warning" 
                  animated 
                />
              </div>

              <div className="mt-4">
                <small className="text-muted">
                  {dashboardStats.userSpecificData 
                    ? 'Tus estadísticas personales - ¡Sigue así!' 
                    : 'Estadísticas generales de la plataforma'
                  }
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Próximos Eventos Destacados</h5>
              <Button as={Link} to="/eventos" variant="outline-primary" size="sm">
                Ver Todos
              </Button>
            </Card.Header>
            <Card.Body>
              {upcomingEvents.length > 0 ? (
                <ListGroup variant="flush">
                  {upcomingEvents.map(event => (
                    <ListGroup.Item key={event.evento_id} className="px-0">
                      <div className="d-flex align-items-start">
                        <span className="fs-4 me-3">
                          {getEventTypeIcon(event.tipo)}
                        </span>
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{event.nombre}</h6>
                          <p className="text-muted small mb-1">
                            {event.ubicacion}
                          </p>
                          <p className="text-muted small mb-2">
                            {event.fecha ? new Date(event.fecha).toLocaleDateString('es-ES') : 'Fecha por definir'}
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <Badge bg="light" text="dark">
                              {event.distancia_km || event.distancia || '0'}km
                            </Badge>
                            <Badge bg={getStatusVariant(event.estado)}>
                              {event.estado}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
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

        <Col lg={6}>
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">Acciones Rápidas</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button as={Link} to="/eventos" variant="primary" size="lg" className="text-start">
                  Explorar Eventos
                </Button>
                <Button as={Link} to="/cuenta/inscripciones" variant="outline-primary" size="lg" className="text-start">
                  Mis Inscripciones
                </Button>
                <Button as={Link} to="/cuenta/equipos" variant="outline-success" size="lg" className="text-start">
                  Mis Equipos
                </Button>
                <Button as={Link} to="/cuenta/perfil" variant="outline-info" size="lg" className="text-start">
                  Mi Perfil
                </Button>
                <Button as={Link} to="/resultados" variant="outline-warning" size="lg" className="text-start">
                  Ver Resultados
                </Button>
                
                {(user?.rol === 'organizador' || user?.rol === 'admin') && (
                  <Button as={Link} to="/organizador/dashboard" variant="outline-dark" size="lg" className="text-start">
                    Panel Organizador
                  </Button>
                )}
                
                {user?.rol === 'admin' && (
                  <Button as={Link} to="/admin/dashboard" variant="outline-danger" size="lg" className="text-start">
                    Panel Admin
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EnhancedDashboardPage;