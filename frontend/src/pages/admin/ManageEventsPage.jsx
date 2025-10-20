import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Form, Modal } from 'react-bootstrap';
import { eventsAPI } from '../../services/api';

const ManageEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await eventsAPI.getAll();
      setEvents(response.data);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      try {
        await eventsAPI.delete(eventId);
        loadEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Error al eliminar el evento');
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

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>Gestión de Eventos</h2>
              <p className="text-muted">Administra todos los eventos de la plataforma</p>
            </div>
            <Button variant="primary" size="lg">
              + Crear Nuevo Evento
            </Button>
          </div>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <h5 className="mb-0">Lista de Eventos</h5>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-4">
              <p>Cargando eventos...</p>
            </div>
          ) : (
            <Table responsive striped>
              <thead>
                <tr>
                  <th>Evento</th>
                  <th>Fecha</th>
                  <th>Ubicación</th>
                  <th>Tipo</th>
                  <th>Inscritos</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>
                      <strong>{event.nombre}</strong>
                      {event.descripcion && (
                        <div>
                          <small className="text-muted">
                            {event.descripcion.substring(0, 50)}...
                          </small>
                        </div>
                      )}
                    </td>
                    <td>{new Date(event.fecha).toLocaleDateString()}</td>
                    <td>{event.ubicacion}</td>
                    <td>
                      <Badge bg="outline-primary" text="dark">
                        {event.tipo}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg="info">0</Badge>
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
                          onClick={() => handleEdit(event)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(event.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          {events.length === 0 && !loading && (
            <div className="text-center py-5">
              <p className="text-muted">No hay eventos creados aún.</p>
              <Button variant="primary">
                Crear Primer Evento
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar Evento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre del Evento</Form.Label>
                    <Form.Control
                      type="text"
                      defaultValue={selectedEvent.nombre}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      defaultValue={selectedEvent.fecha.split('.')[0]}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  defaultValue={selectedEvent.descripcion}
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Ubicación</Form.Label>
                    <Form.Control
                      type="text"
                      defaultValue={selectedEvent.ubicacion}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Distancia (km)</Form.Label>
                    <Form.Control
                      type="number"
                      defaultValue={selectedEvent.distancia}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tipo</Form.Label>
                    <Form.Select defaultValue={selectedEvent.tipo}>
                      <option value="ruta">Ruta</option>
                      <option value="montaña">Montaña</option>
                      <option value="urbano">Urbano</option>
                      <option value="competitivo">Competitivo</option>
                      <option value="recreativo">Recreativo</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Estado</Form.Label>
                    <Form.Select defaultValue={selectedEvent.estado}>
                      <option value="proximamente">Próximamente</option>
                      <option value="activo">Activo</option>
                      <option value="completado">Completado</option>
                      <option value="cancelado">Cancelado</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageEventsPage;