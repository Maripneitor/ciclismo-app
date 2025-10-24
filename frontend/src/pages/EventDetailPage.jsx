// frontend/src/pages/EventDetailPage.jsx - CON MAPA Y SECTORES MEJORADO
import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Button, Badge, Alert, 
  Modal, Spinner, Tabs, Tab, ListGroup, ProgressBar,
  Accordion
} from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsAPI, registrationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RegistrationForm from '../components/forms/RegistrationForm';
import EventMap from '../components/events/EventMap';
import RouteSectors from '../components/events/RouteSectors';

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
  const [activeTab, setActiveTab] = useState('details');
  const [sectorsData, setSectorsData] = useState([]);
  const [selectedSector, setSelectedSector] = useState(null);

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
      
      const eventData = await eventsAPI.getById(id);
      
      // Enriquecer datos con información de ruta y sectores
      const enrichedEvent = {
        ...eventData,
        route_data: eventData.route_data || {
          coordinates: [
            [40.4168, -3.7038], // Madrid
            [40.4178, -3.7138],
            [40.4188, -3.7238],
            [40.4198, -3.7338]
          ],
          sectors: [
            { 
              id: 1, 
              name: 'Inicio - Salida Urbana', 
              distance: 0, 
              elevation: 650,
              difficulty: 'fácil',
              description: 'Salida desde el centro urbano con tráfico controlado',
              estimatedTime: '0:15',
              coordinates: [[40.4168, -3.7038], [40.4170, -3.7050]]
            },
            { 
              id: 2, 
              name: 'Subida Collado Verde', 
              distance: 25, 
              elevation: 950,
              difficulty: 'difícil',
              description: 'Ascenso constante de 8% de pendiente promedio',
              estimatedTime: '1:30',
              coordinates: [[40.4170, -3.7050], [40.4180, -3.7100]]
            },
            { 
              id: 3, 
              name: 'Descenso Técnico', 
              distance: 45, 
              elevation: 720,
              difficulty: 'medio',
              description: 'Descenso técnico con curvas cerradas',
              estimatedTime: '0:45',
              coordinates: [[40.4180, -3.7100], [40.4190, -3.7200]]
            },
            { 
              id: 4, 
              name: 'Llegada - Sprint Final', 
              distance: eventData.distancia_km || 70, 
              elevation: 650,
              difficulty: 'fácil',
              description: 'Recta final hacia la línea de meta',
              estimatedTime: '0:20',
              coordinates: [[40.4190, -3.7200], [40.4198, -3.7338]]
            }
          ],
          elevation_profile: [
            { distance: 0, elevation: 650 },
            { distance: 25, elevation: 950 },
            { distance: 45, elevation: 720 },
            { distance: 70, elevation: 650 }
          ]
        }
      };
      
      setEvent(enrichedEvent);
      setSectorsData(enrichedEvent.route_data?.sectors || []);
      
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
    loadEvent();
  };

  const handleSectorSelect = (sector) => {
    setSelectedSector(sector);
    // Aquí podrías filtrar el mapa para mostrar solo el sector seleccionado
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'próximo': return 'warning';
      case 'en curso': return 'success';
      case 'finalizado': return 'secondary';
      case 'cancelado': return 'danger';
      default: return 'secondary';
    }
  };

  const getDifficultyVariant = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'baja': 
      case 'fácil': return 'success';
      case 'media': 
      case 'medio': return 'warning';
      case 'alta': 
      case 'difícil': return 'danger';
      case 'extrema': return 'dark';
      default: return 'secondary';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'fácil': return '🟢';
      case 'medio': return '🟡';
      case 'difícil': return '🔴';
      default: return '⚪';
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
          <i className="bi bi-check-circle-fill me-2"></i>
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
            </Card.Body>
          </Card>

          {/* Pestañas de contenido */}
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="px-3 pt-3"
                fill
              >
                <Tab eventKey="details" title="📋 Detalles">
                  <div className="p-3">
                    <Row className="g-4">
                      <Col md={6}>
                        <h5>Información del Evento</h5>
                        <ListGroup variant="flush">
                          <ListGroup.Item className="d-flex justify-content-between align-items-center">
                            <span>Fecha y Hora</span>
                            <strong>
                              {new Date(event.fecha).toLocaleDateString('es-ES', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </strong>
                          </ListGroup.Item>
                          <ListGroup.Item className="d-flex justify-content-between align-items-center">
                            <span>Ubicación</span>
                            <strong>{event.ubicacion}</strong>
                          </ListGroup.Item>
                          <ListGroup.Item className="d-flex justify-content-between align-items-center">
                            <span>Tipo</span>
                            <Badge bg="primary">{event.tipo}</Badge>
                          </ListGroup.Item>
                          <ListGroup.Item className="d-flex justify-content-between align-items-center">
                            <span>Dificultad</span>
                            <Badge bg={getDifficultyVariant(event.dificultad)}>
                              {event.dificultad}
                            </Badge>
                          </ListGroup.Item>
                        </ListGroup>
                      </Col>
                      <Col md={6}>
                        <h5>Estadísticas</h5>
                        <ListGroup variant="flush">
                          <ListGroup.Item>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Cupo Disponible</span>
                              <span>
                                {event.participantes_inscritos || 0} / {event.cupo_maximo || '∞'}
                              </span>
                            </div>
                            <ProgressBar 
                              now={registrationProgress} 
                              variant={
                                registrationProgress > 90 ? 'danger' : 
                                registrationProgress > 75 ? 'warning' : 'success'
                              }
                            />
                          </ListGroup.Item>
                          <ListGroup.Item className="d-flex justify-content-between align-items-center">
                            <span>Distancia Total</span>
                            <strong>{event.distancia_km || event.distancia} km</strong>
                          </ListGroup.Item>
                          <ListGroup.Item className="d-flex justify-content-between align-items-center">
                            <span>Elevación</span>
                            <strong>{event.elevacion || 'N/A'} m</strong>
                          </ListGroup.Item>
                          <ListGroup.Item className="d-flex justify-content-between align-items-center">
                            <span>Cuota</span>
                            <strong>€{event.cuota_inscripcion || 'Gratis'}</strong>
                          </ListGroup.Item>
                        </ListGroup>
                      </Col>
                    </Row>
                  </div>
                </Tab>

                <Tab eventKey="route" title="🗺️ Ruta y Sectores">
                  <div className="p-3">
                    <div className="mb-4">
                      <h5>Mapa de la Ruta</h5>
                      <EventMap 
                        coordinates={event.route_data?.coordinates}
                        sectors={sectorsData}
                        selectedSector={selectedSector}
                        height="300px"
                      />
                    </div>

                    <div>
                      <h5>Sectores de la Ruta</h5>
                      <p className="text-muted mb-3">
                        La ruta está dividida en {sectorsData.length} sectores con diferentes características
                      </p>
                      
                      <RouteSectors 
                        sectors={sectorsData}
                        onSectorSelect={handleSectorSelect}
                        selectedSector={selectedSector}
                      />
                    </div>
                  </div>
                </Tab>

                <Tab eventKey="requirements" title="📝 Requisitos">
                  <div className="p-3">
                    <h5>Requisitos de Participación</h5>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <i className="bi bi-check-circle text-success me-2"></i>
                        Equipo de ciclismo en buen estado
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <i className="bi bi-check-circle text-success me-2"></i>
                        Casco obligatorio
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <i className="bi bi-check-circle text-success me-2"></i>
                        Kit básico de reparación
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <i className="bi bi-check-circle text-success me-2"></i>
                        Hidratación suficiente
                      </ListGroup.Item>
                      {event.cuota_inscripcion > 0 && (
                        <ListGroup.Item>
                          <i className="bi bi-credit-card text-primary me-2"></i>
                          Pago de cuota de inscripción: €{event.cuota_inscripcion}
                        </ListGroup.Item>
                      )}
                    </ListGroup>
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          {/* Panel de inscripción */}
          <Card className="border-0 shadow-sm sticky-top" style={{ top: '100px' }}>
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Inscripción</h5>
            </Card.Header>
            <Card.Body className="p-4">
              {isRegistered ? (
                <div className="text-center">
                  <div className="text-success mb-3">
                    <i className="bi bi-check-circle display-4"></i>
                  </div>
                  <h5>¡Ya estás inscrito!</h5>
                  <p className="text-muted">
                    Te has inscrito exitosamente en este evento.
                  </p>
                  <Button 
                    variant="outline-primary" 
                    onClick={() => navigate('/cuenta/mis-eventos')}
                  >
                    Ver Mis Eventos
                  </Button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-4">
                    <h4 className="text-primary">€{event.cuota_inscripcion || 0}</h4>
                    <p className="text-muted">Cuota de inscripción</p>
                  </div>

                  {event.estado?.toLowerCase() === 'próximo' ? (
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-100 py-3 fw-bold"
                      onClick={handleRegisterClick}
                    >
                      Inscribirse Ahora
                    </Button>
                  ) : (
                    <Alert variant="warning" className="text-center">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      Las inscripciones no están disponibles para este evento
                    </Alert>
                  )}

                  <div className="mt-3">
                    <small className="text-muted">
                      <i className="bi bi-info-circle me-1"></i>
                      Al inscribirte aceptas los términos y condiciones del evento
                    </small>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>

          {/* Información del organizador */}
          <Card className="border-0 shadow-sm mt-4">
            <Card.Header className="bg-light">
              <h6 className="mb-0">Organizador</h6>
            </Card.Header>
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                       style={{width: '50px', height: '50px'}}>
                    <span className="fw-bold">O</span>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="mb-1">Organizador del Evento</h6>
                  <small className="text-muted">
                    {event.organizador?.nombre || 'Maripneitor Cycling'}
                  </small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de inscripción */}
      <Modal 
        show={showRegistrationModal} 
        onHide={() => setShowRegistrationModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Inscripción en {event.nombre}</Modal.Title>
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