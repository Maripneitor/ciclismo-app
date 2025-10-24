// frontend/src/pages/LoginPage.jsx - CON MEJORAS DE UI Y GOOGLE LOGIN
import React, { useState } from 'react';
import { 
  Container, Row, Col, Card, Form, Button, Alert, 
  InputGroup, Spinner 
} from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login({
        email: formData.email,
        contrasena: formData.password
      });
      navigate(from, { replace: true });
    } catch (error) {
      setError(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      setError('');
      
      // TODO: Implementar autenticación con Google
      // Por ahora, mostramos un mensaje informativo
      setError('Inicio con Google próximamente disponible. Estamos trabajando en esta funcionalidad.');
      
      // Simulación de carga
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      setError('Error en autenticación con Google: ' + error.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Implementar flujo de recuperación de contraseña
    setError('Funcionalidad de recuperación de contraseña próximamente disponible.');
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} xl={5}>
          <div className="text-center mb-5">
            <div className="login-logo mb-4">
              <span className="logo-icon">🚴‍♂️</span>
              <h1 className="display-6 fw-bold text-primary mb-1">
                Maripneitor<span className="text-dark">Cycling</span>
              </h1>
            </div>
            <p className="text-muted">Inicia sesión en tu cuenta</p>
          </div>

          {message && (
            <Alert variant="info" className="text-center animate-fade-in">
              <i className="bi bi-info-circle me-2"></i>
              {message}
            </Alert>
          )}

          <Card className="border-0 shadow-lg login-card animate-slide-up">
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold mb-2">Bienvenido de nuevo</h2>
                <p className="text-muted">Ingresa a tu cuenta para continuar</p>
              </div>

              {error && (
                <Alert variant="danger" className="text-center animate-shake">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}

              {/* Login con Google */}
              <div className="d-grid mb-4">
                <Button
                  variant="outline-danger"
                  size="lg"
                  onClick={handleGoogleLogin}
                  disabled={googleLoading}
                  className="py-2 fw-semibold google-btn"
                >
                  {googleLoading ? (
                    <Spinner size="sm" className="me-2" />
                  ) : (
                    <span className="me-2">🔴</span>
                  )}
                  {googleLoading ? 'Conectando...' : 'Iniciar con Google'}
                </Button>
              </div>

              <div className="divider mb-4">
                <span className="divider-text">o ingresa con tu email</span>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3 animate-fade-in" style={{animationDelay: '0.1s'}}>
                  <Form.Label className="fw-semibold">Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    required
                    className="py-2 form-control-enhanced"
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-4 animate-fade-in" style={{animationDelay: '0.2s'}}>
                  <Form.Label className="fw-semibold">Contraseña</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Tu contraseña"
                      required
                      className="py-2 border-end-0 form-control-enhanced"
                      disabled={loading}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      className="border-start-0 password-toggle"
                      type="button"
                      disabled={loading}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </Button>
                  </InputGroup>
                  <div className="text-end mt-2">
                    <Button 
                      variant="link" 
                      className="text-decoration-none small p-0"
                      onClick={handleForgotPassword}
                    >
                      ¿Olvidaste tu contraseña?
                    </Button>
                  </div>
                </Form.Group>

                <div className="d-grid mb-3">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={loading}
                    className="py-2 fw-semibold login-btn"
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Iniciando sesión...
                      </>
                    ) : (
                      'Iniciar Sesión'
                    )}
                  </Button>
                </div>

                <div className="text-center">
                  <span className="text-muted">¿No tienes cuenta? </span>
                  <Link 
                    to="/registro" 
                    className="text-decoration-none fw-semibold register-link"
                  >
                    Regístrate aquí
                  </Link>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Información de demo */}
          <Card className="border-0 bg-light mt-4">
            <Card.Body className="text-center py-3">
              <small className="text-muted">
                <strong>Demo:</strong> Usa cualquier email y contraseña para probar
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style jsx>{`
        .login-logo {
          animation: bounce 2s infinite;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        
        .animate-slide-up {
          animation: slideUp 0.5s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .form-control-enhanced {
          transition: all 0.3s ease;
          border: 2px solid #e9ecef;
        }
        
        .form-control-enhanced:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.1);
          transform: translateY(-1px);
        }
        
        .password-toggle {
          transition: all 0.3s ease;
        }
        
        .password-toggle:hover {
          background-color: #f8f9fa;
        }
        
        .login-btn, .google-btn {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .login-btn:hover, .google-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .register-link {
          color: #0d6efd;
          transition: color 0.3s ease;
        }
        
        .register-link:hover {
          color: #0a58ca;
        }
        
        .divider {
          display: flex;
          align-items: center;
          text-align: center;
        }
        
        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid #dee2e6;
        }
        
        .divider-text {
          padding: 0 1rem;
          color: #6c757d;
          font-size: 0.875rem;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        
        @media (max-width: 768px) {
          .login-card {
            margin: 0 10px;
          }
        }
      `}</style>
    </Container>
  );
};

export default LoginPage;