// frontend/src/pages/EventDetailPage.jsx - CONECTADO A API
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
    if (isAuthenticated) {
      checkRegistrationStatus();
    }
  }, [id, isAuthenticated]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Intentar cargar desde API
      try {
        const eventData = await eventsAPI.getById(id);
        setEvent(eventData);
      } catch (apiError) {
        console.warn('Error API evento, usando datos de respaldo:', apiError);
        // Solo usar datos demo si la API falla completamente
        const allEvents = await eventsAPI.getAll();
        const foundEvent = allEvents.find(e => 
          (e.evento_id || e.id) === parseInt(id)
        );
        
        if (foundEvent) {
          setEvent(foundEvent);
        } else {
          throw new Error('Evento no encontrado');
        }
      }
      
    } catch (error) {
      console.error('Error cargando evento:', error);
      setError('Error cargando evento: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkRegistrationStatus = async () => {
    if (!isAuthenticated) return;
    
    try {
      const registrations = await registrationsAPI.getMyRegistrations();
      const registered = registrations.some(reg => 
        reg.evento_id === parseInt(id) || 
        reg.evento?.evento_id === parseInt(id) ||
        reg.evento_id === id
      );
      setIsRegistered(registered);
    } catch (error) {
      console.error('Error verificando inscripción:', error);
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
    loadEvent(); // Recargar datos del evento para actualizar contadores
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

  if (error || !event) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <h4>Error</h4>
          <p>{error || 'Evento no encontrado'}</p>
          <Button onClick={() => navigate('/eventos')}>
            Volver a Eventos
          </Button>
        </Alert>
      </Container>
    );
  }

  const registrationProgress = Math.min(
    ((event.participantes_inscritos || 0) / (event.cupo_maximo || 1)) * 100, 
    100
  );

  return (
    <Container className="py-5">
      {registrationSuccess && (
        <Alert variant="success" dismissible onClose={() => setRegistrationSuccess('')}>
          {registrationSuccess}
        </Alert>
      )}

      <Row className="mb-4">
        <Col>
          <Button variant="outline-primary" onClick={() => navigate('/eventos')}>
            ← Volver a Eventos
          </Button>
        </Col>
      </Row>

      <Row className="g-5">
        <Col lg={8}>
          <Card className="border-0 shadow-sm mb-4">
            <div className="position-relative">
              {event.imagen ? (
                <Card.Img 
                  variant="top" 
                  src={event.imagen} 
                  alt={event.nombre}
                  style={{ height: '400px', objectFit: 'cover' }}
                />
              ) : (
                <div 
                  className="bg-light d-flex align-items-center justify-content-center"
                  style={{ height: '400px' }}
                >
                  <span className="text-muted display-1">🚴</span>
                </div>
              )}
              
              <div className="position-absolute top-0 end-0 m-3">
                <Badge bg={getStatusVariant(event.estado)} className="fs-6 px-3 py-2">
                  {event.estado}
                </Badge>
              </div>
            </div>

            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h1 className="display-6 fw-bold mb-2">{event.nombre}</h1>
                  <p className="text-muted mb-0">
                    <i className="bi bi-geo-alt"></i> {event.ubicacion}
                  </p>
                </div>
                <Badge bg={getDifficultyVariant(event.dificultad)} className="fs-6 px-3 py-2">
                  {event.dificultad}
                </Badge>
              </div>

              <div className="event-meta mb-4">
                <Row className="g-3">
                  <Col sm={6} md={3}>
                    <div className="text-center">
                      <div className="h4 text-primary mb-1">
                        {event.distancia_km || event.distancia}
                      </div>
                      <small className="text-muted">Distancia (km)</small>
                    </div>
                  </Col>
                  <Col sm={6} md={3}>
                    <div className="text-center">
                      <div className="h4 text-success mb-1">
                        {event.elevacion || 'N/A'}
                      </div>
                      <small className="text-muted">Elevación (m)</small>
                    </div>
                  </Col>
                  <Col sm={6} md={3}>
                    <div className="text-center">
                      <div className="h4 text-warning mb-1">
                        €{event.cuota_inscripcion || 0}
                      </div>
                      <small className="text-muted">Inscripción</small>
                    </div>
                  </Col>
                  <Col sm={6} md={3}>
                    <div className="text-center">
                      <div className="h4 text-info mb-1">
                        {event.tipo}
                      </div>
                      <small className="text-muted">Tipo</small>
                    </div>
                  </Col>
                </Row>
              </div>

              <p className="lead">{event.descripcion}</p>

              <Tabs defaultActiveKey="details" className="mb-3">
                <Tab eventKey="details" title="Detalles">
                  <Row className="g-3 mt-2">
                    <Col sm={6}>
                      <strong>Fecha del evento:</strong>
                      <br />
                      {new Date(event.fecha).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Col>
                    <Col sm={6}>
                      <strong>Hora de inicio:</strong>
                      <br />
                      {event.hora_inicio || 'Por definir'}
                    </Col>
                    <Col sm={6}>
                      <strong>Organizador:</strong>
                      <br />
                      {event.organizador || 'Maripneitor Cycling'}
                    </Col>
                    <Col sm={6}>
                      <strong>Categorías:</strong>
                      <br />
                      {event.categorias || 'Todas las categorías'}
                    </Col>
                  </Row>
                </Tab>

                <Tab eventKey="requirements" title="Requisitos">
                  <ListGroup variant="flush" className="mt-2">
                    <ListGroup.Item>
                      <strong>Equipo obligatorio:</strong> Casco, luces delanteras y traseras
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Edad mínima:</strong> 18 años (o 16 con autorización)
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Seguro:</strong> Se requiere seguro de responsabilidad civil
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Bicicleta:</strong> En buen estado mecánico
                    </ListGroup.Item>
                  </ListGroup>
                </Tab>

                <Tab eventKey="route" title="Recorrido">
                  <div className="mt-3">
                    <h6>Descripción del recorrido:</h6>
                    <p>
                      {event.descripcion_recorrido || 
                        'Recorrido diseñado para disfrutar del paisaje y desafiar tus habilidades ciclistas. ' +
                        'Incluye tramos variados con ascensos técnicos y descensos emocionantes.'}
                    </p>
                    
                    <h6>Puntos de interés:</h6>
                    <ul>
                      <li>Salida: {event.punto_encuentro || 'Plaza Principal'}</li>
                      <li>Meta: {event.punto_llegada || 'Mismo punto de salida'}</li>
                      <li>Avituallamientos: 2 puntos durante el recorrido</li>
                      <li>Asistencia médica: Disponible en ruta</li>
                    </ul>
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm sticky-top" style={{ top: '100px' }}>
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4">Información de Inscripción</h5>
              
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted">Cupos disponibles</span>
                  <span className="fw-semibold">
                    {event.participantes_inscritos || 0} / {event.cupo_maximo || 0}
                  </span>
                </div>
                <ProgressBar 
                  now={registrationProgress} 
                  variant={
                    registrationProgress >= 90 ? 'danger' :
                    registrationProgress >= 70 ? 'warning' : 'success'
                  }
                  className="mb-3"
                />
                
                {registrationProgress >= 90 && (
                  <Alert variant="warning" className="py-2 small mb-0">
                    ¡Últimos cupos disponibles!
                  </Alert>
                )}
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted">Cuota de inscripción</span>
                  <span className="h5 text-primary mb-0">
                    €{event.cuota_inscripcion || 0}
                  </span>
                </div>
                <small className="text-muted">
                  Incluye: Seguro, avituallamiento, playera conmemorativa
                </small>
              </div>

              {isRegistered ? (
                <Alert variant="success" className="text-center">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Ya estás inscrito en este evento
                </Alert>
              ) : (
                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={handleRegisterClick}
                    disabled={event.estado?.toLowerCase() === 'finalizado'}
                  >
                    {event.estado?.toLowerCase() === 'finalizado' 
                      ? 'Evento Finalizado' 
                      : 'Inscribirse Ahora'
                    }
                  </Button>
                  
                  {event.estado?.toLowerCase() === 'finalizado' && (
                    <small className="text-muted text-center">
                      Este evento ya ha finalizado
                    </small>
                  )}
                </div>
              )}

              <hr className="my-4" />

              <div className="text-center">
                <small className="text-muted">
                  ¿Tienes dudas? <a href="/contacto">Contáctanos</a>
                </small>
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