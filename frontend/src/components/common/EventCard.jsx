import React from 'react';
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
    calculateProgress
}) => {
    
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

    return (
        <Card className={`event-card glass-card h-100 ${viewMode === 'list' ? 'event-card-list' : ''}`}>
            <Card.Body className="d-flex flex-column">
                {/* Header del Evento Mejorado */}
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

                {/* Información Principal */}
                <Card.Title className="h5 mb-3">
                    <Link 
                        to={`/evento/${event.evento_id || event.id}`} 
                        className="text-decoration-none text-dark"
                    >
                        {event.nombre}
                    </Link>
                </Card.Title>
                
                <Card.Text className="text-muted small mb-2">
                    {formattedDate}
                </Card.Text>

                <Card.Text className="flex-grow-1 text-secondary">
                    {event.descripcion || 'Sin descripción disponible.'}
                </Card.Text>

                {/* Estadísticas del Evento - NUEVO */}
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

                {/* Progress Bar para cupos - NUEVO */}
                {event.cupo_maximo && (
                    <div className="mb-3">
                        <div className="d-flex justify-content-between small text-muted mb-1">
                            <span>Cupos disponibles</span>
                            <span>{event.participantes_inscritos || 0}/{event.cupo_maximo}</span>
                        </div>
                        <ProgressBar 
                            now={progress} 
                            variant={progress > 80 ? "danger" : "success"}
                            className="cupo-progress"
                        />
                    </div>
                )}

                {/* Footer del Card Mejorado */}
                <div className="mt-auto">
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
                </div>
            </Card.Body>
        </Card>
    );
};

export default EventCard;