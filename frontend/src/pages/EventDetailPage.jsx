// frontend/src/pages/EventDetailPage.jsx - VERSIÓN MEJORADA
import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Button, Badge, Alert, 
  Modal, Spinner, Carousel, Tab, Tabs 
} from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RegistrationForm from '../components/forms/RegistrationForm';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('descripcion');

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      // En desarrollo, usar datos de ejemplo enriquecidos
      const demoEvent = {
        evento_id: parseInt(id),
        nombre: 'Gran Fondo Sierra Nevada',
        descripcion: 'Un desafío épico a través de los picos más altos de España. Esta ruta de montaña te llevará por paisajes espectaculares, desde verdes valles hasta impresionantes miradores. Perfecta para ciclistas experimentados que buscan superar sus límites.',
        fecha: '2024-06-15T08:00:00',
        ubicacion: 'Granada, Andalucía, España',
        distancia_km: 120,
        tipo: 'montaña',
        estado: 'Próximo',
        cuota_inscripcion: 50.00,
        participantes_inscritos: 45,
        cupo_maximo: 100,
        dificultad: 'Alta',
        elevacion: 2500,
        organizador: 'Club Ciclista Granada',
        // Nuevos campos para galería
        galeria: [
          '/images/events/sierra-nevada-1.jpg',
          '/images/events/sierra-nevada-2.jpg',
          '/images/events/sierra-nevada-3.jpg',
          '/images/events/sierra-nevada-4.jpg'
        ],
        video_presentacion: '/videos/event-highlight-sierra-nevada.mp4',
        kit_bienvenida: {
          incluido: true,
          items: ['Camiseta técnica', 'Número dorsal', 'Bolsa del corredor', 'Avituallamientos', 'Seguro deportivo']
        },
        requisitos: ['Edad mínima: 18 años', 'Casco obligatorio', 'Bicicleta en buen estado', 'Experiencia en montaña recomendada'],
        horarios: {
          registro: '06:00 - 07:30',
          salida: '08:00',
          llegada: '16:00',
          premiacion: '17:00'
        }
      };
      
      setEvent(demoEvent);
    } catch (error) {
      setError('Error cargando evento');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/evento/${id}` } });
      return;
    }
    setShowRegistrationModal(true);
  };

  const handleRegistrationSuccess = (message) => {
    setRegistrationSuccess(message);
    setShowRegistrationModal(false);
    setTimeout(() => {
      setRegistrationSuccess('');
      navigate('/cuenta/inscripciones');
    }, 3000);
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Próximo': return 'warning';
      case 'En Curso': return 'success';
      case 'Finalizado': return 'secondary';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      'ruta': '🛣️',
      'montaña': '⛰️',
      'urbano': '🏙️',
      'competitivo': '🏆',
      'recreativo': '😊'
    };
    return icons[type] || '🚴';
  };

  const getDifficultyBadge = (dificultad) => {
    const config = {
      'baja': { color: 'success', stars: '⭐', label: 'Baja' },
      'media': { color: 'warning', stars: '⭐⭐', label: 'Media' },
      'alta': { color: 'danger', stars: '⭐⭐⭐', label: 'Alta' }
    };
    return config[dificultad?.toLowerCase()] || config.media;
  };

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Cargando evento...</span>
        </Spinner>
        <p className="mt-2">Cargando detalles del evento...</p>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container className="py-4">
        <Alert variant="warning">
          Evento no encontrado
        </Alert>
      </Container>
    );
  }

  const difficulty = getDifficultyBadge(event.dificultad);

  return (
    <Container className="py-4">
      {error && <Alert variant="danger">{error}</Alert>}
      {registrationSuccess && <Alert variant="success">{registrationSuccess}</Alert>}

      <Row>
        <Col lg={8}>
          {/* Galería de Imágenes */}
          <Card className="mb-4">
            <EventGallery 
              images={event.galeria} 
              eventName={event.nombre}
              video={event.video_presentacion}
            />
          </Card>

          {/* Información del Evento con Tabs */}
          <Card>
            <Card.Body>
              <Tabs
                activeKey={activeTab}
                onSelect={(tab) => setActiveTab(tab)}
                className="mb-3"
              >
                <Tab eventKey="descripcion" title="📝 Descripción">
                  <EventDescription event={event} />
                </Tab>
                
                <Tab eventKey="kit" title="🎁 Kit de Bienvenida">
                  <KitBienvenida kit={event.kit_bienvenida} />
                </Tab>
                
                <Tab eventKey="requisitos" title="✅ Requisitos">
                  <RequisitosEvento requisitos={event.requisitos} />
                </Tab>
                
                <Tab eventKey="horarios" title="🕐 Horarios">
                  <HorariosEvento horarios={event.horarios} />
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          {/* Sidebar de Inscripción */}
          <Card className="sticky-top" style={{ top: '20px' }}>
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Inscripción</h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-4">
                <h3 className="text-primary fw-bold">
                  €{event.cuota_inscripcion || '0.00'}
                </h3>
                <p className="text-muted">Cuota de inscripción</p>
              </div>

              {/* Badges de Información */}
              <div className="d-flex flex-wrap gap-2 mb-3">
                <Badge bg={getStatusVariant(event.estado)}>
                  {event.estado}
                </Badge>
                <Badge bg={difficulty.color}>
                  {difficulty.stars} {difficulty.label}
                </Badge>
                <Badge bg="info">
                  {getTypeIcon(event.tipo)} {event.tipo}
                </Badge>
              </div>

              {/* Estadísticas Rápidas */}
              <div className="event-stats-small mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Distancia:</span>
                  <strong>{event.distancia_km} km</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Elevación:</span>
                  <strong>{event.elevacion} m</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Inscritos:</span>
                  <strong>{event.participantes_inscritos}/{event.cupo_maximo}</strong>
                </div>
              </div>

              {event.estado === 'Finalizado' ? (
                <Button variant="secondary" size="lg" className="w-100" disabled>
                  Evento Finalizado
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="w-100"
                  onClick={handleRegisterClick}
                >
                  {isAuthenticated ? 'Inscribirse' : 'Iniciar Sesión para Inscribirse'}
                </Button>
              )}

              {/* Información Adicional */}
              <div className="mt-3 text-center">
                <small className="text-muted d-block">
                  📍 {event.ubicacion}
                </small>
                <small className="text-muted">
                  🗓️ {new Date(event.fecha).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de Inscripción */}
      <Modal 
        show={showRegistrationModal} 
        onHide={() => setShowRegistrationModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Inscripción al Evento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RegistrationForm
            event={event}
            onSuccess={handleRegistrationSuccess}
            onCancel={() => setShowRegistrationModal(false)}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

// Componente de Galería con Video
const EventGallery = ({ images, eventName, video }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="event-gallery">
      <Carousel 
        activeIndex={activeIndex} 
        onSelect={setActiveIndex}
        interval={null}
        indicators
        controls
      >
        {/* Video de Presentación */}
        {video && (
          <Carousel.Item>
            <div className="video-container">
              <video
                controls
                className="event-video"
                poster="/images/events/video-poster.jpg"
              >
                <source src={video} type="video/mp4" />
                Tu navegador no soporta el elemento video.
              </video>
              <div className="carousel-caption">
                <Badge bg="primary">Video Presentación</Badge>
              </div>
            </div>
          </Carousel.Item>
        )}
        
        {/* Imágenes de la Galería */}
        {images?.map((image, index) => (
          <Carousel.Item key={index}>
            <div 
              className="gallery-image"
              style={{
                backgroundImage: `url(${image})`,
                height: '400px',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <div className="carousel-caption">
              <Badge bg="dark">{index + 1}/{images.length}</Badge>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
      
      {/* Miniaturas */}
      <div className="gallery-thumbnails mt-3">
        <div className="d-flex gap-2 overflow-auto">
          {video && (
            <div 
              className={`thumbnail ${activeIndex === 0 ? 'active' : ''}`}
              onClick={() => setActiveIndex(0)}
            >
              <div className="thumbnail-video">
                <span>🎬</span>
              </div>
            </div>
          )}
          {images?.map((image, index) => (
            <div 
              key={index}
              className={`thumbnail ${activeIndex === (video ? index + 1 : index) ? 'active' : ''}`}
              onClick={() => setActiveIndex(video ? index + 1 : index)}
              style={{
                backgroundImage: `url(${image})`,
                minWidth: '80px',
                height: '60px',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Componente de Descripción Mejorada
const EventDescription = ({ event }) => (
  <div>
    <h4 className="mb-3">Sobre este Evento</h4>
    <p className="mb-4">{event.descripcion}</p>
    
    <Row className="g-3">
      <Col md={6}>
        <h6>🚴 Tipo de Ciclismo</h6>
        <p className="text-muted">{event.tipo}</p>
      </Col>
      <Col md={6}>
        <h6>📏 Distancia Total</h6>
        <p className="text-muted">{event.distancia_km} kilómetros</p>
      </Col>
      <Col md={6}>
        <h6>⛰️ Elevación</h6>
        <p className="text-muted">{event.elevacion} metros de desnivel</p>
      </Col>
      <Col md={6}>
        <h6>👤 Organizador</h6>
        <p className="text-muted">{event.organizador}</p>
      </Col>
    </Row>
  </div>
);

// Componente de Kit de Bienvenida
const KitBienvenida = ({ kit }) => (
  <div>
    <h4 className="mb-3">🎁 Kit de Bienvenida</h4>
    {kit?.incluido ? (
      <>
        <p className="text-success mb-3">
          <strong>✅ Kit incluido en la inscripción</strong>
        </p>
        <ul className="list-unstyled">
          {kit.items?.map((item, index) => (
            <li key={index} className="mb-2">
              <span className="me-2">🎯</span>
              {item}
            </li>
          ))}
        </ul>
      </>
    ) : (
      <p className="text-muted">Este evento no incluye kit de bienvenida.</p>
    )}
  </div>
);

// Componente de Requisitos
const RequisitosEvento = ({ requisitos }) => (
  <div>
    <h4 className="mb-3">✅ Requisitos de Participación</h4>
    <ul className="list-unstyled">
      {requisitos?.map((requisito, index) => (
        <li key={index} className="mb-2">
          <span className="me-2">📋</span>
          {requisito}
        </li>
      ))}
    </ul>
  </div>
);

// Componente de Horarios
const HorariosEvento = ({ horarios }) => (
  <div>
    <h4 className="mb-3">🕐 Horarios del Evento</h4>
    <div className="row g-3">
      <div className="col-md-6">
        <strong>Registro:</strong>
        <p className="text-muted mb-0">{horarios?.registro}</p>
      </div>
      <div className="col-md-6">
        <strong>Salida:</strong>
        <p className="text-muted mb-0">{horarios?.salida}</p>
      </div>
      <div className="col-md-6">
        <strong>Llegada estimada:</strong>
        <p className="text-muted mb-0">{horarios?.llegada}</p>
      </div>
      <div className="col-md-6">
        <strong>Premiación:</strong>
        <p className="text-muted mb-0">{horarios?.premiacion}</p>
      </div>
    </div>
  </div>
);

export default EventDetailPage;