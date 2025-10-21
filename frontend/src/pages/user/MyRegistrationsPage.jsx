import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Alert, Modal, Form } from 'react-bootstrap';
import { registrationsAPI, eventsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const MyRegistrationsPage = () => {
    const { user } = useAuth();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [cancelReason, setCancelReason] = useState('');

    useEffect(() => {
        loadRegistrations();
    }, []);

    const loadRegistrations = async () => {
        try {
            setLoading(true);
            const registrationsData = await registrationsAPI.getAll();
            setRegistrations(registrationsData);
        } catch (error) {
            console.error('Error cargando inscripciones:', error);
            setError('Error al cargar tus inscripciones');
            // Datos de ejemplo para desarrollo
            setRegistrations([
                {
                    inscripcion_id: 1,
                    evento: {
                        nombre: 'Gran Fondo Sierra Nevada',
                        fecha: '2024-02-15T08:00:00',
                        ubicacion: 'Granada, España'
                    },
                    fecha_inscripcion: '2024-01-15T10:30:00',
                    estado: 'Confirmada',
                    categoria_nombre: 'Élite',
                    numero_dorsal: 123,
                    equipo_nombre: 'Ciclistas Madrid',
                    talla: { nombre: 'M' }
                },
                {
                    inscripcion_id: 2,
                    evento: {
                        nombre: 'Carrera Nocturna Madrid',
                        fecha: '2024-02-20T20:00:00',
                        ubicacion: 'Madrid, España'
                    },
                    fecha_inscripcion: '2024-01-10T14:20:00',
                    estado: 'Pendiente',
                    categoria_nombre: 'Recreativo',
                    numero_dorsal: 45,
                    equipo_nombre: null,
                    talla: { nombre: 'L' }
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'Confirmada': return 'success';
            case 'Pendiente': return 'warning';
            case 'Cancelada': return 'danger';
            case 'En espera': return 'info';
            default: return 'secondary';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleCancelClick = (registration) => {
        setSelectedRegistration(registration);
        setShowCancelModal(true);
    };

    const handleCancelConfirm = async () => {
        try {
            await registrationsAPI.delete(selectedRegistration.inscripcion_id);
            setShowCancelModal(false);
            setCancelReason('');
            loadRegistrations();
        } catch (error) {
            setError('Error cancelando la inscripción');
        }
    };

    const isCancellable = (registration) => {
        if (registration.estado !== 'Confirmada' && registration.estado !== 'Pendiente') {
            return false;
        }
        
        const eventDate = new Date(registration.evento.fecha);
        const now = new Date();
        const hoursUntilEvent = (eventDate - now) / (1000 * 60 * 60);
        
        return hoursUntilEvent > 24; // Se puede cancelar hasta 24 horas antes
    };

    const getTimeUntilEvent = (eventDate) => {
        const now = new Date();
        const event = new Date(eventDate);
        const diffTime = event - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return 'Evento pasado';
        if (diffDays === 0) return 'Hoy';
        if (diffDays === 1) return 'Mañana';
        return `En ${diffDays} días`;
    };

    const stats = {
        total: registrations.length,
        confirmed: registrations.filter(r => r.estado === 'Confirmada').length,
        pending: registrations.filter(r => r.estado === 'Pendiente').length,
        cancelled: registrations.filter(r => r.estado === 'Cancelada').length,
        withTeam: registrations.filter(r => r.equipo_nombre).length
    };

    if (loading) {
        return (
            <Container fluid>
                <Row>
                    <Col>
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            <p className="mt-2 text-muted">Cargando tus inscripciones...</p>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container fluid>
            <Row className="mb-4">
                <Col>
                    <h2>Mis Inscripciones</h2>
                    <p className="text-muted">Gestiona todas tus inscripciones a eventos</p>
                </Col>
            </Row>

            {error && (
                <Alert variant="warning">
                    {error}
                </Alert>
            )}

            {/* Estadísticas Rápidas */}
            <Row className="mb-4">
                <Col md={2}>
                    <Card className="text-center">
                        <Card.Body>
                            <h4 className="text-primary">{stats.total}</h4>
                            <p className="text-muted mb-0">Total</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={2}>
                    <Card className="text-center">
                        <Card.Body>
                            <h4 className="text-success">{stats.confirmed}</h4>
                            <p className="text-muted mb-0">Confirmadas</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={2}>
                    <Card className="text-center">
                        <Card.Body>
                            <h4 className="text-warning">{stats.pending}</h4>
                            <p className="text-muted mb-0">Pendientes</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={2}>
                    <Card className="text-center">
                        <Card.Body>
                            <h4 className="text-danger">{stats.cancelled}</h4>
                            <p className="text-muted mb-0">Canceladas</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={2}>
                    <Card className="text-center">
                        <Card.Body>
                            <h4 className="text-info">{stats.withTeam}</h4>
                            <p className="text-muted mb-0">En Equipo</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={2}>
                    <Card className="text-center">
                        <Card.Body>
                            <h4 className="text-dark">
                                {stats.total > 0 ? Math.round((stats.confirmed / stats.total) * 100) : 0}%
                            </h4>
                            <p className="text-muted mb-0">Tasa de Éxito</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="mb-0">📋 Lista de Inscripciones</h5>
                                <small className="text-muted">
                                    {registrations.length} inscripciones encontradas
                                </small>
                            </div>
                            <Button variant="outline-primary" href="/eventos">
                                🗓️ Explorar Más Eventos
                            </Button>
                        </Card.Header>
                        <Card.Body>
                            {registrations.length === 0 ? (
                                <div className="text-center py-5">
                                    <div className="text-muted mb-3 fs-1">📝</div>
                                    <p className="text-muted">No tienes inscripciones activas.</p>
                                    <Button variant="primary" href="/eventos">
                                        Explorar Eventos
                                    </Button>
                                </div>
                            ) : (
                                <Table responsive striped hover>
                                    <thead>
                                        <tr>
                                            <th>Evento</th>
                                            <th>Fecha Evento</th>
                                            <th>Inscripción</th>
                                            <th>Categoría</th>
                                            <th>Dorsal</th>
                                            <th>Talla</th>
                                            <th>Equipo</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {registrations.map((registration) => (
                                            <tr key={registration.inscripcion_id}>
                                                <td>
                                                    <div>
                                                        <strong>{registration.evento?.nombre}</strong>
                                                        <br />
                                                        <small className="text-muted">
                                                            📍 {registration.evento?.ubicacion}
                                                        </small>
                                                        <br />
                                                        <small className="text-info">
                                                            ⏰ {getTimeUntilEvent(registration.evento?.fecha)}
                                                        </small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <small>
                                                        {registration.evento?.fecha ? 
                                                            formatDate(registration.evento.fecha) : 
                                                            'No definida'
                                                        }
                                                    </small>
                                                </td>
                                                <td>
                                                    <small>{formatDate(registration.fecha_inscripcion)}</small>
                                                </td>
                                                <td>
                                                    <Badge bg="outline-primary" text="dark">
                                                        {registration.categoria_nombre}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <Badge bg="info">#{registration.numero_dorsal}</Badge>
                                                </td>
                                                <td>
                                                    <Badge bg="light" text="dark">
                                                        {registration.talla?.nombre || 'N/A'}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    {registration.equipo_nombre ? (
                                                        <Badge bg="success">{registration.equipo_nombre}</Badge>
                                                    ) : (
                                                        <small className="text-muted">Individual</small>
                                                    )}
                                                </td>
                                                <td>
                                                    <Badge bg={getStatusVariant(registration.estado)}>
                                                        {registration.estado}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <Button 
                                                            variant="outline-primary" 
                                                            size="sm"
                                                            href={`/evento/${registration.evento?.evento_id}`}
                                                        >
                                                            👁️ Ver
                                                        </Button>
                                                        {isCancellable(registration) && (
                                                            <Button 
                                                                variant="outline-danger" 
                                                                size="sm"
                                                                onClick={() => handleCancelClick(registration)}
                                                            >
                                                                🗑️ Cancelar
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Modal de Cancelación */}
            <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cancelar Inscripción</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        ¿Estás seguro de que quieres cancelar tu inscripción a 
                        <strong> {selectedRegistration?.evento?.nombre}</strong>?
                    </p>
                    <Form.Group>
                        <Form.Label>Motivo de cancelación (opcional)</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="¿Por qué cancelas tu participación?"
                        />
                    </Form.Group>
                    <Alert variant="warning" className="mt-3">
                        <strong>⚠️ Importante:</strong> Esta acción no se puede deshacer. 
                        Si el evento tiene costo, consulta la política de reembolsos.
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
                        Mantener Inscripción
                    </Button>
                    <Button variant="danger" onClick={handleCancelConfirm}>
                        Confirmar Cancelación
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default MyRegistrationsPage;