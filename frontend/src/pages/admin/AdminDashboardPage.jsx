import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Table, Badge, 
  Spinner, Alert, Button 
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { queriesAPI, usersAPI, eventsAPI } from '../../../services/api';
import { 
  formatDate, 
  formatDateTime, 
  formatNumber,
  calculateProgress 
} from '../../../utils/formatting';
import { 
  getStatusVariant, 
  getUserRoleVariant,
  getStatusText 
} from '../../../utils/uiHelpers';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Cargar estadísticas
      const statsData = await queriesAPI.getStats();
      setStats(statsData);

      // Cargar usuarios recientes
      const usersData = await usersAPI.getAll();
      setRecentUsers(usersData.slice(0, 5));

      // Cargar eventos recientes
      const eventsData = await eventsAPI.getAll();
      setRecentEvents(eventsData.slice(0, 5));

    } catch (error) {
      console.error('Error cargando dashboard:', error);
      setError('Error cargando los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Usar utilidades importadas
  const formatStatsNumber = (num) => formatNumber(num || 0);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h3 fw-bold">Dashboard de Administración</h1>
          <p className="text-muted">
            Resumen general del sistema y estadísticas
          </p>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Estadísticas */}
      <Row className="g-3 mb-4">
        <Col xs={6} md={3}>
          <Card className="border-0 bg-primary text-white">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="fw-bold">{formatStatsNumber(stats?.total_usuarios)}</h4>
                  <p className="mb-0">Usuarios</p>
                </div>
                <div className="display-6">👥</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xs={6} md={3}>
          <Card className="border-0 bg-success text-white">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="fw-bold">{formatStatsNumber(stats?.total_eventos)}</h4>
                  <p className="mb-0">Eventos</p>
                </div>
                <div className="display-6">📅</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xs={6} md={3}>
          <Card className="border-0 bg-warning text-dark">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="fw-bold">{formatStatsNumber(stats?.total_inscripciones)}</h4>
                  <p className="mb-0">Inscripciones</p>
                </div>
                <div className="display-6">📝</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xs={6} md={3}>
          <Card className="border-0 bg-info text-white">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="fw-bold">{formatStatsNumber(stats?.total_organizadores)}</h4>
                  <p className="mb-0">Organizadores</p>
                </div>
                <div className="display-6">🎯</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Usuarios Recientes */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">👥 Usuarios Recientes</h5>
              <Button as={Link} to="/admin/usuarios" variant="outline-primary" size="sm">
                Ver Todos
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              <Table hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Usuario</th>
                    <th>Rol</th>
                    <th>Registro</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map(user => (
                    <tr key={user.usuario_id}>
                      <td>
                        <div>
                          <strong>{user.nombre_completo}</strong>
                          <br />
                          <small className="text-muted">{user.email}</small>
                        </div>
                      </td>
                      <td>
                        <Badge bg={getUserRoleVariant(user.rol)}>
                          {user.rol}
                        </Badge>
                      </td>
                      <td>
                        <small>
                          {formatDate(user.fecha_creacion)}
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Eventos Recientes */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">📅 Eventos Recientes</h5>
              <Button as={Link} to="/admin/eventos" variant="outline-primary" size="sm">
                Ver Todos
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              <Table hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Evento</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEvents.map(event => (
                    <tr key={event.evento_id}>
                      <td>
                        <div>
                          <strong>{event.nombre}</strong>
                          <br />
                          <small className="text-muted">{event.ubicacion}</small>
                        </div>
                      </td>
                      <td>
                        <Badge bg={getStatusVariant(event.estado)}>
                          {getStatusText(event.estado)}
                        </Badge>
                      </td>
                      <td>
                        <small>
                          {formatDate(event.fecha)}
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Acciones Rápidas */}
      <Row className="mt-4">
        <Col>
          <Card className="border-0 bg-light">
            <Card.Body>
              <h5 className="mb-3">🚀 Acciones Rápidas</h5>
              <div className="d-flex gap-2 flex-wrap">
                <Button as={Link} to="/admin/usuarios/nuevo" variant="primary">
                  ➕ Crear Usuario
                </Button>
                <Button as={Link} to="/admin/eventos/nuevo" variant="success">
                  📅 Crear Evento
                </Button>
                <Button as={Link} to="/admin/configuracion" variant="outline-secondary">
                  ⚙️ Configuración
                </Button>
                <Button onClick={loadDashboardData} variant="outline-primary">
                  🔄 Actualizar
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