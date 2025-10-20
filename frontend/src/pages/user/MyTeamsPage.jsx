// src/pages/user/MyTeamsPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form, Alert } from 'react-bootstrap';
import { teamsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const MyTeamsPage = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
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
      // Datos de ejemplo para desarrollo
      setTeams([
        {
          equipo_id: 1,
          nombre: 'Ciclistas Madrid',
          capitan_nombre: 'Juan Pérez',
          fecha_creacion: '2024-01-01T10:00:00',
          miembros_count: 5,
          enlace_invitacion: 'ABC123'
        },
        {
          equipo_id: 2,
          nombre: 'Mountain Riders',
          capitan_nombre: 'Ana García',
          fecha_creacion: '2024-01-05T14:30:00',
          miembros_count: 3,
          enlace_invitacion: 'DEF456'
        }
      ]);
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
      setError('Error creando el equipo');
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
      setError('Error uniéndote al equipo. Verifica el código.');
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
                Unirse a Equipo
              </Button>
              <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                Crear Equipo
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">👥 Mis Equipos</h5>
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
                      <th>Fecha Creación</th>
                      <th>Enlace Invitación</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((team) => (
                      <tr key={team.equipo_id}>
                        <td>
                          <strong>{team.nombre}</strong>
                          {team.descripcion && (
                            <div>
                              <small className="text-muted">{team.descripcion}</small>
                            </div>
                          )}
                        </td>
                        <td>{team.capitan_nombre}</td>
                        <td>
                          <Badge bg="info">{team.miembros_count} miembros</Badge>
                        </td>
                        <td>{formatDate(team.fecha_creacion)}</td>
                        <td>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => copyInviteLink(team.enlace_invitacion)}
                          >
                            Copiar Enlace
                          </Button>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button variant="outline-primary" size="sm">
                              Ver Detalles
                            </Button>
                            <Button variant="outline-danger" size="sm">
                              Abandonar
                            </Button>
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
                placeholder="Ej: Ciclistas Madrid"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={createForm.descripcion}
                onChange={(e) => setCreateForm({...createForm, descripcion: e.target.value})}
                placeholder="Describe tu equipo..."
              />
            </Form.Group>
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
                placeholder="Pega el código de invitación"
              />
              <Form.Text className="text-muted">
                Pídele el código de invitación al capitán del equipo.
              </Form.Text>
            </Form.Group>
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
    </Container>
  );
};

export default MyTeamsPage;