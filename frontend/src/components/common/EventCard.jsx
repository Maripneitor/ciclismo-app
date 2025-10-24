import React, { useState } from 'react';
import { Card, Badge, Button, ProgressBar, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const EventCard = ({ 
    event, 
    onRegister, 
    onQuickView,
    showActions = true,
    viewMode = 'grid',
    loading = false,
    getEventTypeIcon,
    getStatusVariant,
    getDificultadVariant,
    formatDate,
    calculateProgress,
    layoutVariant = 'default',
    isLoading = false,
    isAuthenticated = false,
    showDateHighlight = false
}) => {
    const [imageError, setImageError] = useState(false);
    
    // Funciones por defecto si no se proporcionan
    const defaultGetEventTypeIcon = (type) => {
        const icons = {
            'ruta': '🚴‍♂️',
            'montaña': '⛰️',
            'urbano': '🏙️',
            'competitivo': '🏆',
            'recreativo': '😊'
        };
        return icons[type] || '🚴';
    };

    const defaultGetStatusVariant = (status) => {
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

    const defaultGetDificultadVariant = (dificultad) => {
        switch (dificultad?.toLowerCase()) {
            case 'baja': return 'success';
            case 'media': return 'warning';
            case 'alta': return 'danger';
            case 'extrema': return 'dark';
            default: return 'secondary';
        }
    };

    const defaultFormatDate = (dateString) => {
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

    const defaultCalculateProgress = (event) => {
        if (!event.cupo_maximo) return 0;
        const inscritos = event.participantes_inscritos || 0;
        return (inscritos / event.cupo_maximo) * 100;
    };

    // Usar funciones proporcionadas o las por defecto
    const eventTypeIcon = getEventTypeIcon ? getEventTypeIcon(event.tipo) : defaultGetEventTypeIcon(event.tipo);
    const statusVariant = getStatusVariant ? getStatusVariant(event.estado) : defaultGetStatusVariant(event.estado);
    const dificultadVariant = getDificultadVariant ? getDificultadVariant(event.dificultad) : defaultGetDificultadVariant(event.dificultad);
    const formattedDate = formatDate ? formatDate(event.fecha) : defaultFormatDate(event.fecha);
    const progress = calculateProgress ? calculateProgress(event) : defaultCalculateProgress(event);

    // Lógica para diferentes variantes
    const isEventFull = (event.participantes_inscritos || 0) >= (event.cupo_maximo || 0);
    const isEventFinished = event.estado?.toLowerCase() === 'finalizado';

    // Renderizado condicional según layoutVariant
    const renderImageSection = () => {
        if (layoutVariant === 'default') {
            return null; // No muestra imagen en layout default
        }

        return (
            <div className="position-relative">
                {imageError || !event.imagen || event.imagen.startsWith('/images/') ? (
                    <div 
                        className={`d-flex align-items-center justify-content-center bg-light ${
                            layoutVariant === 'featured' ? 'event-image-fallback' : ''
                        }`}
                        style={{ height: layoutVariant === 'featured' ? '200px' : '200px' }}
                    >
                        <span className={`${layoutVariant === 'featured' ? 'event-icon-large' : 'display-4'} text-muted`}>
                            {eventTypeIcon}
                        </span>
                        {layoutVariant === 'featured' && (
                            <div className="fallback-text">Imagen no disponible</div>
                        )}
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
                
                {/* Badges overlay para enhanced y featured */}
                {(layoutVariant === 'enhanced' || layoutVariant === 'featured') && (
                    <>
                        <div className="position-absolute top-0 start-0 m-2">
                            <Badge bg={statusVariant}>
                                {event.estado}
                            </Badge>
                        </div>
                        
                        <div className="position-absolute top-0 end-0 m-2">
                            <Badge bg={dificultadVariant}>
                                {event.dificultad}
                            </Badge>
                        </div>
                    </>
                )}

                {/* Date highlight para featured */}
                {layoutVariant === 'featured' && showDateHighlight && (
                    <div className="event-date-highlight">
                        <div className="event-day">
                            {new Date(event.fecha).getDate()}
                        </div>
                        <div className="event-month">
                            {new Date(event.fecha).toLocaleDateString('es-ES', { month: 'short' })}
                        </div>
                    </div>
                )}

                {/* Evento lleno banner */}
                {isEventFull && !isEventFinished && layoutVariant === 'enhanced' && (
                    <div className="position-absolute bottom-0 start-0 end-0">
                        <div className="bg-danger text-white text-center py-1 small">
                            🔥 ¡Evento Lleno!
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderStats = () => {
        if (layoutVariant === 'enhanced' || layoutVariant === 'featured') {
            return (
                <div className="event-stats mb-3">
                    <div className={`row g-2 text-center ${layoutVariant === 'featured' ? 'justify-content-between' : ''}`}>
                        <div className={layoutVariant === 'featured' ? 'stat' : 'col-4'}>
                            <div className={layoutVariant === 'featured' ? '' : 'border rounded py-1'}>
                                <div className={`${layoutVariant === 'featured' ? 'stat-value text-primary fw-bold' : 'small text-primary fw-bold'}`}>
                                    {event.distancia_km || event.distancia || 0}km
                                </div>
                                <div className={layoutVariant === 'featured' ? 'stat-label small text-muted' : 'x-small text-muted'}>
                                    Distancia
                                </div>
                            </div>
                        </div>
                        <div className={layoutVariant === 'featured' ? 'stat' : 'col-4'}>
                            <div className={layoutVariant === 'featured' ? '' : 'border rounded py-1'}>
                                <div className={`${layoutVariant === 'featured' ? 'stat-value text-success fw-bold' : 'small text-success fw-bold'}`}>
                                    {event.elevacion || 0}m
                                </div>
                                <div className={layoutVariant === 'featured' ? 'stat-label small text-muted' : 'x-small text-muted'}>
                                    Elevación
                                </div>
                            </div>
                        </div>
                        <div className={layoutVariant === 'featured' ? 'stat' : 'col-4'}>
                            <div className={layoutVariant === 'featured' ? '' : 'border rounded py-1'}>
                                <div className={`${layoutVariant === 'featured' ? 'stat-value text-warning fw-bold' : 'small text-warning fw-bold'}`}>
                                    ${event.cuota_inscripcion || 0}
                                </div>
                                <div className={layoutVariant === 'featured' ? 'stat-label small text-muted' : 'x-small text-muted'}>
                                    {layoutVariant === 'featured' ? 'Inscripción' : 'Precio'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // Stats para layout default
        return (
            <div className="event-stats mb-3">
                <div className="row g-2 text-center">
                    <div className="col-4">
                        <div className="stat-item">
                            <div className="stat-number">{event.distancia_km || event.distancia || 0}</div>
                            <div className="stat-label">km</div>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="stat-item">
                            <div className="stat-number">{event.elevacion || 'N/A'}</div>
                            <div className="stat-label">m elev</div>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="stat-item">
                            <div className="stat-number">{event.participantes_inscritos || 0}</div>
                            <div className="stat-label">inscritos</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderActions = () => {
        if (!showActions) return null;

        if (layoutVariant === 'enhanced') {
            return (
                <div className="d-grid gap-2">
                    <div className="d-flex gap-2">
                        <Button
                            variant="outline-primary"
                            size="sm"
                            className="flex-grow-1"
                            onClick={() => onQuickView && onQuickView(event)}
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
                        onClick={() => onRegister && onRegister(event)}
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
            );
        }

        // Actions para layout default y featured
        return (
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <small className="text-muted d-block">
                        📍 {event.ubicacion || 'Ubicación no especificada'}
                    </small>
                    <small className="text-muted">
                        👤 {event.organizador || 'Organizador'}
                    </small>
                </div>
                
                {showActions && (
                    <div className="d-flex gap-2">
                        <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => onQuickView && onQuickView(event)}
                        >
                            Vista Rápida
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => onRegister && onRegister(event)}
                            disabled={event.estado === 'Finalizado' || loading}
                        >
                            {loading ? (
                                <Spinner animation="border" size="sm" />
                            ) : event.estado === 'Finalizado' ? 'Finalizado' : 'Inscribirse'}
                        </Button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <Card className={`event-card glass-card h-100 ${
            viewMode === 'list' ? 'event-card-list' : ''
        } ${
            layoutVariant === 'enhanced' ? 'border-0 shadow-sm' : ''
        } ${
            layoutVariant === 'featured' ? 'event-featured-card border-0 shadow-hover' : ''
        }`}>
            {renderImageSection()}
            
            <Card.Body className={`d-flex flex-column ${
                layoutVariant === 'featured' ? 'p-4' : ''
            }`}>
                {/* Header del Evento - Solo para layout default */}
                {layoutVariant === 'default' && (
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center">
                            <span className="event-icon fs-2 me-3">
                                {eventTypeIcon}
                            </span>
                            <div>
                                <Badge bg={statusVariant} className="mb-1">
                                    {event.estado}
                                </Badge>
                                {event.dificultad && (
                                    <Badge bg={dificultadVariant} className="ms-1">
                                        {event.dificultad}
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <div className="text-end">
                            <div className="fs-4 fw-bold text-gradient">
                                ${event.cuota_inscripcion || 0}
                            </div>
                            <small className="text-muted">Inscripción</small>
                        </div>
                    </div>
                )}

                {/* Información Principal */}
                <Card.Title className={`${
                    layoutVariant === 'enhanced' ? 'h6 fw-bold mb-2' : 
                    layoutVariant === 'featured' ? 'h5 fw-bold mb-2' : 'h5 mb-3'
                }`}>
                    <Link 
                        to={`/evento/${event.evento_id || event.id}`} 
                        className="text-decoration-none text-dark"
                    >
                        {event.nombre}
                    </Link>
                </Card.Title>
                
                <Card.Text className="text-muted small mb-2">
                    {layoutVariant === 'featured' ? (
                        <>
                            📍 {event.ubicacion || 'Ubicación no especificada'}
                            <br />
                            📅 {formattedDate}
                        </>
                    ) : (
                        formattedDate
                    )}
                </Card.Text>

                <Card.Text className={`flex-grow-1 ${
                    layoutVariant === 'default' ? 'text-secondary' : 'text-muted small'
                }`}>
                    {event.descripcion || 'Sin descripción disponible.'}
                </Card.Text>

                {/* Estadísticas del Evento */}
                {renderStats()}

                {/* Progress Bar para cupos */}
                {event.cupo_maximo && (
                    <div className="mb-3">
                        <div className="d-flex justify-content-between small text-muted mb-1">
                            <span>
                                {layoutVariant === 'enhanced' ? 'Cupos' : 'Cupos disponibles'}
                            </span>
                            <span>{event.participantes_inscritos || 0}/{event.cupo_maximo}</span>
                        </div>
                        {layoutVariant === 'enhanced' ? (
                            <div className="progress" style={{ height: '4px' }}>
                                <div 
                                    className="progress-bar" 
                                    style={{ 
                                        width: `${progress}%` 
                                    }}
                                ></div>
                            </div>
                        ) : (
                            <ProgressBar 
                                now={progress} 
                                variant={progress > 80 ? "danger" : "success"}
                                className="cupo-progress"
                            />
                        )}
                    </div>
                )}

                {/* Footer del Card */}
                <div className="mt-auto">
                    {renderActions()}
                </div>
            </Card.Body>
        </Card>
    );
};

export default EventCard;