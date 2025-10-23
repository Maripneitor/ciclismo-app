// frontend/src/pages/admin/ManageEventsPage.jsx - CRUD COMPLETO
import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Table, Button, Spinner, Alert,
  Modal, Form, Badge
} from 'react-bootstrap';
import { eventsAPI } from '../../services/api';

const ManageEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await eventsAPI.getAll();
      setEvents(eventsData);
    } catch (error) {
      setError('Error al cargar eventos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowModal(true);
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      return;
    }

    try {
      setDeleting(eventId);
      await eventsAPI.delete(eventId);
      setSuccess('Evento eliminado exitosamente');
      await loadEvents();
    } catch (error) {
      setError('Error al eliminar evento: ' + error.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmitModal = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData(e.target);
      const eventData = {
        nombre: formData.get('nombre'),
        descripcion: formData.get('descripcion'),
        fecha: formData.get('fecha'),
        ubicacion: formData.get('ubicacion'),
        distancia: parseFloat(formData.get('distancia')),
        desnivel: parseInt(formData.get('desnivel')),
        estado: formData.get('estado')
      };

      await eventsAPI.update(editingEvent.evento_id, eventData);
      setSuccess('Evento actualizado exitosamente');
      setShowModal(false);
      await loadEvents();
    } catch (error) {
      setError('Error al actualizar evento: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      activo: 'success',
      cancelado: 'danger',
      completado: 'primary',
      pendiente: 'warning'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={12}>
          <div className="page-header mb-4">
            <h1 className="h2 mb-1">Gestión de Eventos</h1>
            <p className="text-muted">Administra todos los eventos del sistema</p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Todos los Eventos</h5>
                <Badge bg="primary">{events.length} eventos</Badge>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Evento</th>
                    <th>Fecha y Ubicación</th>
                    <th>Distancia/Desnivel</th>
                    <th>Estado</th>
                    <th>Organizador</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.evento_id}>
                      <td>
                        <div>
                          <div className="fw-semibold">{event.nombre}</div>
                          <small className="text-muted">
                            {event.descripcion?.substring(0, 100)}...
                          </small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>{new Date(event.fecha).toLocaleDateString()}</div>
                          <small className="text-muted">{event.ubicacion}</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>{event.distancia} km</div>
                          <small className="text-muted">{event.desnivel} m</small>
                        </div>
                      </td>
                      <td>
                        {getStatusBadge(event.estado)}
                      </td>
                      <td>
                        {event.Organizador?.nombre_completo || 'N/A'}
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(event)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(event.evento_id)}
                          disabled={deleting === event.evento_id}
                        >
                          {deleting === event.evento_id ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            'Eliminar'
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de edición */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Editar Evento: {editingEvent?.nombre}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitModal}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre del Evento</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    defaultValue={editingEvent?.nombre}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="fecha"
                    defaultValue={editingEvent?.fecha?.slice(0, 16)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ubicación</Form.Label>
                  <Form.Control
                    type="text"
                    name="ubicacion"
                    defaultValue={editingEvent?.ubicacion}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Distancia (km)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    name="distancia"
                    defaultValue={editingEvent?.distancia}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Desnivel (m)</Form.Label>
                  <Form.Control
                    type="number"
                    name="desnivel"
                    defaultValue={editingEvent?.desnivel}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select name="estado" defaultValue={editingEvent?.estado}>
                    <option value="activo">Activo</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="completado">Completado</option>
                    <option value="cancelado">Cancelado</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcion"
                defaultValue={editingEvent?.descripcion}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => setShowModal(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default ManageEventsPage;