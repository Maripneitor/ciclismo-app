// frontend/src/components/home/FeaturedEvents.jsx - CONECTADO A API
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { homeAPI } from '../../services/api';

const FeaturedEvents = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFeaturedEvents();
  }, []);

  const loadFeaturedEvents = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Intentar obtener eventos destacados de la API
      try {
        const eventsData = await homeAPI.getFeaturedEvents();
        if (Array.isArray(eventsData)) {
          setFeaturedEvents(eventsData.slice(0, 3)); // Tomar primeros 3 eventos
        } else {
          throw new Error('Formato de datos inválido');
        }
      } catch (apiError) {
        console.warn('Error API eventos destacados, usando datos de respaldo:', apiError);
        // Fallback a datos de ejemplo solo si la API falla
        const fallbackEvents = await eventsAPI.getAll();
        setFeaturedEvents(fallbackEvents.slice(0, 3));
      }
      
    } catch (error) {
      console.error('Error loading featured events:', error);
      setError('Error cargando eventos destacados');
    } finally {
      setLoading(false);
    }
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
    switch (status?.toLowerCase()) {
      case 'próximo': return 'warning';
      case 'en curso': return 'success';
      case 'finalizado': return 'secondary';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="featured-events py-5">
        <Container>
          <Row>
            <Col className="text-center">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Cargando eventos destacados...</p>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="featured-events py-5">
        <Container>
          <Row>
            <Col>
              <Alert variant="warning">
                {error}
              </Alert>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }

  return (
    <section className="featured-events py-5 bg-light">
      <Container>
        <Row className="mb-5">
          <Col className="text-center">
            <h2 className="section-title h1 display-4 fw-bold mb-3">
              Próximos <span className="text-primary">Eventos Destacados</span>
            </h2>
            <p className="section-subtitle lead text-muted">
              No te pierdas estas increíbles experiencias ciclistas
            </p>
          </Col>
        </Row>

        {featuredEvents.length === 0 ? (
          <Row>
            <Col className="text-center">
              <p className="text-muted">No hay eventos destacados disponibles</p>
            </Col>
          </Row>
        ) : (
          <Row className="g-4">
            {featuredEvents.map((event) => (
              <Col key={event.evento_id || event.id} xs={12} md={6} lg={4}>
                <EventCard 
                  event={event} 
                  getEventTypeIcon={getEventTypeIcon}
                  getStatusVariant={getStatusVariant}
                  formatDate={formatDate}
                />
              </Col>
            ))}
          </Row>
        )}

        <Row className="mt-5">
          <Col className="text-center">
            <Button 
              as={Link} 
              to="/eventos" 
              variant="primary" 
              size="lg"
              className="px-5"
            >
              Ver Todos los Eventos
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

const EventCard = ({ event, getEventTypeIcon, getStatusVariant, formatDate }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="event-featured-card h-100 border-0 shadow-hover">
      <div className="event-image-container">
        {imageError ? (
          <div className="event-image-fallback">
            <span className="event-icon-large">{getEventTypeIcon(event.tipo)}</span>
            <div className="fallback-text">Imagen no disponible</div>
          </div>
        ) : (
          <Card.Img 
            variant="top" 
            src={event.imagen} 
            alt={event.nombre}
            onError={() => setImageError(true)}
            className="event-image"
            style={{ height: '200px', objectFit: 'cover' }}
          />
        )}
        
        <div className="event-badges">
          <Badge bg={getStatusVariant(event.estado)} className="event-status">
            {event.estado}
          </Badge>
          <Badge bg="dark" className="event-difficulty">
            {event.dificultad}
          </Badge>
        </div>

        <div className="event-date-highlight">
          <div className="event-day">
            {new Date(event.fecha).getDate()}
          </div>
          <div className="event-month">
            {new Date(event.fecha).toLocaleDateString('es-ES', { month: 'short' })}
          </div>
        </div>
      </div>

      <Card.Body className="d-flex flex-column p-4">
        <div className="mb-3">
          <Card.Title className="h5 fw-bold mb-2">
            <Link to={`/evento/${event.evento_id || event.id}`} className="text-decoration-none text-dark">
              {event.nombre}
            </Link>
          </Card.Title>
          <Card.Text className="text-muted small mb-2">
            {event.ubicacion}
          </Card.Text>
          <Card.Text className="text-muted small">
            {formatDate(event.fecha)}
          </Card.Text>
        </div>

        <Card.Text className="flex-grow-1 text-muted mb-3">
          {event.descripcion}
        </Card.Text>

        <div className="event-stats d-flex justify-content-between text-center mb-3">
          <div className="stat">
            <div className="stat-value text-primary fw-bold">{event.distancia_km || event.distancia}km</div>
            <div className="stat-label small text-muted">Distancia</div>
          </div>
          <div className="stat">
            <div className="stat-value text-success fw-bold">{event.elevacion || 0}m</div>
            <div className="stat-label small text-muted">Elevación</div>
          </div>
          <div className="stat">
            <div className="stat-value text-warning fw-bold">€{event.cuota_inscripcion || 0}</div>
            <div className="stat-label small text-muted">Inscripción</div>
          </div>
        </div>

        <div className="mb-3">
          <div className="d-flex justify-content-between small text-muted mb-1">
            <span>Cupos disponibles</span>
            <span>{event.participantes_inscritos || 0}/{event.cupo_maximo || 0}</span>
          </div>
          <div className="progress" style={{ height: '6px' }}>
            <div 
              className="progress-bar" 
              style={{ 
                width: `${((event.participantes_inscritos || 0) / (event.cupo_maximo || 1)) * 100}%` 
              }}
            ></div>
          </div>
        </div>

        <div className="d-grid gap-2">
          <Button 
            as={Link} 
            to={`/evento/${event.evento_id || event.id}`}
            variant="primary"
            className="fw-semibold"
          >
            Ver Detalles
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default FeaturedEvents;