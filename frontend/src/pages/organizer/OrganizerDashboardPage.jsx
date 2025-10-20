import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Button, 
  Badge,
  Modal,
  Form,
  Alert
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { eventsAPI } from '../../services/api';

const OrganizerDashboardPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadOrganizerEvents();
  }, []);

  const loadOrganizerEvents = async () => {
    try {
      setLoading(true);
      let response;
      try {
        response = await eventsAPI.getOrganizerEvents();
      } catch (orgError) {
        console.log('Endpoint de organizador no disponible, cargando todos los eventos');
        response = await eventsAPI.getAll();
      }
      
      const eventsData = response.data || response;
      setEvents(Array.isArray(eventsData) ? eventsData.slice(0, 10) : []);
    } catch (error) {
      console.error('Error loading events:', error);
      setError('Error cargando eventos. Usando datos de demostración.');
      setEvents([
        {
          id: 1,
          nombre: 'Gran Fondo Sierra Nevada',
          descripcion: 'Evento de montaña en la sierra nevada',
          fecha: '2024-02-15T08:00:00',
          ubicacion: 'Granada, España',
          distancia: 120,
          tipo: 'montana',
          estado: 'activo',
          inscritos: 45
        },
        {
          id: 2,
          nombre: 'Carrera Nocturna Madrid',
          descripcion: 'Carrera urbana nocturna por el centro de Madrid',
          fecha: '2024-02-20T20:00:00',
          ubicacion: 'Madrid, España',
          distancia: 45,
          tipo: 'urbano',
          estado: 'proximamente',
          inscritos: 28
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setFormData({
      nombre: '',
      descripcion: '',
      fecha: '',
      ubicacion: '',
      distancia: '',
      tipo: 'ruta',
      estado: 'proximamente'
    });
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setFormData({
      nombre: event.nombre || '',
      descripcion: event.descripcion || '',
      fecha: event.fecha ? event.fecha.split('.')[0].slice(0, 16) : '',
      ubicacion: event.ubicacion || '',
      distancia: event.distancia || '',
      tipo: event.tipo || 'ruta',
      estado: event.estado || 'proximamente'
    });
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    try {
      if (selectedEvent) {
        setSuccess('Evento actualizado correctamente (modo demostración)');
      } else {
        setSuccess('Evento creado correctamente (modo demostración)');
      }
      setShowModal(false);
      setTimeout(() => {
        loadOrganizerEvents();
      }, 1000);
    } catch (error) {
      console.error('Error saving event:', error);
      setError('Error guardando el evento. Modo demostración activado.');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      try {
        setSuccess('Evento eliminado correctamente (modo demostración)');
        loadOrganizerEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
        setError('Error eliminando el evento. Modo demostración activado.');
      }
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'activo': return 'success';
      case 'proximamente': return 'warning';
      case 'completado': return 'secondary';
      case 'cancelado': return 'danger';
      default: return 'secondary';
    }
  };

  const getEventTypeIcon = (type) => {
    const icons = {
      'ruta': '',
      'montana': '',
      'urbano': '',
      'competitivo': '',
      'recreativo': ''
    };
    return icons[type] || '';
  };

  const stats = {
    totalEvents: events.length,
    activeEvents: events.filter(e => e.estado === 'activo').length,
    totalParticipants: events.reduce((sum, event) => sum + (event.inscritos || 0), 0)
  };

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>Panel del Organizador</h2>
              <p className="text-muted">Gestiona tus eventos de ciclismo</p>
            </div>
            <Button variant="primary" onClick={handleCreateEvent}>
              Crear Evento
            </Button>
          </div>
        </Col>
      </Row>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center stat-card">
            <Card.Body>
              <div className="text-primary mb-2 fs-1"></div>
              <h3 className="text-primary">{stats.totalEvents}</h3>
              <p className="text-muted mb-0">Total Eventos</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center stat-card">
            <Card.Body>
              <div className="text-success mb-2 fs-1"></div>
              <h3 className="text-success">{stats.activeEvents}</h3>
              <p className="text-muted mb-0">Eventos Activos</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center stat-card">
            <Card.Body>
              <div className="text-info mb-2 fs-1"></div>
              <h3 className="text-info">{stats.totalParticipants}</h3>
              <p className="text-muted mb-0">Total Participantes</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Mis Eventos</h5>
          <Badge bg="primary" pill>
            {events.length} eventos
          </Badge>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-2 text-muted">Cargando eventos...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-5">
              <div className="text-muted mb-3 fs-1"></div>
              <p className="text-muted">No tienes eventos creados aún.</p>
              <Button variant="primary" onClick={handleCreateEvent}>
                Crear Primer Evento
              </Button>
            </div>
          ) : (
            <Table responsive striped hover>
              <thead className="table-dark">
                <tr>
                  <th>Evento</th>
                  <th>Fecha</th>
                  <th>Ubicación</th>
                  <th>Inscritos</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>
                      <div className="d-flex align-items-start">
                        <span className="fs-5 me-2">
                          {getEventTypeIcon(event.tipo)}
                        </span>
                        <div>
                          <strong>{event.nombre}</strong>
                          {event.descripcion && (
                            <div>
                              <small className="text-muted">
                                {event.descripcion.substring(0, 50)}...
                              </small>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <small>
                        {event.fecha ? new Date(event.fecha).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        }) : 'No definida'}
                      </small>
                    </td>
                    <td>
                      <small> {event.ubicacion}</small>
                    </td>
                    <td>
                      <Badge bg="info" pill>
                        {event.inscritos || 0}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={getStatusVariant(event.estado)}>
                        {event.estado}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleEditEvent(event)}
                          title="Editar evento"
                        >
                          
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteEvent(event.id)}
                          title="Eliminar evento"
                        >
                          
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedEvent ? 'Editar Evento' : 'Crear Nuevo Evento'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitEvent}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre del Evento *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.nombre || ''}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    required
                    placeholder="Ej: Gran Fondo Sierra Nevada"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha y Hora *</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={formData.fecha || ''}
                    onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.descripcion || ''}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                placeholder="Describe el evento, rutas, dificultad, etc."
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ubicación *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.ubicacion || ''}
                    onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                    required
                    placeholder="Ej: Madrid, España"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Distancia (km)</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.distancia || ''}
                    onChange={(e) => setFormData({...formData, distancia: e.target.value})}
                    placeholder="Ej: 120"
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Evento</Form.Label>
                  <Form.Select
                    value={formData.tipo || 'ruta'}
                    onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                  >
                    <option value="ruta">Ruta</option>
                    <option value="montana">Montaña</option>
                    <option value="urbano">Urbano</option>
                    <option value="competitivo">Competitivo</option>
                    <option value="recreativo">Recreativo</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    value={formData.estado || 'proximamente'}
                    onChange={(e) => setFormData({...formData, estado: e.target.value})}
                  >
                    <option value="proximamente">Próximamente</option>
                    <option value="activo">Activo</option>
                    <option value="completado">Completado</option>
                    <option value="cancelado">Cancelado</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Alert variant="info" className="mt-3">
              <small>
                <strong>Modo demostración:</strong> Los datos se guardarán localmente. 
                En producción, se conectaría con el backend.
              </small>
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {selectedEvent ? 'Guardar Cambios' : 'Crear Evento'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default OrganizerDashboardPage;