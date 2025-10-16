    import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <h1>Mi Dashboard</h1>
          <p className="lead">Bienvenido/a, {user?.nombre}!</p>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Tarjeta de Próximo Evento */}
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>🚴 Mi Próximo Evento</Card.Title>
              <Card.Text>
                No tienes eventos próximos registrados.
              </Card.Text>
              <Button as={Link} to="/events" variant="primary">
                Buscar Eventos
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Tarjeta de Último Resultado */}
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>📊 Mi Último Resultado</Card.Title>
              <Card.Text>
                Aún no has participado en eventos.
              </Card.Text>
              <Button as={Link} to="/results" variant="outline-primary">
                Ver Historial
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Estadísticas Rápidas */}
        <Col md={4}>
          <Card>
            <Card.Body className="text-center">
              <h3>0</h3>
              <p className="text-muted mb-0">Eventos Inscrito</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body className="text-center">
              <h3>0 km</h3>
              <p className="text-muted mb-0">Distancia Total</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body className="text-center">
              <h3>-</h3>
              <p className="text-muted mb-0">Mejor Posición</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Acciones Rápidas */}
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Acciones Rápidas</Card.Title>
              <div className="d-flex gap-3 flex-wrap">
                <Button as={Link} to="/events" variant="outline-primary">
                  Explorar Eventos
                </Button>
                <Button as={Link} to="/profile" variant="outline-secondary">
                  Editar Perfil
                </Button>
                {user?.role === 'organizador' || user?.role === 'admin' ? (
                  <Button as={Link} to="/create-event" variant="success">
                    Crear Evento
                  </Button>
                ) : null}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardPage;