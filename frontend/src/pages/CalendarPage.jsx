import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { eventsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

// Configuración de localización
const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
        end: new Date(new Date(event.fecha).getTime() + 2 * 60 * 60 * 1000), // +2 horas
        resource: {
          location: event.ubicacion,
          type: event.tipo,
          description: event.descripcion
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

  const handleSelectSlot = ({ start }) => {
    // Opcional: Permitir crear eventos al hacer clic en slots vacíos
    console.log('Slot seleccionado:', start);
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad';
    
    // Colores diferentes según el tipo de evento
    if (event.resource?.type?.toLowerCase().includes('carrera')) {
      backgroundColor = '#d13438'; // Rojo para carreras
    } else if (event.resource?.type?.toLowerCase().includes('recreativo')) {
      backgroundColor = '#107c10'; // Verde para recreativos
    } else if (event.resource?.type?.toLowerCase().includes('entrenamiento')) {
      backgroundColor = '#f7630c'; // Naranja para entrenamientos
    }
    
    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

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
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={loadEvents}
              >
                🔄 Actualizar
              </Button>
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
                  selectable
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
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Leyenda */}
      <Row className="mt-4">
        <Col md={6}>
          <Card className="border-0 bg-light">
            <Card.Body>
              <h6>Leyenda del Calendario</h6>
              <div className="d-flex flex-wrap gap-3">
                <div className="d-flex align-items-center">
                  <div 
                    style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#3174ad',
                      borderRadius: '2px',
                      marginRight: '8px'
                    }}
                  ></div>
                  <small>Eventos Generales</small>
                </div>
                <div className="d-flex align-items-center">
                  <div 
                    style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#d13438',
                      borderRadius: '2px',
                      marginRight: '8px'
                    }}
                  ></div>
                  <small>Carreras</small>
                </div>
                <div className="d-flex align-items-center">
                  <div 
                    style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#107c10',
                      borderRadius: '2px',
                      marginRight: '8px'
                    }}
                  ></div>
                  <small>Eventos Recreativos</small>
                </div>
                <div className="d-flex align-items-center">
                  <div 
                    style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#f7630c',
                      borderRadius: '2px',
                      marginRight: '8px'
                    }}
                  ></div>
                  <small>Entrenamientos</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CalendarPage;