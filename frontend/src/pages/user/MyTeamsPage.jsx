import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form, Alert, ListGroup } from 'react-bootstrap';
import { teamsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const MyTeamsPage = () => {
    const { user } = useAuth();
    const [teams, setTeams] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [showTeamDetails, setShowTeamDetails] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [createForm, setCreateForm] = useState({
        nombre: '',
        descripcion: ''
    });

    const [joinForm, setJoinForm] = useState({
        inviteCode: ''
    });

    useEffect(() => {
        loadTeams();
    }, []);

    const loadTeams = async () => {
        try {
            setLoading(true);
            const teamsData = await teamsAPI.getMyTeams();
            setTeams(teamsData);
        } catch (error) {
            console.error('Error cargando equipos:', error);
            setError('Error al cargar tus equipos');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        try {
            await teamsAPI.create(createForm);
            setSuccess('Equipo creado exitosamente');
            setShowCreateModal(false);
            setCreateForm({ nombre: '', descripcion: '' });
            loadTeams();
        } catch (error) {
            setError('Error creando el equipo: ' + error.message);
        }
    };

    const handleJoinTeam = async (e) => {
        e.preventDefault();
        try {
            await teamsAPI.join(joinForm.inviteCode);
            setSuccess('Te has unido al equipo exitosamente');
            setShowJoinModal(false);
            setJoinForm({ inviteCode: '' });
            loadTeams();
        } catch (error) {
            setError('Error uniéndote al equipo: ' + error.message);
        }
    };

    const handleViewTeam = (team) => {
        setSelectedTeam(team);
        setShowTeamDetails(true);
    };

    const handleLeaveTeam = async (teamId) => {
        if (window.confirm('¿Estás seguro de que quieres abandonar este equipo?')) {
            try {
                // En una implementación real, llamarías a teamsAPI.leave(teamId)
                setSuccess('Has abandonado el equipo exitosamente');
                loadTeams();
            } catch (error) {
                setError('Error abandonando el equipo');
            }
        }
    };

    const copyInviteLink = (inviteCode) => {
        const inviteLink = `${window.location.origin}/unirse-equipo/${inviteCode}`;
        navigator.clipboard.writeText(inviteLink);
        setSuccess('Enlace de invitación copiado al portapapeles');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES');
    };

    const getTeamRole = (team) => {
        return team.capitan_nombre === user?.nombre_completo ? 'Capitán' : 'Miembro';
    };

    const isCaptain = (team) => {
        return team.capitan_nombre === user?.nombre_completo;
    };

    const stats = {
        totalTeams: teams.length,
        captainOf: teams.filter(team => isCaptain(team)).length,
        totalMembers: teams.reduce((sum, team) => sum + (team.miembros_count || 0), 0),
        activeTeams: teams.filter(team => team.miembros_count > 0).length
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
                            <p className="mt-2 text-muted">Cargando tus equipos...</p>
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
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2>Mis Equipos</h2>
                            <p className="text-muted">Gestiona tus equipos de ciclismo</p>
                        </div>
                        <div className="d-flex gap-2">
                            <Button variant="outline-primary" onClick={() => setShowJoinModal(true)}>
                                🔗 Unirse a Equipo
                            </Button>
                            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                                ➕ Crear Equipo
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>

            {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
            {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

            {/* Estadísticas de Equipos */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="text-center">
                        <Card.Body>
                            <div className="text-primary fs-1">👥</div>
                            <h3 className="text-primary">{stats.totalTeams}</h3>
                            <p className="text-muted mb-0">Total Equipos</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center">
                        <Card.Body>
                            <div className="text-success fs-1">🎯</div>
                            <h3 className="text-success">{stats.captainOf}</h3>
                            <p className="text-muted mb-0">Como Capitán</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center">
                        <Card.Body>
                            <div className="text-warning fs-1">🚴</div>
                            <h3 className="text-warning">{stats.totalMembers}</h3>
                            <p className="text-muted mb-0">Total Miembros</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center">
                        <Card.Body>
                            <div className="text-info fs-1">✅</div>
                            <h3 className="text-info">{stats.activeTeams}</h3>
                            <p className="text-muted mb-0">Equipos Activos</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">👥 Mis Equipos</h5>
                            <Badge bg="primary" pill>
                                {teams.length} equipos
                            </Badge>
                        </Card.Header>
                        <Card.Body>
                            {teams.length === 0 ? (
                                <div className="text-center py-5">
                                    <div className="text-muted mb-3 fs-1">👥</div>
                                    <p className="text-muted">No perteneces a ningún equipo aún.</p>
                                    <div className="d-flex gap-2 justify-content-center">
                                        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                                            Crear Mi Primer Equipo
                                        </Button>
                                        <Button variant="outline-primary" onClick={() => setShowJoinModal(true)}>
                                            Unirse a un Equipo
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Table responsive striped hover>
                                    <thead>
                                        <tr>
                                            <th>Equipo</th>
                                            <th>Capitán</th>
                                            <th>Miembros</th>
                                            <th>Tu Rol</th>
                                            <th>Fecha Creación</th>
                                            <th>Invitaciones</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {teams.map((team) => (
                                            <tr key={team.equipo_id}>
                                                <td>
                                                    <div>
                                                        <strong>{team.nombre}</strong>
                                                        {team.descripcion && (
                                                            <div>
                                                                <small className="text-muted">
                                                                    {team.descripcion}
                                                                </small>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <span className="me-2">👑</span>
                                                        {team.capitan_nombre}
                                                    </div>
                                                </td>
                                                <td>
                                                    <Badge bg="info">{team.miembros_count} miembros</Badge>
                                                </td>
                                                <td>
                                                    <Badge bg={isCaptain(team) ? 'warning' : 'secondary'}>
                                                        {getTeamRole(team)}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    {formatDate(team.fecha_creacion)}
                                                </td>
                                                <td>
                                                    <Button
                                                        variant="outline-secondary"
                                                        size="sm"
                                                        onClick={() => copyInviteLink(team.enlace_invitacion)}
                                                        title="Copiar enlace de invitación"
                                                    >
                                                        📋 Copiar
                                                    </Button>
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            onClick={() => handleViewTeam(team)}
                                                        >
                                                            👁️ Ver
                                                        </Button>
                                                        {!isCaptain(team) && (
                                                            <Button
                                                                variant="outline-danger"
                                                                size="sm"
                                                                onClick={() => handleLeaveTeam(team.equipo_id)}
                                                            >
                                                                🚪 Abandonar
                                                            </Button>
                                                        )}
                                                        {isCaptain(team) && (
                                                            <Button
                                                                variant="outline-warning"
                                                                size="sm"
                                                                disabled
                                                                title="Funcionalidad próximamente"
                                                            >
                                                                ⚙️ Gestionar
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

            {/* Modal Crear Equipo */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Nuevo Equipo</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleCreateTeam}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre del Equipo *</Form.Label>
                            <Form.Control
                                type="text"
                                value={createForm.nombre}
                                onChange={(e) => setCreateForm({...createForm, nombre: e.target.value})}
                                required
                                placeholder="Ej: Ciclistas Madrid, Velocidad Extrem..."
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={createForm.descripcion}
                                onChange={(e) => setCreateForm({...createForm, descripcion: e.target.value})}
                                placeholder="Describe tu equipo, objetivos, nivel..."
                                maxLength={200}
                            />
                            <Form.Text className="text-muted">
                                {createForm.descripcion.length}/200 caracteres
                            </Form.Text>
                        </Form.Group>
                        <Alert variant="info">
                            <strong>💡 Consejo:</strong> Como capitán, podrás gestionar miembros, 
                            invitar ciclistas y representar al equipo en eventos.
                        </Alert>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                            Cancelar
                        </Button>
                        <Button variant="primary" type="submit">
                            Crear Equipo
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Modal Unirse a Equipo */}
            <Modal show={showJoinModal} onHide={() => setShowJoinModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Unirse a un Equipo</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleJoinTeam}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Código de Invitación *</Form.Label>
                            <Form.Control
                                type="text"
                                value={joinForm.inviteCode}
                                onChange={(e) => setJoinForm({inviteCode: e.target.value})}
                                required
                                placeholder="Pega el código de invitación (ej: ABC123)"
                                style={{ textTransform: 'uppercase' }}
                            />
                            <Form.Text className="text-muted">
                                Pídele el código de invitación al capitán del equipo.
                            </Form.Text>
                        </Form.Group>
                        <Alert variant="warning">
                            <strong>⚠️ Importante:</strong> Al unirte a un equipo, el capitán 
                            podrá gestionar tus inscripciones en eventos por equipo.
                        </Alert>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowJoinModal(false)}>
                            Cancelar
                        </Button>
                        <Button variant="primary" type="submit">
                            Unirse al Equipo
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Modal Detalles del Equipo */}
            <Modal show={showTeamDetails} onHide={() => setShowTeamDetails(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Detalles del Equipo: {selectedTeam?.nombre}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedTeam && (
                        <Row>
                            <Col md={6}>
                                <h6>Información del Equipo</h6>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <strong>Nombre:</strong> {selectedTeam.nombre}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Capitán:</strong> {selectedTeam.capitan_nombre}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Miembros:</strong> {selectedTeam.miembros_count}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Fecha creación:</strong> {formatDate(selectedTeam.fecha_creacion)}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>
                            <Col md={6}>
                                <h6>Descripción</h6>
                                <Card>
                                    <Card.Body>
                                        {selectedTeam.descripcion || (
                                            <p className="text-muted">No hay descripción disponible.</p>
                                        )}
                                    </Card.Body>
                                </Card>
                                <div className="mt-3">
                                    <h6>Enlace de Invitación</h6>
                                    <div className="d-flex gap-2">
                                        <Form.Control
                                            type="text"
                                            value={`${window.location.origin}/unirse-equipo/${selectedTeam.enlace_invitacion}`}
                                            readOnly
                                        />
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => copyInviteLink(selectedTeam.enlace_invitacion)}
                                        >
                                            📋
                                        </Button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowTeamDetails(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default MyTeamsPage;