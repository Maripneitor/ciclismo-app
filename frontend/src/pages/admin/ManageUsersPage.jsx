import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { usersAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ManageUsersPage = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        nombre_completo: '',
        email: '',
        rol: 'usuario',
        telefono: '',
        puede_crear_equipo: false
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const usersData = await usersAPI.getAll();
            setUsers(usersData);
        } catch (error) {
            setError('Error cargando usuarios');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setFormData({
            nombre_completo: user.nombre_completo || '',
            email: user.email || '',
            rol: user.rol || 'usuario',
            telefono: user.telefono || '',
            puede_crear_equipo: user.puede_crear_equipo || false
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedUser) {
                await usersAPI.update(selectedUser.usuario_id, formData);
                setShowModal(false);
                loadUsers();
            }
        } catch (error) {
            setError('Error actualizando usuario');
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            try {
                await usersAPI.delete(userId);
                loadUsers();
            } catch (error) {
                setError('Error eliminando usuario');
            }
        }
    };

    const getRoleVariant = (rol) => {
        switch (rol) {
            case 'admin': return 'danger';
            case 'organizador': return 'warning';
            case 'usuario': return 'secondary';
            default: return 'secondary';
        }
    };

    if (loading) {
        return (
            <Container className="py-4 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando usuarios...</span>
                </Spinner>
                <p className="mt-2">Cargando usuarios...</p>
            </Container>
        );
    }

    return (
        <Container fluid>
            <Row className="mb-4">
                <Col>
                    <h2>Gestión de Usuarios</h2>
                    <p className="text-muted">Administra los usuarios de la plataforma</p>
                </Col>
            </Row>

            {error && <Alert variant="danger">{error}</Alert>}

            <Card>
                <Card.Header>
                    <h5 className="mb-0">Lista de Usuarios</h5>
                </Card.Header>
                <Card.Body>
                    <Table responsive striped hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Teléfono</th>
                                <th>Rol</th>
                                <th>Puede crear equipo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(userItem => (
                                <tr key={userItem.usuario_id}>
                                    <td>{userItem.usuario_id}</td>
                                    <td>
                                        <strong>{userItem.nombre_completo}</strong>
                                    </td>
                                    <td>{userItem.email}</td>
                                    <td>{userItem.telefono || 'No especificado'}</td>
                                    <td>
                                        <Badge bg={getRoleVariant(userItem.rol)}>
                                            {userItem.rol}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Badge bg={userItem.puede_crear_equipo ? 'success' : 'secondary'}>
                                            {userItem.puede_crear_equipo ? 'Sí' : 'No'}
                                        </Badge>
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => handleEdit(userItem)}
                                            >
                                                Editar
                                            </Button>
                                            {userItem.usuario_id !== user?.usuario_id && (
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(userItem.usuario_id)}
                                                >
                                                    Eliminar
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Modal de Edición */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Usuario</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre Completo</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.nombre_completo}
                                onChange={(e) => setFormData({...formData, nombre_completo: e.target.value})}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                                type="tel"
                                value={formData.telefono}
                                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Rol</Form.Label>
                            <Form.Select
                                value={formData.rol}
                                onChange={(e) => setFormData({...formData, rol: e.target.value})}
                            >
                                <option value="usuario">Usuario</option>
                                <option value="organizador">Organizador</option>
                                <option value="admin">Administrador</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Puede crear equipos"
                                checked={formData.puede_crear_equipo}
                                onChange={(e) => setFormData({...formData, puede_crear_equipo: e.target.checked})}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancelar
                        </Button>
                        <Button variant="primary" type="submit">
                            Guardar Cambios
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default ManageUsersPage;