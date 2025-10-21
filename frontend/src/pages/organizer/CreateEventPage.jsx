import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { eventsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CreateEventPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        fecha: '',
        ubicacion: '',
        distancia_km: '',
        tipo: 'ruta',
        estado: 'Próximo',
        cuota_inscripcion: '',
        maximo_participantes: '',
        permite_union_a_equipos: true
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const isEdit = Boolean(id);

    useEffect(() => {
        if (isEdit) {
            loadEvent();
        }
    }, [id]);

    const loadEvent = async () => {
        try {
            const event = await eventsAPI.getById(id);
            setFormData({
                nombre: event.nombre || '',
                descripcion: event.descripcion || '',
                fecha: event.fecha ? event.fecha.split('.')[0].slice(0, 16) : '',
                ubicacion: event.ubicacion || '',
                distancia_km: event.distancia_km || '',
                tipo: event.tipo || 'ruta',
                estado: event.estado || 'Próximo',
                cuota_inscripcion: event.cuota_inscripcion || '',
                maximo_participantes: event.maximo_participantes || '',
                permite_union_a_equipos: event.permite_union_a_equipos !== false
            });
        } catch (error) {
            setError('Error cargando evento');
            console.error('Error:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (isEdit) {
                await eventsAPI.update(id, formData);
                setSuccess('Evento actualizado exitosamente');
            } else {
                await eventsAPI.create(formData);
                setSuccess('Evento creado exitosamente');
            }
            
            setTimeout(() => {
                navigate('/organizador/dashboard');
            }, 2000);
        } catch (error) {
            setError(error.message || `Error ${isEdit ? 'actualizando' : 'creando'} evento`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-4">
            <Row className="justify-content-center">
                <Col lg={8}>
                    <Card>
                        <Card.Header>
                            <h4 className="mb-0">
                                {isEdit ? '✏️ Editar Evento' : '➕ Crear Nuevo Evento'}
                            </h4>
                        </Card.Header>
                        <Card.Body>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Nombre del Evento *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="nombre"
                                                value={formData.nombre}
                                                onChange={handleChange}
                                                required
                                                placeholder="Ej: Gran Fondo Sierra Nevada"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Fecha y Hora *</Form.Label>
                                            <Form.Control
                                                type="datetime-local"
                                                name="fecha"
                                                value={formData.fecha}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Descripción</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="descripcion"
                                        value={formData.descripcion}
                                        onChange={handleChange}
                                        placeholder="Describe el evento, rutas, dificultad, etc."
                                    />
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Ubicación *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="ubicacion"
                                                value={formData.ubicacion}
                                                onChange={handleChange}
                                                required
                                                placeholder="Ej: Madrid, España"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Distancia (km)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="distancia_km"
                                                value={formData.distancia_km}
                                                onChange={handleChange}
                                                placeholder="Ej: 120"
                                                min="0"
                                                step="0.1"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Tipo de Evento</Form.Label>
                                            <Form.Select
                                                name="tipo"
                                                value={formData.tipo}
                                                onChange={handleChange}
                                            >
                                                <option value="ruta">Ruta</option>
                                                <option value="montaña">Montaña</option>
                                                <option value="urbano">Urbano</option>
                                                <option value="competitivo">Competitivo</option>
                                                <option value="recreativo">Recreativo</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Estado</Form.Label>
                                            <Form.Select
                                                name="estado"
                                                value={formData.estado}
                                                onChange={handleChange}
                                            >
                                                <option value="Próximo">Próximo</option>
                                                <option value="En Curso">En Curso</option>
                                                <option value="Finalizado">Finalizado</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Cuota de Inscripción (€)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="cuota_inscripcion"
                                                value={formData.cuota_inscripcion}
                                                onChange={handleChange}
                                                placeholder="0.00"
                                                min="0"
                                                step="0.01"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Máximo de Participantes</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="maximo_participantes"
                                                value={formData.maximo_participantes}
                                                onChange={handleChange}
                                                placeholder="Ilimitado"
                                                min="0"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-4">
                                    <Form.Check
                                        type="checkbox"
                                        name="permite_union_a_equipos"
                                        checked={formData.permite_union_a_equipos}
                                        onChange={handleChange}
                                        label="Permitir unión a equipos"
                                    />
                                </Form.Group>

                                <div className="d-flex gap-2 justify-content-end">
                                    <Button 
                                        variant="secondary" 
                                        onClick={() => navigate('/organizador/dashboard')}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button 
                                        variant="primary" 
                                        type="submit" 
                                        disabled={loading}
                                    >
                                        {loading ? 'Guardando...' : (isEdit ? 'Actualizar Evento' : 'Crear Evento')}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CreateEventPage;