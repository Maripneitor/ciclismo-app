// frontend/src/pages/LoginPage.jsx - CORREGIDO
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState('');

    const { login, isAuthenticated, error: authError, setError } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/cuenta/dashboard';

    // Redirigir si ya está autenticado
    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    useEffect(() => {
        if (authError) {
            setLocalError(authError);
        }
    }, [authError]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (localError || authError) {
            setLocalError('');
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setLocalError('');

        try {
            const credentials = {
                email: formData.email,
                contrasena: formData.password
            };

            const result = await login(credentials);
            
            if (result.success) {
                // La redirección se manejará en el useEffect cuando isAuthenticated cambie
                console.log('Login exitoso, redirigiendo...');
            }
        } catch (error) {
            console.error('Error en el formulario de login:', error);
            setLocalError(error.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    // Si ya está autenticado, mostrar loading
    if (isAuthenticated) {
        return (
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col md={6} className="text-center">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3">Redirigiendo...</p>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={6} lg={4}>
                    <Card className="shadow">
                        <Card.Body className="p-4">
                            <div className="text-center mb-4">
                                <h2>Iniciar Sesión</h2>
                                <p className="text-muted">Accede a tu cuenta</p>
                            </div>

                            {(localError || authError) && (
                                <Alert variant="danger" className="mb-3">
                                    <strong>Error:</strong> {localError || authError}
                                    {localError.includes('conectar al servidor') && (
                                        <div className="mt-2">
                                            <small>
                                                Asegúrate de que el servidor backend esté ejecutándose en el puerto 5000.
                                            </small>
                                        </div>
                                    )}
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
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

                                <Form.Group className="mb-4">
                                    <Form.Label>Contraseña</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="Tu contraseña"
                                        disabled={loading}
                                    />
                                </Form.Group>

                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="w-100 mb-3"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                                className="me-2"
                                            />
                                            Iniciando sesión...
                                        </>
                                    ) : (
                                        'Iniciar Sesión'
                                    )}
                                </Button>
                            </Form>

                            <div className="text-center">
                                <p className="mb-0">
                                    ¿No tienes cuenta?{' '}
                                    <Link to="/registro" className="text-decoration-none">
                                        Regístrate aquí
                                    </Link>
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginPage;