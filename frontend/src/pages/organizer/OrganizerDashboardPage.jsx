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
  Alert,
  ProgressBar
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { eventsAPI } from '../../services/api';

const OrganizerDashboardPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({});
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalParticipants: 0,
    upcomingEvents: 0,
    completedEvents: 0
  });
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
      const eventsArray = Array.isArray(eventsData) ? eventsData.slice(0, 10) : [];
      setEvents(eventsArray);

      const now = new Date();
      const statsData = {
        totalEvents: eventsArray.length,
        activeEvents: eventsArray.filter(e => e.estado === 'activo' || e.estado === 'En Curso').length,
        upcomingEvents: eventsArray.filter(e => e.estado === 'proximamente' || e.estado === 'Próximo').length,
        completedEvents: eventsArray.filter(e => e.estado === 'completado' || e.estado === 'Finalizado').length,
        totalParticipants: eventsArray.reduce((sum, event) => sum + (event.inscritos || 0), 0)
      };
      setStats(statsData);

    } catch (error) {
      console.error('Error loading events:', error);
      setError('Error cargando eventos. Usando datos de demostración.');
      const demoEvents = [
        {
          id: 1,
          evento_id: 1,
          nombre: 'Gran Fondo Sierra Nevada',
          descripcion: 'Evento de montaña en la sierra nevada',
          fecha: '2024-02-15T08:00:00',
          ubicacion: 'Granada, España',
          distancia: 120,
          distancia_km: 120,
          tipo: 'montana',
          estado: 'activo',
          inscritos: 45,
          maximo_participantes: 100
        },
        {
          id: 2,
          evento_id: 2,
          nombre: 'Carrera Nocturna Madrid',
          descripcion: 'Carrera urbana nocturna por el centro de Madrid',
          fecha: '2024-02-20T20:00:00',
          ubicacion: 'Madrid, España',
          distancia: 45,
          distancia_km: 45,
          tipo: 'urbano',
          estado: 'proximamente',
          inscritos: 28,
          maximo_participantes: 50
        }
      ];
      setEvents(demoEvents);
      setStats({
        totalEvents: demoEvents.length,
        activeEvents: demoEvents.filter(e => e.estado === 'activo').length,
        upcomingEvents: demoEvents.filter(e => e.estado === 'proximamente').length,
        completedEvents: 0,
        totalParticipants: demoEvents.reduce((sum, event) => sum + (event.inscritos || 0), 0)
      });
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
      distancia: event.distancia || event.distancia_km || '',
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
      case 'activo':
      case 'En Curso': return 'success';
      case 'proximamente':
      case 'Próximo': return 'warning';
      case 'completado':
      case 'Finalizado': return 'secondary';
      case 'cancelado': return 'danger';
      default: return 'secondary';
    }
  };

  const getEventTypeIcon = (type) => {
    const icons = {
      'ruta': '',
      'montana': '',
      'montaña': '',
      'urbano': '',
      'competitivo': '',
      'recreativo': ''
    };
    return icons[type] || '';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No definida';
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        <Col md={2}>
          <Card className="text-center stat-card">
            <Card.Body>
              <div className="text-primary mb-2 fs-1"></div>
              <h3 className="text-primary">{stats.totalEvents}</h3>
              <p className="text-muted mb-0">Total Eventos</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center stat-card">
            <Card.Body>
              <div className="text-success mb-2 fs-1"></div>
              <h3 className="text-success">{stats.activeEvents}</h3>
              <p className="text-muted mb-0">Activos</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center stat-card">
            <Card.Body>
              <div className="text-warning mb-2 fs-1"></div>
              <h3 className="text-warning">{stats.upcomingEvents}</h3>
              <p className="text-muted mb-0">Próximos</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center stat-card">
            <Card.Body>
              <div className="text-info mb-2 fs-1"></div>
              <h3 className="text-info">{stats.totalParticipants}</h3>
              <p className="text-muted mb-0">Participantes</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center stat-card">
            <Card.Body>
              <div className="text-secondary mb-2 fs-1"></div>
              <h3 className="text-secondary">{stats.completedEvents}</h3>
              <p className="text-muted mb-0">Finalizados</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center stat-card">
            <Card.Body>
              <div className="text-dark mb-2 fs-1"></div>
              <h3 className="text-dark">
                {stats.totalEvents > 0 ? Math.round((stats.completedEvents / stats.totalEvents) * 100) : 0}%
              </h3>
              <p className="text-muted mb-0">Tasa de éxito</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Resumen de Actividad</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Distribución de Eventos</span>
                    </div>
                    <div className="mb-2">
                      <small>Próximos: {stats.upcomingEvents}</small>
                      <ProgressBar 
                        now={stats.totalEvents > 0 ? (stats.upcomingEvents / stats.totalEvents) * 100 : 0} 
                        variant="warning" 
                        className="mb-1" 
                      />
                    </div>
                    <div className="mb-2">
                      <small>En Curso: {stats.activeEvents}</small>
                      <ProgressBar 
                        now={stats.totalEvents > 0 ? (stats.activeEvents / stats.totalEvents) * 100 : 0} 
                        variant="success" 
                        className="mb-1" 
                      />
                    </div>
                    <div>
                      <small>Finalizados: {stats.completedEvents}</small>
                      <ProgressBar 
                        now={stats.totalEvents > 0 ? (stats.completedEvents / stats.totalEvents) * 100 : 0} 
                        variant="secondary" 
                        className="mb-1" 
                      />
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="text-center">
                    <h6>Participación Promedio</h6>
                    <div className="display-4 text-primary">
                      {stats.totalEvents > 0 ? Math.round(stats.totalParticipants / stats.totalEvents) : 0}
                    </div>
                    <p className="text-muted">participantes por evento</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0">Mis Eventos</h5>
            <small className="text-muted">Gestiona todos tus eventos creados</small>
          </div>
          <div>
            <Badge bg="primary" className="me-2">
              Total: {events.length}
            </Badge>
            <Button variant="outline-primary" size="sm" onClick={handleCreateEvent}>
              Nuevo Evento
            </Button>
          </div>
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
                Crear Mi Primer Evento
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
                  <tr key={event.evento_id || event.id}>
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
                          <div>
                            <small className="text-muted">
                              {event.distancia_km || event.distancia || '0'} km • {event.tipo}
                            </small>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <small>{formatDate(event.fecha)}</small>
                    </td>
                    <td>
                      <small>{event.ubicacion}</small>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <Badge bg="info" pill className="me-2">
                          {event.inscritos || 0}
                        </Badge>
                        {event.maximo_participantes && (
                          <small className="text-muted">
                            / {event.maximo_participantes}
                          </small>
                        )}
                      </div>
                      {event.maximo_participantes && (
                        <ProgressBar 
                          now={event.inscritos ? (event.inscritos / event.maximo_participantes) * 100 : 0} 
                          variant="success" 
                          size="sm" 
                          className="mt-1"
                        />
                      )}
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
                          as={Link}
                          to={`/evento/${event.evento_id || event.id}`}
                          variant="outline-info"
                          size="sm"
                          title="Ver evento"
                        >
                          
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteEvent(event.evento_id || event.id)}
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