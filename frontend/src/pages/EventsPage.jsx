// frontend/src/pages/EventsPage.jsx - MEJORADO CON API Y FILTROS
import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Row, Col, Card, Button, Spinner, Alert, Form,
  Badge, InputGroup, Dropdown, ButtonGroup, Modal
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { eventsAPI, registrationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import EnhancedEventCard from '../components/events/EnhancedEventCard';
import AdvancedSearchFilters from '../components/events/AdvancedSearchFilters';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    tipo: '',
    dificultad: '',
    distanciaMin: '',
    distanciaMax: '',
    fechaInicio: '',
    fechaFin: '',
    ubicacion: '',
    precioMin: '',
    precioMax: '',
    estado: '',
    search: ''
  });

  const [sortBy, setSortBy] = useState('fecha');
  const [loadingEvents, setLoadingEvents] = useState([]);
  const [registrationMessage, setRegistrationMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterAndSortEvents();
  }, [events, filters, sortBy, searchQuery]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError('');
      const eventsData = await eventsAPI.getAll();
      
      const adaptedEvents = eventsData.map(event => ({
        id: event.evento_id || event.id,
        evento_id: event.evento_id,
        nombre: event.nombre,
        descripcion: event.descripcion,
        fecha: event.fecha,
        ubicacion: event.ubicacion,
        distancia_km: event.distancia_km,
        tipo: event.tipo,
        estado: event.estado,
        cuota_inscripcion: event.cuota_inscripcion,
        participantes_inscritos: event.participantes_inscritos || 0,
        cupo_maximo: event.cupo_maximo,
        dificultad: event.dificultad,
        elevacion: event.elevacion,
        imagen: event.imagen
      }));
      
      setEvents(adaptedEvents);
    } catch (error) {
      console.error('Error loading events:', error);
      setError('Error cargando eventos del servidor');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortEvents = useCallback(() => {
    let filtered = [...events];

    // Filtro de búsqueda por texto
    if (filters.search) {
      const query = filters.search.toLowerCase();
      filtered = filtered.filter(event =>
        event.nombre?.toLowerCase().includes(query) ||
        event.descripcion?.toLowerCase().includes(query) ||
        event.ubicacion?.toLowerCase().includes(query)
      );
    }

    // Filtros individuales
    if (filters.tipo) {
      filtered = filtered.filter(event => event.tipo === filters.tipo);
    }

    if (filters.dificultad) {
      filtered = filtered.filter(event => event.dificultad === filters.dificultad);
    }

    if (filters.estado) {
      filtered = filtered.filter(event => event.estado === filters.estado);
    }

    if (filters.ubicacion) {
      filtered = filtered.filter(event => 
        event.ubicacion?.toLowerCase().includes(filters.ubicacion.toLowerCase())
      );
    }

    // Filtros numéricos
    if (filters.distanciaMin) {
      filtered = filtered.filter(event => 
        event.distancia_km >= parseFloat(filters.distanciaMin)
      );
    }

    if (filters.distanciaMax) {
      filtered = filtered.filter(event => 
        event.distancia_km <= parseFloat(filters.distanciaMax)
      );
    }

    if (filters.precioMin) {
      filtered = filtered.filter(event => 
        event.cuota_inscripcion >= parseFloat(filters.precioMin)
      );
    }

    if (filters.precioMax) {
      filtered = filtered.filter(event => 
        event.cuota_inscripcion <= parseFloat(filters.precioMax)
      );
    }

    // Filtros de fecha
    if (filters.fechaInicio) {
      const startDate = new Date(filters.fechaInicio);
      filtered = filtered.filter(event => new Date(event.fecha) >= startDate);
    }

    if (filters.fechaFin) {
      const endDate = new Date(filters.fechaFin);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(event => new Date(event.fecha) <= endDate);
    }

    // Ordenamiento
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
          return (dificultades[b.dificultad?.toLowerCase()] || 0) - 
                 (dificultades[a.dificultad?.toLowerCase()] || 0);
        case 'popularidad':
          return (b.participantes_inscritos || 0) - (a.participantes_inscritos || 0);
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
  }, [events, filters, sortBy]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (query) => {
    setFilters(prev => ({
      ...prev,
      search: query
    }));
  };

  const clearFilters = () => {
    setFilters({
      tipo: '',
      dificultad: '',
      distanciaMin: '',
      distanciaMax: '',
      fechaInicio: '',
      fechaFin: '',
      ubicacion: '',
      precioMin: '',
      precioMax: '',
      estado: '',
      search: ''
    });
    setSortBy('fecha');
    setSearchQuery('');
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

    setLoadingEvents(prev => [...prev, event.evento_id || event.id]);
    setRegistrationMessage('');

    try {
      const registrationData = {
        evento_id: event.evento_id || event.id,
        categoria_id: 1,
        talla_playera_id: 1
      };

      const result = await registrationsAPI.registerForEvent(registrationData);
      setRegistrationMessage(`¡Inscripción exitosa! ${result.message || `Te has registrado en ${event.nombre}`}`);
      
      setEvents(prev => prev.map(e => 
        (e.evento_id || e.id) === (event.evento_id || event.id)
          ? { ...e, participantes_inscritos: (e.participantes_inscritos || 0) + 1 }
          : e
      ));

    } catch (error) {
      console.error('Error en inscripción:', error);
      setRegistrationMessage(error.message || 'Error al realizar la inscripción');
    } finally {
      setLoadingEvents(prev => prev.filter(id => id !== (event.evento_id || event.id)));
    }
  };

  const handleQuickView = (event) => {
    setSelectedEvent(event);
    setShowQuickView(true);
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== '' && value !== null && value !== undefined
  ).length;

  if (loading && events.length === 0) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3">Cargando eventos...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
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
              {activeFiltersCount > 0 && (
                <Badge bg="primary" className="fs-6 px-3 py-2">
                  {activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''} activo{activeFiltersCount !== 1 ? 's' : ''}
                </Badge>
              )}

              <Dropdown>
                <Dropdown.Toggle variant="outline-primary">
                  Ordenar: {
                    sortBy === 'fecha' ? 'Fecha' :
                    sortBy === 'distancia' ? 'Distancia' :
                    sortBy === 'precio' ? 'Precio' :
                    sortBy === 'dificultad' ? 'Dificultad' :
                    'Popularidad'
                  }
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setSortBy('fecha')}>
                    Fecha
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSortBy('distancia')}>
                    Distancia
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSortBy('precio')}>
                    Precio
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSortBy('dificultad')}>
                    Dificultad
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSortBy('popularidad')}>
                    Popularidad
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </Col>
      </Row>

      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {registrationMessage && (
        <Row className="mb-4">
          <Col>
            <Alert 
              variant={registrationMessage.includes('éxito') ? 'success' : 'warning'}
              dismissible 
              onClose={() => setRegistrationMessage('')}
            >
              {registrationMessage}
            </Alert>
          </Col>
        </Row>
      )}

      <Row>
        <Col lg={3}>
          <AdvancedSearchFilters
            onFiltersChange={handleFiltersChange}
            loading={loading}
          />
          
          {/* Búsqueda rápida por texto */}
          <Card className="mb-4">
            <Card.Body>
              <Form.Group>
                <Form.Label className="fw-semibold">🔍 Búsqueda rápida</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Buscar eventos..."
                    value={filters.search}
                    onChange={(e) => handleFiltersChange({
                      ...filters,
                      search: e.target.value
                    })}
                  />
                  {filters.search && (
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => handleFiltersChange({...filters, search: ''})}
                    >
                      ✕
                    </Button>
                  )}
                </InputGroup>
              </Form.Group>
            </Card.Body>
          </Card>

          {/* Botón Limpiar Todo */}
          {activeFiltersCount > 0 && (
            <div className="d-grid">
              <Button variant="outline-danger" onClick={clearFilters}>
                🗑️ Limpiar Todos los Filtros ({activeFiltersCount})
              </Button>
            </div>
          )}
        </Col>

        <Col lg={9}>
          <div className="events-grid-container">
            {loading && events.length > 0 ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Actualizando eventos...</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-5">
                <h4 className="text-muted">No se encontraron eventos</h4>
                <p className="text-muted mb-3">
                  {activeFiltersCount > 0 
                    ? 'Intenta ajustar los filtros o la búsqueda'
                    : 'No hay eventos disponibles en este momento'
                  }
                </p>
                {activeFiltersCount > 0 && (
                  <Button variant="outline-primary" onClick={clearFilters}>
                    Limpiar filtros
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <p className="text-muted mb-0">
                    Mostrando {filteredEvents.length} de {events.length} eventos
                  </p>
                  <small className="text-muted">
                    Ordenado por {sortBy === 'fecha' ? 'fecha' : 
                    sortBy === 'distancia' ? 'distancia' :
                    sortBy === 'precio' ? 'precio' :
                    sortBy === 'dificultad' ? 'dificultad' : 'popularidad'}
                  </small>
                </div>
                <Row className="g-4">
                  {filteredEvents.map((event) => (
                    <Col key={event.evento_id || event.id} xs={12} lg={6} xl={4}>
                      <EnhancedEventCard
                        event={event}
                        onRegister={handleRegister}
                        onQuickView={handleQuickView}
                        isLoading={loadingEvents.includes(event.evento_id || event.id)}
                        isAuthenticated={isAuthenticated}
                      />
                    </Col>
                  ))}
                </Row>
              </>
            )}
          </div>
        </Col>
      </Row>

      <Modal show={showQuickView} onHide={() => setShowQuickView(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedEvent?.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <Row>
              <Col md={6}>
                <img 
                  src={selectedEvent.imagen} 
                  alt={selectedEvent.nombre}
                  className="img-fluid rounded mb-3"
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
              </Col>
              <Col md={6}>
                <p><strong>Ubicación:</strong> {selectedEvent.ubicacion}</p>
                <p><strong>Fecha:</strong> {new Date(selectedEvent.fecha).toLocaleDateString('es-ES')}</p>
                <p><strong>Distancia:</strong> {selectedEvent.distancia_km} km</p>
                <p><strong>Elevación:</strong> {selectedEvent.elevacion} m</p>
                <p><strong>Dificultad:</strong> {selectedEvent.dificultad}</p>
                <p><strong>Estado:</strong> {selectedEvent.estado}</p>
                <p><strong>Cupos:</strong> {selectedEvent.participantes_inscritos}/{selectedEvent.cupo_maximo}</p>
              </Col>
              <Col xs={12}>
                <p className="mt-3">{selectedEvent.descripcion}</p>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowQuickView(false)}>
            Cerrar
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              setShowQuickView(false);
              navigate(`/evento/${selectedEvent?.evento_id || selectedEvent?.id}`);
            }}
          >
            Ver Detalles Completos
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EventsPage;