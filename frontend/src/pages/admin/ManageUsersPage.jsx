// frontend/src/pages/admin/ManageUsersPage.jsx - CRUD COMPLETO
import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Table, Button, Spinner, Alert,
  Modal, Form, Badge, InputGroup
} from 'react-bootstrap';
import { usersAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await usersAPI.getAll();
      setUsers(usersData);
    } catch (error) {
      setError('Error al cargar usuarios: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      return;
    }

    // Prevenir auto-eliminación
    if (userId === currentUser.usuario_id) {
      setError('No puedes eliminar tu propia cuenta');
      return;
    }

    try {
      setDeleting(userId);
      await usersAPI.deleteUser(userId);
      setSuccess('Usuario eliminado exitosamente');
      await loadUsers();
    } catch (error) {
      setError('Error al eliminar usuario: ' + error.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData(e.target);
      const userData = {
        nombre_completo: formData.get('nombre_completo'),
        email: formData.get('email'),
        telefono: formData.get('telefono'),
        rol: formData.get('rol'),
        puede_crear_equipo: formData.get('puede_crear_equipo') === 'true'
      };

      await usersAPI.updateUser(editingUser.usuario_id, userData);
      setSuccess('Usuario actualizado exitosamente');
      setShowModal(false);
      await loadUsers();
    } catch (error) {
      setError('Error al actualizar usuario: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadge = (role) => {
    const variants = {
      admin: 'danger',
      organizador: 'warning',
      usuario: 'primary'
    };
    return <Badge bg={variants[role]}>{role}</Badge>;
  };

  const getProfileImageUrl = (user) => {
    const API_BASE_URL = import.meta.env.MODE === 'development' 
      ? 'http://localhost:5000' 
      : '';
    
    if (user.profileImageUrl) {
      return `${API_BASE_URL}${user.profileImageUrl}`;
    }
    return null;
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={12}>
          <div className="page-header mb-4">
            <h1 className="h2 mb-1">Gestión de Usuarios</h1>
            <p className="text-muted">Administra los usuarios del sistema</p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Lista de Usuarios</h5>
                <Badge bg="primary">{users.length} usuarios</Badge>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Usuario</th>
                    <th>Información</th>
                    <th>Rol</th>
                    <th>Fecha Registro</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.usuario_id}>
                      <td>
                        <div className="d-flex align-items-center">
                          {getProfileImageUrl(user) ? (
                            <img
                              src={getProfileImageUrl(user)}
                              alt="Perfil"
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                marginRight: '12px'
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: '#6c757d',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 'bold',
                                marginRight: '12px'
                              }}
                            >
                              {user.nombre_completo?.charAt(0) || 'U'}
                            </div>
                          )}
                          <div>
                            <div className="fw-semibold">{user.nombre_completo}</div>
                            <small className="text-muted">{user.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <small className="text-muted">Teléfono:</small>
                          <div>{user.telefono || 'No especificado'}</div>
                        </div>
                      </td>
                      <td>
                        {getRoleBadge(user.rol)}
                        {user.puede_crear_equipo && (
                          <Badge bg="success" className="ms-1">Equipos</Badge>
                        )}
                      </td>
                      <td>
                        {new Date(user.fecha_creacion).toLocaleDateString()}
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(user)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(user.usuario_id)}
                          disabled={deleting === user.usuario_id || user.usuario_id === currentUser.usuario_id}
                        >
                          {deleting === user.usuario_id ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            'Eliminar'
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de edición */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Editar Usuario: {editingUser?.nombre_completo}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre Completo</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre_completo"
                    defaultValue={editingUser?.nombre_completo}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    defaultValue={editingUser?.email}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="tel"
                    name="telefono"
                    defaultValue={editingUser?.telefono}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Rol</Form.Label>
                  <Form.Select name="rol" defaultValue={editingUser?.rol}>
                    <option value="usuario">Usuario</option>
                    <option value="organizador">Organizador</option>
                    <option value="admin">Administrador</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Puede Crear Equipos</Form.Label>
                  <Form.Select 
                    name="puede_crear_equipo" 
                    defaultValue={editingUser?.puede_crear_equipo?.toString()}
                  >
                    <option value="true">Sí</option>
                    <option value="false">No</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => setShowModal(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default ManageUsersPage;