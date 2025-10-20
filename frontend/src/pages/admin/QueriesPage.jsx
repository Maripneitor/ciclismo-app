import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const QueriesPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [eventStats, setEventStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/queries/stats');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError('Error cargando estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/queries/users-stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setUserStats(data);
    } catch (err) {
      setError('Error cargando estadísticas de usuarios');
    }
  };

  const fetchEventStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/queries/events-stats');
      const data = await response.json();
      setEventStats(data);
    } catch (err) {
      setError('Error cargando estadísticas de eventos');
    }
  };

  useEffect(() => {
    fetchStats();
    if (user?.role === 'admin') {
      fetchUserStats();
    }
    fetchEventStats();
  }, [user]);

  if (!user || user.role !== 'admin') {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <h4>Acceso Denegado</h4>
          <p>Solo los administradores pueden acceder a esta página.</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>Consultas y Estadísticas</h2>
          <p className="text-muted">Panel de consultas avanzadas de la base de datos</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Estadísticas Generales</h5>
              <Button onClick={fetchStats} disabled={loading}>
                {loading ? <Spinner size="sm" /> : 'Actualizar'}
              </Button>
            </Card.Header>
            <Card.Body>
              {stats ? (
                <Row>
                  <Col md={3} className="text-center">
                    <h3 className="text-primary">{stats.total_usuarios}</h3>
                    <p className="text-muted">Usuarios Totales</p>
                  </Col>
                  <Col md={3} className="text-center">
                    <h3 className="text-success">{stats.total_eventos}</h3>
                    <p className="text-muted">Eventos Totales</p>
                  </Col>
                  <Col md={3} className="text-center">
                    <h3 className="text-warning">{stats.total_inscripciones}</h3>
                    <p className="text-muted">Inscripciones</p>
                  </Col>
                  <Col md={3} className="text-center">
                    <h3 className="text-info">{stats.total_admins}</h3>
                    <p className="text-muted">Administradores</p>
                  </Col>
                </Row>
              ) : (
                <div className="text-center py-3">
                  <Spinner animation="border" />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Estadísticas de Usuarios</h5>
            </Card.Header>
            <Card.Body>
              {userStats ? (
                <Table striped size="sm">
                  <thead>
                    <tr>
                      <th>Rol</th>
                      <th>Cantidad</th>
                      <th>Último Registro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userStats.por_rol?.map((stat, index) => (
                      <tr key={index}>
                        <td>
                          <span className={`badge ${
                            stat.role === 'admin' ? 'bg-danger' :
                            stat.role === 'organizador' ? 'bg-warning' : 'bg-secondary'
                          }`}>
                            {stat.role}
                          </span>
                        </td>
                        <td>{stat.count}</td>
                        <td>{new Date(stat.ultimo_registro).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-3">
                  <Spinner animation="border" size="sm" />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Estadísticas de Eventos</h5>
            </Card.Header>
            <Card.Body>
              {eventStats ? (
                <Table striped size="sm">
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>Estado</th>
                      <th>Total</th>
                      <th>Dist. Prom.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventStats.estadisticas?.map((stat, index) => (
                      <tr key={index}>
                        <td>{stat.tipo}</td>
                        <td>
                          <span className={`badge ${
                            stat.estado === 'activo' ? 'bg-success' :
                            stat.estado === 'proximamente' ? 'bg-warning' : 'bg-secondary'
                          }`}>
                            {stat.estado}
                          </span>
                        </td>
                        <td>{stat.total}</td>
                        <td>{Math.round(stat.distancia_promedio)}km</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-3">
                  <Spinner animation="border" size="sm" />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Próximos Eventos</h5>
            </Card.Header>
            <Card.Body>
              {eventStats?.proximos_eventos ? (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Evento</th>
                      <th>Fecha</th>
                      <th>Ubicación</th>
                      <th>Tipo</th>
                      <th>Distancia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventStats.proximos_eventos.map((event) => (
                      <tr key={event.id}>
                        <td>{event.nombre}</td>
                        <td>{new Date(event.fecha).toLocaleDateString()}</td>
                        <td>{event.ubicacion}</td>
                        <td>{event.tipo}</td>
                        <td>{event.distancia}km</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-3">
                  <Spinner animation="border" />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default QueriesPage;