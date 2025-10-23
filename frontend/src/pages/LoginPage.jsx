// frontend/src/pages/LoginPage.jsx - CON MEJORAS DE UI
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/cuenta/dashboard';
  const message = location.state?.message;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (error) {
      setError(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implementar autenticación con Google
    setError('Inicio con Google próximamente disponible');
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} xl={5}>
          <div className="text-center mb-5">
            <h1 className="display-6 fw-bold text-primary">
              Maripneitor<span className="text-dark">Cycling</span>
            </h1>
            <p className="text-muted">Inicia sesión en tu cuenta</p>
          </div>

          {message && (
            <Alert variant="info" className="text-center">
              {message}
            </Alert>
          )}

          <Card className="border-0 shadow-lg login-card">
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Bienvenido de nuevo</h2>
                <p className="text-muted">Ingresa a tu cuenta para continuar</p>
              </div>

              {error && (
                <Alert variant="danger" className="text-center">
                  {error}
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
                    placeholder="tu@email.com"
                    required
                    className="py-2"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Contraseña</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Tu contraseña"
                      required
                      className="py-2 border-end-0"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      className="border-start-0"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </Button>
                  </InputGroup>
                  <div className="text-end mt-2">
                    <Link to="/olvide-contrasena" className="text-decoration-none small">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                </Form.Group>

                <div className="d-grid mb-3">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={loading}
                    className="py-2 fw-semibold"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Iniciando sesión...
                      </>
                    ) : (
                      'Iniciar Sesión'
                    )}
                  </Button>
                </div>

                <div className="text-center mb-3">
                  <span className="text-muted">o</span>
                </div>

                <div className="d-grid mb-4">
                  <Button
                    variant="outline-danger"
                    size="lg"
                    onClick={handleGoogleLogin}
                    className="py-2 fw-semibold"
                  >
                    <span className="me-2">🔴</span>
                    Iniciar con Google
                  </Button>
                </div>

                <div className="text-center">
                  <span className="text-muted">¿No tienes cuenta? </span>
                  <Link to="/registro" className="text-decoration-none fw-semibold">
                    Regístrate aquí
                  </Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;