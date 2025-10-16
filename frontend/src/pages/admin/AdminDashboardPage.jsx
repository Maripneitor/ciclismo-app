import React from 'react';
import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  const stats = {
    totalUsers: 1247,
    totalEvents: 89,
    activeEvents: 15,
    totalRevenue: 12450
  };

  const recentUsers = [
    { id: 1, nombre: 'Ana García', email: 'ana@email.com', fechaRegistro: '2024-01-15', role: 'usuario' },
    { id: 2, nombre: 'Carlos López', email: 'carlos@email.com', fechaRegistro: '2024-01-14', role: 'organizador' },
    { id: 3, nombre: 'María Rodríguez', email: 'maria@email.com', fechaRegistro: '2024-01-14', role: 'usuario' },
  ];

  const recentEvents = [
    { id: 1, nombre: 'Gran Fondo Sierra Nevada', fecha: '2024-01-20', inscritos: 45, estado: 'activo' },
    { id: 2, nombre: 'Carrera Nocturna Madrid', fecha: '2024-01-18', inscritos: 28, estado: 'activo' },
  ];

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>Dashboard de Administración</h2>
          <p className="text-muted">Resumen general de la plataforma</p>
        </Col>
      </Row>

      {/* Estadísticas */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-primary">{stats.totalUsers}</h3>
              <p className="text-muted mb-0">Usuarios Totales</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-success">{stats.totalEvents}</h3>
              <p className="text-muted mb-0">Eventos Totales</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-warning">{stats.activeEvents}</h3>
              <p className="text-muted mb-0">Eventos Activos</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-info">€{stats.totalRevenue}</h3>
              <p className="text-muted mb-0">Ingresos Totales</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Usuarios Recientes</h5>
              <Button as={Link} to="/admin/usuarios" variant="outline-primary" size="sm">
                Ver Todos
              </Button>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Fecha</th>
                    <th>Rol</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.nombre}</td>
                      <td>{user.email}</td>
                      <td>{user.fechaRegistro}</td>
                      <td>
                        <span className={`badge ${
                          user.role === 'admin' ? 'bg-danger' :
                          user.role === 'organizador' ? 'bg-warning' : 'bg-secondary'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Eventos Recientes</h5>
              <Button as={Link} to="/admin/eventos" variant="outline-primary" size="sm">
                Ver Todos
              </Button>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Evento</th>
                    <th>Fecha</th>
                    <th>Inscritos</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEvents.map((event) => (
                    <tr key={event.id}>
                      <td>{event.nombre}</td>
                      <td>{event.fecha}</td>
                      <td>{event.inscritos}</td>
                      <td>
                        <span className={`badge ${
                          event.estado === 'activo' ? 'bg-success' : 'bg-secondary'
                        }`}>
                          {event.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Acciones rápidas */}
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Acciones Rápidas</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex gap-3 flex-wrap">
                <Button as={Link} to="/admin/eventos/nuevo" variant="primary">
                  Crear Nuevo Evento
                </Button>
                <Button as={Link} to="/admin/usuarios" variant="outline-primary">
                  Gestionar Usuarios
                </Button>
                <Button variant="outline-success">
                  Generar Reporte
                </Button>
                <Button variant="outline-warning">
                  Configuración del Sistema
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