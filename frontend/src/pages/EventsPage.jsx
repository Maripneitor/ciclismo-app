import React, { useState, useEffect, useCallback } from 'react';
import {
    Container, Row, Col, Card, Button, Spinner, Alert, Form,
    Badge, InputGroup, Dropdown, ProgressBar, ButtonGroup,
    Modal
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { eventsAPI, registrationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from "../context/ThemeContext";  // ✅ Importación añadida
import './EventsPage.css';

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    // ✅ REEMPLAZADO: Usar el contexto del tema en lugar del estado local
    const { darkMode } = useTheme();

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
    const [registrationMessage, setRegistrationMessage] = useState('');

    // ❌ ELIMINADO: useEffect para cargar tema (ahora se maneja en ThemeContext)

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
            let eventsData = Array.isArray(response) ? response : response.data || [];

            console.log('📥 Eventos recibidos del backend:', eventsData);

            // Normalizar los datos del backend - mapear evento_id a id
            eventsData = eventsData.map(event => ({
                ...event,
                id: event.evento_id, // Usar evento_id como id
                nombre: event.nombre,
                descripcion: event.descripcion,
                fecha: event.fecha,
                ubicacion: event.ubicacion || 'Ubicación no especificada',
                distancia_km: event.distancia || 0,
                tipo: event.tipo || 'ruta',
                estado: event.estado || 'Próximo',
                cuota_inscripcion: event.cuota_inscripcion || 0,
                organizador: event.organizador || 'Organizador no especificado',
                participantes_inscritos: event.participantes_inscritos || 0,
                cupo_maximo: event.cupo_maximo || 0,
                dificultad: event.dificultad || 'Media',
                elevacion: event.elevacion || 0
            }));

            // FILTRAR solo eventos con IDs válidos (numéricos)
            eventsData = eventsData.filter(event => {
                const hasValidId = event.id && (typeof event.id === 'number' || !isNaN(event.id));
                if (!hasValidId) {
                    console.warn('⚠️ Evento con ID inválido filtrado:', event);
                }
                return hasValidId;
            });

            console.log('✅ Eventos válidos después del filtrado:', eventsData);
            setEvents(eventsData);
        } catch (error) {
            console.error('❌ Error loading events:', error);
            setError('Error cargando eventos del servidor');

            // Datos de demostración SOLO con IDs numéricos
            const demoEvents = [
                {
                    id: 1,
                    nombre: 'Gran Fondo Sierra Nevada',
                    descripcion: 'Evento de montaña en la sierra nevada con paisajes espectaculares.',
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
                    descripcion: 'Carrera urbana nocturna por el centro histórico de Madrid.',
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
                }
            ];
            
            setEvents(demoEvents);
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

        // Verificar que el evento tenga un ID válido
        if (!event.id || (typeof event.id !== 'number' && isNaN(event.id))) {
            console.error('❌ ID de evento inválido:', event.id);
            setRegistrationMessage('Error: ID de evento inválido');
            return;
        }

        setLoadingEvents(prev => [...prev, event.id]);
        setRegistrationMessage('');

        try {
            console.log('🔄 Intentando inscripción para evento:', event.id, event.nombre);
            
            // Llamar a la API de inscripciones
            const result = await registrationsAPI.registerForEvent({
                eventId: event.id, // Usar el ID normalizado
                categoria_id: 1,
                talla_playera_id: 1,
                numero_telefono: user?.telefono || '',
                genero: user?.genero || ''
            });
            
            console.log('✅ Inscripción exitosa:', result);
            setRegistrationMessage(`¡Inscripción exitosa! Te has registrado en ${event.nombre}`);
            
            // Recargar eventos para actualizar contadores
            setTimeout(() => {
                loadEvents();
            }, 2000);

        } catch (error) {
            console.error('❌ Error en inscripción:', error);
            
            let errorMessage = 'Error al realizar la inscripción';
            if (error.message) {
                errorMessage = error.message;
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            setRegistrationMessage(`❌ ${errorMessage}`);
        } finally {
            setLoadingEvents(prev => prev.filter(id => id !== event.id));
        }
    };

    const calculateProgress = (event) => {
        if (!event.cupo_maximo) return 0;
        const inscritos = event.participantes_inscritos || 0;
        return (inscritos / event.cupo_maximo) * 100;
    };

    // Clases dinámicas basadas en el tema - ✅ Ahora usa el contexto
    const getThemeClass = () => darkMode ? 'dark-mode' : 'light-mode';
    const getCardClass = () => darkMode ? 'bg-dark text-light border-secondary' : 'bg-light text-dark border-light';
    const getTextClass = () => darkMode ? 'text-light' : 'text-dark';
    const getMutedTextClass = () => darkMode ? 'text-light-emphasis' : 'text-muted';
    const getBgClass = () => darkMode ? 'bg-dark' : 'bg-light';

    const EventCard = ({ event }) => (
        <Col key={event.id} md={viewMode === 'grid' ? 6 : 12} lg={viewMode === 'grid' ? 4 : 12}>
            <Card className={`event-card h-100 ${viewMode === 'list' ? 'event-card-list' : ''} shadow-sm ${getCardClass()}`}>
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
                            <small className={getMutedTextClass()}>Inscripción</small>
                        </div>
                    </div>

                    {/* Información Principal - MEJORADO */}
                    <Card.Title className={`h5 mb-3 ${getTextClass()}`}>
                        <Link
                            to={`/evento/${event.id}`}
                            className={`text-decoration-none fw-bold hover-primary ${getTextClass()}`}
                        >
                            {event.nombre}
                        </Link>
                    </Card.Title>

                    <Card.Text className="text-primary fw-medium small mb-2">
                        {formatDate(event.fecha)}
                    </Card.Text>
                    <Card.Text className={`flex-grow-1 ${getMutedTextClass()}`}>
                        {event.descripcion || 'Sin descripción disponible.'}
                    </Card.Text>

                    {/* Estadísticas del Evento */}
                    <div className="event-stats mb-3">
                        <Row className="g-2 text-center">
                            <Col xs={4}>
                                <div className="stat-item">
                                    <div className="stat-number text-success fw-bold fs-5">{event.distancia_km || 0}</div>
                                    <div className={`stat-label ${getMutedTextClass()} small`}>km</div>
                                </div>
                            </Col>
                            <Col xs={4}>
                                <div className="stat-item">
                                    <div className="stat-number text-warning fw-bold fs-5">{event.elevacion || 'N/A'}</div>
                                    <div className={`stat-label ${getMutedTextClass()} small`}>m elev</div>
                                </div>
                            </Col>
                            <Col xs={4}>
                                <div className="stat-item">
                                    <div className="stat-number text-info fw-bold fs-5">{event.participantes_inscritos || 0}</div>
                                    <div className={`stat-label ${getMutedTextClass()} small`}>inscritos</div>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    {/* Progress Bar para cupos */}
                    {event.cupo_maximo && (
                        <div className="mb-3">
                            <div className={`d-flex justify-content-between small fw-medium mb-1 ${getMutedTextClass()}`}>
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

                    {/* Footer del Card - MEJORADO */}
                    <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <small className={`d-block fw-semibold ${getTextClass()}`}>
                                    {event.ubicacion || 'Ubicación no especificada'}
                                </small>
                                <small className={getMutedTextClass()}>
                                    {event.organizador || 'Organizador'}
                                </small>
                            </div>
                            <div className="d-flex gap-2">
                                <Button
                                    variant={darkMode ? "outline-light" : "outline-primary"}
                                    size="sm"
                                    onClick={() => handleQuickView(event)}
                                    className="fw-medium"
                                >
                                    Vista Rápida
                                </Button>
                                <Button
                                    variant={isAuthenticated ? "primary" : "secondary"}
                                    size="sm"
                                    onClick={() => handleRegister(event)}
                                    disabled={event.estado === 'Finalizado' || loadingEvents.includes(event.id) || !isAuthenticated}
                                    className="fw-medium"
                                    title={!isAuthenticated ? "Inicia sesión para inscribirte" : ""}
                                >
                                    {loadingEvents.includes(event.id) ? (
                                        <>
                                            <Spinner animation="border" size="sm" className="me-1" />
                                            Inscribiendo...
                                        </>
                                    ) : event.estado === 'Finalizado' ? (
                                        'Finalizado'
                                    ) : !isAuthenticated ? (
                                        'Inicia sesión'
                                    ) : (
                                        'Inscribirse'
                                    )}
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
            <div className={`events-page ${getThemeClass()}`}>
                <Container className="d-flex justify-content-center align-items-center min-vh-100">
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" size="lg" />
                        <p className={`mt-3 fw-medium ${getTextClass()}`}>Cargando eventos...</p>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className={`events-page ${getThemeClass()} ${getBgClass()}`} style={{minHeight: '100vh'}}>
            {/* Hero Section */}
            <section className={`events-hero-section py-5 ${darkMode ? 'bg-dark text-light' : 'bg-primary text-white'}`}>
                <Container>
                    <Row className="min-vh-50 align-items-center">
                        <Col lg={8} className="mx-auto text-center">
                            <Badge bg={darkMode ? "light" : "white"} text={darkMode ? "dark" : "dark"} className="hero-badge mb-3 fs-6 fw-bold">
                                EXPLORA EVENTOS
                            </Badge>
                            <h1 className="hero-title display-4 fw-bold mb-4">
                                ENCUENTRA TU <span className={darkMode ? "text-warning" : "text-warning"}>PRÓXIMO DESAFÍO</span>
                            </h1>
                            <p className={`hero-subtitle lead fs-5 ${darkMode ? 'opacity-90' : 'opacity-90'}`}>
                                Descubre eventos de ciclismo que se adapten a tu estilo y nivel
                            </p>
                            {!isAuthenticated && (
                                <div className="mt-4">
                                    <Alert variant={darkMode ? "light" : "light"} className="d-inline-block">
                                        <strong>💡 ¿Quieres inscribirte?</strong> 
                                        <Link to="/login" className={`ms-2 fw-bold ${darkMode ? 'text-dark' : 'text-primary'}`}>
                                            Inicia sesión
                                        </Link>
                                    </Alert>
                                </div>
                            )}
                        </Col>
                    </Row>
                </Container>
            </section>

            <Container className="py-5">
                {/* Mensajes de registro */}
                {registrationMessage && (
                    <Alert 
                        variant={registrationMessage.includes('éxito') || registrationMessage.includes('exitosa') ? 'success' : 
                               registrationMessage.includes('❌') ? 'danger' : 'warning'} 
                        className="mb-4"
                        dismissible
                        onClose={() => setRegistrationMessage('')}
                    >
                        {registrationMessage}
                    </Alert>
                )}

                {/* Header con Controles */}
                <Row className="mb-4">
                    <Col>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h2 className={`section-title display-5 fw-bold mb-2 ${getTextClass()}`}>
                                    TODOS LOS <span className="text-primary">EVENTOS</span>
                                </h2>
                                <p className={`section-subtitle fs-6 ${getMutedTextClass()}`}>
                                    Filtra y encuentra el evento perfecto para ti
                                </p>
                            </div>
                            <div className="d-flex gap-3">
                                {/* Selector de Vista */}
                                <ButtonGroup>
                                    <Button
                                        variant={viewMode === 'grid' ? 'primary' : darkMode ? 'outline-light' : 'outline-primary'}
                                        onClick={() => setViewMode('grid')}
                                        size="sm"
                                        className="fw-medium"
                                    >
                                        ⏹ Grid
                                    </Button>
                                    <Button
                                        variant={viewMode === 'list' ? 'primary' : darkMode ? 'outline-light' : 'outline-primary'}
                                        onClick={() => setViewMode('list')}
                                        size="sm"
                                        className="fw-medium"
                                    >
                                        📋 Lista
                                    </Button>
                                </ButtonGroup>

                                {/* Ordenamiento */}
                                <Dropdown>
                                    <Dropdown.Toggle variant={darkMode ? "outline-light" : "outline-primary"} size="sm" className="fw-medium">
                                        📊 Ordenar: {sortBy === 'fecha' ? 'Fecha' :
                                            sortBy === 'distancia' ? 'Distancia' :
                                            sortBy === 'precio' ? 'Precio' : 'Nombre'}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className={darkMode ? 'bg-dark text-light' : ''}>
                                        <Dropdown.Item onClick={() => setSortBy('fecha')} className={darkMode ? 'text-light' : ''}>Fecha</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setSortBy('distancia')} className={darkMode ? 'text-light' : ''}>Distancia</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setSortBy('precio')} className={darkMode ? 'text-light' : ''}>Precio</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setSortBy('nombre')} className={darkMode ? 'text-light' : ''}>Nombre</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                    </Col>
                </Row>

                {error && (
                    <Alert variant="warning" className="mb-4">
                        {error}
                    </Alert>
                )}

                {/* Filtros Mejorados */}
                <Card className={`mb-4 shadow-sm ${darkMode ? 'bg-dark text-light border-secondary' : 'border-light'}`}>
                    <Card.Body className="p-4">
                        <Row className="g-3">
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label className={`fw-bold ${getTextClass()}`}>Buscar</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nombre, ubicación..."
                                            value={filters.search}
                                            onChange={(e) => handleFilterChange('search', e.target.value)}
                                            className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                                        />
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label className={`fw-bold ${getTextClass()}`}>Tipo</Form.Label>
                                    <Form.Select
                                        value={filters.tipo}
                                        onChange={(e) => handleFilterChange('tipo', e.target.value)}
                                        className={darkMode ? 'bg-dark text-light border-secondary' : ''}
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
                                    <Form.Label className={`fw-bold ${getTextClass()}`}>Estado</Form.Label>
                                    <Form.Select
                                        value={filters.estado}
                                        onChange={(e) => handleFilterChange('estado', e.target.value)}
                                        className={darkMode ? 'bg-dark text-light border-secondary' : ''}
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
                                    <Form.Label className={`fw-bold ${getTextClass()}`}>Distancia</Form.Label>
                                    <Form.Select
                                        value={filters.distancia}
                                        onChange={(e) => handleFilterChange('distancia', e.target.value)}
                                        className={darkMode ? 'bg-dark text-light border-secondary' : ''}
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
                                    <Form.Label className={`fw-bold ${getTextClass()}`}>Precio</Form.Label>
                                    <Form.Select
                                        value={filters.precio}
                                        onChange={(e) => handleFilterChange('precio', e.target.value)}
                                        className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                                    >
                                        <option value="all">Todos</option>
                                        <option value="gratis">Gratis</option>
                                        <option value="economico">Económicos</option>
                                        <option value="premium">Premium</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={1} className="d-flex align-items-end">
                                <Button
                                    variant={darkMode ? "outline-light" : "outline-secondary"}
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
                                    {filteredEvents.length} eventos encontrados
                                </Badge>
                                {(filters.search || filters.tipo !== 'all' || filters.estado !== 'all') && (
                                    <Badge bg="info" className="ms-2 fs-6 px-3 py-2 fw-medium">
                                        Filtros activos
                                    </Badge>
                                )}
                            </div>
                            <div className={`fw-medium ${getMutedTextClass()}`}>
                                <small>
                                    Mostrando {filteredEvents.length} de {events.length} eventos
                                </small>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Grid/Lista de Eventos */}
                <Row className="g-4">
                    {filteredEvents.length === 0 ? (
                        <Col>
                            <Card className={`text-center py-5 shadow-sm ${darkMode ? 'bg-dark text-light border-secondary' : 'border-light'}`}>
                                <Card.Body>
                                    <div className={`mb-3 ${getMutedTextClass()}`} style={{ fontSize: '4rem' }}>🚴</div>
                                    <h4 className={`mb-3 fw-bold ${getTextClass()}`}>No se encontraron eventos</h4>
                                    <p className={`mb-4 ${getMutedTextClass()}`}>
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
                            <Card className={`text-center py-5 shadow-lg ${darkMode ? 'bg-dark text-light border-primary' : 'border-primary'}`}>
                                <Card.Body>
                                    <div className="text-primary mb-3" style={{ fontSize: '4rem' }}>🚴‍♂️</div>
                                    <h3 className="text-primary mb-3 fw-bold">¿No encuentras lo que buscas?</h3>
                                    <p className={`mb-4 lead fw-medium ${getMutedTextClass()}`}>
                                        Crea tu propio evento y compártelo con la comunidad ciclista
                                    </p>
                                    <Button
                                        as={Link}
                                        to="/organizador/eventos/nuevo"
                                        variant="primary"
                                        size="lg"
                                        className="px-5 fw-bold"
                                    >
                                        Crear Mi Evento
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}
            </Container>

            {/* Modal de Vista Rápida */}
            <Modal show={showQuickView} onHide={() => setShowQuickView(false)} size="lg" centered>
                <Modal.Header closeButton className={darkMode ? 'bg-dark text-light border-secondary' : ''}>
                    <Modal.Title className={`fw-bold ${darkMode ? 'text-light' : 'text-dark'}`}>
                        {selectedEvent?.nombre}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className={darkMode ? 'bg-dark text-light' : ''}>
                    {selectedEvent && (
                        <>
                            <p className={`mb-3 ${darkMode ? 'text-light-emphasis' : 'text-muted'}`}>{selectedEvent.descripcion}</p>
                            <Row>
                                <Col md={6}>
                                    <p className={`fw-medium ${getTextClass()}`}>
                                        <strong>Ubicación:</strong> {selectedEvent.ubicacion}
                                    </p>
                                    <p className={`fw-medium ${getTextClass()}`}>
                                        <strong>Fecha:</strong> {formatDate(selectedEvent.fecha)}
                                    </p>
                                    <p className={`fw-medium ${getTextClass()}`}>
                                        <strong>Organizador:</strong> {selectedEvent.organizador}
                                    </p>
                                </Col>
                                <Col md={6}>
                                    <p className={`fw-medium ${getTextClass()}`}>
                                        <strong>Distancia:</strong> {selectedEvent.distancia_km} km
                                    </p>
                                    <p className={`fw-medium ${getTextClass()}`}>
                                        <strong>Dificultad:</strong> {selectedEvent.dificultad}
                                    </p>
                                    <p className={`fw-medium ${getTextClass()}`}>
                                        <strong>Elevación:</strong> {selectedEvent.elevacion} m
                                    </p>
                                </Col>
                            </Row>
                            <div className="mt-4">
                                <Button
                                    variant={isAuthenticated ? "primary" : "secondary"}
                                    onClick={() => {
                                        setShowQuickView(false);
                                        handleRegister(selectedEvent);
                                    }}
                                    disabled={selectedEvent.estado === 'Finalizado' || !isAuthenticated}
                                    className="me-2"
                                >
                                    {selectedEvent.estado === 'Finalizado' ? 'Evento Finalizado' : 
                                     !isAuthenticated ? 'Inicia sesión para inscribirte' : 'Inscribirse'}
                                </Button>
                                <Button
                                    variant={darkMode ? "outline-light" : "outline-primary"}
                                    as={Link}
                                    to={`/evento/${selectedEvent.id}`}
                                    onClick={() => setShowQuickView(false)}
                                >
                                    Ver detalles completos
                                </Button>
                            </div>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default EventsPage;