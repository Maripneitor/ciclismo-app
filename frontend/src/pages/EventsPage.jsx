// frontend/src/pages/EventsPage.jsx - ACTUALIZADA
import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Button, Spinner, Alert, Form,
  Badge, InputGroup, Dropdown, ButtonGroup
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { eventsAPI, registrationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import EnhancedEventCard from '../components/events/EnhancedEventCard';
import './EventsPage.css';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Filtros mejorados
  const [filters, setFilters] = useState({
    search: '',
    tipo: 'all',
    estado: 'all',
    dificultad: 'all',
    distancia: 'all',
    precio: 'all'
  });

  const [sortBy, setSortBy] = useState('fecha');
  const [viewMode, setViewMode] = useState('grid');
  const [loadingEvents, setLoadingEvents] = useState([]);
  const [registrationMessage, setRegistrationMessage] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterAndSortEvents();
  }, [events, filters, sortBy]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      // Datos de ejemplo enriquecidos
      const demoEvents = [
        {
          id: 1,
          nombre: 'Gran Fondo Sierra Nevada',
          descripcion: 'Desafío de montaña en los picos más altos de España. Ruta técnica con paisajes espectaculares.',
          fecha: '2024-06-15T08:00:00',
          ubicacion: 'Granada, España',
          distancia_km: 120,
          tipo: 'montaña',
          estado: 'Próximo',
          cuota_inscripcion: 50.00,
          participantes_inscritos: 45,
          cupo_maximo: 100,
          dificultad: 'Alta',
          elevacion: 2500,
          imagen: '/images/events/sierra-nevada.jpg'
        },
        {
          id: 2,
          nombre: 'Carrera Nocturna Madrid',
          descripcion: 'Recorrido urbano iluminado por el centro histórico de Madrid. Ambiente festivo y seguro.',
          fecha: '2024-07-20T20:00:00',
          ubicacion: 'Madrid, España',
          distancia_km: 45,
          tipo: 'urbano',
          estado: 'Próximo',
          cuota_inscripcion: 25.00,
          participantes_inscritos: 120,
          cupo_maximo: 200,
          dificultad: 'Media',
          elevacion: 300,
          imagen: '/images/events/madrid-nocturna.jpg'
        },
        {
          id: 3,
          nombre: 'Maratón Costa Barcelona',
          descripcion: 'Ruta costera con vistas al mediterráneo. Perfecta para disfrutar del paisaje y el buen clima.',
          fecha: '2024-08-10T09:00:00',
          ubicacion: 'Barcelona, España',
          distancia_km: 80,
          tipo: 'ruta',
          estado: 'Próximo',
          cuota_inscripcion: 35.00,
          participantes_inscritos: 75,
          cupo_maximo: 150,
          dificultad: 'Media',
          elevacion: 500,
          imagen: '/images/events/costa-barcelona.jpg'
        },
        {
          id: 4,
          nombre: 'Extreme Mountain Challenge',
          descripcion: 'Para los más aventureros. Ruta técnica con secciones de singletrack y descensos vertiginosos.',
          fecha: '2024-09-05T07:00:00',
          ubicacion: 'Pirineos, España',
          distancia_km: 65,
          tipo: 'montaña',
          estado: 'Próximo',
          cuota_inscripcion: 60.00,
          participantes_inscritos: 95,
          cupo_maximo: 100,
          dificultad: 'Extrema',
          elevacion: 1800,
          imagen: '/images/events/pirineos-extreme.jpg'
        }
      ];

      setEvents(demoEvents);
    } catch (error) {
      console.error('Error loading events:', error);
      setError('Error cargando eventos del servidor');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortEvents = () => {
    let filtered = [...events];

    // Aplicar filtros
    if (filters.search) {
      filtered = filtered.filter(event =>
        event.nombre?.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.descripcion?.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.ubicacion?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.tipo !== 'all') {
      filtered = filtered.filter(event => event.tipo === filters.tipo);
    }

    if (filters.estado !== 'all') {
      filtered = filtered.filter(event => event.estado === filters.estado);
    }

    if (filters.dificultad !== 'all') {
      filtered = filtered.filter(event => event.dificultad?.toLowerCase() === filters.dificultad);
    }

    if (filters.distancia !== 'all') {
      filtered = filtered.filter(event => {
        const distancia = event.distancia_km || 0;
        switch (filters.distancia) {
          case 'corta': return distancia <= 50;
          case 'media': return distancia > 50 && distancia <= 100;
          case 'larga': return distancia > 100;
          default: return true;
        }
      });
    }

    if (filters.precio !== 'all') {
      filtered = filtered.filter(event => {
        const precio = event.cuota_inscripcion || 0;
        switch (filters.precio) {
          case 'gratis': return precio === 0;
          case 'economico': return precio > 0 && precio <= 25;
          case 'premium': return precio > 25;
          default: return true;
        }
      });
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'fecha':
          return new Date(a.fecha) - new Date(b.fecha);
        case 'distancia':
          return (b.distancia_km || 0) - (a.distancia_km || 0);
        case 'precio':
          return (a.cuota_inscripcion || 0) - (b.cuota_inscripcion || 0);
        case 'dificultad':
          const dificultades = { 'baja': 1, 'media': 2, 'alta': 3, 'extrema': 4 };
          return (dificultades[b.dificultad?.toLowerCase()] || 0) - (dificultades[a.dificultad?.toLowerCase()] || 0);
        case 'popularidad':
          return (b.participantes_inscritos || 0) - (a.participantes_inscritos || 0);
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      tipo: 'all',
      estado: 'all',
      dificultad: 'all',
      distancia: 'all',
      precio: 'all'
    });
    setSortBy('fecha');
  };

  const handleRegister = async (event) => {
    if (!isAuthenticated) {
      setRegistrationMessage('Debes iniciar sesión para inscribirte en eventos');
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            from: '/eventos',
            message: 'Inicia sesión para inscribirte en eventos'
          }
        });
      }, 1500);
      return;
    }

    setLoadingEvents(prev => [...prev, event.id]);
    setRegistrationMessage('');

    try {
      // Simular inscripción
      await new Promise(resolve => setTimeout(resolve, 1500));
      setRegistrationMessage(`¡Inscripción exitosa! Te has registrado en ${event.nombre}`);
      
      // Actualizar contador
      setEvents(prev => prev.map(e => 
        e.id === event.id 
          ? { ...e, participantes_inscritos: (e.participantes_inscritos || 0) + 1 }
          : e
      ));

    } catch (error) {
      setRegistrationMessage('❌ Error al realizar la inscripción');
    } finally {
      setLoadingEvents(prev => prev.filter(id => id !== event.id));
    }
  };

  if (loading) {
    return (
      <div className="events-page">
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
    <div className="events-page">
      <Container className="py-5">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="display-5 fw-bold mb-2">
                  Catálogo de <span className="text-primary">Eventos</span>
                </h1>
                <p className="text-muted">
                  Descubre los mejores eventos de ciclismo
                </p>
              </div>
              <div className="d-flex gap-3">
                <ButtonGroup>
                  <Button
                    variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
                    onClick={() => setViewMode('grid')}
                  >
                    ⏹ Grid
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
                    onClick={() => setViewMode('list')}
                  >
                    📋 Lista
                  </Button>
                </ButtonGroup>

                <Dropdown>
                  <Dropdown.Toggle variant="outline-primary">
                    📊 Ordenar: {
                      sortBy === 'fecha' ? 'Fecha' :
                      sortBy === 'distancia' ? 'Distancia' :
                      sortBy === 'precio' ? 'Precio' :
                      sortBy === 'dificultad' ? 'Dificultad' : 'Popularidad'
                    }
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setSortBy('fecha')}>Fecha</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortBy('distancia')}>Distancia</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortBy('precio')}>Precio</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortBy('dificultad')}>Dificultad</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortBy('popularidad')}>Popularidad</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </Col>
        </Row>

        {registrationMessage && (
          <Alert 
            variant={registrationMessage.includes('éxito') ? 'success' : 'warning'} 
            className="mb-4"
            dismissible
            onClose={() => setRegistrationMessage('')}
          >
            {registrationMessage}
          </Alert>
        )}

        {/* Filtros Mejorados */}
        <Card className="mb-4">
          <Card.Body>
            <Row className="g-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>🔍 Buscar</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre, ubicación..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>🚴 Tipo</Form.Label>
                  <Form.Select
                    value={filters.tipo}
                    onChange={(e) => handleFilterChange('tipo', e.target.value)}
                  >
                    <option value="all">Todos</option>
                    <option value="ruta">Ruta</option>
                    <option value="montaña">Montaña</option>
                    <option value="urbano">Urbano</option>
                    <option value="competitivo">Competitivo</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>📅 Estado</Form.Label>
                  <Form.Select
                    value={filters.estado}
                    onChange={(e) => handleFilterChange('estado', e.target.value)}
                  >
                    <option value="all">Todos</option>
                    <option value="Próximo">Próximo</option>
                    <option value="En Curso">En Curso</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>💪 Dificultad</Form.Label>
                  <Form.Select
                    value={filters.dificultad}
                    onChange={(e) => handleFilterChange('dificultad', e.target.value)}
                  >
                    <option value="all">Todas</option>
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                    <option value="extrema">Extrema</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>🛣️ Distancia</Form.Label>
                  <Form.Select
                    value={filters.distancia}
                    onChange={(e) => handleFilterChange('distancia', e.target.value)}
                  >
                    <option value="all">Todas</option>
                    <option value="corta">Corta (&lt;50km)</option>
                    <option value="media">Media (51-100km)</option>
                    <option value="larga">Larga (&gt;100km)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={1} className="d-flex align-items-end">
                <Button
                  variant="outline-secondary"
                  onClick={clearFilters}
                  className="w-100"
                  title="Limpiar filtros"
                >
                  🗑️
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Resultados */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <Badge bg="primary" className="fs-6 px-3 py-2">
                {filteredEvents.length} eventos encontrados
              </Badge>
              {(filters.search || filters.tipo !== 'all' || filters.estado !== 'all') && (
                <Badge bg="info" className="ms-2 fs-6 px-3 py-2">
                  Filtros activos
                </Badge>
              )}
            </div>
          </Col>
        </Row>

        {/* Grid de Eventos */}
        <Row className="g-4">
          {filteredEvents.length === 0 ? (
            <Col>
              <Card className="text-center py-5">
                <Card.Body>
                  <div className="text-muted mb-3" style={{ fontSize: '4rem' }}>🚴</div>
                  <h4>No se encontraron eventos</h4>
                  <p className="text-muted mb-4">
                    No hay eventos disponibles que coincidan con tus criterios de búsqueda.
                  </p>
                  <Button variant="primary" onClick={clearFilters}>
                    Limpiar Filtros
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ) : (
            filteredEvents.map(event => (
              <Col key={event.id} xs={12} md={6} lg={4}>
                <EnhancedEventCard
                  event={event}
                  onRegister={handleRegister}
                  loadingEvents={loadingEvents}
                  isAuthenticated={isAuthenticated}
                />
              </Col>
            ))
          )}
        </Row>
      </Container>
    </div>
  );
};

export default EventsPage;