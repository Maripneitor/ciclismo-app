import React from 'react';
import { Card, Badge, ProgressBar, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  formatDate, 
  formatCurrency, 
  formatDistance, 
  calculateProgress 
} from '../../utils/formatting';
import { 
  getStatusVariant, 
  getDifficultyVariant, 
  getEventTypeIcon,
  getStatusText 
} from '../../utils/uiHelpers';

const EventCard = ({ 
  event, 
  layoutVariant = 'default',
  showDateHighlight = false,
  showActions = true,
  onActionClick 
}) => {
  const {
    evento_id,
    id,
    nombre,
    descripcion,
    fecha,
    ubicacion,
    tipo,
    estado,
    dificultad,
    distancia_km,
    cuota_inscripcion,
    participantes_inscritos,
    cupo_maximo,
    imagen
  } = event;

  const eventId = evento_id || id;

  // Usar utilidades importadas
  const statusVariant = getStatusVariant(estado);
  const difficultyVariant = getDifficultyVariant(dificultad);
  const eventIcon = getEventTypeIcon(tipo);
  const formattedDate = formatDate(fecha);
  const formattedDistance = formatDistance(distancia_km);
  const formattedPrice = formatCurrency(cuota_inscripcion);
  const progress = calculateProgress(participantes_inscritos, cupo_maximo);
  const statusText = getStatusText(estado);

  const handleActionClick = (action) => {
    if (onActionClick) {
      onActionClick(action, event);
    }
  };

  return (
    <Card className={`event-card h-100 ${layoutVariant === 'featured' ? 'event-card-featured' : ''}`}>
      {imagen && (
        <div className="event-card-image-container">
          <Card.Img 
            variant="top" 
            src={imagen} 
            alt={nombre}
            className="event-card-image"
          />
          {showDateHighlight && (
            <div className="event-date-badge">
              <div className="event-date-day">
                {new Date(fecha).getDate()}
              </div>
              <div className="event-date-month">
                {new Date(fecha).toLocaleDateString('es-ES', { month: 'short' })}
              </div>
            </div>
          )}
        </div>
      )}
      
      <Card.Body className="d-flex flex-column">
        <div className="event-header mb-2">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <Badge bg={statusVariant} className="event-status">
              {statusText}
            </Badge>
            <span className="event-type-icon" title={tipo}>
              {eventIcon}
            </span>
          </div>
          
          <Card.Title className="event-title h5">
            {nombre}
          </Card.Title>
        </div>

        <Card.Text className="event-description text-muted small flex-grow-1">
          {descripcion?.substring(0, 100)}
          {descripcion?.length > 100 && '...'}
        </Card.Text>

        <div className="event-details mt-auto">
          <div className="event-meta mb-2">
            <div className="event-meta-item">
              <small className="text-muted">
                <strong>📅</strong> {formattedDate}
              </small>
            </div>
            <div className="event-meta-item">
              <small className="text-muted">
                <strong>📍</strong> {ubicacion}
              </small>
            </div>
            <div className="event-meta-item">
              <small className="text-muted">
                <strong>🛣️</strong> {formattedDistance}
              </small>
            </div>
            {dificultad && (
              <div className="event-meta-item">
                <Badge bg={difficultyVariant} className="difficulty-badge">
                  {dificultad}
                </Badge>
              </div>
            )}
          </div>

          {cupo_maximo && (
            <div className="event-capacity mb-2">
              <div className="d-flex justify-content-between small text-muted mb-1">
                <span>Inscritos: {participantes_inscritos || 0}/{cupo_maximo}</span>
                <span>{progress}%</span>
              </div>
              <ProgressBar 
                now={progress} 
                variant={progress >= 90 ? 'danger' : progress >= 70 ? 'warning' : 'success'}
              />
            </div>
          )}

          <div className="event-footer d-flex justify-content-between align-items-center">
            <div className="event-price h6 mb-0 text-primary">
              {formattedPrice}
            </div>
            
            {showActions && (
              <div className="event-actions">
                <Button
                  as={Link}
                  to={`/evento/${eventId}`}
                  variant="primary"
                  size="sm"
                  onClick={() => handleActionClick('view')}
                >
                  Ver Detalles
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default EventCard;