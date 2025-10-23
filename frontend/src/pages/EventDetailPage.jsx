import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Button, Badge, Alert, 
  Modal, Spinner, Tabs, Tab, ListGroup, ProgressBar
} from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsAPI, registrationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RegistrationForm from '../components/forms/RegistrationForm';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    loadEvent();
    checkRegistrationStatus();
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const demoEvent = {
        evento_id: parseInt(id),
        nombre: 'Gran Fondo Sierra Nevada',
        descripcion: 'Un desafío épico a través de los picos más altos de España. Esta ruta de montaña te llevará por paisajes espectaculares, desde verdes valles hasta impresionantes miradores. Perfecta para ciclistas experimentados que buscan superar sus límites.',
        fecha: '2024-06-15T08:00:00',
        ubicacion: 'Granada, Andalucía, España',
        distancia_km: 120,
        tipo: 'montaña',
        estado: 'Próximo',
        cuota_inscripcion: 50.00,
        participantes_inscritos: 45,
        cupo_maximo: 100,
        dificultad: 'Alta',
        elevacion: 2500,
        organizador: { nombre: 'Maripneitor', email: 'info@maripneitor.com' },
        imagen: '../../src/assets/imagenes/Ruta montaña.jpg',
        hora_inicio: '08:00',
        descripcion_ruta: 'Ruta técnica con ascensos desafiantes y descensos emocionantes a través de la Sierra Nevada.',
        url_mapa: 'https://maps.example.com/sierra-nevada'
      };
      
      setEvent(demoEvent);
    } catch (error) {
      setError('Error cargando evento');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkRegistrationStatus = async () => {
    if (!isAuthenticated) return;
    try {
      const registrations = await registrationsAPI.getMyRegistrations();
      const registered = registrations.some(reg => 
        reg.evento_id === parseInt(id) || reg.evento?.evento_id === parseInt(id)
      );
      setIsRegistered(registered);
    } catch (error) {
      console.error('Error checking registration:', error);
    }
  };

  const handleRegisterClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { 
          from: `/evento/${id}`,
          message: 'Inicia sesión para inscribirte en este evento'
        } 
      });
      return;
    }
    setShowRegistrationModal(true);
  };

  const handleRegistrationSuccess = (message) => {
    setRegistrationSuccess(message);
    setShowRegistrationModal(false);
    setIsRegistered(true);
    loadEvent();
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'próximo': return 'warning';
      case 'en curso': return 'success';
      case 'finalizado': return 'secondary';
      default: return 'secondary';
    }
  };

  const getDifficultyVariant = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'baja': return 'success';
      case 'media': return 'warning';
      case 'alta': return 'danger';
      case 'extrema': return 'dark';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3">Cargando evento...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error}
          <div className="mt-3">
            <Button variant="primary" onClick={() => navigate('/eventos')}>
              Volver a Eventos
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          Evento no encontrado
          <div className="mt-3">
            <Button variant="primary" onClick={() => navigate('/eventos')}>
              Volver a Eventos
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {registrationSuccess && (
        <Alert variant="success" dismissible onClose={() => setRegistrationSuccess('')}>
          {registrationSuccess}
        </Alert>
      )}

      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <div className="event-hero-image">
              <img 
                src={event.imagen} 
                alt={event.nombre}
                className="card-img-top"
              />
              <div className="event-hero-badges">
                <Badge bg={getStatusVariant(event.estado)}>
                  {event.estado}
                </Badge>
                <Badge bg={getDifficultyVariant(event.dificultad)}>
                  {event.dificultad}
                </Badge>
              </div>
            </div>

            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h1 className="h2 fw-bold mb-2">{event.nombre}</h1>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    <Badge bg="light" text="dark">
                      {event.ubicacion}
                    </Badge>
                    <Badge bg="light" text="dark">
                      {new Date(event.fecha).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Badge>
                    <Badge bg="light" text="dark">
                      {event.hora_inicio}
                    </Badge>
                  </div>
                </div>
              </div>

              <Card.Text className="lead mb-4">
                {event.descripcion}
              </Card.Text>

              <Tabs defaultActiveKey="details" className="mb-4">
                <Tab eventKey="details" title="Detalles">
                  <Row className="mt-3">
                    <Col md={6}>
                      <ListGroup variant="flush">
                        <ListGroup.Item className="d-flex justify-content-between">
                          <span>Distancia:</span>
                          <strong>{event.distancia_km} km</strong>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between">
                          <span>Elevación:</span>
                          <strong>{event.elevacion} m</strong>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between">
                          <span>Tipo:</span>
                          <Badge bg="primary">{event.tipo}</Badge>
                        </ListGroup.Item>
                      </ListGroup>
                    </Col>
                    <Col md={6}>
                      <ListGroup variant="flush">
                        <ListGroup.Item className="d-flex justify-content-between">
                          <span>Cuota:</span>
                          <strong>€{event.cuota_inscripcion}</strong>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between">
                          <span>Organizador:</span>
                          <strong>{event.organizador?.nombre || 'Maripneitor'}</strong>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between">
                          <span>Cupo:</span>
                          <strong>{event.participantes_inscritos}/{event.cupo_maximo}</strong>
                        </ListGroup.Item>
                      </ListGroup>
                    </Col>
                  </Row>

                  <div className="mt-4">
                    <h5 className="mb-2">Progreso de inscripciones</h5>
                    <ProgressBar 
                      now={(event.participantes_inscritos / event.cupo_maximo) * 100}
                      label={`${Math.round((event.participantes_inscritos / event.cupo_maximo) * 100)}%`}
                      variant={
                        (event.participantes_inscritos / event.cupo_maximo) > 0.8 ? 'danger' :
                        (event.participantes_inscritos / event.cupo_maximo) > 0.5 ? 'warning' : 'success'
                      }
                    />
                  </div>
                </Tab>

                <Tab eventKey="route" title="Ruta">
                  <div className="mt-3">
                    <h5>Descripción de la Ruta</h5>
                    <p>{event.descripcion_ruta || 'Información detallada de la ruta disponible próximamente.'}</p>
                    
                    {event.url_mapa && (
                      <div className="mt-3">
                        <Button 
                          variant="outline-primary" 
                          href={event.url_mapa}
                          target="_blank"
                        >
                          Ver Mapa de la Ruta
                        </Button>
                      </div>
                    )}
                  </div>
                </Tab>

                <Tab eventKey="requirements" title="Requisitos">
                  <div className="mt-3">
                    <h5>Requisitos de Participación</h5>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        Edad mínima: 16 años
                      </ListGroup.Item>
                      <ListGroup.Item>
                        Bicicleta en buen estado
                      </ListGroup.Item>
                      <ListGroup.Item>
                        Casco obligatorio
                      </ListGroup.Item>
                      <ListGroup.Item>
                        Seguro personal recomendado
                      </ListGroup.Item>
                    </ListGroup>
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="sticky-top" style={{ top: '100px' }}>
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h3 className="h4 mb-2">Inscripción</h3>
                <div className="price-display">
                  <span className="h2 fw-bold text-primary">€{event.cuota_inscripcion}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span>Cupos disponibles:</span>
                  <strong>{event.cupo_maximo - event.participantes_inscritos}</strong>
                </div>
                <ProgressBar 
                  now={(event.participantes_inscritos / event.cupo_maximo) * 100}
                  variant={
                    (event.participantes_inscritos / event.cupo_maximo) > 0.8 ? 'danger' :
                    (event.participantes_inscritos / event.cupo_maximo) > 0.5 ? 'warning' : 'success'
                  }
                />
              </div>

              {isRegistered ? (
                <Alert variant="success" className="text-center">
                  Ya estás inscrito en este evento
                </Alert>
              ) : event.estado !== 'Próximo' ? (
                <Alert variant="warning" className="text-center">
                  Las inscripciones no están disponibles para este evento
                </Alert>
              ) : (event.cupo_maximo - event.participantes_inscritos) <= 0 ? (
                <Alert variant="danger" className="text-center">
                  Evento agotado
                </Alert>
              ) : (
                <div className="d-grid gap-2">
                  {isAuthenticated ? (
                    <Button 
                      variant="primary" 
                      size="lg"
                      onClick={() => setShowRegistrationModal(true)}
                    >
                      Inscribirse Ahora
                    </Button>
                  ) : (
                    <Button 
                      variant="primary" 
                      size="lg"
                      onClick={() => navigate('/login', {
                        state: { 
                          from: `/evento/${id}`,
                          message: 'Inicia sesión para inscribirte en este evento'
                        }
                      })}
                    >
                      Iniciar Sesión para Inscribirse
                    </Button>
                  )}
                  
                  <Button variant="outline-secondary">
                    Compartir Evento
                  </Button>
                </div>
              )}

              <div className="mt-4">
                <h6 className="mb-3">Información del Organizador</h6>
                <div className="d-flex align-items-center">
                  <div>
                    <strong>{event.organizador?.nombre || 'Maripneitor'}</strong>
                    <div className="text-muted small">
                      {event.organizador?.email || 'info@maripneitor.com'}
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal 
        show={showRegistrationModal} 
        onHide={() => setShowRegistrationModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Inscripción: {event.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RegistrationForm
            event={event}
            onSuccess={handleRegistrationSuccess}
            onCancel={() => setShowRegistrationModal(false)}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default EventDetailPage;