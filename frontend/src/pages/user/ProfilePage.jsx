// frontend/src/pages/user/ProfilePage.jsx - ACTUALIZADO CON SUBIDA DE IMAGEN
import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Form, Button, Spinner, Alert,
  Tab, Tabs, Badge, ListGroup, Modal
} from 'react-bootstrap';
import { usersAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, updateUser, uploadProfilePicture, refreshUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const API_BASE_URL = import.meta.env.MODE === 'development' 
    ? 'http://localhost:5000' 
    : '';

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const userProfile = await usersAPI.getProfile();
      setProfile(userProfile);
    } catch (error) {
      setError('Error al cargar el perfil: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData(e.target);
      const personalData = {
        nombre_completo: formData.get('nombre_completo'),
        email: formData.get('email'),
        telefono: formData.get('telefono')
      };

      await updateUser(personalData);
      await refreshUserProfile();
      setSuccess('Perfil actualizado exitosamente');
    } catch (error) {
      setError('Error al actualizar perfil: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUploadImage = async () => {
    if (!selectedFile) {
      setError('Por favor selecciona una imagen');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      await uploadProfilePicture(selectedFile);
      setSuccess('Imagen de perfil actualizada exitosamente');
      setSelectedFile(null);
      setPreviewUrl('');
      document.getElementById('profileImageInput').value = '';
    } catch (error) {
      setError('Error al subir imagen: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      // Para eliminar la imagen, subimos un archivo vacío o implementamos un endpoint específico
      // Por ahora, simplemente cerramos el modal
      setShowDeleteModal(false);
    } catch (error) {
      setError('Error al eliminar imagen: ' + error.message);
    }
  };

  const getProfileImageUrl = () => {
    if (user?.profileImageUrl) {
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
        <Col lg={10}>
          <div className="profile-header mb-4">
            <h1 className="h2 mb-1">Mi Perfil</h1>
            <p className="text-muted">Gestiona tu información personal y preferencias</p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Tabs
            activeKey={activeTab}
            onSelect={(tab) => setActiveTab(tab)}
            className="mb-4"
          >
            <Tab eventKey="personal" title="📝 Información Personal">
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Información Personal</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={4} className="text-center mb-4">
                      <div className="profile-image-section">
                        <div className="profile-image-container mb-3">
                          {getProfileImageUrl() ? (
                            <img
                              src={getProfileImageUrl()}
                              alt="Perfil"
                              className="profile-image"
                              style={{
                                width: '150px',
                                height: '150px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '3px solid #dee2e6'
                              }}
                            />
                          ) : (
                            <div
                              className="profile-placeholder"
                              style={{
                                width: '150px',
                                height: '150px',
                                borderRadius: '50%',
                                backgroundColor: '#6c757d',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '48px',
                                fontWeight: 'bold'
                              }}
                            >
                              {user?.nombre_completo?.charAt(0) || '👤'}
                            </div>
                          )}
                        </div>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Cambiar Imagen de Perfil</Form.Label>
                          <Form.Control
                            type="file"
                            id="profileImageInput"
                            accept="image/*"
                            onChange={handleFileSelect}
                          />
                          <Form.Text className="text-muted">
                            Formatos: JPG, PNG, GIF. Máx: 5MB
                          </Form.Text>
                        </Form.Group>

                        {previewUrl && (
                          <div className="preview-section mb-3">
                            <p className="small mb-2">Vista previa:</p>
                            <img
                              src={previewUrl}
                              alt="Preview"
                              style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                              }}
                            />
                          </div>
                        )}

                        <Button
                          variant="primary"
                          onClick={handleUploadImage}
                          disabled={!selectedFile || uploading}
                          className="w-100"
                        >
                          {uploading ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-2" />
                              Subiendo...
                            </>
                          ) : (
                            'Subir Imagen'
                          )}
                        </Button>

                        {getProfileImageUrl() && (
                          <Button
                            variant="outline-danger"
                            onClick={() => setShowDeleteModal(true)}
                            className="w-100 mt-2"
                          >
                            Eliminar Imagen
                          </Button>
                        )}
                      </div>
                    </Col>

                    <Col md={8}>
                      <Form onSubmit={handlePersonalSubmit}>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Nombre Completo</Form.Label>
                              <Form.Control
                                type="text"
                                name="nombre_completo"
                                defaultValue={user?.nombre_completo}
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
                                defaultValue={user?.email}
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
                                defaultValue={user?.telefono}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Rol</Form.Label>
                              <Form.Control
                                type="text"
                                value={user?.rol}
                                disabled
                                className="text-capitalize"
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <div className="d-flex justify-content-end">
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
                        </div>
                      </Form>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="events" title="🎫 Mis Eventos">
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Mis Eventos</h5>
                </Card.Header>
                <Card.Body>
                  <UserEventsSection />
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="registrations" title="📋 Mis Inscripciones">
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Mis Inscripciones</h5>
                </Card.Header>
                <Card.Body>
                  <UserRegistrationsSection />
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Col>
      </Row>

      {/* Modal para eliminar imagen */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Imagen de Perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que quieres eliminar tu imagen de perfil? 
          Se restaurará la imagen por defecto.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleRemoveImage}>
            Eliminar Imagen
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

// Componentes auxiliares para las secciones de eventos e inscripciones
const UserEventsSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const userEvents = await usersAPI.getMyEvents();
      setEvents(userEvents);
    } catch (error) {
      console.error('Error cargando eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  return (
    <div>
      {events.length === 0 ? (
        <p className="text-muted">No has creado ningún evento.</p>
      ) : (
        <ListGroup variant="flush">
          {events.map((event) => (
            <ListGroup.Item key={event.evento_id} className="px-0">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">{event.nombre}</h6>
                  <p className="text-muted mb-1 small">
                    {new Date(event.fecha).toLocaleDateString()} - {event.ubicacion}
                  </p>
                </div>
                <Badge bg={event.estado === 'activo' ? 'success' : 'secondary'}>
                  {event.estado}
                </Badge>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

const UserRegistrationsSection = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    try {
      const userRegistrations = await usersAPI.getMyRegistrations();
      setRegistrations(userRegistrations);
    } catch (error) {
      console.error('Error cargando inscripciones:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  return (
    <div>
      {registrations.length === 0 ? (
        <p className="text-muted">No tienes inscripciones activas.</p>
      ) : (
        <ListGroup variant="flush">
          {registrations.map((registration) => (
            <ListGroup.Item key={registration.inscripcion_id} className="px-0">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">{registration.Evento?.nombre}</h6>
                  <p className="text-muted mb-1 small">
                    {new Date(registration.Evento?.fecha).toLocaleDateString()} - 
                    Categoría: {registration.Categoria?.nombre}
                  </p>
                </div>
                <Badge bg={registration.estado === 'confirmada' ? 'success' : 'warning'}>
                  {registration.estado}
                </Badge>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default ProfilePage;