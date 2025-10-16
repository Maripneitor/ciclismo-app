import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Container>
      {/* Hero Section */}
      <Row className="hero-section py-5 mb-4">
        <Col lg={6}>
          <h1 className="display-4 fw-bold mb-4">
            Gestiona tus Eventos de Ciclismo 🚴‍♂️
          </h1>
          <p className="lead mb-4">
            La plataforma todo en uno para organizar, participar y seguir 
            eventos de ciclismo. Conecta con la comunidad ciclista.
          </p>
          <div className="d-flex gap-3">
            {!isAuthenticated ? (
              <>
                <Button as={Link} to="/register" variant="primary" size="lg">
                  Comenzar
                </Button>
                <Button as={Link} to="/events" variant="outline-primary" size="lg">
                  Ver Eventos
                </Button>
              </>
            ) : (
              <Button as={Link} to="/dashboard" variant="primary" size="lg">
                Mi Dashboard
              </Button>
            )}
          </div>
        </Col>
        <Col lg={6}>
          <div className="text-center">
            <div 
              style={{ 
                backgroundColor: '#f8f9fa', 
                height: '300px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: '10px',
                fontSize: '5rem'
              }}
            >
              🚴‍♂️
            </div>
          </div>
        </Col>
      </Row>

      {/* Features Section */}
      <Row className="mb-5">
        <Col md={4} className="mb-4">
          <Card className="h-100 text-center">
            <Card.Body>
              <div className="feature-icon mb-3">📅</div>
              <Card.Title>Gestión de Eventos</Card.Title>
              <Card.Text>
                Crea y gestiona eventos de ciclismo fácilmente. 
                Controla inscripciones, rutas y resultados.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 text-center">
            <Card.Body>
              <div className="feature-icon mb-3">👥</div>
              <Card.Title>Comunidad Activa</Card.Title>
              <Card.Text>
                Conecta con otros ciclistas. Participa en eventos 
                y comparte tus logros.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 text-center">
            <Card.Body>
              <div className="feature-icon mb-3">📊</div>
              <Card.Title>Seguimiento de Resultados</Card.Title>
              <Card.Text>
                Analiza tu desempeño con estadísticas detalladas 
                y gráficos interactivos.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

// ✅ Asegúrate de que tenga export default
export default HomePage;