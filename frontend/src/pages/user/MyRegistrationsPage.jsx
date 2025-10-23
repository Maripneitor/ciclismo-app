// frontend/src/pages/MyRegistrationsPage.jsx - CONECTADO A API
import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Table, Spinner, Alert,
  Badge, Button, Modal
} from 'react-bootstrap';
import { registrationsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const MyRegistrationsPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadMyRegistrations();
    }
  }, [isAuthenticated]);

  const loadMyRegistrations = async () => {
    try {
      setLoading(true);
      setError('');
      
      const registrationsData = await registrationsAPI.getMyRegistrations();
      setRegistrations(registrationsData);
    } catch (error) {
      console.error('Error loading registrations:', error);
      setError('Error cargando tus inscripciones');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (registration) => {
    setSelectedRegistration(registration);
    setShowDetailsModal(true);
  };

  const handleCancelRegistration = async (registrationId) => {
    if (!window.confirm('¿Estás seguro de que quieres cancelar esta inscripción?')) {
      return;
    }

    try {
      await registrationsAPI.cancelRegistration(registrationId);
      setRegistrations(prev => 
        prev.filter(reg => reg.inscripcion_id !== registrationId)
      );
      setShowDetailsModal(false);
    } catch (error) {
      console.error('Error canceling registration:', error);
      alert('Error al cancelar la inscripción: ' + error.message);
    }
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmada': return 'success';
      case 'pendiente': return 'warning';
      case 'cancelada': return 'danger';
      case 'completada': return 'primary';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const upcomingRegistrations = registrations.filter(reg => 
    reg.estado?.toLowerCase() === 'confirmada' || 
    reg.estado?.toLowerCase() === 'pendiente'
  );

  const pastRegistrations = registrations.filter(reg => 
    reg.estado?.toLowerCase() === 'completada' || 
    reg.estado?.toLowerCase() === 'cancelada'
  );

  if (!isAuthenticated) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <h4>Acceso Requerido</h4>
          <p>Debes iniciar sesión para ver tus inscripciones.</p>
          <Button href="/login">Iniciar Sesión</Button>
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3">Cargando tus inscripciones...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="display-5 fw-bold">
            Mis <span className="text-primary">Inscripciones</span>
          </h1>
          <p className="text-muted">
            Gestiona y revisa todas tus inscripciones a eventos
          </p>
        </Col>
      </Row>

      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {registrations.length === 0 ? (
        <Row>
          <Col>
            <Card className="border-0 shadow-sm text-center py-5">
              <Card.Body>
                <div className="display-1 text-muted mb-3">📝</div>
                <h4 className="text-muted mb-3">No tienes inscripciones</h4>
                <p className="text-muted mb-4">
                  Aún no te has inscrito en ningún evento. 
                  ¡Explora nuestro catálogo y encuentra tu próxima aventura!
                </p>
                <Button href="/eventos" variant="primary" size="lg">
                  Explorar Eventos
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <>
          {/* Inscripciones Próximas */}
          {upcomingRegistrations.length > 0 && (
            <Row className="mb-5">
              <Col>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white border-0">
                    <h5 className="mb-0 text-success">
                      📅 Próximas Inscripciones ({upcomingRegistrations.length})
                    </h5>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <Table responsive hover className="mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th>Evento</th>
                          <th>Fecha</th>
                          <th>Categoría</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {upcomingRegistrations.map((registration) => (
                          <tr key={registration.inscripcion_id}>
                            <td>
                              <div className="fw-semibold">
                                {registration.evento?.nombre}
                              </div>
                              <small className="text-muted">
                                {registration.evento?.ubicacion}
                              </small>
                            </td>
                            <td>
                              {formatDate(registration.evento?.fecha)}
                            </td>
                            <td>
                              <Badge bg="outline-primary">
                                {registration.categoria?.nombre || 'General'}
                              </Badge>
                            </td>
                            <td>
                              <Badge bg={getStatusVariant(registration.estado)}>
                                {registration.estado}
                              </Badge>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => handleViewDetails(registration)}
                                >
                                  Ver
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleCancelRegistration(registration.inscripcion_id)}
                                >
                                  Cancelar
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Historial de Inscripciones */}
          {pastRegistrations.length > 0 && (
            <Row>
              <Col>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white border-0">
                    <h5 className="mb-0 text-muted">
                      📋 Historial ({pastRegistrations.length})
                    </h5>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <Table responsive hover className="mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th>Evento</th>
                          <th>Fecha</th>
                          <th>Categoría</th>
                          <th>Estado</th>
                          <th>Resultado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pastRegistrations.map((registration) => (
                          <tr key={registration.inscripcion_id}>
                            <td>
                              <div className="fw-semibold">
                                {registration.evento?.nombre}
                              </div>
                            </td>
                            <td>
                              {formatDate(registration.evento?.fecha)}
                            </td>
                            <td>
                              <Badge bg="outline-secondary">
                                {registration.categoria?.nombre || 'General'}
                              </Badge>
                            </td>
                            <td>
                              <Badge bg={getStatusVariant(registration.estado)}>
                                {registration.estado}
                              </Badge>
                            </td>
                            <td>
                              {registration.resultado ? (
                                <div>
                                  <small>
                                    <strong>Pos:</strong> {registration.resultado.posicion}°
                                  </small>
                                  <br />
                                  <small>
                                    <strong>Tiempo:</strong> {registration.resultado.tiempo}
                                  </small>
                                </div>
                              ) : (
                                <span className="text-muted">N/A</span>
                              )}
                            </td>
                            <td>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleViewDetails(registration)}
                              >
                                Ver
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
          )}
        </>
      )}

      {/* Modal de Detalles */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalles de Inscripción</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRegistration && (
            <Row>
              <Col md={6}>
                <h6>Información del Evento</h6>
                <p><strong>Nombre:</strong> {selectedRegistration.evento?.nombre}</p>
                <p><strong>Fecha:</strong> {formatDate(selectedRegistration.evento?.fecha)}</p>
                <p><strong>Ubicación:</strong> {selectedRegistration.evento?.ubicacion}</p>
                <p><strong>Distancia:</strong> {selectedRegistration.evento?.distancia_km} km</p>
                
                <h6 className="mt-4">Información de Inscripción</h6>
                <p><strong>Categoría:</strong> {selectedRegistration.categoria?.nombre || 'General'}</p>
                <p><strong>Talla Playera:</strong> {selectedRegistration.talla_playera?.nombre || 'N/A'}</p>
                {selectedRegistration.numero_pechera && (
                  <p><strong>Número Pechera:</strong> {selectedRegistration.numero_pechera}</p>
                )}
              </Col>
              <Col md={6}>
                <h6>Estado y Pago</h6>
                <Badge bg={getStatusVariant(selectedRegistration.estado)} className="fs-6">
                  {selectedRegistration.estado}
                </Badge>
                
                {selectedRegistration.fecha_inscripcion && (
                  <>
                    <h6 className="mt-4">Fecha de Inscripción</h6>
                    <p>{formatDate(selectedRegistration.fecha_inscripcion)}</p>
                  </>
                )}
                
                {selectedRegistration.metodo_pago && (
                  <>
                    <h6 className="mt-4">Información de Pago</h6>
                    <p><strong>Método:</strong> {selectedRegistration.metodo_pago}</p>
                    <p><strong>Monto:</strong> €{selectedRegistration.evento?.cuota_inscripcion || 0}</p>
                  </>
                )}
                
                {selectedRegistration.resultado && (
                  <>
                    <h6 className="mt-4">Resultado</h6>
                    <p><strong>Posición:</strong> {selectedRegistration.resultado.posicion}°</p>
                    <p><strong>Tiempo:</strong> {selectedRegistration.resultado.tiempo}</p>
                    <p><strong>Velocidad Promedio:</strong> {selectedRegistration.resultado.velocidad_promedio} km/h</p>
                  </>
                )}
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Cerrar
          </Button>
          {selectedRegistration?.estado?.toLowerCase() === 'confirmada' && (
            <Button 
              variant="danger" 
              onClick={() => handleCancelRegistration(selectedRegistration.inscripcion_id)}
            >
              Cancelar Inscripción
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MyRegistrationsPage;