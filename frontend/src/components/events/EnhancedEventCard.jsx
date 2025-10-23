// frontend/src/components/events/EnhancedEventCard.jsx - NUEVO COMPONENTE
import React from 'react';
import { Card, Button, Badge, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const EnhancedEventCard = ({ event, onRegister, onQuickView, isLoading, isAuthenticated }) => {
  const [imageError, setImageError] = React.useState(false);

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'próximo': return 'warning';
      case 'en curso': return 'success';
      case 'finalizado': return 'secondary';
      default: return 'secondary';
    }
  };

  const getDifficultyVariant = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'baja': return 'success';
      case 'media': return 'warning';
      case 'alta': return 'danger';
      case 'extrema': return 'dark';
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

  const isEventFull = (event.participantes_inscritos || 0) >= (event.cupo_maximo || 0);
  const isEventFinished = event.estado?.toLowerCase() === 'finalizado';

  return (
    <Card className="event-card h-100 border-0 shadow-sm">
      <div className="position-relative">
        {imageError ? (
          <div 
            className="event-image-fallback d-flex align-items-center justify-content-center bg-light"
            style={{ height: '200px' }}
          >
            <span className="display-4 text-muted">🚴</span>
          </div>
        ) : (
          <Card.Img 
            variant="top" 
            src={event.imagen} 
            alt={event.nombre}
            onError={() => setImageError(true)}
            style={{ height: '200px', objectFit: 'cover' }}
          />
        )}
        
        <div className="position-absolute top-0 start-0 m-2">
          <Badge bg={getStatusVariant(event.estado)}>
            {event.estado}
          </Badge>
        </div>
        
        <div className="position-absolute top-0 end-0 m-2">
          <Badge bg={getDifficultyVariant(event.dificultad)}>
            {event.dificultad}
          </Badge>
        </div>

        {isEventFull && !isEventFinished && (
          <div className="position-absolute bottom-0 start-0 end-0">
            <div className="bg-danger text-white text-center py-1 small">
              🔥 ¡Evento Lleno!
            </div>
          </div>
        )}
      </div>

      <Card.Body className="d-flex flex-column">
        <div className="flex-grow-1">
          <Card.Title className="h6 fw-bold mb-2">
            <Link 
              to={`/evento/${event.evento_id || event.id}`} 
              className="text-decoration-none text-dark"
            >
              {event.nombre}
            </Link>
          </Card.Title>
          
          <Card.Text className="text-muted small mb-2">
            📍 {event.ubicacion}
          </Card.Text>
          
          <Card.Text className="text-muted small mb-3">
            📅 {formatDate(event.fecha)}
          </Card.Text>

          <Card.Text className="small text-muted mb-3">
            {event.descripcion?.substring(0, 100)}
            {event.descripcion?.length > 100 && '...'}
          </Card.Text>
        </div>

        <div className="event-stats mb-3">
          <Row className="text-center g-2">
            <Col xs={4}>
              <div className="border rounded py-1">
                <div className="small text-primary fw-bold">
                  {event.distancia_km || event.distancia}km
                </div>
                <div className="x-small text-muted">Distancia</div>
              </div>
            </Col>
            <Col xs={4}>
              <div className="border rounded py-1">
                <div className="small text-success fw-bold">
                  {event.elevacion || 0}m
                </div>
                <div className="x-small text-muted">Elevación</div>
              </div>
            </Col>
            <Col xs={4}>
              <div className="border rounded py-1">
                <div className="small text-warning fw-bold">
                  €{event.cuota_inscripcion || 0}
                </div>
                <div className="x-small text-muted">Precio</div>
              </div>
            </Col>
          </Row>
        </div>

        <div className="mb-3">
          <div className="d-flex justify-content-between small text-muted mb-1">
            <span>Cupos</span>
            <span>{event.participantes_inscritos || 0}/{event.cupo_maximo || 0}</span>
          </div>
          <div className="progress" style={{ height: '4px' }}>
            <div 
              className="progress-bar" 
              style={{ 
                width: `${((event.participantes_inscritos || 0) / (event.cupo_maximo || 1)) * 100}%` 
              }}
            ></div>
          </div>
        </div>

        <div className="d-grid gap-2">
          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              size="sm"
              className="flex-grow-1"
              onClick={() => onQuickView(event)}
            >
              Vista Rápida
            </Button>
            <Button
              as={Link}
              to={`/evento/${event.evento_id || event.id}`}
              variant="outline-secondary"
              size="sm"
            >
              Detalles
            </Button>
          </div>
          
          <Button
            variant="primary"
            size="sm"
            onClick={() => onRegister(event)}
            disabled={isLoading || isEventFull || isEventFinished || !isAuthenticated}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Inscribiendo...
              </>
            ) : isEventFinished ? (
              'Evento Finalizado'
            ) : isEventFull ? (
              'Cupo Lleno'
            ) : !isAuthenticated ? (
              'Iniciar Sesión'
            ) : (
              'Inscribirse'
            )}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default EnhancedEventCard;