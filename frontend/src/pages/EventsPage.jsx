import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Form, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { isAuthenticated } = useAuth();
    
    // Filtros
    const [filters, setFilters] = useState({
        search: '',
        tipo: '',
        estado: '',
        fecha: ''
    });

    useEffect(() => {
        loadEvents();
    }, []);

    useEffect(() => {
        filterEvents();
    }, [events, filters]);

    const loadEvents = async () => {
        try {
            const response = await eventsAPI.getAll();
            const eventsData = Array.isArray(response) ? response : (response.data || []);
            setEvents(eventsData);
        } catch (error) {
            setError('Error cargando eventos. Mostrando datos de demostración.');
            // Datos de demostración
            setEvents([
                {
                    evento_id: 1,
                    nombre: 'Gran Fondo Sierra Nevada',
                    descripcion: 'Evento de montaña en la sierra nevada con paisajes espectaculares',
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
                    descripcion: 'Carrera urbana nocturna por el centro histórico de Madrid',
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

    const filterEvents = () => {
        let filtered = [...events];

        // Filtro de búsqueda
        if (filters.search) {
            filtered = filtered.filter(event =>
                event.nombre.toLowerCase().includes(filters.search.toLowerCase()) ||
                event.descripcion?.toLowerCase().includes(filters.search.toLowerCase()) ||
                event.ubicacion?.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        // Filtro por tipo
        if (filters.tipo) {
            filtered = filtered.filter(event => event.tipo === filters.tipo);
        }

        // Filtro por estado
        if (filters.estado) {
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
            tipo: '',
            estado: '',
            fecha: ''
        });
    };

    const getEventTypeIcon = (type) => {
        const icons = {
            'ruta': '🛣️',
            'montaña': '⛰️',
            'urbano': '🏙️',
            'competitivo': '🏆',
            'recreativo': '😊'
        };
        return icons[type] || '🚴';
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'Próximo': return 'warning';
            case 'En Curso': return 'success';
            case 'Finalizado': return 'secondary';
            default: return 'secondary';
        }
    };

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('es-ES', {
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

    const handleRegister = (event) => {
        if (!isAuthenticated) {
            alert('Debes iniciar sesión para inscribirte en eventos');
            return;
        }
        // Navegar a la página de detalles del evento
        window.location.href = `/evento/${event.evento_id || event.id}`;
    };

    if (loading) {
        return (
            <Container className="py-4 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando eventos...</span>
                </Spinner>
                <p className="mt-2">Cargando eventos...</p>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <Row className="mb-4">
                <Col>
                    <h1>Eventos de Ciclismo</h1>
                    <p className="lead">Encuentra tu próxima aventura sobre dos ruedas</p>
                </Col>
            </Row>

            {error && (
                <Alert variant="warning">
                    {error}
                </Alert>
            )}

            {/* Filtros Mejorados */}
            <Card className="mb-4">
                <Card.Header>
                    <h5 className="mb-0">🔍 Filtros de Búsqueda</h5>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Buscar</Form.Label>
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
                                <Form.Label>Tipo</Form.Label>
                                <Form.Select
                                    value={filters.tipo}
                                    onChange={(e) => handleFilterChange('tipo', e.target.value)}
                                >
                                    <option value="">Todos</option>
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
                                <Form.Label>Estado</Form.Label>
                                <Form.Select
                                    value={filters.estado}
                                    onChange={(e) => handleFilterChange('estado', e.target.value)}
                                >
                                    <option value="">Todos</option>
                                    <option value="Próximo">Próximo</option>
                                    <option value="En Curso">En Curso</option>
                                    <option value="Finalizado">Finalizado</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Fecha</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={filters.fecha}
                                    onChange={(e) => handleFilterChange('fecha', e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={2} className="d-flex align-items-end">
                            <Button variant="outline-secondary" onClick={clearFilters} className="w-100">
                                🗑️ Limpiar
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Resumen de Resultados */}
            <Row className="mb-3">
                <Col>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <Badge bg="primary" className="fs-6">
                                {filteredEvents.length} eventos encontrados
                            </Badge>
                            {filters.search && (
                                <Badge bg="info" className="ms-2 fs-6">
                                    Búsqueda: "{filters.search}"
                                </Badge>
                            )}
                        </div>
                        <div>
                            <small className="text-muted">
                                Mostrando {filteredEvents.length} de {events.length} eventos
                            </small>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Grid de Eventos Mejorado */}
            <Row className="g-4">
                {filteredEvents.length === 0 ? (
                    <Col>
                        <Card className="text-center py-5">
                            <Card.Body>
                                <div className="text-muted mb-3 fs-1">🔍</div>
                                <h5>No se encontraron eventos</h5>
                                <p className="text-muted">
                                    {events.length === 0 
                                        ? 'No hay eventos disponibles en este momento.' 
                                        : 'No hay eventos que coincidan con tus criterios de búsqueda.'
                                    }
                                </p>
                                <Button variant="primary" onClick={clearFilters}>
                                    Limpiar Filtros
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ) : (
                    filteredEvents.map(event => (
                        <Col key={event.evento_id || event.id} md={6} lg={4}>
                            <Card className="h-100 shadow-sm event-card">
                                <Card.Body className="d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <span className="fs-2">
                                            {getEventTypeIcon(event.tipo)}
                                        </span>
                                        <div className="d-flex flex-column align-items-end">
                                            <Badge bg={getStatusVariant(event.estado)} className="mb-1">
                                                {event.estado}
                                            </Badge>
                                            <Badge bg="dark" className="fs-6">
                                                €{event.cuota_inscripcion || 0}
                                            </Badge>
                                        </div>
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
                                        📅 {formatDate(event.fecha)}
                                    </Card.Text>

                                    <Card.Text className="flex-grow-1">
                                        {event.descripcion || 'Sin descripción disponible.'}
                                    </Card.Text>

                                    <div className="mt-auto">
                                        <div className="d-flex justify-content-between text-sm mb-2">
                                            <span>📍 {event.ubicacion || 'Ubicación no especificada'}</span>
                                            <span>📏 {event.distancia_km || event.distancia || '0'} km</span>
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <small className="text-muted">
                                                    👤 {event.organizador?.nombre_completo || 'Organizador'}
                                                </small>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <Button
                                                    as={Link}
                                                    to={`/evento/${event.evento_id || event.id}`}
                                                    variant="outline-primary"
                                                    size="sm"
                                                >
                                                    Ver
                                                </Button>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => handleRegister(event)}
                                                    disabled={event.estado === 'Finalizado'}
                                                >
                                                    {event.estado === 'Finalizado' ? 'Finalizado' : 'Inscribirse'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>

            {/* Llamada a la acción */}
            {isAuthenticated && (
                <Row className="mt-5">
                    <Col>
                        <Card className="bg-light text-center">
                            <Card.Body className="py-5">
                                <h3>¿No encuentras lo que buscas?</h3>
                                <p className="text-muted mb-4">
                                    Crea tu propio evento y compártelo con la comunidad ciclista
                                </p>
                                <Button as={Link} to="/organizador/eventos/nuevo" variant="primary" size="lg">
                                    🎪 Crear Mi Evento
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default EventsPage;