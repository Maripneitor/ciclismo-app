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
  Spinner
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { eventsAPI } from '../../services/api';

const EnhancedDashboardPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const eventsResponse = await eventsAPI.getAll();
      const eventsData = eventsResponse.data || eventsResponse;
      setEvents(Array.isArray(eventsData) ? eventsData : []);

      try {
        const userEventsResponse = await eventsAPI.getUserEvents();
        setUserEvents(userEventsResponse.data || userEventsResponse || []);
      } catch (userEventsError) {
        setUserEvents([]);
      }

      const calculatedStats = {
        total_usuarios: 0,
        total_eventos: eventsData.length,
        total_inscripciones: 0,
        total_admins: 0,
        total_organizadores: 0
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
      setStats({
        total_usuarios: 1247,
        total_eventos: 89,
        total_inscripciones: 2543,
        total_admins: 3,
        total_organizadores: 15
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
      userSpecificData: userEvents.length > 0
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

  const dashboardStats = calculateStats();
  const upcomingEvents = events
    .filter(event => event.fecha && new Date(event.fecha) > new Date())
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
        <Col md={3}>
          <Card className="stat-card h-100">
            <Card.Body className="text-center">
              <div className="stat-icon text-primary">Próximos</div>
              <h3 className="text-primary mt-2">{dashboardStats.upcomingEvents}</h3>
              <p className="text-muted mb-0">Próximos Eventos</p>
              {!dashboardStats.userSpecificData && (
                <small className="text-muted">Disponibles</small>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card h-100">
            <Card.Body className="text-center">
              <div className="stat-icon text-success">Completados</div>
              <h3 className="text-success mt-2">{dashboardStats.completedEvents}</h3>
              <p className="text-muted mb-0">Completados</p>
              {!dashboardStats.userSpecificData && (
                <small className="text-muted">Totales</small>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card h-100">
            <Card.Body className="text-center">
              <div className="stat-icon text-warning">Distancia</div>
              <h3 className="text-warning mt-2">{dashboardStats.totalDistance}km</h3>
              <p className="text-muted mb-0">Distancia Total</p>
              {!dashboardStats.userSpecificData && (
                <small className="text-muted">Acumulada</small>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card h-100">
            <Card.Body className="text-center">
              <div className="stat-icon text-info">Total</div>
              <h3 className="text-info mt-2">{dashboardStats.totalEvents}</h3>
              <p className="text-muted mb-0">Total Eventos</p>
              {!dashboardStats.userSpecificData && (
                <small className="text-muted">En plataforma</small>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={6}>
          <Card className="h-100">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Próximo Evento Destacado</h5>
            </Card.Header>
            <Card.Body>
              {upcomingEvents.length > 0 ? (
                <div>
                  <div className="d-flex align-items-start mb-3">
                    <span className="fs-2 me-3">
                      {getEventTypeIcon(upcomingEvents[0].tipo)}
                    </span>
                    <div>
                      <h5>{upcomingEvents[0].nombre}</h5>
                      <p className="text-muted mb-1">
                        {upcomingEvents[0].ubicacion}
                      </p>
                      <p className="text-muted mb-1">
                        {new Date(upcomingEvents[0].fecha).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <Badge bg="primary" className="me-2">
                        {upcomingEvents[0].distancia_km || upcomingEvents[0].distancia || '0'} km
                      </Badge>
                      <Badge bg="outline-secondary">
                        {upcomingEvents[0].tipo || 'General'}
                      </Badge>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <Button 
                      as={Link} 
                      to="/eventos" 
                      variant="primary" 
                      size="sm"
                    >
                      Ver Detalles
                    </Button>
                    <Button variant="outline-secondary" size="sm">
                      Prepara tu Ruta
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="text-muted mb-3 fs-1">Sin eventos</div>
                  <p className="text-muted mb-3">No hay eventos próximos disponibles.</p>
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

        <Col md={12}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Acciones Rápidas</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex gap-3 flex-wrap">
                <Button as={Link} to="/eventos" variant="primary" className="action-btn">
                  Explorar Eventos
                </Button>
                <Button as={Link} to="/cuenta/perfil" variant="outline-primary" className="action-btn">
                  Editar Perfil
                </Button>
                <Button as={Link} to="/cuenta/historial" variant="outline-success" className="action-btn">
                  Ver Historial
                </Button>
                <Button as={Link} to="/resultados" variant="outline-info" className="action-btn">
                  Ver Resultados
                </Button>
                
                {(user?.rol === 'organizador' || user?.rol === 'admin') && (
                  <Button as={Link} to="/organizador/dashboard" variant="outline-warning" className="action-btn">
                    Panel Organizador
                  </Button>
                )}
                
                {user?.rol === 'admin' && (
                  <Button as={Link} to="/admin/dashboard" variant="outline-danger" className="action-btn">
                    Panel Admin
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={12}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Próximos Eventos Disponibles</h5>
              <Button as={Link} to="/eventos" variant="outline-primary" size="sm">
                Ver Todos
              </Button>
            </Card.Header>
            <Card.Body>
              {upcomingEvents.length > 0 ? (
                <Row>
                  {upcomingEvents.map((event) => (
                    <Col md={4} key={event.evento_id || event.id} className="mb-3">
                      <Card className="h-100 event-card">
                        <Card.Body>
                          <div className="d-flex align-items-start mb-2">
                            <span className="fs-4 me-2">
                              {getEventTypeIcon(event.tipo)}
                            </span>
                            <Badge 
                              bg={
                                event.estado === 'activo' ? 'success' :
                                event.estado === 'proximamente' ? 'warning' : 'secondary'
                              }
                              className="ms-auto"
                            >
                              {event.estado || 'disponible'}
                            </Badge>
                          </div>
                          
                          <h6 className="mb-2">{event.nombre}</h6>
                          <p className="text-muted small mb-1">
                            {event.ubicacion}
                          </p>
                          <p className="text-muted small mb-2">
                            {event.fecha ? new Date(event.fecha).toLocaleDateString() : 'Fecha por definir'}
                          </p>
                          
                          <div className="d-flex justify-content-between align-items-center">
                            <Badge bg="light" text="dark">
                              {event.distancia_km || event.distancia || '0'}km
                            </Badge>
                            <Button variant="primary" size="sm">
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

export default EnhancedDashboardPage;