import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, Row, Col, Card, Spinner, Alert, Button, 
  Modal, Form, Badge 
} from 'react-bootstrap';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { eventsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Configuración de localización
const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, isOrganizer } = useAuth();

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const eventsData = await eventsAPI.getAll();
      
      // Transformar eventos al formato requerido por el calendario
      const calendarEvents = eventsData.map(event => ({
        id: event.evento_id || event.id,
        title: event.nombre,
        start: new Date(event.fecha),
        end: new Date(new Date(event.fecha).getTime() + 2 * 60 * 60 * 1000),
        resource: {
          location: event.ubicacion,
          type: event.tipo,
          description: event.descripcion,
          estado: event.estado
        }
      }));
      
      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error cargando eventos para calendario:', error);
      setError('Error cargando el calendario de eventos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleSelectEvent = (event) => {
    navigate(`/evento/${event.id}`);
  };

  const handleSelectSlot = ({ start, end }) => {
    if (isAdmin || isOrganizer) {
      setSelectedSlot({ start, end });
      setShowCreateModal(true);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setCreating(true);
    
    try {
      const formData = new FormData(e.target);
      const eventData = {
        nombre: formData.get('nombre'),
        descripcion: formData.get('descripcion'),
        fecha: selectedSlot.start.toISOString(),
        ubicacion: formData.get('ubicacion'),
        tipo: formData.get('tipo'),
        distancia_km: parseFloat(formData.get('distancia')),
        dificultad: formData.get('dificultad'),
        cupo_maximo: parseInt(formData.get('cupo_maximo')),
        cuota_inscripcion: parseFloat(formData.get('cuota_inscripcion'))
      };

      await eventsAPI.create(eventData);
      setShowCreateModal(false);
      setSelectedSlot(null);
      await loadEvents();
    } catch (error) {
      setError('Error creando evento: ' + error.message);
    } finally {
      setCreating(false);
    }
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad';
    let textColor = 'white';
    
    // Colores diferentes según el tipo de evento
    if (event.resource?.type?.toLowerCase().includes('carrera')) {
      backgroundColor = '#d13438';
    } else if (event.resource?.type?.toLowerCase().includes('recreativo')) {
      backgroundColor = '#107c10';
    } else if (event.resource?.type?.toLowerCase().includes('entrenamiento')) {
      backgroundColor = '#f7630c';
    }

    // Estado del evento
    if (event.resource?.estado === 'finalizado') {
      backgroundColor = '#6c757d';
    } else if (event.resource?.estado === 'cancelado') {
      backgroundColor = '#dc3545';
    }
    
    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: textColor,
        border: '0px',
        display: 'block',
        fontSize: '12px',
        padding: '2px 5px'
      }
    };
  };

  const canCreateEvents = isAuthenticated && (isAdmin || isOrganizer);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3">Cargando calendario...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="display-5 fw-bold">
            Calendario de <span className="text-primary">Eventos</span>
          </h1>
          <p className="text-muted">
            Visualiza todos los eventos programados en un vistazo
            {canCreateEvents && " - Haz clic en cualquier fecha/hora para crear un nuevo evento"}
          </p>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">🗓️ Calendario de Eventos Ciclistas</h5>
              <div className="d-flex gap-2">
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={loadEvents}
                >
                  🔄 Actualizar
                </Button>
                {canCreateEvents && (
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => navigate('/organizador/eventos/nuevo')}
                  >
                    ➕ Crear Evento
                  </Button>
                )}
              </div>
            </Card.Header>
            <Card.Body className="p-3">
              <div style={{ height: '600px' }}>
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  onSelectEvent={handleSelectEvent}
                  onSelectSlot={handleSelectSlot}
                  selectable={canCreateEvents}
                  eventPropGetter={eventStyleGetter}
                  messages={{
                    next: "Siguiente",
                    previous: "Anterior",
                    today: "Hoy",
                    month: "Mes",
                    week: "Semana",
                    day: "Día",
                    agenda: "Agenda",
                    date: "Fecha",
                    time: "Hora",
                    event: "Evento",
                    noEventsInRange: "No hay eventos en este rango"
                  }}
                  popup
                  views={['month', 'week', 'day']}
                  defaultView="month"
                  tooltipAccessor={(event) => 
                    `${event.title}\n${event.resource?.location || ''}\n${event.resource?.type || ''}`
                  }
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Leyenda */}
      <Row className="mt-4">
        <Col md={8}>
          <Card className="border-0 bg-light">
            <Card.Body>
              <h6>Leyenda del Calendario</h6>
              <div className="d-flex flex-wrap gap-3">
                <div className="d-flex align-items-center">
                  <div className="color-box" style={{backgroundColor: '#3174ad'}}></div>
                  <small>Eventos Generales</small>
                </div>
                <div className="d-flex align-items-center">
                  <div className="color-box" style={{backgroundColor: '#d13438'}}></div>
                  <small>Carreras</small>
                </div>
                <div className="d-flex align-items-center">
                  <div className="color-box" style={{backgroundColor: '#107c10'}}></div>
                  <small>Eventos Recreativos</small>
                </div>
                <div className="d-flex align-items-center">
                  <div className="color-box" style={{backgroundColor: '#f7630c'}}></div>
                  <small>Entrenamientos</small>
                </div>
                <div className="d-flex align-items-center">
                  <div className="color-box" style={{backgroundColor: '#6c757d'}}></div>
                  <small>Finalizados</small>
                </div>
                <div className="d-flex align-items-center">
                  <div className="color-box" style={{backgroundColor: '#dc3545'}}></div>
                  <small>Cancelados</small>
                </div>
              </div>
              {canCreateEvents && (
                <div className="mt-3">
                  <Badge bg="info" className="me-2">💡</Badge>
                  <small className="text-muted">
                    Haz clic en cualquier fecha/hora para crear un nuevo evento
                  </small>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal para crear evento rápido */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Crear Evento Rápido</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateEvent}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre del Evento *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    required
                    placeholder="Ej: Gran Fondo Sierra Nevada"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha y Hora</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={selectedSlot ? moment(selectedSlot.start).format('YYYY-MM-DDTHH:mm') : ''}
                    readOnly
                    className="bg-light"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ubicación *</Form.Label>
                  <Form.Control
                    type="text"
                    name="ubicacion"
                    required
                    placeholder="Ej: Madrid, España"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Evento *</Form.Label>
                  <Form.Select name="tipo" required>
                    <option value="ruta">Ruta</option>
                    <option value="carrera">Carrera</option>
                    <option value="recreativo">Recreativo</option>
                    <option value="entrenamiento">Entrenamiento</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Distancia (km)</Form.Label>
                  <Form.Control
                    type="number"
                    name="distancia"
                    step="0.1"
                    placeholder="120"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Dificultad</Form.Label>
                  <Form.Select name="dificultad">
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Cupo Máximo</Form.Label>
                  <Form.Control
                    type="number"
                    name="cupo_maximo"
                    placeholder="50"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcion"
                placeholder="Describe el evento..."
              />
            </Form.Group>

            <Alert variant="info">
              <small>
                Este es un formulario rápido. Para opciones avanzadas, usa el 
                formulario completo de creación de eventos.
              </small>
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => setShowCreateModal(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="outline-primary" 
              onClick={() => {
                setShowCreateModal(false);
                navigate('/organizador/eventos/nuevo', {
                  state: { 
                    fechaPreseleccionada: selectedSlot?.start.toISOString() 
                  }
                });
              }}
            >
              📋 Formulario Completo
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              disabled={creating}
            >
              {creating ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Creando...
                </>
              ) : (
                'Crear Evento Rápido'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <style jsx>{`
        .color-box {
          width: 12px;
          height: 12px;
          border-radius: 2px;
          margin-right: 8px;
        }
      `}</style>
    </Container>
  );
};

export default CalendarPage;