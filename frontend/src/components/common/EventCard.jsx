import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const EventCard = ({ event, onRegister, showActions = true }) => {
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

    return (
        <Card className="h-100 shadow-sm event-card">
            <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="fs-2">{getEventTypeIcon(event.tipo)}</span>
                    <Badge bg={getStatusVariant(event.estado)}>
                        {event.estado}
                    </Badge>
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
                    {formatDate(event.fecha)}
                </Card.Text>

                <Card.Text className="flex-grow-1">
                    {event.descripcion || 'Sin descripción disponible.'}
                </Card.Text>

                <div className="mt-auto">
                    <div className="d-flex justify-content-between text-sm mb-2">
                        <span>{event.ubicacion || 'Ubicación no especificada'}</span>
                        <span>{event.distancia_km || event.distancia || '0'} km</span>
                    </div>

                    {showActions && (
                        <div className="d-flex justify-content-between align-items-center">
                            <strong>€{event.cuota_inscripcion || 0}</strong>
                            <div className="d-flex gap-2">
                                <Button
                                    as={Link}
                                    to={`/evento/${event.evento_id || event.id}`}
                                    variant="outline-primary"
                                    size="sm"
                                >
                                    Ver Detalles
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => onRegister && onRegister(event)}
                                    disabled={event.estado === 'Finalizado'}
                                >
                                    Inscribirse
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
};

export default EventCard;