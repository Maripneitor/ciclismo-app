// src/pages/user/MyRegistrationsPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Alert } from 'react-bootstrap';
import { usersAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const MyRegistrationsPage = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    try {
      setLoading(true);
      const registrationsData = await usersAPI.getUserRegistrations();
      setRegistrations(registrationsData);
    } catch (error) {
      console.error('Error cargando inscripciones:', error);
      setError('Error al cargar tus inscripciones');
      // Datos de ejemplo para desarrollo
      setRegistrations([
        {
          inscripcion_id: 1,
          evento_nombre: 'Gran Fondo Sierra Nevada',
          fecha_inscripcion: '2024-01-15T10:30:00',
          estado: 'Confirmada',
          categoria_nombre: 'Élite',
          numero_dorsal: 123,
          equipo_nombre: 'Ciclistas Madrid'
        },
        {
          inscripcion_id: 2,
          evento_nombre: 'Carrera Nocturna Madrid',
          fecha_inscripcion: '2024-01-10T14:20:00',
          estado: 'Pendiente',
          categoria_nombre: 'Recreativo',
          numero_dorsal: 45,
          equipo_nombre: null
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Confirmada': return 'success';
      case 'Pendiente': return 'warning';
      case 'Cancelada': return 'danger';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container fluid>
        <Row>
          <Col>
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-2 text-muted">Cargando tus inscripciones...</p>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>Mis Inscripciones</h2>
          <p className="text-muted">Gestiona todas tus inscripciones a eventos</p>
        </Col>
      </Row>

      {error && (
        <Alert variant="warning">
          {error}
        </Alert>
      )}

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">📋 Lista de Inscripciones</h5>
            </Card.Header>
            <Card.Body>
              {registrations.length === 0 ? (
                <div className="text-center py-5">
                  <div className="text-muted mb-3 fs-1">📭</div>
                  <p className="text-muted">No tienes inscripciones activas.</p>
                  <Button variant="primary" href="/eventos">
                    Explorar Eventos
                  </Button>
                </div>
              ) : (
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Evento</th>
                      <th>Fecha Inscripción</th>
                      <th>Categoría</th>
                      <th>Número Dorsal</th>
                      <th>Equipo</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((registration) => (
                      <tr key={registration.inscripcion_id}>
                        <td>
                          <strong>{registration.evento_nombre}</strong>
                        </td>
                        <td>
                          <small>{formatDate(registration.fecha_inscripcion)}</small>
                        </td>
                        <td>
                          <Badge bg="outline-primary" text="dark">
                            {registration.categoria_nombre}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg="info">#{registration.numero_dorsal}</Badge>
                        </td>
                        <td>
                          {registration.equipo_nombre || 'Individual'}
                        </td>
                        <td>
                          <Badge bg={getStatusVariant(registration.estado)}>
                            {registration.estado}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button variant="outline-primary" size="sm">
                              Ver Detalles
                            </Button>
                            {registration.estado === 'Pendiente' && (
                              <Button variant="outline-danger" size="sm">
                                Cancelar
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Estadísticas rápidas */}
      <Row className="mt-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h4 className="text-primary">{registrations.length}</h4>
              <p className="text-muted mb-0">Total Inscripciones</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h4 className="text-success">
                {registrations.filter(r => r.estado === 'Confirmada').length}
              </h4>
              <p className="text-muted mb-0">Confirmadas</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h4 className="text-warning">
                {registrations.filter(r => r.estado === 'Pendiente').length}
              </h4>
              <p className="text-muted mb-0">Pendientes</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h4 className="text-info">
                {registrations.filter(r => r.equipo_nombre).length}
              </h4>
              <p className="text-muted mb-0">En Equipo</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MyRegistrationsPage;