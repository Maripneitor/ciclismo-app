// frontend/src/components/events/EnhancedEventCard.jsx
import React, { useState } from 'react';
import { Card, Badge, Button, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const EnhancedEventCard = ({ 
  event, 
  onRegister, 
  loadingEvents = [],
  isAuthenticated 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Iconos por tipo de evento
  const eventTypeIcons = {
    'ruta': { icon: '🛣️', color: 'primary', label: 'Ruta' },
    'montaña': { icon: '⛰️', color: 'success', label: 'Montaña' },
    'urbano': { icon: '🏙️', color: 'info', label: 'Urbano' },
    'competitivo': { icon: '🏆', color: 'warning', label: 'Competitivo' },
    'recreativo': { icon: '😊', color: 'secondary', label: 'Recreativo' }
  };

  // Colores por dificultad
  const difficultyConfig = {
    'baja': { color: 'success', stars: '⭐', label: 'Baja' },
    'media': { color: 'warning', stars: '⭐⭐', label: 'Media' },
    'alta': { color: 'danger', stars: '⭐⭐⭐', label: 'Alta' },
    'extrema': { color: 'dark', stars: '⭐⭐⭐⭐', label: 'Extrema' }
  };

  // Badges especiales
  const getSpecialBadges = () => {
    const badges = [];
    
    // Badge por estado
    if (event.estado === 'Próximo') badges.push({ type: 'primary', text: '🔜 Próximo' });
    if (event.estado === 'En Curso') badges.push({ type: 'success', text: '🎯 En Curso' });
    
    // Badge por popularidad
    const fillPercentage = (event.participantes_inscritos / event.cupo_maximo) * 100;
    if (fillPercentage > 80) badges.push({ type: 'danger', text: '🔥 Popular' });
    if (fillPercentage > 95) badges.push({ type: 'warning', text: '⏳ Últimas Plazas' });
    
    // Badge por novedad (eventos de los próximos 7 días)
    const eventDate = new Date(event.fecha);
    const today = new Date();
    const daysDiff = (eventDate - today) / (1000 * 60 * 60 * 24);
    if (daysDiff <= 7 && daysDiff >= 0) badges.push({ type: 'info', text: '🆕 Próximamente' });
    
    return badges;
  };

  const eventType = eventTypeIcons[event.tipo] || eventTypeIcons.ruta;
  const difficulty = difficultyConfig[event.dificultad?.toLowerCase()] || difficultyConfig.media;
  const specialBadges = getSpecialBadges();
  const isRegistering = loadingEvents.includes(event.id);

  return (
    <Card className="enhanced-event-card h-100 border-0 shadow-sm">
      {/* Header con Imagen y Badges */}
      <div className="event-card-header position-relative">
        {/* Imagen del Evento */}
        <div className="event-image-container">
          {!imageError ? (
            <>
              <div className={`event-image-placeholder ${imageLoaded ? 'd-none' : ''}`}>
                <span className="event-icon-large">{eventType.icon}</span>
              </div>
              <Card.Img 
                variant="top" 
                src={event.imagen || `/images/events/event-${event.id % 5 || 1}.jpg`}
                alt={event.nombre}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                className={`event-image ${imageLoaded ? 'event-image-loaded' : 'event-image-loading'}`}
              />
            </>
          ) : (
            <div className="event-image-fallback">
              <span className="event-icon-large">{eventType.icon}</span>
              <div className="fallback-text">Imagen no disponible</div>
            </div>
          )}
        </div>

        {/* Badges Superpuestos */}
        <div className="event-badges-overlay">
          {/* Badge de Tipo */}
          <Badge bg={eventType.color} className="event-type-badge">
            {eventType.icon} {eventType.label}
          </Badge>
          
          {/* Badges Especiales */}
          {specialBadges.map((badge, index) => (
            <Badge key={index} bg={badge.type} className="special-badge">
              {badge.text}
            </Badge>
          ))}
        </div>

        {/* Dificultad con Estrellas */}
        <div className="difficulty-badge">
          <Badge bg={difficulty.color} className="difficulty-stars">
            {difficulty.stars} {difficulty.label}
          </Badge>
        </div>

        {/* Mini Mapa de Ubicación */}
        <div className="location-mini-map">
          <div className="map-placeholder">
            <span className="map-icon">📍</span>
            <small className="location-text">{event.ubicacion?.split(',')[0]}</small>
          </div>
        </div>
      </div>

      <Card.Body className="d-flex flex-column p-3">
        {/* Información Principal */}
        <div className="mb-2">
          <Card.Title className="h6 fw-bold mb-2 event-title">
            <Link to={`/evento/${event.id}`} className="text-decoration-none text-dark">
              {event.nombre}
            </Link>
          </Card.Title>
          
          <div className="event-meta d-flex align-items-center gap-2 mb-2">
            <small className="text-muted">
              <i className="bi bi-calendar-event me-1"></i>
              {new Date(event.fecha).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short'
              })}
            </small>
            <small className="text-muted">
              <i className="bi bi-geo-alt me-1"></i>
              {event.ubicacion?.split(',')[0]}
            </small>
          </div>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="event-quick-stats d-flex justify-content-between text-center mb-3">
          <div className="stat">
            <div className="stat-value text-primary fw-bold">{event.distancia_km}km</div>
            <div className="stat-label small text-muted">Distancia</div>
          </div>
          <div className="stat">
            <div className="stat-value text-success fw-bold">{event.elevacion}m</div>
            <div className="stat-label small text-muted">Elevación</div>
          </div>
          <div className="stat">
            <div className="stat-value text-warning fw-bold">€{event.cuota_inscripcion}</div>
            <div className="stat-label small text-muted">Precio</div>
          </div>
        </div>

        {/* Progress Bar de Cupos */}
        {event.cupo_maximo && (
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <small className="text-muted">Cupos disponibles</small>
              <small className="fw-semibold">
                {event.participantes_inscritos}/{event.cupo_maximo}
              </small>
            </div>
            <ProgressBar 
              now={(event.participantes_inscritos / event.cupo_maximo) * 100}
              variant={
                (event.participantes_inscritos / event.cupo_maximo) > 0.8 ? "danger" :
                (event.participantes_inscritos / event.cupo_maximo) > 0.5 ? "warning" : "success"
              }
              className="cupo-progress"
            />
          </div>
        )}

        {/* Descripción Corta */}
        <Card.Text className="event-description small text-muted flex-grow-1 mb-3">
          {event.descripcion?.length > 100 
            ? `${event.descripcion.substring(0, 100)}...` 
            : event.descripcion
          }
        </Card.Text>

        {/* Acciones */}
        <div className="event-actions d-grid gap-2 mt-auto">
          <Button
            variant={isAuthenticated ? "primary" : "secondary"}
            size="sm"
            onClick={() => onRegister && onRegister(event)}
            disabled={event.estado === 'Finalizado' || isRegistering || !isAuthenticated}
            className="fw-semibold"
          >
            {isRegistering ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Inscribiendo...
              </>
            ) : event.estado === 'Finalizado' ? (
              'Evento Finalizado'
            ) : !isAuthenticated ? (
              'Inicia sesión'
            ) : (
              'Inscribirse'
            )}
          </Button>
          
          <Button
            variant="outline-primary"
            size="sm"
            as={Link}
            to={`/evento/${event.id}`}
            className="fw-semibold"
          >
            Ver Detalles
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default EnhancedEventCard;