// frontend/src/pages/HistoryPage.jsx - CONECTADO A API
import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Table, Spinner, Alert,
  Badge, Button, Modal, Form
} from 'react-bootstrap';
import { registrationsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const HistoryPage = () => {
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
      
      // Adaptar datos si es necesario
      const adaptedRegistrations = registrationsData.map(reg => ({
        id: reg.inscripcion_id || reg.id,
        evento_id: reg.evento_id,
        evento_nombre: reg.evento?.nombre || reg.nombre_evento,
        evento_fecha: reg.evento?.fecha || reg.fecha_evento,
        estado: reg.estado || 'confirmada',
        fecha_inscripcion: reg.fecha_inscripcion,
        categoria: reg.categoria?.nombre || reg.categoria_nombre,
        talla_playera: reg.talla_playera?.nombre || reg.talla_nombre,
        numero_pechera: reg.numero_pechera,
        resultado: reg.resultado
      }));
      
      setRegistrations(adaptedRegistrations);
    } catch (error) {
      console.error('Error loading registrations:', error);
      setError('Error cargando historial de inscripciones');
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
        prev.filter(reg => reg.id !== registrationId)
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

  if (!isAuthenticated) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <h4>Acceso Requerido</h4>
          <p>Debes iniciar sesión para ver tu historial de inscripciones.</p>
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
          <p className="mt-3">Cargando historial...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="display-5 fw-bold">
            Mi <span className="text-primary">Historial</span>
          </h1>
          <p className="text-muted">
            Todas tus inscripciones y participaciones en eventos
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
        <Row>
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0">
                <h5 className="mb-0">
                  Mis Inscripciones ({registrations.length})
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
                      <th>Fecha Inscripción</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((registration) => (
                      <tr key={registration.id}>
                        <td>
                          <div className="fw-semibold">
                            {registration.evento_nombre}
                          </div>
                        </td>
                        <td>
                          {formatDate(registration.evento_fecha)}
                        </td>
                        <td>
                          <Badge bg="outline-primary">
                            {registration.categoria || 'General'}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={getStatusVariant(registration.estado)}>
                            {registration.estado}
                          </Badge>
                        </td>
                        <td>
                          {registration.fecha_inscripcion ? 
                            formatDate(registration.fecha_inscripcion) : 
                            'N/A'
                          }
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
                            {registration.estado?.toLowerCase() === 'confirmada' && (
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleCancelRegistration(registration.id)}
                              >
                                Cancelar
                              </Button>
                            )}
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
                <p><strong>Nombre:</strong> {selectedRegistration.evento_nombre}</p>
                <p><strong>Fecha:</strong> {formatDate(selectedRegistration.evento_fecha)}</p>
                
                <h6 className="mt-4">Información de Inscripción</h6>
                <p><strong>Categoría:</strong> {selectedRegistration.categoria || 'General'}</p>
                <p><strong>Talla Playera:</strong> {selectedRegistration.talla_playera || 'N/A'}</p>
                {selectedRegistration.numero_pechera && (
                  <p><strong>Número Pechera:</strong> {selectedRegistration.numero_pechera}</p>
                )}
              </Col>
              <Col md={6}>
                <h6>Estado</h6>
                <Badge bg={getStatusVariant(selectedRegistration.estado)} className="fs-6">
                  {selectedRegistration.estado}
                </Badge>
                
                {selectedRegistration.fecha_inscripcion && (
                  <>
                    <h6 className="mt-4">Fecha de Inscripción</h6>
                    <p>{formatDate(selectedRegistration.fecha_inscripcion)}</p>
                  </>
                )}
                
                {selectedRegistration.resultado && (
                  <>
                    <h6 className="mt-4">Resultado</h6>
                    <p><strong>Tiempo:</strong> {selectedRegistration.resultado.tiempo || 'N/A'}</p>
                    <p><strong>Posición:</strong> {selectedRegistration.resultado.posicion || 'N/A'}</p>
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
              onClick={() => handleCancelRegistration(selectedRegistration.id)}
            >
              Cancelar Inscripción
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default HistoryPage;