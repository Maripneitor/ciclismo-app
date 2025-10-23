// frontend/src/pages/MyTeamsPage.jsx - CONECTADO A API
import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Button, Spinner, Alert,
  Badge, Modal, Form, ListGroup
} from 'react-bootstrap';
import { teamsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyTeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);

  const [newTeam, setNewTeam] = useState({
    nombre: '',
    descripcion: '',
    tipo: 'recreativo'
  });

  const [joinData, setJoinData] = useState({
    codigo_invitacion: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadMyTeams();
    }
  }, [isAuthenticated]);

  const loadMyTeams = async () => {
    try {
      setLoading(true);
      setError('');
      
      const teamsData = await teamsAPI.getMyTeams();
      setTeams(teamsData);
    } catch (error) {
      console.error('Error loading teams:', error);
      setError('Error cargando tus equipos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    
    try {
      setCreating(true);
      
      const createdTeam = await teamsAPI.create(newTeam);
      setTeams(prev => [createdTeam, ...prev]);
      setShowCreateModal(false);
      setNewTeam({ nombre: '', descripcion: '', tipo: 'recreativo' });
      
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Error creando equipo: ' + error.message);
    } finally {
      setCreating(false);
    }
  };

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    
    try {
      setJoining(true);
      
      const result = await teamsAPI.join(joinData);
      await loadMyTeams(); // Recargar equipos
      setShowJoinModal(false);
      setJoinData({ codigo_invitacion: '' });
      
      alert(result.message || 'Te has unido al equipo exitosamente');
      
    } catch (error) {
      console.error('Error joining team:', error);
      alert('Error uniéndote al equipo: ' + error.message);
    } finally {
      setJoining(false);
    }
  };

  const handleLeaveTeam = async (teamId) => {
    if (!window.confirm('¿Estás seguro de que quieres abandonar este equipo?')) {
      return;
    }

    try {
      await teamsAPI.leave(teamId);
      setTeams(prev => prev.filter(team => team.equipo_id !== teamId));
    } catch (error) {
      console.error('Error leaving team:', error);
      alert('Error abandonando equipo: ' + error.message);
    }
  };

  const getTeamTypeVariant = (type) => {
    switch (type?.toLowerCase()) {
      case 'competitivo': return 'danger';
      case 'recreativo': return 'success';
      case 'mixto': return 'warning';
      default: return 'secondary';
    }
  };

  if (!isAuthenticated) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <h4>Acceso Requerido</h4>
          <p>Debes iniciar sesión para gestionar tus equipos.</p>
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
          <p className="mt-3">Cargando tus equipos...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="display-5 fw-bold">
                Mis <span className="text-primary">Equipos</span>
              </h1>
              <p className="text-muted">
                Gestiona tus equipos y participa en eventos grupales
              </p>
            </div>
            <div className="d-flex gap-3">
              <Button 
                variant="outline-primary"
                onClick={() => setShowJoinModal(true)}
              >
                Unirse a Equipo
              </Button>
              <Button 
                variant="primary"
                onClick={() => setShowCreateModal(true)}
              >
                Crear Equipo
              </Button>
            </div>
          </div>
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

      {teams.length === 0 ? (
        <Row>
          <Col>
            <Card className="border-0 shadow-sm text-center py-5">
              <Card.Body>
                <div className="display-1 text-muted mb-3">👥</div>
                <h4 className="text-muted mb-3">No tienes equipos</h4>
                <p className="text-muted mb-4">
                  Únete a un equipo existente o crea uno nuevo para participar en eventos grupales.
                </p>
                <div className="d-flex gap-3 justify-content-center">
                  <Button 
                    variant="outline-primary"
                    onClick={() => setShowJoinModal(true)}
                  >
                    Unirse a Equipo
                  </Button>
                  <Button 
                    variant="primary"
                    onClick={() => setShowCreateModal(true)}
                  >
                    Crear Equipo
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row className="g-4">
          {teams.map((team) => (
            <Col key={team.equipo_id || team.id} xs={12} md={6} lg={4}>
              <TeamCard 
                team={team}
                onLeaveTeam={handleLeaveTeam}
                getTeamTypeVariant={getTeamTypeVariant}
              />
            </Col>
          ))}
        </Row>
      )}

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
                value={newTeam.nombre}
                onChange={(e) => setNewTeam({...newTeam, nombre: e.target.value})}
                placeholder="Ej: Los Ciclistas Veloces"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newTeam.descripcion}
                onChange={(e) => setNewTeam({...newTeam, descripcion: e.target.value})}
                placeholder="Describe los objetivos y características de tu equipo..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tipo de Equipo</Form.Label>
              <Form.Select
                value={newTeam.tipo}
                onChange={(e) => setNewTeam({...newTeam, tipo: e.target.value})}
              >
                <option value="recreativo">Recreativo</option>
                <option value="competitivo">Competitivo</option>
                <option value="mixto">Mixto</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => setShowCreateModal(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={creating}
            >
              {creating ? <Spinner size="sm" /> : 'Crear Equipo'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal Unirse a Equipo */}
      <Modal show={showJoinModal} onHide={() => setShowJoinModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Unirse a Equipo</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleJoinTeam}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Código de Invitación *</Form.Label>
              <Form.Control
                type="text"
                value={joinData.codigo_invitacion}
                onChange={(e) => setJoinData({codigo_invitacion: e.target.value})}
                placeholder="Ingresa el código de invitación"
                required
              />
              <Form.Text className="text-muted">
                Solicita el código de invitación al líder del equipo.
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => setShowJoinModal(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={joining}
            >
              {joining ? <Spinner size="sm" /> : 'Unirse al Equipo'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

const TeamCard = ({ team, onLeaveTeam, getTeamTypeVariant }) => {
  const [showMembers, setShowMembers] = useState(false);

  return (
    <Card className="border-0 shadow-sm h-100">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <Card.Title className="h5 fw-bold mb-1">
              {team.nombre}
            </Card.Title>
            <Badge bg={getTeamTypeVariant(team.tipo)}>
              {team.tipo}
            </Badge>
          </div>
          <div className="text-end">
            <div className="h6 text-primary mb-1">
              {team.cantidad_miembros || team.miembros?.length || 0}
            </div>
            <small className="text-muted">miembros</small>
          </div>
        </div>

        <Card.Text className="text-muted flex-grow-1">
          {team.descripcion || 'Sin descripción disponible.'}
        </Card.Text>

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <small className="text-muted">
              Líder: {team.lider?.nombre || 'N/A'}
            </small>
            <small className="text-muted">
              Eventos: {team.total_eventos || 0}
            </small>
          </div>

          <div className="d-grid gap-2">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => setShowMembers(true)}
            >
              Ver Miembros
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => onLeaveTeam(team.equipo_id || team.id)}
            >
              Abandonar Equipo
            </Button>
          </div>
        </div>
      </Card.Body>

      {/* Modal de Miembros */}
      <Modal show={showMembers} onHide={() => setShowMembers(false)} size="sm">
        <Modal.Header closeButton>
          <Modal.Title>Miembros del Equipo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup variant="flush">
            {team.miembros && team.miembros.length > 0 ? (
              team.miembros.map((miembro, index) => (
                <ListGroup.Item key={index} className="px-0">
                  <div className="d-flex align-items-center">
                    <div className="avatar-sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3">
                      {miembro.nombre?.charAt(0) || 'M'}
                    </div>
                    <div>
                      <div className="fw-semibold">{miembro.nombre}</div>
                      <small className="text-muted">{miembro.rol}</small>
                    </div>
                  </div>
                </ListGroup.Item>
              ))
            ) : (
              <p className="text-muted text-center">No hay miembros</p>
            )}
          </ListGroup>
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default MyTeamsPage;