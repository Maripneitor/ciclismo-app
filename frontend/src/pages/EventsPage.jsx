import React, { useState, useEffect, useCallback } from 'react';
import {
    Container, Row, Col, Card, Button, Spinner, Alert, Form,
    Badge, InputGroup, Dropdown, ListGroup, ProgressBar, ButtonGroup
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

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
        fecha: '',
        distancia: 'all',
        precio: 'all'
    });

    // Nuevos estados para funcionalidades dinámicas
    const [sortBy, setSortBy] = useState('fecha');
    const [viewMode, setViewMode] = useState('grid');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showQuickView, setShowQuickView] = useState(false);
    const [loadingEvents, setLoadingEvents] = useState([]);

    useEffect(() => {
        loadEvents();
    }, []);

    useEffect(() => {
        filterAndSortEvents();
    }, [events, filters, sortBy]);

    const loadEvents = async () => {
        try {
            setLoading(true);
            const response = await eventsAPI.getAll();
            let eventsData = Array.isArray(response) ? response : (response.data || []);
            
            // Asegurar que todos los eventos tengan un ID único
            eventsData = eventsData.map((event, index) => ({
                ...event,
                id: event.id || `temp-${Date.now()}-${index}`
            }));
            
            setEvents(eventsData);
        } catch (error) {
            console.error('Error loading events:', error);
            setError('Error cargando eventos. Mostrando datos de demostración.');
            // Datos de demostración con IDs garantizados
            setEvents([
                {
                    id: 1,
                    nombre: 'Gran Fondo Sierra Nevada',
                    descripcion: 'Evento de montaña en la sierra nevada con paisajes espectaculares y rutas desafiantes para ciclistas experimentados.',
                    fecha: '2024-06-15T08:00:00',
                    ubicacion: 'Granada, España',
                    distancia_km: 120,
                    tipo: 'montaña',
                    estado: 'Próximo',
                    cuota_inscripcion: 50.00,
                    organizador: 'Club Ciclista Granada',
                    participantes_inscritos: 45,
                    cupo_maximo: 100,
                    dificultad: 'Alta',
                    elevacion: 2500
                },
                {
                    id: 2,
                    nombre: 'Carrera Nocturna Madrid',
                    descripcion: 'Carrera urbana nocturna por el centro histórico de Madrid bajo las luces de la ciudad.',
                    fecha: '2024-07-20T20:00:00',
                    ubicacion: 'Madrid, España',
                    distancia_km: 45,
                    tipo: 'urbano',
                    estado: 'Próximo',
                    cuota_inscripcion: 25.00,
                    organizador: 'Madrid Cycling',
                    participantes_inscritos: 120,
                    cupo_maximo: 200,
                    dificultad: 'Media',
                    elevacion: 300
                },
                {
                    id: 3,
                    nombre: 'Tour Costa Brava',
                    descripcion: 'Recorrido escénico por la costa mediterránea con vistas espectaculares.',
                    fecha: '2024-05-10T07:30:00',
                    ubicacion: 'Girona, España',
                    distancia_km: 80,
                    tipo: 'ruta',
                    estado: 'Próximo',
                    cuota_inscripcion: 35.00,
                    organizador: 'Costa Brava Cycling',
                    participantes_inscritos: 75,
                    cupo_maximo: 150,
                    dificultad: 'Media',
                    elevacion: 800
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortEvents = useCallback(() => {
        let filtered = [...events];

        // Filtro de búsqueda
        if (filters.search) {
            filtered = filtered.filter(event =>
                event.nombre?.toLowerCase().includes(filters.search.toLowerCase()) ||
                event.descripcion?.toLowerCase().includes(filters.search.toLowerCase()) ||
                event.ubicacion?.toLowerCase().includes(filters.search.toLowerCase()) ||
                event.organizador?.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        // Filtro por tipo
        if (filters.tipo && filters.tipo !== 'all') {
            filtered = filtered.filter(event => event.tipo === filters.tipo);
        }

        // Filtro por estado
        if (filters.estado && filters.estado !== 'all') {
            filtered = filtered.filter(event => event.estado === filters.estado);
        }

        // Filtro por fecha
        if (filters.fecha) {
            filtered = filtered.filter(event => {
                const eventDate = new Date(event.fecha).toDateString();
                const filterDate = new Date(filters.fecha).toDateString();
                return eventDate === filterDate;
            });
        }

        // Filtro por distancia
        if (filters.distancia && filters.distancia !== 'all') {
            filtered = filtered.filter(event => {
                const distancia = event.distancia_km || event.distancia || 0;
                switch (filters.distancia) {
                    case 'corta': return distancia <= 50;
                    case 'media': return distancia > 50 && distancia <= 100;
                    case 'larga': return distancia > 100;
                    default: return true;
                }
            });
        }

        // Filtro por precio
        if (filters.precio && filters.precio !== 'all') {
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

        // Ordenamiento
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'fecha':
                    return new Date(a.fecha) - new Date(b.fecha);
                case 'distancia':
                    return (b.distancia_km || 0) - (a.distancia_km || 0);
                case 'precio':
                    return (a.cuota_inscripcion || 0) - (b.cuota_inscripcion || 0);
                case 'nombre':
                    return a.nombre.localeCompare(b.nombre);
                default:
                    return 0;
            }
        });

        setFilteredEvents(filtered);
    }, [events, filters, sortBy]);

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
            fecha: '',
            distancia: 'all',
            precio: 'all'
        });
        setSortBy('fecha');
    };

    const getEventTypeIcon = (type) => {
        const icons = {
            'ruta': '🚴‍♂️',
            'montaña': '⛰️',
            'urbano': '🏙️',
            'competitivo': '🏆',
            'recreativo': '😊'
        };
        return icons[type] || '🚴';
    };

    const getStatusVariant = (status) => {
        switch (status?.toLowerCase()) {
            case 'próximo':
            case 'proximo':
                return 'warning';
            case 'en curso':
            case 'activo':
                return 'success';
            case 'finalizado':
            case 'completado':
                return 'secondary';
            default:
                return 'secondary';
        }
    };

    const getDificultadVariant = (dificultad) => {
        switch (dificultad?.toLowerCase()) {
            case 'baja': return 'success';
            case 'media': return 'warning';
            case 'alta': return 'danger';
            default: return 'secondary';
        }
    };

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Fecha por definir';
        }
    };

    const handleQuickView = (event) => {
        setSelectedEvent(event);
        setShowQuickView(true);
    };

    const handleRegister = async (event) => {
        if (!isAuthenticated) {
            alert('Debes iniciar sesión para inscribirte en eventos');
            navigate('/login');
            return;
        }

        setLoadingEvents(prev => [...prev, event.id]);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            navigate(`/evento/${event.id}`);
        } catch (error) {
            console.error('Error en inscripción:', error);
        } finally {
            setLoadingEvents(prev => prev.filter(id => id !== event.id));
        }
    };

    const calculateProgress = (event) => {
        if (!event.cupo_maximo) return 0;
        const inscritos = event.participantes_inscritos || 0;
        return (inscritos / event.cupo_maximo) * 100;
    };

    const EventCard = ({ event }) => (
        <Col key={event.id} md={viewMode === 'grid' ? 6 : 12} lg={viewMode === 'grid' ? 4 : 12}>
            <Card className={`event-card glass-card h-100 ${viewMode === 'list' ? 'event-card-list' : ''} shadow-sm hover-shadow`}>
                <Card.Body className="d-flex flex-column">
                    {/* Header del Evento */}
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center">
                            <span className="event-icon fs-2 me-3">
                                {getEventTypeIcon(event.tipo)}
                            </span>
                            <div>
                                <Badge bg={getStatusVariant(event.estado)} className="mb-1">
                                    {event.estado}
                                </Badge>
                                {event.dificultad && (
                                    <Badge bg={getDificultadVariant(event.dificultad)} className="ms-1">
                                        {event.dificultad}
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <div className="text-end">
                            <div className="fs-4 fw-bold text-primary">
                                ${event.cuota_inscripcion || 0}
                            </div>
                            <small className="text-muted">Inscripción</small>
                        </div>
                    </div>

                    {/* Información Principal */}
                    <Card.Title className="h5 mb-3">
                        <Link
                            to={`/evento/${event.id}`}
                            className="text-decoration-none text-dark fw-bold hover-primary"
                        >
                            {event.nombre}
                        </Link>
                    </Card.Title>

                    <Card.Text className="text-primary fw-medium small mb-2">
                        📅 {formatDate(event.fecha)}
                    </Card.Text>

                    <Card.Text className="flex-grow-1 text-gray-700">
                        {event.descripcion || 'Sin descripción disponible.'}
                    </Card.Text>

                    {/* Estadísticas del Evento */}
                    <div className="event-stats mb-3">
                        <Row className="g-2 text-center">
                            <Col xs={4}>
                                <div className="stat-item">
                                    <div className="stat-number text-success fw-bold fs-5">{event.distancia_km || 0}</div>
                                    <div className="stat-label text-gray-600 small fw-medium">km</div>
                                </div>
                            </Col>
                            <Col xs={4}>
                                <div className="stat-item">
                                    <div className="stat-number text-warning fw-bold fs-5">{event.elevacion || 'N/A'}</div>
                                    <div className="stat-label text-gray-600 small fw-medium">m elev</div>
                                </div>
                            </Col>
                            <Col xs={4}>
                                <div className="stat-item">
                                    <div className="stat-number text-info fw-bold fs-5">{event.participantes_inscritos || 0}</div>
                                    <div className="stat-label text-gray-600 small fw-medium">inscritos</div>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    {/* Progress Bar para cupos */}
                    {event.cupo_maximo && (
                        <div className="mb-3">
                            <div className="d-flex justify-content-between small text-gray-700 fw-medium mb-1">
                                <span>Cupos disponibles</span>
                                <span>{event.participantes_inscritos || 0} / {event.cupo_maximo}</span>
                            </div>
                            <ProgressBar
                                now={calculateProgress(event)}
                                variant={calculateProgress(event) > 80 ? "danger" : "success"}
                                className="cupo-progress"
                            />
                        </div>
                    )}

                    {/* Footer del Card */}
                    <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <small className="text-gray-800 d-block fw-semibold">
                                    📍 {event.ubicacion || 'ubicación no especificada'}
                                </small>
                                <small className="text-gray-600">
                                    👤 {event.organizador || 'Organizador'}
                                </small>
                            </div>
                            <div className="d-flex gap-2">
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => handleQuickView(event)}
                                    className="fw-medium"
                                >
                                    Vista Rápida
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleRegister(event)}
                                    disabled={event.estado === 'Finalizado' || loadingEvents.includes(event.id)}
                                    className="fw-medium"
                                >
                                    {loadingEvents.includes(event.id) ? (
                                        <Spinner animation="border" size="sm" />
                                    ) : event.estado === 'Finalizado' ? 'Finalizado' : 'Inscribirse'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );

    if (loading) {
        return (
            <div className="events-page-modern">
                <Container className="d-flex justify-content-center align-items-center min-vh-100">
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" size="lg" />
                        <p className="mt-3 text-primary fw-medium">Cargando eventos...</p>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="events-page-modern">
            {/* Hero Section */}
            <section className="events-hero-section py-5 bg-gradient-primary">
                <Container>
                    <Row className="min-vh-50 align-items-center">
                        <Col lg={8} className="mx-auto text-center text-white">
                            <Badge bg="light" text="dark" className="hero-badge mb-3 fs-6 fw-bold">
                                🚴‍♀️ EXPLORA EVENTOS
                            </Badge>
                            <h1 className="hero-title display-4 fw-bold mb-4">
                                ENCUENTRA TU <span className="text-warning">PRÓXIMO DESAFÍO</span>
                            </h1>
                            <p className="hero-subtitle lead fs-5 opacity-90">
                                Descubre eventos de ciclismo que se adapten a tu estilo y nivel
                            </p>
                        </Col>
                    </Row>
                </Container>
            </section>

            <Container className="py-5">
                {/* Header con Controles */}
                <Row className="mb-4">
                    <Col>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h2 className="section-title display-5 fw-bold text-gray-900 mb-2">
                                    TODOS LOS <span className="text-primary">EVENTOS</span>
                                </h2>
                                <p className="section-subtitle text-gray-700 fs-6">
                                    Filtra y encuentra el evento perfecto para ti
                                </p>
                            </div>
                            <div className="d-flex gap-3">
                                {/* Selector de Vista */}
                                <ButtonGroup>
                                    <Button
                                        variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
                                        onClick={() => setViewMode('grid')}
                                        size="sm"
                                        className="fw-medium"
                                    >
                                        ▣ Grid
                                    </Button>
                                    <Button
                                        variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
                                        onClick={() => setViewMode('list')}
                                        size="sm"
                                        className="fw-medium"
                                    >
                                        ≡ Lista
                                    </Button>
                                </ButtonGroup>

                                {/* Ordenamiento */}
                                <Dropdown>
                                    <Dropdown.Toggle variant="outline-primary" size="sm" className="fw-medium">
                                        🔄 Ordenar: {sortBy === 'fecha' ? 'Fecha' :
                                            sortBy === 'distancia' ? 'Distancia' :
                                                sortBy === 'precio' ? 'Precio' : 'Nombre'}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => setSortBy('fecha')}>📅 Fecha</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setSortBy('distancia')}>📏 Distancia</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setSortBy('precio')}>💰 Precio</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setSortBy('nombre')}>🔤 Nombre</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                    </Col>
                </Row>

                {error && (
                    <Alert variant="warning" className="mb-4">
                        ⚠️ {error}
                    </Alert>
                )}

                {/* Filtros Mejorados */}
                <Card className="glass-card mb-4 border-light shadow-sm">
                    <Card.Body className="p-4">
                        <Row className="g-3">
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label className="fw-bold text-gray-800">🔍 Buscar</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nombre, ubicación..."
                                            value={filters.search}
                                            onChange={(e) => handleFilterChange('search', e.target.value)}
                                            className="search-input"
                                        />
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label className="fw-bold text-gray-800">🚴 Tipo</Form.Label>
                                    <Form.Select
                                        value={filters.tipo}
                                        onChange={(e) => handleFilterChange('tipo', e.target.value)}
                                    >
                                        <option value="all">Todos los tipos</option>
                                        <option value="ruta">Ruta</option>
                                        <option value="montaña">Montaña</option>
                                        <option value="urbano">Urbano</option>
                                        <option value="competitivo">Competitivo</option>
                                        <option value="recreativo">Recreativo</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label className="fw-bold text-gray-800">📊 Estado</Form.Label>
                                    <Form.Select
                                        value={filters.estado}
                                        onChange={(e) => handleFilterChange('estado', e.target.value)}
                                    >
                                        <option value="all">Todos</option>
                                        <option value="Próximo">Próximo</option>
                                        <option value="En Curso">En Curso</option>
                                        <option value="Finalizado">Finalizado</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label className="fw-bold text-gray-800">📏 Distancia</Form.Label>
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
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label className="fw-bold text-gray-800">💰 Precio</Form.Label>
                                    <Form.Select
                                        value={filters.precio}
                                        onChange={(e) => handleFilterChange('precio', e.target.value)}
                                    >
                                        <option value="all">Todos</option>
                                        <option value="gratis">Gratis</option>
                                        <option value="economico">Económico</option>
                                        <option value="premium">Premium</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={1} className="d-flex align-items-end">
                                <Button
                                    variant="outline-secondary"
                                    onClick={clearFilters}
                                    className="w-100 fw-medium"
                                    title="Limpiar todos los filtros"
                                >
                                    🗑️
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* Resumen de Resultados */}
                <Row className="mb-4">
                    <Col>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <Badge bg="primary" className="fs-6 px-3 py-2 fw-medium">
                                    📊 {filteredEvents.length} eventos encontrados
                                </Badge>
                                {(filters.search || filters.tipo !== 'all' || filters.estado !== 'all') && (
                                    <Badge bg="info" className="ms-2 fs-6 px-3 py-2 fw-medium">
                                        🔧 Filtros activos
                                    </Badge>
                                )}
                            </div>
                            <div className="text-gray-700 fw-medium">
                                <small>
                                    Mostrando {filteredEvents.length} de {events.length} eventos
                                </small>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Grid/Lista de Eventos - CORREGIDO: key única garantizada */}
                <Row className="g-4">
                    {filteredEvents.length === 0 ? (
                        <Col>
                            <Card className="glass-card text-center py-5 border-light shadow-sm">
                                <Card.Body>
                                    <div className="text-gray-400 mb-3" style={{ fontSize: '4rem' }}>🔍</div>
                                    <h4 className="text-gray-800 mb-3 fw-bold">No se encontraron eventos</h4>
                                    <p className="text-gray-600 mb-4">
                                        No hay eventos disponibles en este momento que<br />
                                        coincidan con tus criterios de búsqueda.
                                    </p>
                                    <Button variant="primary" onClick={clearFilters} className="fw-medium">
                                        🗑️ Limpiar Filtros
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ) : (
                        filteredEvents.map(event => (
                            <EventCard key={`event-${event.id}-${event.nombre}`} event={event} />
                        ))
                    )}
                </Row>

                {/* Call to Action para Organizadores */}
                {isAuthenticated && (
                    <Row className="mt-5">
                        <Col>
                            <Card className="glass-card text-center py-5 cta-card border-primary shadow-lg">
                                <Card.Body>
                                    <div className="cta-icon mb-3 text-primary" style={{ fontSize: '4rem' }}>🚴‍♂️</div>
                                    <h3 className="text-primary mb-3 fw-bold">¿No encuentras lo que buscas?</h3>
                                    <p className="text-gray-700 mb-4 lead fw-medium">
                                        Crea tu propio evento y compártelo con la comunidad ciclista
                                    </p>
                                    <Button
                                        as={Link}
                                        to="/organizador/eventos/nuevo"
                                        variant="primary"
                                        size="lg"
                                        className="px-5 fw-bold"
                                    >
                                        🎯 Crear Mi Evento
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}
            </Container>

            {/* Modal de Vista Rápida */}
            {showQuickView && selectedEvent && (
                <div className="modal-backdrop show" onClick={() => setShowQuickView(false)}>
                    <div className="modal-dialog modal-lg" onClick={e => e.stopPropagation()}>
                        <div className="modal-content glass-card border-light shadow-lg">
                            <div className="modal-header border-bottom">
                                <h5 className="modal-title text-gray-900 fw-bold">{selectedEvent.nombre}</h5>
                                <Button
                                    variant="close"
                                    onClick={() => setShowQuickView(false)}
                                ></Button>
                            </div>
                            <div className="modal-body">
                                <p className="text-gray-700 mb-3">{selectedEvent.descripcion}</p>
                                <div className="row">
                                    <div className="col-md-6">
                                        <p className="text-gray-800 fw-medium">📍 <strong>Ubicación:</strong> {selectedEvent.ubicacion}</p>
                                        <p className="text-gray-800 fw-medium">📅 <strong>Fecha:</strong> {formatDate(selectedEvent.fecha)}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <p className="text-gray-800 fw-medium">📏 <strong>Distancia:</strong> {selectedEvent.distancia_km} km</p>
                                        <p className="text-gray-800 fw-medium">⚡ <strong>Dificultad:</strong> {selectedEvent.dificultad}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventsPage;