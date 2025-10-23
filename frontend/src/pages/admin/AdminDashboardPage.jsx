// frontend/src/pages/AdminDashboardPage.jsx - CONECTADO A API
import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Table, Spinner, Alert,
  Badge, ProgressBar, Button
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { queriesAPI, eventsAPI, usersAPI } from '../../services/api';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const [statsData, eventsData, usersData] = await Promise.all([
        queriesAPI.getStats(),
        eventsAPI.getAll(),
        usersAPI.getAll()
      ]);

      setStats(statsData);
      
      // Ordenar eventos por fecha más reciente
      const sortedEvents = eventsData
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 5);
      setRecentEvents(sortedEvents);

      // Ordenar usuarios por fecha de registro (asumiendo que existe)
      const sortedUsers = usersData
        .sort((a, b) => new Date(b.fecha_registro || 0) - new Date(a.fecha_registro || 0))
        .slice(0, 5);
      setRecentUsers(sortedUsers);

    } catch (error) {
      console.error('Error loading admin dashboard:', error);
      setError('Error cargando datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'activo': return 'success';
      case 'próximo': return 'warning';
      case 'en curso': return 'primary';
      case 'finalizado': return 'secondary';
      case 'pendiente': return 'warning';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3">Cargando panel de administración...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="display-5 fw-bold">
            Panel de <span className="text-primary">Administración</span>
          </h1>
          <p className="text-muted">
            Resumen general y métricas de la plataforma
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

      {/* Stats Cards */}
      {stats && (
        <Row className="g-4 mb-5">
          <Col md={3} sm={6}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title text-muted mb-2">Total Usuarios</h6>
                    <h3 className="text-primary fw-bold mb-0">
                      {stats.total_usuarios || 0}
                    </h3>
                  </div>
                  <div className="avatar-sm bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center">
                    <span className="text-primary fs-4">👥</span>
                  </div>
                </div>
                <div className="mt-3">
                  <small className="text-success">
                    <i className="bi bi-arrow-up"></i> +12% este mes
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} sm={6}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title text-muted mb-2">Total Eventos</h6>
                    <h3 className="text-success fw-bold mb-0">
                      {stats.total_eventos || 0}
                    </h3>
                  </div>
                  <div className="avatar-sm bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center">
                    <span className="text-success fs-4">📅</span>
                  </div>
                </div>
                <div className="mt-3">
                  <small className="text-success">
                    <i className="bi bi-arrow-up"></i> +8% este mes
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} sm={6}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title text-muted mb-2">Inscripciones</h6>
                    <h3 className="text-warning fw-bold mb-0">
                      {stats.total_inscripciones || 0}
                    </h3>
                  </div>
                  <div className="avatar-sm bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center">
                    <span className="text-warning fs-4">🎯</span>
                  </div>
                </div>
                <div className="mt-3">
                  <small className="text-success">
                    <i className="bi bi-arrow-up"></i> +15% este mes
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} sm={6}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title text-muted mb-2">Ingresos</h6>
                    <h3 className="text-info fw-bold mb-0">
                      €{((stats.total_inscripciones || 0) * 25).toLocaleString()}
                    </h3>
                  </div>
                  <div className="avatar-sm bg-info bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center">
                    <span className="text-info fs-4">💰</span>
                  </div>
                </div>
                <div className="mt-3">
                  <small className="text-success">
                    <i className="bi bi-arrow-up"></i> +18% este mes
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Row className="g-4">
        {/* Eventos Recientes */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">📅 Eventos Recientes</h5>
              <Button as={Link} to="/admin/eventos" variant="outline-primary" size="sm">
                Ver Todos
              </Button>
            </Card.Header>
            <Card.Body>
              {recentEvents.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted">No hay eventos recientes</p>
                </div>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Evento</th>
                      <th>Fecha</th>
                      <th>Inscritos</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEvents.map((event) => (
                      <tr key={event.evento_id || event.id}>
                        <td>
                          <div className="fw-semibold">{event.nombre}</div>
                          <small className="text-muted">{event.ubicacion}</small>
                        </td>
                        <td>
                          {new Date(event.fecha).toLocaleDateString('es-ES')}
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className="fw-semibold me-2">
                              {event.participantes_inscritos || 0}/{event.cupo_maximo || 0}
                            </span>
                            <ProgressBar 
                              now={((event.participantes_inscritos || 0) / (event.cupo_maximo || 1)) * 100}
                              style={{ width: '60px', height: '6px' }}
                              variant={
                                ((event.participantes_inscritos || 0) / (event.cupo_maximo || 1)) * 100 >= 80 ? 
                                'success' : 'primary'
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <Badge bg={getStatusVariant(event.estado)}>
                            {event.estado}
                          </Badge>
                        </td>
                        <td>
                          <Button 
                            as={Link} 
                            to={`/evento/${event.evento_id || event.id}`}
                            variant="outline-primary" 
                            size="sm"
                          >
                            Ver
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Usuarios Recientes */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">👥 Usuarios Recientes</h5>
              <Button as={Link} to="/admin/usuarios" variant="outline-primary" size="sm">
                Ver Todos
              </Button>
            </Card.Header>
            <Card.Body>
              {recentUsers.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted">No hay usuarios recientes</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {recentUsers.map((user) => (
                    <div key={user.usuario_id || user.id} className="list-group-item px-0">
                      <div className="d-flex align-items-center">
                        <div className="avatar-sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3">
                          {user.nombre?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{user.nombre || 'Usuario Nuevo'}</h6>
                          <small className="text-muted">{user.email}</small>
                        </div>
                        <Badge bg="outline-secondary" className="small">
                          Nuevo
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-sm mt-4">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">⚡ Acciones Rápidas</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button as={Link} to="/admin/eventos/nuevo" variant="primary">
                  Crear Nuevo Evento
                </Button>
                <Button as={Link} to="/admin/usuarios" variant="outline-primary">
                  Gestionar Usuarios
                </Button>
                <Button as={Link} to="/queries" variant="outline-secondary">
                  Ver Estadísticas
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboardPage;