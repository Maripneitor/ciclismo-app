import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Button, 
  Card, 
  Badge,
  ProgressBar,
  Form,
  Navbar,
  Nav,
  InputGroup,
  Dropdown,
  ListGroup,
  Spinner,
  Alert
} from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { eventsAPI, registrationsAPI } from '../services/api';

const HomePage = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [nextEvent, setNextEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    loadHomeData();
  }, [isAuthenticated]);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      setError('');

      // Cargar eventos desde la API real
      const eventsResponse = await eventsAPI.getAll();
      const eventsData = Array.isArray(eventsResponse) ? eventsResponse : 
                        (eventsResponse.data || eventsResponse || []);
      
      console.log('Eventos cargados:', eventsData);

      // Ordenar eventos por fecha y tomar los próximos
      const upcomingEvents = eventsData
        .filter(event => event.fecha && new Date(event.fecha) > new Date())
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
        .slice(0, 6);
      
      setFeaturedEvents(upcomingEvents);

      // Si el usuario está autenticado, cargar sus datos reales
      if (isAuthenticated) {
        await loadUserData(eventsData);
      }

    } catch (error) {
      console.error('Error loading home data:', error);
      setError('Error al cargar los datos. Por favor, intenta nuevamente.');
      
      // Datos de ejemplo para desarrollo
      setFeaturedEvents([
        {
          id: 1,
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
          id: 2,
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
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (allEvents) => {
    try {
      // Cargar inscripciones del usuario
      let userRegistrationsData = [];
      try {
        userRegistrationsData = await registrationsAPI.getAll();
        userRegistrationsData = Array.isArray(userRegistrationsData) ? userRegistrationsData : [];
      } catch (error) {
        console.log('No se pudieron cargar las inscripciones:', error);
        userRegistrationsData = [];
      }

      setUserRegistrations(userRegistrationsData);

      // Encontrar el próximo evento del usuario
      const userNextRegistration = userRegistrationsData.find(reg => 
        reg.evento && new Date(reg.evento.fecha) > new Date()
      );

      if (userNextRegistration && userNextRegistration.evento) {
        setNextEvent(userNextRegistration.evento);
      } else if (allEvents.length > 0) {
        // Si no tiene próximos eventos, mostrar el primer evento próximo disponible
        const nextAvailableEvent = allEvents
          .filter(event => event.fecha && new Date(event.fecha) > new Date())
          .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))[0];
        
        setNextEvent(nextAvailableEvent);
      }

      // Calcular estadísticas reales del usuario
      const userEvents = userRegistrationsData
        .filter(reg => reg.evento)
        .map(reg => reg.evento);

      const completedEvents = userEvents.filter(event => 
        event.fecha && new Date(event.fecha) <= new Date()
      );

      const totalDistance = userEvents.reduce((sum, event) => 
        sum + (parseFloat(event.distancia_km || event.distancia || 0)), 0
      );

      const weeklyDistance = Math.round(totalDistance / (userEvents.length || 1));
      
      setUserStats({
        totalEvents: userEvents.length,
        completedEvents: completedEvents.length,
        totalDistance: Math.round(totalDistance),
        weeklyDistance: weeklyDistance,
        participationRate: allEvents.length > 0 ? 
          Math.round((userEvents.length / allEvents.length) * 100) : 0
      });

    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const results = featuredEvents.filter(event => 
        event.nombre?.toLowerCase().includes(query.toLowerCase()) ||
        event.ubicacion?.toLowerCase().includes(query.toLowerCase()) ||
        event.tipo?.toLowerCase().includes(query.toLowerCase()) ||
        event.descripcion?.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getEventTypeIcon = (type) => {
    const icons = {
      'ruta': '🛣️',
      'montaña': '⛰️',
      'montana': '⛰️',
      'urbano': '🏙️',
      'competitivo': '🏆',
      'recreativo': '🚴'
    };
    return icons[type] || '🚴';
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Próximo': return 'warning';
      case 'En Curso': return 'success';
      case 'Finalizado': return 'secondary';
      case 'activo': return 'success';
      case 'proximamente': return 'warning';
      case 'completado': return 'secondary';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha por definir';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const routeTypes = [
    { type: 'all', label: 'Todas', icon: '🚴' },
    { type: 'ruta', label: 'Ruta', icon: '🛣️' },
    { type: 'montaña', label: 'Montaña', icon: '⛰️' },
    { type: 'urbano', label: 'Urbano', icon: '🏙️' },
    { type: 'competitivo', label: 'Competitivo', icon: '🏆' },
    { type: 'recreativo', label: 'Recreativo', icon: '😊' }
  ];

  const filteredEvents = activeFilter === 'all' 
    ? featuredEvents 
    : featuredEvents.filter(event => event.tipo === activeFilter);

  if (loading) {
    return (
      <div className="homepage-modern">
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="text-center">
            <Spinner animation="border" variant="primary" size="lg" />
            <p className="mt-3">Cargando eventos...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="homepage-modern">
      {/* Navigation Bar */}
      <Navbar expand="lg" className="modern-navbar" fixed="top">
        <Container>
          <Navbar.Brand as={Link} to="/" className="navbar-brand-modern">
            <span className="brand-icon">🚴‍♂️</span>
            <strong>Ciclismo</strong>App
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/eventos" className="nav-link-modern">
                Eventos
              </Nav.Link>
              <Nav.Link as={Link} to="/resultados" className="nav-link-modern">
                Resultados
              </Nav.Link>
              <Nav.Link as={Link} to="/comunidad" className="nav-link-modern">
                Comunidad
              </Nav.Link>
            </Nav>

            {/* Barra de Búsqueda */}
            <div className="search-container me-3">
              <InputGroup className="modern-search">
                <Form.Control
                  type="text"
                  placeholder="Buscar eventos, rutas..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="search-input"
                />
                <Button variant="outline-primary" className="search-btn">
                  🔍
                </Button>
              </InputGroup>

              {showSearchResults && (
                <div className="search-results-dropdown">
                  {searchResults.length > 0 ? (
                    searchResults.map(event => (
                      <div key={event.evento_id || event.id} className="search-result-item">
                        <Link 
                          to={`/evento/${event.evento_id || event.id}`}
                          onClick={() => setShowSearchResults(false)}
                        >
                          <strong>{event.nombre}</strong>
                          <small>{event.ubicacion} • {event.distancia_km || event.distancia || '0'}km</small>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="search-result-item text-muted">
                      No se encontraron resultados
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Menu */}
            {isAuthenticated ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="outline-light" className="user-dropdown-toggle">
                  <span className="user-avatar">👤</span>
                  {user?.nombre || user?.nombre_completo || 'Usuario'}
                </Dropdown.Toggle>
                <Dropdown.Menu className="user-dropdown-menu">
                  <Dropdown.Item as={Link} to="/cuenta/dashboard">
                    Mi Dashboard
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/cuenta/inscripciones">
                    Mis Inscripciones
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/cuenta/resultados">
                    Mis Resultados
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    Cerrar Sesión
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <div className="auth-buttons">
                <Button as={Link} to="/login" variant="outline-light" className="me-2">
                  Iniciar Sesión
                </Button>
                <Button as={Link} to="/registro" variant="primary" className="btn-gradient">
                  Registrarse
                </Button>
              </div>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <section className="hero-gradient-section">
        <Container>
          <Row className="min-vh-100 align-items-center">
            <Col lg={6} className="hero-content">
              <Badge bg="warning" className="hero-badge mb-3">
                🚀 PLATAFORMA #1 EN CICLISMO
              </Badge>
              <h1 className="hero-title display-1 fw-black">
                VIVE LA <span className="text-gradient">PASIÓN</span> SOBRE DOS RUEDAS
              </h1>
              <p className="hero-subtitle lead fs-2">
                Gestiona, participa y sigue eventos de ciclismo como nunca antes
              </p>
              
              <div className="hero-actions">
                {!isAuthenticated ? (
                  <>
                    <Button 
                      as={Link} 
                      to="/registro" 
                      className="btn-hero-primary me-3"
                      size="lg"
                    >
                      COMENZAR GRATIS
                    </Button>
                    <Button 
                      as={Link} 
                      to="/eventos" 
                      className="btn-hero-secondary"
                      variant="outline-light"
                      size="lg"
                    >
                      EXPLORAR EVENTOS
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      as={Link} 
                      to="/cuenta/dashboard" 
                      className="btn-hero-primary me-3"
                      size="lg"
                    >
                      MI DASHBOARD
                    </Button>
                    <Button 
                      as={Link} 
                      to="/eventos" 
                      className="btn-hero-secondary"
                      variant="outline-light"
                      size="lg"
                    >
                      NUEVO EVENTO
                    </Button>
                  </>
                )}
              </div>

              {/* Estadísticas reales */}
              <div className="hero-stats">
                <Row>
                  <Col xs={6} md={3}>
                    <div className="stat-item">
                      <div className="stat-number">{featuredEvents.length}+</div>
                      <div className="stat-label">Próximos Eventos</div>
                    </div>
                  </Col>
                  <Col xs={6} md={3}>
                    <div className="stat-item">
                      <div className="stat-number">{userStats?.totalEvents || 0}</div>
                      <div className="stat-label">Mis Eventos</div>
                    </div>
                  </Col>
                  <Col xs={6} md={3}>
                    <div className="stat-item">
                      <div className="stat-number">{userStats?.completedEvents || 0}</div>
                      <div className="stat-label">Completados</div>
                    </div>
                  </Col>
                  <Col xs={6} md={3}>
                    <div className="stat-item">
                      <div className="stat-number">{userStats?.totalDistance || 0}km</div>
                      <div className="stat-label">Distancia Total</div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col lg={6} className="hero-visual">
              <div className="floating-bike">
                <div className="bike-icon">🚴‍♂️</div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Dashboard Personalizado */}
      {isAuthenticated && userStats && (
        <section className="dashboard-section py-5">
          <Container>
            <Row className="mb-4">
              <Col>
                <h2 className="section-title display-4 fw-bold">
                  MI <span className="text-gradient">DASHBOARD</span>
                </h2>
                <p className="section-subtitle lead">
                  Bienvenido de vuelta, <strong>{user?.nombre || user?.nombre_completo}</strong>
                </p>
              </Col>
            </Row>
            
            <Row className="g-4">
              {/* Estadísticas Reales */}
              <Col md={3}>
                <Card className="glass-card stats-card">
                  <Card.Body>
                    <div className="stat-icon">📊</div>
                    <h3 className="stat-number">{userStats.totalEvents}</h3>
                    <p className="stat-label">Total Eventos</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="glass-card stats-card">
                  <Card.Body>
                    <div className="stat-icon">✅</div>
                    <h3 className="stat-number">{userStats.completedEvents}</h3>
                    <p className="stat-label">Completados</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="glass-card stats-card">
                  <Card.Body>
                    <div className="stat-icon">📏</div>
                    <h3 className="stat-number">{userStats.totalDistance}km</h3>
                    <p className="stat-label">Distancia Total</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="glass-card stats-card">
                  <Card.Body>
                    <div className="stat-icon">🎯</div>
                    <h3 className="stat-number">{userStats.participationRate}%</h3>
                    <p className="stat-label">Tasa Participación</p>
                    <ProgressBar now={userStats.participationRate} className="mt-2" />
                  </Card.Body>
                </Card>
              </Col>

              {/* Próximo Evento Real */}
              {nextEvent && (
                <Col lg={8}>
                  <Card className="glass-card next-event-card">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <Badge bg="primary" className="mb-2">PRÓXIMO EVENTO</Badge>
                          <h4 className="mb-1">{nextEvent.nombre}</h4>
                          <p className="text-muted mb-2">
                            {formatDate(nextEvent.fecha)}
                          </p>
                        </div>
                        <Button 
                          as={Link} 
                          to={`/evento/${nextEvent.evento_id || nextEvent.id}`}
                          variant="outline-primary" 
                          size="sm"
                        >
                          Ver Detalles
                        </Button>
                      </div>
                      
                      <Row>
                        <Col md={6}>
                          <div className="event-info">
                            <span>📍 {nextEvent.ubicacion || 'Ubicación no especificada'}</span>
                            <span>📏 {nextEvent.distancia_km || nextEvent.distancia || '0'}km</span>
                            <span>{getEventTypeIcon(nextEvent.tipo)} {nextEvent.tipo}</span>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="preparation-progress">
                            <span>
                              Estado: <Badge bg={getStatusVariant(nextEvent.estado)}>
                                {nextEvent.estado}
                              </Badge>
                            </span>
                            {nextEvent.cuota_inscripcion && (
                              <span className="d-block mt-2">
                                💰 €{nextEvent.cuota_inscripcion}
                              </span>
                            )}
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              )}

              {/* Acciones Rápidas */}
              <Col lg={4}>
                <Card className="glass-card quick-actions-card">
                  <Card.Body>
                    <h5 className="mb-3">Acciones Rápidas</h5>
                    <ListGroup variant="flush">
                      <ListGroup.Item action as={Link} to="/eventos">
                        📅 Buscar Eventos
                      </ListGroup.Item>
                      <ListGroup.Item action as={Link} to="/cuenta/inscripciones">
                        📋 Mis Inscripciones
                      </ListGroup.Item>
                      <ListGroup.Item action as={Link} to="/cuenta/resultados">
                        📊 Mis Resultados
                      </ListGroup.Item>
                      <ListGroup.Item action as={Link} to="/cuenta/equipos">
                        👥 Mis Equipos
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
      )}

      {/* Eventos Destacados */}
      <section className="events-section py-5 bg-light">
        <Container>
          <Row className="mb-4">
            <Col>
              <h2 className="section-title display-4 fw-bold">
                PRÓXIMOS <span className="text-gradient">EVENTOS</span>
              </h2>
              <p className="section-subtitle lead">
                No te pierdas estos desafíos
              </p>
            </Col>
          </Row>

          {/* Filtros */}
          <Row className="mb-4">
            <Col>
              <div className="route-filters">
                {routeTypes.map(route => (
                  <Button
                    key={route.type}
                    variant={activeFilter === route.type ? "primary" : "outline-primary"}
                    className="route-filter-btn me-2 mb-2"
                    onClick={() => setActiveFilter(route.type)}
                  >
                    <span className="me-2">{route.icon}</span>
                    {route.label}
                  </Button>
                ))}
              </div>
            </Col>
          </Row>

          {error && (
            <Alert variant="warning" className="mb-4">
              {error}
            </Alert>
          )}

          <Row className="g-4">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <Col key={event.evento_id || event.id} md={6} lg={4}>
                  <Card className="event-card h-100 border-0 shadow-sm">
                    <Card.Body className="d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <span className="fs-2">
                          {getEventTypeIcon(event.tipo)}
                        </span>
                        <Badge bg={getStatusVariant(event.estado)}>
                          {event.estado}
                        </Badge>
                      </div>
                      
                      <Card.Title className="h5">
                        <Link 
                          to={`/evento/${event.evento_id || event.id}`}
                          className="text-decoration-none text-dark"
                        >
                          {event.nombre}
                        </Link>
                      </Card.Title>
                      
                      <Card.Text className="text-muted small mb-2">
                        {formatDate(event.fecha)}
                      </Card.Text>
                      
                      <Card.Text className="flex-grow-1">
                        {event.descripcion || 'Sin descripción disponible.'}
                      </Card.Text>
                      
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between text-sm mb-2">
                          <span>{event.ubicacion || 'Ubicación no especificada'}</span>
                          <span>{event.distancia_km || event.distancia || '0'} km</span>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center">
                          <strong>€{event.cuota_inscripcion || 0}</strong>
                          <div className="d-flex gap-2">
                            <Button
                              as={Link}
                              to={`/evento/${event.evento_id || event.id}`}
                              variant="outline-primary"
                              size="sm"
                            >
                              Ver Detalles
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => navigate(`/evento/${event.evento_id || event.id}`)}
                              disabled={event.estado === 'Finalizado' || event.estado === 'completado'}
                            >
                              Inscribirse
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col>
                <Card className="text-center py-5">
                  <Card.Body>
                    <div className="text-muted mb-3 fs-1">🚴‍♂️</div>
                    <h5>No hay eventos próximos</h5>
                    <p className="text-muted">
                      No hay eventos que coincidan con tus criterios de búsqueda.
                    </p>
                    <Button 
                      variant="primary" 
                      onClick={() => setActiveFilter('all')}
                    >
                      Ver Todos los Eventos
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>
        </Container>
      </section>

      {/* CTA Final */}
      <section className="cta-section py-5 text-white">
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h2 className="display-4 fw-bold mb-4">
                ¿LISTO PARA EL <span className="text-warning">DESAFÍO</span>?
              </h2>
              <p className="lead fs-3 mb-4">
                Únete a la comunidad ciclista más innovadora
              </p>
              <Button 
                as={Link} 
                to={isAuthenticated ? "/eventos" : "/registro"}
                variant="warning"
                size="lg"
                className="btn-cta px-5 py-3 fw-bold"
              >
                {isAuthenticated ? "EXPLORAR EVENTOS" : "CREAR CUENTA GRATIS"}
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;