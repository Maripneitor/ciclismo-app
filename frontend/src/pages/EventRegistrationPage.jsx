// frontend/src/pages/EventRegistrationPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { eventsAPI, registrationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const EventRegistrationPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [event, setEvent] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [tallas, setTallas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    
    const [formData, setFormData] = useState({
        categoria_id: '',
        talla_playera_id: '',
        equipo_id: '',
        numero_telefono: '',
        fecha_nacimiento: '',
        genero: '',
        nombre_contacto_emergencia: '',
        telefono_contacto_emergencia: '',
        url_identificacion: ''
    });

    useEffect(() => {
        loadRegistrationData();
    }, [id]);

    const loadRegistrationData = async () => {
        try {
            setLoading(true);
            const [eventData, categoriasData, tallasData] = await Promise.all([
                eventsAPI.getById(id),
                registrationsAPI.getCategorias(id),
                registrationsAPI.getTallas()
            ]);
            
            setEvent(eventData);
            setCategorias(categoriasData);
            setTallas(tallasData);
            
            // Pre-fill user data
            setFormData(prev => ({
                ...prev,
                numero_telefono: user.telefono || '',
                genero: user.genero || '',
                fecha_nacimiento: user.fecha_nacimiento || ''
            }));
            
        } catch (error) {
            setError('Error cargando datos del evento');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            await registrationsAPI.registerForEvent({
                eventId: id,
                ...formData
            });
            
            navigate('/mis-inscripciones', {
                state: { 
                    message: `¡Inscripción exitosa! Te has registrado en ${event.nombre}` 
                }
            });
            
        } catch (error) {
            setError(error.message || 'Error al realizar la inscripción');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div>Cargando...</div>;
    if (!event) return <div>Evento no encontrado</div>;

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card>
                        <Card.Header>
                            <h3>Inscripción: {event.nombre}</h3>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                {/* Aquí irían todos los campos del formulario */}
                                <Button 
                                    type="submit" 
                                    disabled={submitting}
                                    variant="primary"
                                >
                                    {submitting ? <Spinner size="sm" /> : 'Confirmar Inscripción'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default EventRegistrationPage;