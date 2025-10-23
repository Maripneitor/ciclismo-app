// frontend/src/pages/QueriesPage.jsx - CORREGIDO USO DE FETCH
import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Table, Spinner, Alert,
  Form, Button, Badge, ProgressBar, Tabs, Tab
} from 'react-bootstrap';
import { queriesAPI, eventsAPI, usersAPI } from '../../services/api';

const QueriesPage = () => {
  const [stats, setStats] = useState(null);
  const [usersStats, setUsersStats] = useState([]);
  const [eventsStats, setEventsStats] = useState([]);
  const [topOrganizers, setTopOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError('');

      // Usar servicios API en lugar de fetch directo
      const [statsData, usersStatsData, eventsStatsData, organizersData] = await Promise.all([
        queriesAPI.getStats(),
        queriesAPI.getUsersStats(),
        queriesAPI.getEventsStats(),
        queriesAPI.getTopOrganizers()
      ]);

      setStats(statsData);
      setUsersStats(usersStatsData);
      setEventsStats(eventsStatsData);
      setTopOrganizers(organizersData);

    } catch (error) {
      console.error('Error loading queries data:', error);
      setError('Error cargando datos estadísticos');
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'activo': return 'success';
      case 'inactivo': return 'secondary';
      case 'pendiente': return 'warning';
      case 'completado': return 'success';
      case 'cancelado': return 'danger';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3">Cargando estadísticas...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="display-5 fw-bold">
            Panel de <span className="text-primary">Estadísticas</span>
          </h1>
          <p className="text-muted">
            Métricas y análisis de la plataforma Maripneitor Cycling
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

      <Tabs
        activeKey={activeTab}
        onSelect={setActiveTab}
        className="mb-4"
        fill
      >
        <Tab eventKey="general" title="📊 General">
          <GeneralStatsTab 
            stats={stats}
            getStatusVariant={getStatusVariant}
          />
        </Tab>
        
        <Tab eventKey="users" title="👥 Usuarios">
          <UsersStatsTab 
            usersStats={usersStats}
            getStatusVariant={getStatusVariant}
          />
        </Tab>
        
        <Tab eventKey="events" title="📅 Eventos">
          <EventsStatsTab 
            eventsStats={eventsStats}
            getStatusVariant={getStatusVariant}
          />
        </Tab>
        
        <Tab eventKey="organizers" title="🏆 Organizadores">
          <OrganizersTab 
            topOrganizers={topOrganizers}
          />
        </Tab>
      </Tabs>
    </Container>
  );
};

const GeneralStatsTab = ({ stats, getStatusVariant }) => {
  if (!stats) return null;

  const statCards = [
    {
      title: 'Total Usuarios',
      value: stats.total_usuarios || 0,
      icon: '👥',
      color: 'primary',
      description: 'Usuarios registrados'
    },
    {
      title: 'Total Eventos',
      value: stats.total_eventos || 0,
      icon: '📅',
      color: 'success',
      description: 'Eventos creados'
    },
    {
      title: 'Inscripciones',
      value: stats.total_inscripciones || 0,
      icon: '🎯',
      color: 'warning',
      description: 'Inscripciones totales'
    },
    {
      title: 'Comunidades',
      value: stats.total_comunidades || 0,
      icon: '🌍',
      color: 'info',
      description: 'Comunidades activas'
    }
  ];

  return (
    <div>
      <Row className="g-4 mb-5">
        {statCards.map((stat, index) => (
          <Col key={index} xs={6} md={3}>
            <Card className="border-0 shadow-sm h-100 text-center">
              <Card.Body className="p-4">
                <div className={`text-${stat.color} display-6 mb-3`}>
                  {stat.icon}
                </div>
                <h3 className={`text-${stat.color} fw-bold`}>
                  {stat.value.toLocaleString()}
                </h3>
                <h6 className="card-title mb-2">{stat.title}</h6>
                <small className="text-muted">{stat.description}</small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        <Col md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">📈 Distribución de Eventos</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Próximos</span>
                  <span>{stats.eventos_proximos || 0}</span>
                </div>
                <ProgressBar 
                  variant="warning" 
                  now={((stats.eventos_proximos || 0) / (stats.total_eventos || 1)) * 100} 
                />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>En Curso</span>
                  <span>{stats.eventos_en_curso || 0}</span>
                </div>
                <ProgressBar 
                  variant="success" 
                  now={((stats.eventos_en_curso || 0) / (stats.total_eventos || 1)) * 100} 
                />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Finalizados</span>
                  <span>{stats.eventos_finalizados || 0}</span>
                </div>
                <ProgressBar 
                  variant="secondary" 
                  now={((stats.eventos_finalizados || 0) / (stats.total_eventos || 1)) * 100} 
                />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">🎯 Tasa de Participación</h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center py-4">
                <div className="display-4 text-primary fw-bold">
                  {Math.round(((stats.total_inscripciones || 0) / (stats.total_usuarios || 1)) * 100)}%
                </div>
                <p className="text-muted mb-0">
                  Usuarios activos que participan en eventos
                </p>
              </div>
              <div className="row text-center">
                <div className="col-6">
                  <div className="h5 text-success mb-1">
                    {stats.promedio_inscripciones_por_usuario || 0}
                  </div>
                  <small className="text-muted">Inscripciones por usuario</small>
                </div>
                <div className="col-6">
                  <div className="h5 text-warning mb-1">
                    {stats.promedio_participantes_por_evento || 0}
                  </div>
                  <small className="text-muted">Participantes por evento</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const UsersStatsTab = ({ usersStats, getStatusVariant }) => (
  <Card className="border-0 shadow-sm">
    <Card.Header className="bg-white border-0">
      <h5 className="mb-0">📊 Estadísticas de Usuarios</h5>
    </Card.Header>
    <Card.Body>
      {usersStats.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-muted">No hay datos de usuarios disponibles</p>
        </div>
      ) : (
        <Table responsive hover>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Eventos Inscritos</th>
              <th>Completados</th>
              <th>Equipos</th>
              <th>Estado</th>
              <th>Última Actividad</th>
            </tr>
          </thead>
          <tbody>
            {usersStats.map((user, index) => (
              <tr key={user.usuario_id || index}>
                <td>
                  <div className="d-flex align-items-center">
                    <div className="avatar-sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3">
                      {user.nombre?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="fw-semibold">{user.nombre || 'Usuario'}</div>
                      <small className="text-muted">{user.email}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <Badge bg="primary">{user.total_inscripciones || 0}</Badge>
                </td>
                <td>
                  <Badge bg="success">{user.eventos_completados || 0}</Badge>
                </td>
                <td>
                  <Badge bg="info">{user.equipos_pertenecientes || 0}</Badge>
                </td>
                <td>
                  <Badge bg={getStatusVariant(user.estado)}>
                    {user.estado || 'Activo'}
                  </Badge>
                </td>
                <td>
                  {user.ultima_actividad ? 
                    new Date(user.ultima_actividad).toLocaleDateString('es-ES') : 
                    'N/A'
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Card.Body>
  </Card>
);

const EventsStatsTab = ({ eventsStats, getStatusVariant }) => (
  <Card className="border-0 shadow-sm">
    <Card.Header className="bg-white border-0">
      <h5 className="mb-0">📈 Estadísticas de Eventos</h5>
    </Card.Header>
    <Card.Body>
      {eventsStats.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-muted">No hay datos de eventos disponibles</p>
        </div>
      ) : (
        <Table responsive hover>
          <thead>
            <tr>
              <th>Evento</th>
              <th>Tipo</th>
              <th>Inscritos</th>
              <th>Cupo</th>
              <th>Recaudación</th>
              <th>Estado</th>
              <th>Participación</th>
            </tr>
          </thead>
          <tbody>
            {eventsStats.map((event, index) => {
              const participationRate = ((event.participantes_inscritos || 0) / (event.cupo_maximo || 1)) * 100;
              
              return (
                <tr key={event.evento_id || index}>
                  <td className="fw-semibold">{event.nombre}</td>
                  <td>
                    <Badge bg="outline-primary">{event.tipo}</Badge>
                  </td>
                  <td>
                    <strong>{event.participantes_inscritos || 0}</strong>
                  </td>
                  <td>
                    <small className="text-muted">{event.cupo_maximo || 0}</small>
                  </td>
                  <td className="text-success fw-semibold">
                    €{((event.cuota_inscripcion || 0) * (event.participantes_inscritos || 0)).toLocaleString()}
                  </td>
                  <td>
                    <Badge bg={getStatusVariant(event.estado)}>
                      {event.estado}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1 me-3">
                        <ProgressBar 
                          now={participationRate} 
                          variant={
                            participationRate >= 90 ? 'success' :
                            participationRate >= 50 ? 'warning' : 'danger'
                          }
                          style={{ height: '6px' }}
                        />
                      </div>
                      <small className="text-muted">
                        {Math.round(participationRate)}%
                      </small>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </Card.Body>
  </Card>
);

const OrganizersTab = ({ topOrganizers }) => (
  <Row className="g-4">
    {topOrganizers.length === 0 ? (
      <Col>
        <div className="text-center py-5">
          <p className="text-muted">No hay datos de organizadores disponibles</p>
        </div>
      </Col>
    ) : (
      topOrganizers.map((organizer, index) => (
        <Col key={organizer.organizador_id || index} md={6} lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center p-4">
              <div className="avatar-lg bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3">
                <span className="h4 mb-0">{organizer.nombre?.charAt(0) || 'O'}</span>
              </div>
              
              <h5 className="card-title mb-1">{organizer.nombre}</h5>
              <p className="text-muted small mb-3">{organizer.email}</p>
              
              <div className="row text-center mb-3">
                <div className="col-4">
                  <div className="h5 text-primary mb-1">{organizer.total_eventos || 0}</div>
                  <small className="text-muted">Eventos</small>
                </div>
                <div className="col-4">
                  <div className="h5 text-success mb-1">{organizer.total_participantes || 0}</div>
                  <small className="text-muted">Participantes</small>
                </div>
                <div className="col-4">
                  <div className="h5 text-warning mb-1">{organizer.tasa_completacion || 0}%</div>
                  <small className="text-muted">Completación</small>
                </div>
              </div>
              
              <Badge bg={index < 3 ? 'warning' : 'secondary'} className="mb-2">
                #{index + 1} Organizador
              </Badge>
              
              <div className="mt-3">
                <small className="text-muted">
                  Miembro desde {organizer.fecha_registro ? 
                    new Date(organizer.fecha_registro).getFullYear() : 
                    'N/A'
                  }
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))
    )}
  </Row>
);

export default QueriesPage;