// frontend/src/pages/EventsPage.jsx - VERSIÓN FINAL MEJORADA
import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Row, Col, Card, Button, Spinner, Alert, Form,
  Badge, InputGroup, Dropdown, ButtonGroup
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { eventsAPI, registrationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import EnhancedEventCard from '../components/events/EnhancedEventCard';
import AdvancedSearchFilters from '../components/events/AdvancedSearchFilters';
import './EventsPage.css';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    tipos: [],
    distancia: [0, 200],
    precio: [0, 100],
    fecha: null,
    ubicacion: '',
    bounds: null,
    search: '',
    estado: 'all',
    dificultad: 'all'
  });

  const [sortBy, setSortBy] = useState('fecha');
  const [loadingEvents, setLoadingEvents] = useState([]);
  const [registrationMessage, setRegistrationMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterAndSortEvents();
  }, [events, filters, sortBy, searchQuery]);

  const loadEvents = async () => {
    try {
      setLoading(true);
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
        },
        {
          id: 5,
          nombre: 'Tour Costa del Sol',
          descripcion: 'Ruta costera con vistas espectaculares al mar Mediterráneo. Perfecta para disfrutar del buen clima.',
          fecha: '2024-10-12T09:00:00',
          ubicacion: 'Málaga, España',
          distancia_km: 95,
          tipo: 'ruta',
          estado: 'Próximo',
          cuota_inscripcion: 40.00,
          participantes_inscritos: 60,
          cupo_maximo: 120,
          dificultad: 'Media',
          elevacion: 400,
          imagen: '/images/events/costa-sol.jpg'
        },
        {
          id: 6,
          nombre: 'Urban Sprint Valencia',
          descripcion: 'Carrera urbana rápida por el centro histórico y la Ciudad de las Artes y las Ciencias.',
          fecha: '2024-11-08T18:00:00',
          ubicacion: 'Valencia, España',
          distancia_km: 30,
          tipo: 'urbano',
          estado: 'Próximo',
          cuota_inscripcion: 20.00,
          participantes_inscritos: 80,
          cupo_maximo: 150,
          dificultad: 'Baja',
          elevacion: 50,
          imagen: '/images/events/valencia-urban.jpg'
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

  const filterAndSortEvents = useCallback(() => {
    let filtered = [...events];

    if (filters.search) {
      const query = filters.search.toLowerCase();
      filtered = filtered.filter(event =>
        event.nombre?.toLowerCase().includes(query) ||
        event.descripcion?.toLowerCase().includes(query) ||
        event.ubicacion?.toLowerCase().includes(query)
      );
    }

    if (filters.tipos.length > 0) {
      filtered = filtered.filter(event => 
        filters.tipos.includes(event.tipo)
      );
    }

    filtered = filtered.filter(event => 
      event.distancia_km >= filters.distancia[0] &&
      event.distancia_km <= filters.distancia[1]
    );

    filtered = filtered.filter(event => 
      event.cuota_inscripcion >= filters.precio[0] &&
      event.cuota_inscripcion <= filters.precio[1]
    );

    if (filters.fecha) {
      const filterDate = new Date(filters.fecha).toDateString();
      filtered = filtered.filter(event => 
        new Date(event.fecha).toDateString() === filterDate
      );
    }

    if (filters.estado !== 'all') {
      filtered = filtered.filter(event => event.estado === filters.estado);
    }

    if (filters.dificultad !== 'all') {
      filtered = filtered.filter(event => 
        event.dificultad?.toLowerCase() === filters.dificultad
      );
    }

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
      tipos: [],
      distancia: [0, 200],
      precio: [0, 100],
      fecha: null,
      ubicacion: '',
      bounds: null,
      search: '',
      estado: 'all',
      dificultad: 'all'
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      setRegistrationMessage(`Inscripción exitosa! Te has registrado en ${event.nombre}`);
      
      setEvents(prev => prev.map(e => 
        e.id === event.id 
          ? { ...e, participantes_inscritos: (e.participantes_inscritos || 0) + 1 }
          : e
      ));

    } catch (error) {
      setRegistrationMessage('Error al realizar la inscripción');
    } finally {
      setLoadingEvents(prev => prev.filter(id => id !== event.id));
    }
  };

  const activeFiltersCount = Object.values(filters).filter(filter => {
    if (Array.isArray(filter)) {
      if (filter === filters.distancia) return filter[0] !== 0 || filter[1] !== 200;
      if (filter === filters.precio) return filter[0] !== 0 || filter[1] !== 100;
      return filter.length > 0;
    }
    if (filter instanceof Date) return true;
    return filter !== null && filter !== '' && filter !== undefined && filter !== 'all';
  }).length;

  if (loading && events.length === 0) {
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
                <Badge bg="light" text="dark" className="fs-6 px-3 py-2">
                  Vista Grid
                </Badge>

                <Dropdown>
                  <Dropdown.Toggle variant="outline-primary">
                    Ordenar: {
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

        <AdvancedSearchFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          events={events}
          onSearch={handleSearch}
        />

        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Badge bg="primary" className="fs-6 px-3 py-2">
                  {filteredEvents.length} eventos encontrados
                </Badge>
                {activeFiltersCount > 0 && (
                  <Badge bg="info" className="ms-2 fs-6 px-3 py-2">
                    {activeFiltersCount} filtros activos
                  </Badge>
                )}
              </div>
              <Button
                variant="outline-secondary"
                onClick={clearFilters}
                disabled={activeFiltersCount === 0}
              >
                Limpiar Filtros
              </Button>
            </div>
          </Col>
        </Row>

        <div className="events-grid">
          {filteredEvents.length === 0 ? (
            <Col>
              <Card className="text-center py-5">
                <Card.Body>
                  <div className="text-muted mb-3" style={{ fontSize: '4rem' }}></div>
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
            <Row className="g-4">
              {filteredEvents.map((event, index) => (
                <Col key={event.id} xs={12} md={6} lg={4}>
                  <div className="event-card-animated" style={{ animationDelay: `${index * 0.1}s` }}>
                    <EnhancedEventCard
                      event={event}
                      onRegister={handleRegister}
                      loadingEvents={loadingEvents}
                      isAuthenticated={isAuthenticated}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Container>
    </div>
  );
};

export default EventsPage;