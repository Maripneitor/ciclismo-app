import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Accordion, Badge } from 'react-bootstrap';
import { eventsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ContactPage = () => {
    const { user, isAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        evento_id: '',
        motivo: '',
        asunto: '',
        mensaje: '',
        archivo_adjunto: null
    });
    const [events, setEvents] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                nombre: user.nombre_completo || '',
                email: user.email || '',
                telefono: user.telefono || ''
            }));
        }
        loadEvents();
    }, [user]);

    const loadEvents = async () => {
        try {
            const eventsData = await eventsAPI.getAll();
            setEvents(eventsData.slice(0, 10)); // Solo mostrar los primeros 10 eventos
        } catch (error) {
            console.error('Error cargando eventos:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simular envío del formulario
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            setShowAlert(true);
            setSubmitted(true);
            
            // Reset form
            setFormData({
                nombre: user?.nombre_completo || '',
                email: user?.email || '',
                telefono: user?.telefono || '',
                evento_id: '',
                motivo: '',
                asunto: '',
                mensaje: '',
                archivo_adjunto: null
            });

            setTimeout(() => setShowAlert(false), 5000);
        } catch (error) {
            console.error('Error enviando formulario:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
            alert('El archivo es demasiado grande. Máximo 5MB permitido.');
            e.target.value = '';
            return;
        }
        handleChange(e);
    };

    const faqItems = [
        {
            question: "¿Cómo me inscribo en un evento?",
            answer: "Para inscribirte en un evento, primero debes iniciar sesión. Luego navega a la página de eventos, selecciona el evento que te interese y haz clic en 'Inscribirse'. Completa el formulario de inscripción y confirma tu participación."
        },
        {
            question: "¿Puedo cancelar mi inscripción?",
            answer: "Sí, puedes cancelar tu inscripción hasta 24 horas antes del evento. Ve a 'Mis Inscripciones' en tu panel de usuario y selecciona la opción de cancelar. Ten en cuenta que algunas eventos pueden tener políticas de cancelación específicas."
        },
        {
            question: "¿Cómo creo un equipo?",
            answer: "Para crear un equipo, ve a la sección 'Mis Equipos' en tu panel de usuario y haz clic en 'Crear Equipo'. Completa la información del equipo y podrás invitar a otros ciclistas usando el código de invitación generado."
        },
        {
            question: "¿Qué métodos de pago aceptan?",
            answer: "Aceptamos tarjetas de crédito/débito (Visa, MasterCard), transferencias bancarias y PayPal para el pago de inscripciones a eventos."
        },
        {
            question: "¿Cómo contacto al organizador de un evento?",
            answer: "Puedes contactar al organizador a través del formulario de contacto seleccionando el evento específico en el campo correspondiente. Tu mensaje será enviado directamente al organizador."
        }
    ];

    return (
        <Container className="py-4">
            <Row className="mb-5">
                <Col>
                    <h1>Contacto</h1>
                    <p className="lead">¿Tienes preguntas? Nos encantaría escucharte.</p>
                </Col>
            </Row>

            {showAlert && (
                <Alert variant="success" className="mb-4">
                    ✅ ¡Mensaje enviado correctamente! Te contactaremos pronto.
                </Alert>
            )}

            <Row>
                <Col lg={8}>
                    <Card className="mb-4">
                        <Card.Body className="p-4">
                            <div className="text-center mb-4">
                                <h4>📧 Envíanos un Mensaje</h4>
                                <p className="text-muted">
                                    Completa el formulario y nos pondremos en contacto contigo
                                </p>
                            </div>

                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Nombre completo *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="nombre"
                                                value={formData.nombre}
                                                onChange={handleChange}
                                                required
                                                placeholder="Tu nombre completo"
                                                disabled={loading}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email *</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="tu@email.com"
                                                disabled={loading}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Teléfono</Form.Label>
                                            <Form.Control
                                                type="tel"
                                                name="telefono"
                                                value={formData.telefono}
                                                onChange={handleChange}
                                                placeholder="+34 600 000 000"
                                                disabled={loading}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Evento relacionado</Form.Label>
                                            <Form.Select
                                                name="evento_id"
                                                value={formData.evento_id}
                                                onChange={handleChange}
                                                disabled={loading}
                                            >
                                                <option value="">Seleccionar evento (opcional)</option>
                                                {events.map(event => (
                                                    <option key={event.evento_id} value={event.evento_id}>
                                                        {event.nombre} - {new Date(event.fecha).toLocaleDateString()}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Motivo *</Form.Label>
                                            <Form.Select
                                                name="motivo"
                                                value={formData.motivo}
                                                onChange={handleChange}
                                                required
                                                disabled={loading}
                                            >
                                                <option value="">Selecciona un motivo</option>
                                                <option value="soporte">Soporte Técnico</option>
                                                <option value="eventos">Información sobre Eventos</option>
                                                <option value="pagos">Problemas con Pagos</option>
                                                <option value="cuenta">Problemas con Mi Cuenta</option>
                                                <option value="colaboracion">Colaboración</option>
                                                <option value="sugerencias">Sugerencias</option>
                                                <option value="otros">Otros</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Asunto *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="asunto"
                                                value={formData.asunto}
                                                onChange={handleChange}
                                                required
                                                placeholder="Breve descripción del asunto"
                                                disabled={loading}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-4">
                                    <Form.Label>Mensaje *</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={5}
                                        name="mensaje"
                                        value={formData.mensaje}
                                        onChange={handleChange}
                                        required
                                        placeholder="Describe tu consulta o sugerencia en detalle..."
                                        disabled={loading}
                                        maxLength={1000}
                                    />
                                    <Form.Text className="text-muted">
                                        {formData.mensaje.length}/1000 caracteres
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Archivo adjunto (opcional)</Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="archivo_adjunto"
                                        onChange={handleFileChange}
                                        disabled={loading}
                                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                    />
                                    <Form.Text className="text-muted">
                                        Formatos aceptados: PDF, JPG, PNG, DOC. Tamaño máximo: 5MB
                                    </Form.Text>
                                </Form.Group>

                                <div className="d-grid">
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        size="lg"
                                        disabled={loading || submitted}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" />
                                                Enviando...
                                            </>
                                        ) : submitted ? (
                                            '✅ Mensaje Enviado'
                                        ) : (
                                            '📤 Enviar Mensaje'
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    {/* Información de Contacto */}
                    <Card className="bg-light mb-4">
                        <Card.Body>
                            <h5>📞 Información de Contacto</h5>
                            
                            <div className="mb-4">
                                <h6>📧 Email</h6>
                                <p className="text-muted mb-0">info@ciclismoapp.com</p>
                                <p className="text-muted mb-0">soporte@ciclismoapp.com</p>
                            </div>

                            <div className="mb-4">
                                <h6>📞 Teléfono</h6>
                                <p className="text-muted mb-0">+34 912 345 678</p>
                                <small className="text-muted">Lunes a Viernes: 9:00 - 18:00</small>
                            </div>

                            <div className="mb-4">
                                <h6>📍 Dirección</h6>
                                <p className="text-muted mb-0">
                                    Calle del Ciclismo, 123<br />
                                    28001 Madrid, España
                                </p>
                            </div>

                            <div className="mb-3">
                                <h6>🕒 Horario de Atención</h6>
                                <p className="text-muted mb-0">
                                    <strong>Lunes - Viernes:</strong> 9:00 - 18:00<br />
                                    <strong>Sábados:</strong> 10:00 - 14:00<br />
                                    <strong>Domingos:</strong> Cerrado
                                </p>
                            </div>

                            <div className="mt-4">
                                <h6>⚡ Respuesta Rápida</h6>
                                <Badge bg="success" className="me-2">24-48 horas</Badge>
                                <small className="text-muted">Tiempo promedio de respuesta</small>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Preguntas Frecuentes */}
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">❓ Preguntas Frecuentes</h5>
                        </Card.Header>
                        <Card.Body>
                            <Accordion flush>
                                {faqItems.map((faq, index) => (
                                    <Accordion.Item key={index} eventKey={index.toString()}>
                                        <Accordion.Header>
                                            {faq.question}
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            {faq.answer}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        </Card.Body>
                    </Card>

                    {/* Estadísticas de Soporte */}
                    <Card className="mt-4">
                        <Card.Body className="text-center">
                            <h6>📊 Nuestro Soporte</h6>
                            <div className="row text-center mt-3">
                                <div className="col-4">
                                    <div className="text-primary fs-4">🎯</div>
                                    <div className="h5 mb-0">95%</div>
                                    <small className="text-muted">Satisfacción</small>
                                </div>
                                <div className="col-4">
                                    <div className="text-success fs-4">⚡</div>
                                    <div className="h5 mb-0">2h</div>
                                    <small className="text-muted">Respuesta avg.</small>
                                </div>
                                <div className="col-4">
                                    <div className="text-info fs-4">✅</div>
                                    <div className="h5 mb-0">98%</div>
                                    <small className="text-muted">Resuelto</small>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ContactPage;