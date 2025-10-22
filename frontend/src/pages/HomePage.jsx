import React, { useState, useEffect, useRef } from 'react';
import {
    Container,
    Row,
    Col,
    Button,
    Card,
    Badge,
    ProgressBar,
    Carousel,
    Spinner,
    Alert,
    Modal,
    Form
} from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import { eventsAPI, registrationsAPI } from '../services/api';

const HomePage = () => {
    const { isAuthenticated, user } = useAuth();
    const { darkMode } = useTheme();
    const navigate = useNavigate();
    const isMounted = useRef(true);

    // Estados
    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [userStats, setUserStats] = useState(null);
    const [nextEvent, setNextEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [showNewsletterModal, setShowNewsletterModal] = useState(false);
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Actualizar tamaño de ventana
    useEffect(() => {
        const handleResize = () => {
            if (isMounted.current) {
                setWindowWidth(window.innerWidth);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Datos estáticos para el carrusel y otros elementos
    const carouselImages = [
        {
            id: 1,
            title: "Aventura en la Montaña",
            description: "Descubre rutas espectaculares en entornos naturales"
        },
        {
            id: 2,
            title: "Carreras Nocturnas",
            description: "Vive la emoción de competir bajo las luces de la ciudad"
        },
        {
            id: 3,
            title: "Comunidad Activa",
            description: "Únete a miles de ciclistas apasionados"
        }
    ];

    const featuredProjects = [
        {
            id: 1,
            title: "Ciclismo Inclusivo",
            description: "Programa para hacer el ciclismo accesible para todos",
            icon: "♿",
            progress: 75,
            supporters: 234
        },
        {
            id: 2,
            title: "Rutas Sostenibles",
            description: "Desarrollo de rutas ecológicas y respetuosas con el medio ambiente",
            icon: "🌱",
            progress: 60,
            supporters: 189
        },
        {
            id: 3,
            title: "Tecnología GPS Avanzada",
            description: "Sistema de navegación y tracking en tiempo real",
            icon: "📡",
            progress: 90,
            supporters: 312
        }
    ];

    const testimonials = [
        {
            id: 1,
            name: "María González",
            role: "Ciclista Profesional",
            content: "Esta plataforma ha revolucionado mi forma de entrenar y competir. ¡Increíble!",
            avatar: "👩‍🚴"
        },
        {
            id: 2,
            name: "Carlos Rodríguez",
            role: "Organizador de Eventos",
            content: "La gestión de eventos es mucho más sencilla y los participantes están más involucrados.",
            avatar: "👨‍💼"
        },
        {
            id: 3,
            name: "Ana Martínez",
            role: "Ciclista Recreativa",
            content: "He encontrado una comunidad maravillosa y eventos perfectos para mi nivel.",
            avatar: "👩‍🦰"
        }
    ];

    const stats = {
        totalUsers: 1250,
        totalEvents: 89,
        kilometersRidden: 45600,
        communities: 15
    };

    const routeTypes = [
        { type: 'all', label: 'Todas', icon: '🚴' },
        { type: 'ruta', label: 'Ruta', icon: '🛣️' },
        { type: 'montaña', label: 'Montaña', icon: '⛰️' },
        { type: 'urbano', label: 'Urbano', icon: '🏙️' },
        { type: 'competitivo', label: 'Competitivo', icon: '🏆' },
        { type: 'recreativo', label: 'Recreativo', icon: '😊' }
    ];

    // Helpers responsivos
    const isMobile = windowWidth < 768;
    const isTablet = windowWidth >= 768 && windowWidth < 992;
    const isDesktop = windowWidth >= 992;

    const getCarouselHeight = () => {
        if (isMobile) return '250px';
        if (isTablet) return '300px';
        return '350px';
    };

    useEffect(() => {
        isMounted.current = true;
        loadHomeData();
        
        const timer = setTimeout(() => {
            if (!localStorage.getItem('newsletterSubscribed') && isMounted.current) {
                setShowNewsletterModal(true);
            }
        }, 5000);

        return () => {
            isMounted.current = false;
            clearTimeout(timer);
        };
    }, [isAuthenticated]);

    const loadHomeData = async () => {
        if (!isMounted.current) return;

        try {
            setLoading(true);
            setError('');

            // Simular carga de datos
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Datos de ejemplo para desarrollo
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
                    participantes_inscritos: 45,
                    cupo_maximo: 100,
                    dificultad: 'Alta'
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
                    participantes_inscritos: 120,
                    cupo_maximo: 200,
                    dificultad: 'Media'
                },
                {
                    id: 3,
                    nombre: 'Maratón Costa Barcelona',
                    descripcion: 'Recorrido costero con vistas al mediterráneo.',
                    fecha: '2024-08-10T09:00:00',
                    ubicacion: 'Barcelona, España',
                    distancia_km: 80,
                    tipo: 'ruta',
                    estado: 'Próximo',
                    cuota_inscripcion: 35.00,
                    participantes_inscritos: 75,
                    cupo_maximo: 150,
                    dificultad: 'Media'
                }
            ];

            if (isMounted.current) {
                setFeaturedEvents(demoEvents);

                if (isAuthenticated) {
                    // Simular estadísticas de usuario
                    setUserStats({
                        totalEvents: 3,
                        completedEvents: 1,
                        totalDistance: 245,
                        participationRate: 60
                    });
                }
            }

        } catch (error) {
            console.error('Error loading home data:', error);
            if (isMounted.current) {
                setError('Error al cargar los datos. Por favor, intenta nuevamente.');
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    };

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        console.log('Email suscrito:', newsletterEmail);
        localStorage.setItem('newsletterSubscribed', 'true');
        setShowNewsletterModal(false);
        setNewsletterEmail('');
        alert('¡Gracias por suscribirte a nuestro newsletter!');
    };

    const getEventTypeIcon = (type) => {
        const icons = {
            'ruta': '🚴‍♂️',
            'montaña': '⛰️',
            'urbano': '🏙️',
            'competitivo': '🏆',
            'recreativo': '😊',
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

    const filteredEvents = activeFilter === 'all'
        ? featuredEvents
        : featuredEvents.filter(event => event.tipo === activeFilter);

    if (loading) {
        return (
            <div className="homepage-modern">
                <Container className="d-flex justify-content-center align-items-center min-vh-100">
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" size="lg" />
                        <p className="mt-3 text-muted">Cargando la experiencia ciclista...</p>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="homepage-modern">
            {/* Hero Section */}
            <section className="hero-section position-relative overflow-hidden">
                <div className="hero-background"></div>
                <Container>
                    <Row className="min-vh-100 align-items-center">
                        <Col xs={12} lg={6} className="hero-content text-white text-center text-lg-start">
                            <Badge bg="warning" text="dark" className="hero-badge mb-3">
                                🚀 PLATAFORMA INNOVADORA
                            </Badge>
                            <h1 className="hero-title display-4 display-lg-3 fw-bold mb-3 mb-lg-4">
                                VIVE EL CICLISMO COMO <span className="text-warning">NUNCA ANTES</span>
                            </h1>
                            <p className="hero-subtitle lead mb-4">
                                Tecnología avanzada, comunidad activa y experiencias únicas sobre dos ruedas
                            </p>
                            <div className="hero-actions d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-2 gap-sm-3">
                                {!isAuthenticated ? (
                                    <>
                                        <Button
                                            as={Link}
                                            to="/registro"
                                            className="btn-hero-primary"
                                            size={isMobile ? "md" : "lg"}
                                        >
                                            COMENZAR GRATIS
                                        </Button>
                                        <Button
                                            as={Link}
                                            to="/eventos"
                                            className="btn-hero-secondary"
                                            variant="outline-light"
                                            size={isMobile ? "md" : "lg"}
                                        >
                                            EXPLORAR EVENTOS
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            as={Link}
                                            to="/cuenta/dashboard"
                                            className="btn-hero-primary"
                                            size={isMobile ? "md" : "lg"}
                                        >
                                            MI DASHBOARD
                                        </Button>
                                        <Button
                                            as={Link}
                                            to="/eventos"
                                            className="btn-hero-secondary"
                                            variant="outline-light"
                                            size={isMobile ? "md" : "lg"}
                                        >
                                            NUEVO EVENTO
                                        </Button>
                                    </>
                                )}
                            </div>
                        </Col>
                        <Col xs={12} lg={6} className="hero-visual mt-4 mt-lg-0">
                            <div className="floating-elements d-none d-lg-flex justify-content-center align-items-center">
                                <div className="text-center">
                                    <div style={{fontSize: '8rem'}}>🚴‍♂️</div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Estadísticas Globales */}
            <section className="stats-section py-4 py-lg-5">
                <Container>
                    <Row className="g-3 g-lg-4">
                        {[
                            { icon: '👥', number: `${stats.totalUsers}+`, label: 'Ciclistas Activos' },
                            { icon: '📅', number: `${stats.totalEvents}+`, label: 'Eventos Organizados' },
                            { icon: '🛣️', number: `${stats.kilometersRidden}K`, label: 'Km Recorridos' },
                            { icon: '🌍', number: `${stats.communities}+`, label: 'Comunidades' }
                        ].map((stat, index) => (
                            <Col xs={6} md={3} key={index}>
                                <div className="stat-card text-center h-100">
                                    <div className="stat-icon">{stat.icon}</div>
                                    <h3 className="stat-number">{stat.number}</h3>
                                    <p className="stat-label small">{stat.label}</p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Carrusel de Imágenes */}
            <section className="carousel-section py-4 py-lg-5">
                <Container>
                    <Row className="mb-4">
                        <Col className="text-center">
                            <h2 className="section-title h1 h2-lg fw-bold">
                                DESCUBRE <span className="text-primary">EXPERIENCIAS ÚNICAS</span>
                            </h2>
                            <p className="section-subtitle">
                                Galería de nuestros eventos y proyectos más destacados
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} lg={10} className="mx-auto">
                            <Carousel 
                                fade 
                                indicators 
                                interval={4000}
                                controls={!isMobile}
                            >
                                {carouselImages.map((image) => (
                                    <Carousel.Item key={image.id}>
                                        <div 
                                            className="carousel-image-placeholder d-flex align-items-center justify-content-center"
                                            style={{
                                                height: getCarouselHeight(),
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                borderRadius: '15px',
                                                color: 'white'
                                            }}
                                        >
                                            <div className="text-center px-3">
                                                <div className="carousel-icon mb-2" style={{fontSize: isMobile ? '3rem' : '4rem'}}>
                                                    🚴‍♂️
                                                </div>
                                                <h3 className="h4 h3-lg mb-2">{image.title}</h3>
                                                <p className="mb-0">{image.description}</p>
                                            </div>
                                        </div>
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Dashboard Personalizado */}
            {isAuthenticated && userStats && (
                <section className="dashboard-section py-4 py-lg-5">
                    <Container>
                        <Row className="mb-4">
                            <Col className="text-center">
                                <h2 className="section-title h1 h2-lg fw-bold text-white">
                                    MI <span className="text-warning">DASHBOARD</span>
                                </h2>
                                <p className="section-subtitle text-white">
                                    Bienvenido de vuelta, <strong>{user?.nombre || user?.nombre_completo || 'Ciclista'}</strong>
                                </p>
                            </Col>
                        </Row>

                        <Row className="g-3 g-lg-4">
                            {[
                                { icon: '📊', number: userStats.totalEvents, label: 'Total Eventos' },
                                { icon: '✅', number: userStats.completedEvents, label: 'Completados' },
                                { icon: '🛣️', number: `${userStats.totalDistance}km`, label: 'Distancia Total' },
                                { icon: '📈', number: `${userStats.participationRate}%`, label: 'Tasa Participación', progress: true }
                            ].map((stat, index) => (
                                <Col xs={6} md={3} key={index}>
                                    <Card className="stats-card text-center h-100">
                                        <Card.Body className="d-flex flex-column justify-content-center">
                                            <div className="stat-icon">{stat.icon}</div>
                                            <h3 className="stat-number h4 h3-lg">{stat.number}</h3>
                                            <p className="stat-label small mb-2">{stat.label}</p>
                                            {stat.progress && (
                                                <ProgressBar 
                                                    now={userStats.participationRate} 
                                                    className="mt-auto" 
                                                    variant="warning" 
                                                    style={{height: '6px'}}
                                                />
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Container>
                </section>
            )}

            {/* Proyectos Destacados */}
           <section className="projects-section py-4 py-lg-5">
    <Container>
        <Row className="mb-4">
            <Col className="text-center">
                <h2 className="section-title h1 h2-lg fw-bold">
                    PROYECTOS <span className="text-primary">INNOVADORES</span>
                </h2>
                <p className="section-subtitle">
                    Iniciativas que están transformando el ciclismo
                </p>
            </Col>
        </Row>
        <Row className="g-3 g-lg-4">
            {featuredProjects.map((project) => (
                <Col xs={12} md={6} lg={4} key={project.id}>
                    <Card className="project-card h-100">
                        <Card.Body className="d-flex flex-column text-center">
                            <div className="project-icon mb-3" style={{fontSize: '3rem'}}>
                                {project.icon}
                            </div>
                            <Card.Title className="h5 mb-3 text-dark">
                                {project.title}
                            </Card.Title>
                            <Card.Text className="flex-grow-1 text-muted">
                                {project.description}
                            </Card.Text>
                            <div className="project-progress mt-auto">
                                <div className="d-flex justify-content-between mb-2 small">
                                    <span className="text-dark">Progreso</span>
                                    <span className="text-dark fw-bold">{project.progress}%</span>
                                </div>
                                <ProgressBar now={project.progress} variant="success" />
                                <div className="project-supporters mt-2">
                                    <small className="text-muted">
                                        {project.supporters} apoyos
                                    </small>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    </Container>
</section>

            {/* Eventos Destacados */}
            <section className="events-section py-4 py-lg-5">
                <Container>
                    <Row className="mb-4">
                        <Col className="text-center">
                            <h2 className="section-title h1 h2-lg fw-bold">
                                PRÓXIMOS <span className="text-primary">EVENTOS</span>
                            </h2>
                            <p className="section-subtitle">
                                No te pierdas estos desafíos emocionantes
                            </p>
                        </Col>
                    </Row>

                    {/* Filtros */}
                    <Row className="mb-4">
                        <Col>
                            <div className="route-filters d-flex flex-wrap justify-content-center gap-2">
                                {routeTypes.map(route => (
                                    <Button
                                        key={route.type}
                                        variant={activeFilter === route.type ? "primary" : "outline-primary"}
                                        className="route-filter-btn"
                                        onClick={() => setActiveFilter(route.type)}
                                        size={isMobile ? "sm" : "md"}
                                    >
                                        <span className="me-1 me-md-2">{route.icon}</span>
                                        <span className="d-none d-sm-inline">{route.label}</span>
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

                    <Row className="g-3 g-lg-4">
                        {filteredEvents.length > 0 ? (
                            filteredEvents.map((event) => (
                                <Col xs={12} md={6} lg={4} key={event.id}>
                                    <Card className="event-card h-100">
                                        <Card.Body className="d-flex flex-column">
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <span className="event-icon fs-2">
                                                    {getEventTypeIcon(event.tipo)}
                                                </span>
                                                <Badge bg={getStatusVariant(event.estado)}>
                                                    {event.estado || 'Próximo'}
                                                </Badge>
                                            </div>
                                            <Card.Title className="h5">
                                                <Link to={`/evento/${event.id}`} className="text-decoration-none text-dark">
                                                    {event.nombre}
                                                </Link>
                                            </Card.Title>
                                            <Card.Text className="text-muted small mb-2">
                                                {formatDate(event.fecha)}
                                            </Card.Text>
                                            <Card.Text className="flex-grow-1 small">
                                                {event.descripcion || 'Sin descripción disponible.'}
                                            </Card.Text>
                                            <div className="mt-auto pt-3">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <strong className="text-primary h6">
                                                            ${event.cuota_inscripcion || 0}
                                                        </strong>
                                                        <div className="text-muted small">
                                                            {event.ubicacion}
                                                        </div>
                                                    </div>
                                                    <Button 
                                                        variant="primary"
                                                        onClick={() => navigate(`/evento/${event.id}`)}
                                                        size={isMobile ? "sm" : "md"}
                                                    >
                                                        Ver Detalles
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <Col xs={12}>
                                <Card className="text-center py-5">
                                    <Card.Body>
                                        <div className="text-muted mb-3" style={{fontSize: '3rem'}}>🚴‍♂️</div>
                                        <h5>No hay eventos próximos</h5>
                                        <p className="text-muted mb-3">
                                            Próximamente tendremos más eventos emocionantes para ti.
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

            {/* Testimonios */}
           
<section className="testimonials-section py-4 py-lg-5">
    <Container>
        <Row className="mb-4">
            <Col className="text-center">
                <h2 className="section-title h1 h2-lg fw-bold text-white">
                    LO QUE DICEN <span className="text-warning">NUESTROS CICLISTAS</span>
                </h2>
                <p className="section-subtitle text-white opacity-75">
                    Descubre por qué miles de ciclistas confían en nosotros
                </p>
            </Col>
        </Row>
        <Row className="g-3 g-lg-4">
            {testimonials.map((testimonial) => (
                <Col xs={12} md={6} lg={4} key={testimonial.id}>
                    <Card className="testimonial-card h-100">
                        <Card.Body className="text-center d-flex flex-column">
                            <div className="testimonial-avatar mb-3" style={{fontSize: '3rem'}}>
                                {testimonial.avatar}
                            </div>
                            <Card.Text className="fst-italic mb-3 flex-grow-1 text-white">
                                "{testimonial.content}"
                            </Card.Text>
                            <div>
                                <Card.Title className="h6 mb-1 text-white">
                                    {testimonial.name}
                                </Card.Title>
                                <Card.Text className="text-warning small fw-bold">
                                    {testimonial.role}
                                </Card.Text>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    </Container>
</section>


<section className="projects-section py-4 py-lg-5">
    <Container>
        <Row className="mb-4">
            <Col className="text-center">
                <h2 className="section-title h1 h2-lg fw-bold">
                    PROYECTOS <span className="text-primary">INNOVADORES</span>
                </h2>
                <p className="section-subtitle">
                    Iniciativas que están transformando el ciclismo
                </p>
            </Col>
        </Row>
        <Row className="g-3 g-lg-4">
            {featuredProjects.map((project) => (
                <Col xs={12} md={6} lg={4} key={project.id}>
                    <Card className="project-card h-100">
                        <Card.Body className="d-flex flex-column text-center">
                            <div className="project-icon mb-3" style={{fontSize: '3rem'}}>
                                {project.icon}
                            </div>
                            <Card.Title className="h5 mb-3 text-dark">
                                {project.title}
                            </Card.Title>
                            <Card.Text className="flex-grow-1 text-muted">
                                {project.description}
                            </Card.Text>
                            <div className="project-progress mt-auto">
                                <div className="d-flex justify-content-between mb-2 small">
                                    <span className="text-dark">Progreso</span>
                                    <span className="text-dark fw-bold">{project.progress}%</span>
                                </div>
                                <ProgressBar now={project.progress} variant="success" />
                                <div className="project-supporters mt-2">
                                    <small className="text-muted">
                                        {project.supporters} apoyos
                                    </small>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    </Container>
</section>

            {/* CTA Final */}
            <section className="cta-section py-4 py-lg-5 text-white">
                <Container>
                    <Row className="text-center">
                        <Col xs={12} lg={8} className="mx-auto">
                            <h2 className="display-5 display-lg-4 fw-bold mb-3 mb-lg-4">
                                ¿LISTO PARA EL <span className="text-warning">PRÓXIMO NIVEL</span>?
                            </h2>
                            <p className="lead mb-4">
                                Únete a la revolución del ciclismo moderno
                            </p>
                            <Button
                                as={Link}
                                to={isAuthenticated ? "/eventos" : "/registro"}
                                variant="warning"
                                size="lg"
                                className="btn-cta px-4 px-lg-5 py-3 fw-bold"
                            >
                                {isAuthenticated ? "EXPLORAR EVENTOS" : "COMENZAR AHORA"}
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Modal de Newsletter */}
            <Modal 
                show={showNewsletterModal} 
                onHide={() => setShowNewsletterModal(false)} 
                centered
                size={isMobile ? "" : "lg"}
            >
                <Modal.Header closeButton>
                    <Modal.Title>🚀 No te pierdas nada</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Suscríbete a nuestro newsletter y recibe:</p>
                    <ul className="mb-3">
                        <li>📧 Novedades de eventos exclusivos</li>
                        <li>🎁 Descuentos y promociones especiales</li>
                        <li>💡 Consejos de entrenamiento y nutrición</li>
                        <li>🌟 Contenido premium para ciclistas</li>
                    </ul>
                    <Form onSubmit={handleNewsletterSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Tu email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="tu@email.com"
                                value={newsletterEmail}
                                onChange={(e) => setNewsletterEmail(e.target.value)}
                                required
                                size={isMobile ? "sm" : "md"}
                            />
                        </Form.Group>
                        <div className="d-grid gap-2">
                            <Button variant="primary" type="submit" size={isMobile ? "sm" : "md"}>
                                Suscribirme
                            </Button>
                            <Button 
                                variant="outline-secondary" 
                                onClick={() => setShowNewsletterModal(false)}
                                size={isMobile ? "sm" : "md"}
                            >
                                Ahora no, gracias
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default HomePage;