import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Modal, Spinner } from 'react-bootstrap';
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

    useEffect(() => {
        loadEvent();
    }, [id]);

    const loadEvent = async () => {
        try {
            setLoading(true);
            const eventData = await eventsAPI.getById(id);
            setEvent(eventData);
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

    if (loading) {
        return (
            <Container className="py-4 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando evento...</span>
                </Spinner>
                <p className="mt-2">Cargando evento...</p>
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

    return (
        <Container className="py-4">
            {error && <Alert variant="danger">{error}</Alert>}
            {registrationSuccess && <Alert variant="success">{registrationSuccess}</Alert>}

            <Row>
                <Col lg={8}>
                    <Card className="mb-4">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <Badge bg={getStatusVariant(event.estado)} className="mb-2">
                                        {event.estado}
                                    </Badge>
                                    <h1>{event.nombre}</h1>
                                </div>
                                <span className="fs-2">{getTypeIcon(event.tipo)}</span>
                            </div>

                            <Row className="mb-3">
                                <Col md={6}>
                                    <strong>📅 Fecha:</strong>
                                    <p className="mb-2">
                                        {new Date(event.fecha).toLocaleDateString('es-ES', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </Col>
                                <Col md={6}>
                                    <strong>📍 Ubicación:</strong>
                                    <p className="mb-2">{event.ubicacion || 'No especificada'}</p>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={6}>
                                    <strong>📏 Distancia:</strong>
                                    <p className="mb-2">{event.distancia_km || 'No especificada'} km</p>
                                </Col>
                                <Col md={6}>
                                    <strong>🎯 Tipo:</strong>
                                    <p className="mb-2">{event.tipo || 'No especificado'}</p>
                                </Col>
                            </Row>

                            {event.descripcion && (
                                <div className="mb-3">
                                    <strong>📝 Descripción:</strong>
                                    <p className="mb-0">{event.descripcion}</p>
                                </div>
                            )}

                            <div className="mb-3">
                                <strong>👤 Organizador:</strong>
                                <p className="mb-0">
                                    {event.organizador?.nombre_completo || 'No especificado'}
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card className="sticky-top" style={{ top: '20px' }}>
                        <Card.Header>
                            <h5 className="mb-0">Inscripción</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="text-center mb-4">
                                <h3 className="text-primary">
                                    €{event.cuota_inscripcion || '0.00'}
                                </h3>
                                <p className="text-muted">Cuota de inscripción</p>
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

                            {event.maximo_participantes && (
                                <div className="mt-3 text-center">
                                    <small className="text-muted">
                                        Máximo {event.maximo_participantes} participantes
                                    </small>
                                </div>
                            )}

                            {event.permite_union_a_equipos !== false && (
                                <div className="mt-2 text-center">
                                    <small className="text-muted">
                                        ✅ Inscripción por equipos disponible
                                    </small>
                                </div>
                            )}
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

export default EventDetailPage;