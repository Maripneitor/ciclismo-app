import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tabs, Tab } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const SystemSettingsPage = () => {
    const { user } = useAuth();
    const [settings, setSettings] = useState({
        site_name: 'Ciclismo App',
        site_description: 'Plataforma de gestión de eventos de ciclismo',
        contact_email: 'info@ciclismoapp.com',
        contact_phone: '+34 912 345 678',
        max_events_per_organizer: 10,
        max_team_members: 10,
        registration_deadline_days: 7
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // En una implementación real, cargaría los settings desde la API
        loadSettings();
    }, []);

    const loadSettings = async () => {
        // Simular carga de settings
        setTimeout(() => {
            setSettings({
                site_name: 'Ciclismo App',
                site_description: 'Plataforma de gestión de eventos de ciclismo',
                contact_email: 'info@ciclismoapp.com',
                contact_phone: '+34 912 345 678',
                max_events_per_organizer: 10,
                max_team_members: 10,
                registration_deadline_days: 7
            });
        }, 500);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // En una implementación real, guardaría en la API
            setTimeout(() => {
                setSuccess('Configuración guardada exitosamente');
                setLoading(false);
            }, 1000);
        } catch (error) {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    if (!user || user.rol !== 'admin') {
        return (
            <Container className="py-5">
                <Alert variant="danger">
                    <h4>Acceso Denegado</h4>
                    <p>Solo los administradores pueden acceder a esta página.</p>
                </Alert>
            </Container>
        );
    }

    return (
        <Container fluid>
            <Row className="mb-4">
                <Col>
                    <h2>Configuración del Sistema</h2>
                    <p className="text-muted">Configura los parámetros generales de la plataforma</p>
                </Col>
            </Row>

            {success && <Alert variant="success">{success}</Alert>}

            <Tabs defaultActiveKey="general" className="mb-4">
                <Tab eventKey="general" title="⚙️ General">
                    <Card>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Nombre del Sitio</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="site_name"
                                                value={settings.site_name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email de Contacto</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="contact_email"
                                                value={settings.contact_email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Descripción del Sitio</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="site_description"
                                        value={settings.site_description}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Teléfono de Contacto</Form.Label>
                                            <Form.Control
                                                type="tel"
                                                name="contact_phone"
                                                value={settings.contact_phone}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Límite de Eventos por Organizador</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="max_events_per_organizer"
                                                value={settings.max_events_per_organizer}
                                                onChange={handleChange}
                                                min="1"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Máximo Miembros por Equipo</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="max_team_members"
                                                value={settings.max_team_members}
                                                onChange={handleChange}
                                                min="1"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Días Límite para Inscripción</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="registration_deadline_days"
                                                value={settings.registration_deadline_days}
                                                onChange={handleChange}
                                                min="1"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Button variant="primary" type="submit" disabled={loading}>
                                    {loading ? 'Guardando...' : 'Guardar Configuración'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Tab>

                <Tab eventKey="emails" title="📧 Emails">
                    <Card>
                        <Card.Body>
                            <h5>Configuración de Emails Automáticos</h5>
                            <p className="text-muted">
                                Configura los templates de emails que se enviarán automáticamente.
                            </p>
                            <Alert variant="info">
                                Esta funcionalidad estará disponible en la próxima actualización.
                            </Alert>
                        </Card.Body>
                    </Card>
                </Tab>

                <Tab eventKey="backup" title="💾 Backup">
                    <Card>
                        <Card.Body>
                            <h5>Gestión de Backup</h5>
                            <p className="text-muted">
                                Realiza backup de la base de datos y gestiona restauraciones.
                            </p>
                            <div className="d-flex gap-3">
                                <Button variant="outline-primary">
                                    Generar Backup
                                </Button>
                                <Button variant="outline-secondary" disabled>
                                    Restaurar Backup
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Tab>
            </Tabs>
        </Container>
    );
};

export default SystemSettingsPage;