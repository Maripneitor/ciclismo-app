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
      const eventsData = Array.isArray(response) ? response : (response.data || []);
      setEvents(eventsData);
    } catch (error) {
      setError('Error cargando eventos. Mostrando datos de demostración.');
      setEvents([
        {
          evento_id: 1,
          nombre: 'Gran Fondo Sierra Nevada',
          descripcion: 'Evento de montaña en la sierra nevada con paisajes espectaculares',
          fecha: '2024-02-15T08:00:00',
          ubicacion: 'Granada, España',
          distancia_km: 120,
          tipo: 'montaña',
          estado: 'Próximo',
          cuota_inscripcion: 50.00
        },
        {
          evento_id: 2,
          nombre: 'Carrera Nocturna Madrid',
          descripcion: 'Carrera urbana nocturna por el centro histórico de Madrid',
          fecha: '2024-02-20T20:00:00',
          ubicacion: 'Madrid, España',
          distancia_km: 45,
          tipo: 'urbano',
          estado: 'Próximo',
          cuota_inscripcion: 25.00
        },
        {
          evento_id: 3,
          nombre: 'Maratón Costa Barcelona',
          descripcion: 'Recorrido costero con vistas al Mediterráneo',
          fecha: '2024-03-10T09:00:00',
          ubicacion: 'Barcelona, España',
          distancia_km: 80,
          tipo: 'ruta',
          estado: 'Próximo',
          cuota_inscripcion: 35.00
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeIcon = (type) => {
    const icons = {
      'ruta': '',
      'montaña': '',
      'urbano': '',
      'competitivo': '',
      'recreativo': ''
    };
    return icons[type] || '';
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Fecha por definir';
    }
  };

  const handleRegister = (event) => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para inscribirte en eventos');
      return;
    }
    alert(`Inscribiéndote en: ${event.nombre}`);
  };

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando eventos...</span>
        </Spinner>
        <p className="mt-2">Cargando eventos...</p>
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

      {error && (
        <Alert variant="warning">
          {error}
        </Alert>
      )}

      <Row className="g-4">
        {!events || events.length === 0 ? (
          <Col>
            <Alert variant="info">
              No hay eventos disponibles en este momento.
            </Alert>
          </Col>
        ) : (
          events.map(event => (
            <Col key={event.evento_id || event.id} md={6} lg={4}>
              <Card className="h-100 shadow-sm event-card">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="fs-2">{getEventTypeIcon(event.tipo)}</span>
                    <span className={`badge ${
                      event.estado === 'activo' ? 'bg-success' : 
                      event.estado === 'Próximo' ? 'bg-warning' : 
                      event.estado === 'Finalizado' ? 'bg-secondary' : 
                      'bg-danger'
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
                      <span>{event.ubicacion || 'Ubicación no especificada'}</span>
                      <span>{event.distancia_km || event.distancia || '0'} km</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <strong>€{event.cuota_inscripcion || event.precio || 0}</strong>
                      {isAuthenticated ? (
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => handleRegister(event)}
                        >
                          Inscribirse
                        </Button>
                      ) : (
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          disabled
                        >
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