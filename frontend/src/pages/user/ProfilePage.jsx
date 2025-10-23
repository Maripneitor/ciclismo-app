// frontend/src/pages/ProfilePage.jsx - CONECTADO A API
import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Form, Button, Spinner, Alert,
  Tab, Tabs, Badge, ListGroup, Modal
} from 'react-bootstrap';
import { usersAPI, authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
    genero: '',
    direccion: '',
    ciudad: '',
    pais: '',
    codigo_postal: '',
    alergias: '',
    condiciones_medicas: '',
    contacto_emergencia: '',
    telefono_emergencia: '',
    talla_playera: '',
    tipo_bicicleta: '',
    nivel_experiencia: ''
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      const profileData = await usersAPI.getProfile();
      setProfile(profileData);
      
      // Llenar formulario con datos del perfil
      setFormData({
        nombre: profileData.nombre || '',
        email: profileData.email || '',
        telefono: profileData.telefono || '',
        fecha_nacimiento: profileData.fecha_nacimiento || '',
        genero: profileData.genero || '',
        direccion: profileData.direccion || '',
        ciudad: profileData.ciudad || '',
        pais: profileData.pais || '',
        codigo_postal: profileData.codigo_postal || '',
        alergias: profileData.alergias || '',
        condiciones_medicas: profileData.condiciones_medicas || '',
        contacto_emergencia: profileData.contacto_emergencia || '',
        telefono_emergencia: profileData.telefono_emergencia || '',
        talla_playera: profileData.talla_playera || '',
        tipo_bicicleta: profileData.tipo_bicicleta || '',
        nivel_experiencia: profileData.nivel_experiencia || ''
      });
      
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Error cargando perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      const updatedProfile = await usersAPI.updateProfile(formData);
      setProfile(updatedProfile);
      updateUser(updatedProfile);
      
      setSuccess('Perfil actualizado exitosamente');
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error actualizando perfil: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('¿Estás completamente seguro? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      // En una implementación real, esto llamaría a una API para eliminar la cuenta
      alert('Funcionalidad de eliminación de cuenta en desarrollo');
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Error eliminando cuenta: ' + error.message);
    }
  };

  const getExperienceBadge = (level) => {
    switch (level?.toLowerCase()) {
      case 'principiante': return 'success';
      case 'intermedio': return 'warning';
      case 'avanzado': return 'danger';
      case 'experto': return 'dark';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3">Cargando perfil...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="display-5 fw-bold">
            Mi <span className="text-primary">Perfil</span>
          </h1>
          <p className="text-muted">
            Gestiona tu información personal y preferencias
          </p>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Row>
        <Col lg={4} className="mb-4">
          <Card className="border-0 shadow-sm sticky-top" style={{ top: '100px' }}>
            <Card.Body className="text-center p-4">
              <div className="avatar-lg bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3">
                <span className="h4 mb-0">
                  {profile?.nombre?.charAt(0) || user?.nombre?.charAt(0) || 'U'}
                </span>
              </div>
              
              <h4 className="fw-bold mb-1">{profile?.nombre || user?.nombre}</h4>
              <p className="text-muted mb-3">{profile?.email || user?.email}</p>
              
              <Badge bg={getExperienceBadge(profile?.nivel_experiencia)} className="fs-6 mb-3">
                {profile?.nivel_experiencia || 'Sin especificar'}
              </Badge>

              <div className="mt-4">
                <h6 className="text-muted mb-2">Estadísticas Rápidas</h6>
                <div className="row text-center">
                  <div className="col-6 mb-3">
                    <div className="h5 text-primary mb-1">
                      {profile?.total_inscripciones || 0}
                    </div>
                    <small className="text-muted">Inscripciones</small>
                  </div>
                  <div className="col-6 mb-3">
                    <div className="h5 text-success mb-1">
                      {profile?.eventos_completados || 0}
                    </div>
                    <small className="text-muted">Completados</small>
                  </div>
                </div>
              </div>

              <div className="d-grid gap-2 mt-4">
                <Button variant="outline-danger" onClick={() => setShowDeleteModal(true)}>
                  Eliminar Cuenta
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              <Tabs
                activeKey={activeTab}
                onSelect={setActiveTab}
                className="px-3 pt-3"
                fill
              >
                <Tab eventKey="personal" title="👤 Personal">
                  <Form onSubmit={handleSubmit} className="p-3">
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Nombre Completo *</Form.Label>
                          <Form.Control
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email *</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
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
                            value={formData.telefono}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Fecha de Nacimiento</Form.Label>
                          <Form.Control
                            type="date"
                            name="fecha_nacimiento"
                            value={formData.fecha_nacimiento}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Género</Form.Label>
                          <Form.Select
                            name="genero"
                            value={formData.genero}
                            onChange={handleInputChange}
                          >
                            <option value="">Seleccionar...</option>
                            <option value="masculino">Masculino</option>
                            <option value="femenino">Femenino</option>
                            <option value="otro">Otro</option>
                            <option value="prefiero_no_decir">Prefiero no decir</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Talla de Playera</Form.Label>
                          <Form.Select
                            name="talla_playera"
                            value={formData.talla_playera}
                            onChange={handleInputChange}
                          >
                            <option value="">Seleccionar...</option>
                            <option value="XS">XS</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                            <option value="XXL">XXL</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="d-grid">
                      <Button 
                        type="submit" 
                        variant="primary" 
                        size="lg"
                        disabled={saving}
                      >
                        {saving ? <Spinner size="sm" /> : 'Guardar Cambios'}
                      </Button>
                    </div>
                  </Form>
                </Tab>

                <Tab eventKey="ubicacion" title="📍 Ubicación">
                  <Form onSubmit={handleSubmit} className="p-3">
                    <Row>
                      <Col md={8}>
                        <Form.Group className="mb-3">
                          <Form.Label>Dirección</Form.Label>
                          <Form.Control
                            type="text"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleInputChange}
                            placeholder="Calle y número"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Código Postal</Form.Label>
                          <Form.Control
                            type="text"
                            name="codigo_postal"
                            value={formData.codigo_postal}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Ciudad</Form.Label>
                          <Form.Control
                            type="text"
                            name="ciudad"
                            value={formData.ciudad}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>País</Form.Label>
                          <Form.Control
                            type="text"
                            name="pais"
                            value={formData.pais}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="d-grid">
                      <Button 
                        type="submit" 
                        variant="primary" 
                        size="lg"
                        disabled={saving}
                      >
                        {saving ? <Spinner size="sm" /> : 'Guardar Cambios'}
                      </Button>
                    </div>
                  </Form>
                </Tab>

                <Tab eventKey="ciclista" title="🚴 Ciclista">
                  <Form onSubmit={handleSubmit} className="p-3">
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Nivel de Experiencia</Form.Label>
                          <Form.Select
                            name="nivel_experiencia"
                            value={formData.nivel_experiencia}
                            onChange={handleInputChange}
                          >
                            <option value="">Seleccionar...</option>
                            <option value="principiante">Principiante</option>
                            <option value="intermedio">Intermedio</option>
                            <option value="avanzado">Avanzado</option>
                            <option value="experto">Experto</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Tipo de Bicicleta Principal</Form.Label>
                          <Form.Select
                            name="tipo_bicicleta"
                            value={formData.tipo_bicicleta}
                            onChange={handleInputChange}
                          >
                            <option value="">Seleccionar...</option>
                            <option value="ruta">Ruta</option>
                            <option value="montaña">Montaña</option>
                            <option value="urbana">Urbana</option>
                            <option value="hibrida">Híbrida</option>
                            <option value="gravel">Gravel</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="d-grid">
                      <Button 
                        type="submit" 
                        variant="primary" 
                        size="lg"
                        disabled={saving}
                      >
                        {saving ? <Spinner size="sm" /> : 'Guardar Cambios'}
                      </Button>
                    </div>
                  </Form>
                </Tab>

                <Tab eventKey="emergencia" title="🆘 Emergencia">
                  <Form onSubmit={handleSubmit} className="p-3">
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Contacto de Emergencia</Form.Label>
                          <Form.Control
                            type="text"
                            name="contacto_emergencia"
                            value={formData.contacto_emergencia}
                            onChange={handleInputChange}
                            placeholder="Nombre completo"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Teléfono de Emergencia</Form.Label>
                          <Form.Control
                            type="tel"
                            name="telefono_emergencia"
                            value={formData.telefono_emergencia}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Alergias</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="alergias"
                        value={formData.alergias}
                        onChange={handleInputChange}
                        placeholder="Lista cualquier alergia relevante..."
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Condiciones Médicas</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="condiciones_medicas"
                        value={formData.condiciones_medicas}
                        onChange={handleInputChange}
                        placeholder="Condiciones médicas que debamos conocer..."
                      />
                    </Form.Group>

                    <div className="d-grid">
                      <Button 
                        type="submit" 
                        variant="primary" 
                        size="lg"
                        disabled={saving}
                      >
                        {saving ? <Spinner size="sm" /> : 'Guardar Cambios'}
                      </Button>
                    </div>
                  </Form>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de Eliminación de Cuenta */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Cuenta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">
            <h6>¡Advertencia!</h6>
            <p className="mb-0">
              Esta acción no se puede deshacer. Se eliminarán todos tus datos, 
              inscripciones y historial permanentemente.
            </p>
          </Alert>
          <p>
            ¿Estás completamente seguro de que quieres eliminar tu cuenta?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount}>
            Sí, Eliminar Cuenta
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProfilePage;