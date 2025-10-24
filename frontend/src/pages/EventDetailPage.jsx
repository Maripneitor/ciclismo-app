import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Button, Badge, Alert, 
  Spinner, Tabs, Tab, ProgressBar, ListGroup 
} from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { eventsAPI, registrationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import EventMap from '../components/events/EventMap';
import RouteSectors from '../components/events/RouteSectors';
import RegistrationForm from '../components/forms/RegistrationForm';
import { 
  formatDate, 
  formatDateTime, 
  formatCurrency, 
  formatDistance,
  calculateProgress 
} from '../utils/formatting';
import { 
  getStatusVariant, 
  getDifficultyVariant, 
  getEventTypeIcon,
  getStatusText 
} from '../utils/uiHelpers';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [selectedSector, setSelectedSector] = useState(null);
  const [userRegistration, setUserRegistration] = useState(null);

  useEffect(() => {
    loadEventData();
  }, [id]);

  const loadEventData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const eventData = await eventsAPI.getById(id);
      setEvent(eventData);

      // Verificar si el usuario ya está inscrito
      if (isAuthenticated) {
        try {
          const registrations = await registrationsAPI.getMyRegistrations();
          const userReg = registrations.find(reg => 
            reg.evento_id === eventData.evento_id || reg.evento_id === eventData.id
          );
          setUserRegistration(userReg);
        } catch (regError) {
          console.log('No se pudo verificar inscripción:', regError);
        }
      }
    } catch (error) {
      console.error('Error cargando evento:', error);
      setError('Error cargando los detalles del evento');
    } finally {
      setLoading(false);
    }
  };

  // Usar utilidades importadas
  const statusVariant = event ? getStatusVariant(event.estado) : 'secondary';
  const difficultyVariant = event ? getDifficultyVariant(event.dificultad) : 'secondary';
  const eventIcon = event ? getEventTypeIcon(event.tipo) : '🚴';
  const formattedDate = event ? formatDateTime(event.fecha) : '';
  const formattedDistance = event ? formatDistance(event.distancia_km) : '';
  const formattedPrice = event ? formatCurrency(event.cuota_inscripcion) : '';
  const progress = event ? calculateProgress(event.participantes_inscritos, event.cupo_maximo) : 0;
  const statusText = event ? getStatusText(event.estado) : '';

  const handleRegistrationSuccess = (message) => {
    setShowRegistrationForm(false);
    loadEventData(); // Recargar datos para actualizar inscripción
    // Mostrar mensaje de éxito
  };

  const handleSectorSelect = (sector) => {
    setSelectedSector(sector);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Cargando evento...</p>
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
          <Button as={Link} to="/eventos" variant="primary">
            Volver a Eventos
          </Button>
        </Alert>
      </Container>
    );
  }

  const routeData = event.route_data || {
    coordinates: [],
    sectors: []
  };

  return (
    <Container className="py-4">
      {/* Header del Evento */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <nav aria-label="breadcrumb">
                <Link to="/eventos" className="text-decoration-none">
                  ← Volver a Eventos
                </Link>
              </nav>
              <h1 className="display-5 fw-bold mt-2">{event.nombre}</h1>
              <div className="d-flex flex-wrap gap-2 align-items-center mt-2">
                <Badge bg={statusVariant} className="fs-6">
                  {statusText}
                </Badge>
                <Badge bg={difficultyVariant} className="fs-6">
                  {event.dificultad}
                </Badge>
                <span className="event-type-icon fs-4">{eventIcon}</span>
              </div>
            </div>
            
            <div className="text-end">
              <h3 className="text-primary">{formattedPrice}</h3>
              {!userRegistration && isAuthenticated && event.estado === 'próximo' && (
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => setShowRegistrationForm(true)}
                >
                  Inscribirse
                </Button>
              )}
              {userRegistration && (
                <Badge bg="success" className="fs-6 p-2">
                  ✅ Ya estás inscrito
                </Badge>
              )}
            </div>
          </div>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Información Principal */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <h5>Descripción</h5>
              <p className="lead">{event.descripcion}</p>
              
              <Row className="g-3 mt-4">
                <Col sm={6}>
                  <strong>📅 Fecha y Hora:</strong>
                  <div>{formattedDate}</div>
                </Col>
                <Col sm={6}>
                  <strong>📍 Ubicación:</strong>
                  <div>{event.ubicacion}</div>
                </Col>
                <Col sm={6}>
                  <strong>🛣️ Distancia:</strong>
                  <div>{formattedDistance}</div>
                </Col>
                <Col sm={6}>
                  <strong>📈 Elevación:</strong>
                  <div>{event.elevacion || 'N/A'} m</div>
                </Col>
                <Col sm={6}>
                  <strong>🎯 Tipo:</strong>
                  <div>{event.tipo}</div>
                </Col>
                <Col sm={6}>
                  <strong>⚡ Dificultad:</strong>
                  <div>
                    <Badge bg={difficultyVariant}>
                      {event.dificultad}
                    </Badge>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Mapa y Sectores */}
          <Tabs defaultActiveKey="map" className="mb-4">
            <Tab eventKey="map" title="🗺️ Mapa de Ruta">
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                  <div style={{ height: '400px' }}>
                    <EventMap 
                      route={routeData.coordinates}
                      eventLocation={event.ubicacion}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Tab>
            
            <Tab eventKey="sectors" title="📊 Sectores de Ruta">
              <RouteSectors 
                sectors={routeData.sectors}
                onSectorSelect={handleSectorSelect}
                selectedSector={selectedSector}
              />
            </Tab>
          </Tabs>
        </Col>

        {/* Sidebar */}
        <Col lg={4}>
          {/* Cupos Disponibles */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white">
              <h6 className="mb-0">📊 Cupos Disponibles</h6>
            </Card.Header>
            <Card.Body>
              <div className="text-center">
                <h4 className="text-primary">
                  {event.participantes_inscritos || 0}/{event.cupo_maximo}
                </h4>
                <p className="text-muted">Ciclistas inscritos</p>
                <ProgressBar 
                  now={progress} 
                  variant={progress >= 90 ? 'danger' : progress >= 70 ? 'warning' : 'success'}
                  className="mb-2"
                />
                <small className="text-muted">
                  {event.cupo_maximo - (event.participantes_inscritos || 0)} cupos disponibles
                </small>
              </div>
            </Card.Body>
          </Card>

          {/* Información de Inscripción */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white">
              <h6 className="mb-0">📝 Información de Inscripción</h6>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="px-0">
                  <strong>Precio:</strong> {formattedPrice}
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  <strong>Incluye:</strong> Playera, hidratación, seguro
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  <strong>Requisitos:</strong> Bicicleta en buen estado, casco
                </ListGroup.Item>
              </ListGroup>
              
              {!isAuthenticated ? (
                <Alert variant="info" className="mt-3">
                  <strong>💡 Inicia sesión</strong> para inscribirte en este evento
                </Alert>
              ) : userRegistration ? (
                <Alert variant="success" className="mt-3">
                  <strong>✅ Ya estás inscrito</strong>
                  <div className="mt-2">
                    <Button 
                      variant="outline-success" 
                      size="sm"
                      as={Link}
                      to="/cuenta/inscripciones"
                    >
                      Ver mi inscripción
                    </Button>
                  </div>
                </Alert>
              ) : event.estado === 'próximo' ? (
                <Button 
                  variant="primary" 
                  className="w-100 mt-3"
                  onClick={() => setShowRegistrationForm(true)}
                >
                  Inscribirse Ahora
                </Button>
              ) : (
                <Alert variant="secondary" className="mt-3">
                  Las inscripciones para este evento no están disponibles
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de Registro */}
      {showRegistrationForm && (
        <RegistrationForm
          event={event}
          onSuccess={handleRegistrationSuccess}
          onCancel={() => setShowRegistrationForm(false)}
        />
      )}
    </Container>
  );
};

export default EventDetailPage;