import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, ProgressBar, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { queriesAPI, usersAPI, eventsAPI } from '../../services/api';

const AdminDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentEvents, setRecentEvents] = useState([]);
    const [systemHealth, setSystemHealth] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            
            // Cargar datos en paralelo
            const [statsData, usersData, eventsData] = await Promise.all([
                queriesAPI.getStats(),
                usersAPI.getAll(),
                eventsAPI.getAll()
            ]);

            setStats(statsData);
            
            // Usuarios recientes (últimos 5)
            const sortedUsers = usersData
                .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))
                .slice(0, 5);
            setRecentUsers(sortedUsers);

            // Eventos recientes (próximos 5)
            const upcomingEvents = eventsData
                .filter(event => new Date(event.fecha) > new Date())
                .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
                .slice(0, 5);
            setRecentEvents(upcomingEvents);

            // Salud del sistema (simulada)
            setSystemHealth({
                database: { status: 'healthy', usage: '75%' },
                api: { status: 'healthy', responseTime: '120ms' },
                storage: { status: 'warning', usage: '85%' },
                users: { status: 'healthy', active: '89%' }
            });

        } catch (error) {
            console.error('Error loading admin dashboard:', error);
            setError('Error cargando datos del dashboard');
        } finally {
            setLoading(false);
        }
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'healthy': return 'success';
            case 'warning': return 'warning';
            case 'critical': return 'danger';
            default: return 'secondary';
        }
    };

    const getRoleVariant = (role) => {
        switch (role) {
            case 'admin': return 'danger';
            case 'organizador': return 'warning';
            case 'usuario': return 'secondary';
            default: return 'secondary';
        }
    };

    const getEventStatusVariant = (status) => {
        switch (status) {
            case 'Próximo': return 'warning';
            case 'En Curso': return 'success';
            case 'Finalizado': return 'secondary';
            default: return 'secondary';
        }
    };

    if (loading) {
        return (
            <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2 text-muted">Cargando dashboard de administración...</p>
                </div>
            </Container>
        );
    }

    return (
        <Container fluid>
            <Row className="mb-4">
                <Col>
                    <h2>Dashboard de Administración</h2>
                    <p className="text-muted">Resumen general y métricas de la plataforma</p>
                </Col>
            </Row>

            {error && <Alert variant="danger">{error}</Alert>}

            {/* Estadísticas Principales */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="text-center h-100">
                        <Card.Body>
                            <div className="text-primary mb-2 fs-1">👥</div>
                            <h3 className="text-primary">{stats?.total_usuarios || 0}</h3>
                            <p className="text-muted mb-0">Usuarios Totales</p>
                            <div className="mt-2">
                                <Badge bg="success" className="me-1">{stats?.total_admins || 0} Admin</Badge>
                                <Badge bg="warning" className="me-1">{stats?.total_organizadores || 0} Org</Badge>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center h-100">
                        <Card.Body>
                            <div className="text-success mb-2 fs-1">📅</div>
                            <h3 className="text-success">{stats?.total_eventos || 0}</h3>
                            <p className="text-muted mb-0">Eventos Totales</p>
                            <div className="mt-2">
                                <small className="text-muted">
                                    {recentEvents.filter(e => e.estado === 'Próximo').length} próximos
                                </small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center h-100">
                        <Card.Body>
                            <div className="text-warning mb-2 fs-1">📝</div>
                            <h3 className="text-warning">{stats?.total_inscripciones || 0}</h3>
                            <p className="text-muted mb-0">Inscripciones</p>
                            <div className="mt-2">
                                <ProgressBar 
                                    now={stats?.total_usuarios ? Math.min(100, (stats.total_inscripciones / stats.total_usuarios) * 100) : 0} 
                                    variant="warning" 
                                    style={{ height: '6px' }}
                                />
                                <small className="text-muted">
                                    {stats?.total_usuarios ? Math.round((stats.total_inscripciones / stats.total_usuarios) * 100) : 0}% participación
                                </small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center h-100">
                        <Card.Body>
                            <div className="text-info mb-2 fs-1">💰</div>
                            <h3 className="text-info">€{stats?.total_ingresos || '0'}</h3>
                            <p className="text-muted mb-0">Ingresos Totales</p>
                            <div className="mt-2">
                                <Badge bg="info">Promedio: €{stats?.promedio_ingresos || '0'}/evento</Badge>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Salud del Sistema */}
            <Row className="mb-4">
                <Col>
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">🖥️ Salud del Sistema</h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={3}>
                                    <div className="text-center">
                                        <div className={`fs-2 mb-2 ${systemHealth.database?.status === 'healthy' ? 'text-success' : 'text-warning'}`}>
                                            🗄️
                                        </div>
                                        <h6>Base de Datos</h6>
                                        <Badge bg={getStatusVariant(systemHealth.database?.status)}>
                                            {systemHealth.database?.status}
                                        </Badge>
                                        <div className="mt-2">
                                            <small className="text-muted">Uso: {systemHealth.database?.usage}</small>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="text-center">
                                        <div className={`fs-2 mb-2 ${systemHealth.api?.status === 'healthy' ? 'text-success' : 'text-warning'}`}>
                                            🔌
                                        </div>
                                        <h6>API</h6>
                                        <Badge bg={getStatusVariant(systemHealth.api?.status)}>
                                            {systemHealth.api?.status}
                                        </Badge>
                                        <div className="mt-2">
                                            <small className="text-muted">Tiempo: {systemHealth.api?.responseTime}</small>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="text-center">
                                        <div className={`fs-2 mb-2 ${systemHealth.storage?.status === 'healthy' ? 'text-success' : 'text-warning'}`}>
                                            💾
                                        </div>
                                        <h6>Almacenamiento</h6>
                                        <Badge bg={getStatusVariant(systemHealth.storage?.status)}>
                                            {systemHealth.storage?.status}
                                        </Badge>
                                        <div className="mt-2">
                                            <small className="text-muted">Uso: {systemHealth.storage?.usage}</small>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="text-center">
                                        <div className={`fs-2 mb-2 ${systemHealth.users?.status === 'healthy' ? 'text-success' : 'text-warning'}`}>
                                            👤
                                        </div>
                                        <h6>Usuarios Activos</h6>
                                        <Badge bg={getStatusVariant(systemHealth.users?.status)}>
                                            {systemHealth.users?.status}
                                        </Badge>
                                        <div className="mt-2">
                                            <small className="text-muted">{systemHealth.users?.active} activos</small>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="g-4">
                {/* Usuarios Recientes */}
                <Col lg={6}>
                    <Card className="h-100">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">👥 Usuarios Recientes</h5>
                            <Button as={Link} to="/admin/usuarios" variant="outline-primary" size="sm">
                                Ver Todos
                            </Button>
                        </Card.Header>
                        <Card.Body>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>Usuario</th>
                                        <th>Email</th>
                                        <th>Fecha</th>
                                        <th>Rol</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentUsers.map(user => (
                                        <tr key={user.usuario_id}>
                                            <td>
                                                <div>
                                                    <strong>{user.nombre_completo}</strong>
                                                </div>
                                            </td>
                                            <td>
                                                <small>{user.email}</small>
                                            </td>
                                            <td>
                                                <small>
                                                    {new Date(user.fecha_creacion).toLocaleDateString('es-ES')}
                                                </small>
                                            </td>
                                            <td>
                                                <Badge bg={getRoleVariant(user.rol)}>
                                                    {user.rol}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            {recentUsers.length === 0 && (
                                <div className="text-center py-3">
                                    <p className="text-muted">No hay usuarios registrados</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Próximos Eventos */}
                <Col lg={6}>
                    <Card className="h-100">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">📅 Próximos Eventos</h5>
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
                                        <th>Organizador</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentEvents.map(event => (
                                        <tr key={event.evento_id}>
                                            <td>
                                                <div>
                                                    <strong>{event.nombre}</strong>
                                                    <br />
                                                    <small className="text-muted">
                                                        {event.distancia_km || '0'} km • {event.tipo}
                                                    </small>
                                                </div>
                                            </td>
                                            <td>
                                                <small>
                                                    {new Date(event.fecha).toLocaleDateString('es-ES')}
                                                </small>
                                            </td>
                                            <td>
                                                <small>{event.organizador?.nombre_completo || 'N/A'}</small>
                                            </td>
                                            <td>
                                                <Badge bg={getEventStatusVariant(event.estado)}>
                                                    {event.estado}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            {recentEvents.length === 0 && (
                                <div className="text-center py-3">
                                    <p className="text-muted">No hay eventos próximos</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Acciones Rápidas Mejoradas */}
            <Row className="mt-4">
                <Col>
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">⚡ Acciones Rápidas</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-flex gap-3 flex-wrap">
                                <Button as={Link} to="/admin/eventos/nuevo" variant="primary" className="action-btn">
                                    🎪 Crear Evento
                                </Button>
                                <Button as={Link} to="/admin/usuarios" variant="outline-primary" className="action-btn">
                                    👥 Gestionar Usuarios
                                </Button>
                                <Button as={Link} to="/admin/consultas" variant="outline-success" className="action-btn">
                                    📊 Generar Reporte
                                </Button>
                                <Button as={Link} to="/admin/configuracion" variant="outline-warning" className="action-btn">
                                    ⚙️ Configuración
                                </Button>
                                <Button variant="outline-info" className="action-btn" onClick={loadDashboardData}>
                                    🔄 Actualizar Datos
                                </Button>
                                <Button variant="outline-dark" className="action-btn">
                                    📧 Enviar Notificación
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Métricas de Crecimiento */}
            <Row className="mt-4">
                <Col>
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">📈 Métricas de Crecimiento</h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={4}>
                                    <div className="text-center">
                                        <h6>Crecimiento de Usuarios</h6>
                                        <div className="display-4 text-success">+12%</div>
                                        <small className="text-muted">último mes</small>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="text-center">
                                        <h6>Eventos Activos</h6>
                                        <div className="display-4 text-primary">{recentEvents.length}</div>
                                        <small className="text-muted">próximos 30 días</small>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="text-center">
                                        <h6>Tasa de Retención</h6>
                                        <div className="display-4 text-warning">84%</div>
                                        <small className="text-muted">usuarios activos</small>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminDashboardPage;