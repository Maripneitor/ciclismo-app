// frontend/src/components/forms/RegistrationForm.jsx - CORREGIDO
import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Alert, Card, Spinner } from 'react-bootstrap';
import { eventsAPI, registrationsAPI, teamsAPI } from '../../services/api';

const RegistrationForm = ({ event, onSuccess, onCancel }) => {
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

    const [categories, setCategories] = useState([]);
    const [tallas, setTallas] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingTallas, setLoadingTallas] = useState(false);
    const [loadingTeams, setLoadingTeams] = useState(false);
    const [error, setError] = useState('');
    const [errorLoading, setErrorLoading] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        loadFormData();
    }, [event]);

    const loadFormData = async () => {
        try {
            console.log('📝 Cargando datos del formulario para evento:', event?.evento_id);
            
            // Cargar categorías
            setLoadingCategories(true);
            try {
                const cats = await registrationsAPI.getCategorias(event.evento_id);
                setCategories(Array.isArray(cats) ? cats : []);
                console.log('✅ Categorías cargadas:', cats.length);
            } catch (catError) {
                console.error('❌ Error cargando categorías:', catError);
                setErrorLoading('Error cargando categorías del evento');
            } finally {
                setLoadingCategories(false);
            }

            // Cargar tallas
            setLoadingTallas(true);
            try {
                const tallasData = await registrationsAPI.getTallas();
                setTallas(Array.isArray(tallasData) ? tallasData : []);
                console.log('✅ Tallas cargadas:', tallasData.length);
            } catch (tallasError) {
                console.error('❌ Error cargando tallas:', tallasError);
                setErrorLoading('Error cargando tallas disponibles');
            } finally {
                setLoadingTallas(false);
            }

            // Cargar equipos
            setLoadingTeams(true);
            try {
                const userTeams = await teamsAPI.getMyTeams();
                setTeams(Array.isArray(userTeams) ? userTeams : []);
                console.log('✅ Equipos cargados:', userTeams.length);
            } catch (teamsError) {
                console.error('❌ Error cargando equipos:', teamsError);
                // No mostrar error para equipos ya que es opcional
            } finally {
                setLoadingTeams(false);
            }

        } catch (error) {
            console.error('❌ Error cargando datos del formulario:', error);
            setErrorLoading('Error cargando datos del formulario');
        }
    };

    const calcularEdad = (fecha) => {
        const hoy = new Date();
        const nacimiento = new Date(fecha);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        
        return edad;
    };

    const validateForm = () => {
        const errors = {};
        
        if (!formData.categoria_id) errors.categoria_id = 'Selecciona una categoría';
        if (!formData.talla_playera_id) errors.talla_playera_id = 'Selecciona una talla';
        if (!formData.numero_telefono) errors.numero_telefono = 'Teléfono requerido';
        if (!formData.fecha_nacimiento) errors.fecha_nacimiento = 'Fecha requerida';
        if (!formData.nombre_contacto_emergencia) errors.nombre_contacto_emergencia = 'Contacto de emergencia requerido';
        if (!formData.telefono_contacto_emergencia) errors.telefono_contacto_emergencia = 'Teléfono de emergencia requerido';
        
        if (formData.fecha_nacimiento) {
            const edad = calcularEdad(formData.fecha_nacimiento);
            if (edad < 16) errors.fecha_nacimiento = 'Debes ser mayor de 16 años';
        }
        
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            setLoading(false);
            return;
        }

        setFieldErrors({});

        try {
            const registrationData = {
                ...formData,
                evento_id: event.evento_id
            };

            console.log('📤 Enviando inscripción:', registrationData);
            
            const result = await registrationsAPI.registerForEvent(registrationData);
            onSuccess(result.message || '¡Inscripción exitosa!');
            
        } catch (error) {
            console.error('❌ Error en inscripción:', error);
            setError(error.message || 'Error en la inscripción');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        
        if (fieldErrors[e.target.name]) {
            setFieldErrors({
                ...fieldErrors,
                [e.target.name]: ''
            });
        }
    };

    return (
        <Card>
            <Card.Header>
                <h5 className="mb-0">Inscripción: {event.nombre}</h5>
            </Card.Header>
            <Card.Body>
                {error && (
                    <Alert variant="danger" dismissible onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                {errorLoading && (
                    <Alert variant="warning" dismissible onClose={() => setErrorLoading('')}>
                        {errorLoading}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Categoría *</Form.Label>
                                {loadingCategories ? (
                                    <div className="text-center py-2">
                                        <Spinner size="sm" /> Cargando categorías...
                                    </div>
                                ) : (
                                    <Form.Select
                                        name="categoria_id"
                                        value={formData.categoria_id}
                                        onChange={handleChange}
                                        required
                                        isInvalid={!!fieldErrors.categoria_id}
                                    >
                                        <option value="">Seleccionar categoría</option>
                                        {categories.map(cat => (
                                            <option key={cat.categoria_id} value={cat.categoria_id}>
                                                {cat.nombre} - €{cat.cuota_categoria || event.cuota_inscripcion}
                                            </option>
                                        ))}
                                    </Form.Select>
                                )}
                                <Form.Control.Feedback type="invalid">
                                    {fieldErrors.categoria_id}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Talla de Playera *</Form.Label>
                                {loadingTallas ? (
                                    <div className="text-center py-2">
                                        <Spinner size="sm" /> Cargando tallas...
                                    </div>
                                ) : (
                                    <Form.Select
                                        name="talla_playera_id"
                                        value={formData.talla_playera_id}
                                        onChange={handleChange}
                                        required
                                        isInvalid={!!fieldErrors.talla_playera_id}
                                    >
                                        <option value="">Seleccionar talla</option>
                                        {tallas.map(talla => (
                                            <option key={talla.talla_playera_id} value={talla.talla_playera_id}>
                                                {talla.nombre} {talla.descripcion ? `(${talla.descripcion})` : ''}
                                            </option>
                                        ))}
                                    </Form.Select>
                                )}
                                <Form.Control.Feedback type="invalid">
                                    {fieldErrors.talla_playera_id}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Equipo (Opcional)</Form.Label>
                        {loadingTeams ? (
                            <div className="text-center py-2">
                                <Spinner size="sm" /> Cargando equipos...
                            </div>
                        ) : (
                            <Form.Select
                                name="equipo_id"
                                value={formData.equipo_id}
                                onChange={handleChange}
                            >
                                <option value="">Individual (Sin equipo)</option>
                                {teams.map(team => (
                                    <option key={team.equipo_id} value={team.equipo_id}>
                                        {team.nombre}
                                    </option>
                                ))}
                            </Form.Select>
                        )}
                    </Form.Group>

                    {/* Resto del formulario se mantiene igual */}
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Teléfono *</Form.Label>
                                <Form.Control
                                    type="tel"
                                    name="numero_telefono"
                                    value={formData.numero_telefono}
                                    onChange={handleChange}
                                    required
                                    isInvalid={!!fieldErrors.numero_telefono}
                                    placeholder="+34 600 000 000"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {fieldErrors.numero_telefono}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Fecha de Nacimiento *</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="fecha_nacimiento"
                                    value={formData.fecha_nacimiento}
                                    onChange={handleChange}
                                    required
                                    isInvalid={!!fieldErrors.fecha_nacimiento}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {fieldErrors.fecha_nacimiento}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Género</Form.Label>
                        <Form.Select
                            name="genero"
                            value={formData.genero}
                            onChange={handleChange}
                        >
                            <option value="">Seleccionar</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Otro">Otro</option>
                            <option value="Prefiero no decir">Prefiero no decir</option>
                        </Form.Select>
                    </Form.Group>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Contacto de Emergencia *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombre_contacto_emergencia"
                                    value={formData.nombre_contacto_emergencia}
                                    onChange={handleChange}
                                    required
                                    isInvalid={!!fieldErrors.nombre_contacto_emergencia}
                                    placeholder="Nombre completo"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {fieldErrors.nombre_contacto_emergencia}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Teléfono de Emergencia *</Form.Label>
                                <Form.Control
                                    type="tel"
                                    name="telefono_contacto_emergencia"
                                    value={formData.telefono_contacto_emergencia}
                                    onChange={handleChange}
                                    required
                                    isInvalid={!!fieldErrors.telefono_contacto_emergencia}
                                    placeholder="+34 600 000 000"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {fieldErrors.telefono_contacto_emergencia}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-4">
                        <Form.Label>URL de Identificación (Opcional)</Form.Label>
                        <Form.Control
                            type="url"
                            name="url_identificacion"
                            value={formData.url_identificacion}
                            onChange={handleChange}
                            placeholder="https://ejemplo.com/identificacion.jpg"
                        />
                        <Form.Text className="text-muted">
                            Enlace a documento de identificación (DNI, pasaporte)
                        </Form.Text>
                    </Form.Group>

                    <div className="d-flex gap-2 justify-content-end">
                        <Button variant="secondary" onClick={onCancel} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" />
                                    Procesando...
                                </>
                            ) : (
                                'Confirmar Inscripción'
                            )}
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default RegistrationForm;