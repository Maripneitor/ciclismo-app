import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { eventsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await eventsAPI.getAll();
      setEvents(response.data);
    } catch (error) {
      setError('Error cargando eventos');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeIcon = (type) => {
    const icons = {
      'ruta': '🛣️',
      'montaña': '⛰️',
      'urbano': '🏙️',
      'competitivo': '🏆',
      'recreativo': '😊'
    };
    return icons[type] || '🚴';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando eventos...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1>Eventos de Ciclismo</h1>
          <p className="lead">Encuentra tu próxima aventura sobre dos ruedas</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="g-4">
        {events.length === 0 ? (
          <Col>
            <Alert variant="info">
              No hay eventos disponibles en este momento.
            </Alert>
          </Col>
        ) : (
          events.map(event => (
            <Col key={event.id} md={6} lg={4}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="fs-2">{getEventTypeIcon(event.tipo)}</span>
                    <span className={`badge ${
                      event.estado === 'activo' ? 'bg-success' :
                      event.estado === 'proximamente' ? 'bg-warning' :
                      event.estado === 'completado' ? 'bg-secondary' : 'bg-danger'
                    }`}>
                      {event.estado}
                    </span>
                  </div>
                  
                  <Card.Title className="h5">{event.nombre}</Card.Title>
                  <Card.Text className="text-muted small mb-2">
                    {formatDate(event.fecha)}
                  </Card.Text>
                  <Card.Text className="flex-grow-1">
                    {event.descripcion || 'Sin descripción disponible.'}
                  </Card.Text>
                  
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between text-sm mb-2">
                      <span>📍 {event.ubicacion}</span>
                      <span>📏 {event.distancia} km</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <strong>€{event.precio}</strong>
                      {isAuthenticated ? (
                        <Button variant="primary" size="sm">
                          Inscribirse
                        </Button>
                      ) : (
                        <Button variant="outline-primary" size="sm" disabled>
                          Inicia sesión para inscribirte
                        </Button>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default EventsPage;