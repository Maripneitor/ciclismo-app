import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tab, Tabs } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [showAlert, setShowAlert] = useState(false);

  const [personalData, setPersonalData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    fechaNacimiento: '',
    genero: '',
    bio: ''
  });

  const [bikeData, setBikeData] = useState({
    tipoBicicleta: '',
    marca: '',
    modelo: '',
    talla: '',
    year: ''
  });

  const handlePersonalSubmit = (e) => {
    e.preventDefault();
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleBikeSubmit = (e) => {
    e.preventDefault();
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <h2>Mi Perfil</h2>
          <p className="text-muted">Gestiona tu información personal y preferencias</p>

          {showAlert && (
            <Alert variant="success" className="mb-4">
              Perfil actualizado correctamente
            </Alert>
          )}

          <Tabs
            activeKey={activeTab}
            onSelect={(tab) => setActiveTab(tab)}
            className="mb-4"
          >
            <Tab eventKey="personal" title="👤 Información Personal">
              <Card>
                <Card.Body>
                  <Form onSubmit={handlePersonalSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Nombre completo</Form.Label>
                          <Form.Control
                            type="text"
                            value={personalData.nombre}
                            onChange={(e) => setPersonalData({...personalData, nombre: e.target.value})}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            value={personalData.email}
                            onChange={(e) => setPersonalData({...personalData, email: e.target.value})}
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
                            value={personalData.telefono}
                            onChange={(e) => setPersonalData({...personalData, telefono: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Fecha de nacimiento</Form.Label>
                          <Form.Control
                            type="date"
                            value={personalData.fechaNacimiento}
                            onChange={(e) => setPersonalData({...personalData, fechaNacimiento: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-4">
                      <Form.Label>Biografía</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={personalData.bio}
                        onChange={(e) => setPersonalData({...personalData, bio: e.target.value})}
                        placeholder="Cuéntanos sobre ti como ciclista..."
                      />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                      Guardar Cambios
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="bike" title="🚴 Mi Bicicleta">
              <Card>
                <Card.Body>
                  <Form onSubmit={handleBikeSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Tipo de bicicleta</Form.Label>
                          <Form.Select
                            value={bikeData.tipoBicicleta}
                            onChange={(e) => setBikeData({...bikeData, tipoBicicleta: e.target.value})}
                          >
                            <option value="">Seleccionar tipo</option>
                            <option value="carretera">Carretera</option>
                            <option value="montaña">Montaña</option>
                            <option value="urbana">Urbana</option>
                            <option value="hibrida">Híbrida</option>
                            <option value="gravel">Gravel</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Marca</Form.Label>
                          <Form.Control
                            type="text"
                            value={bikeData.marca}
                            onChange={(e) => setBikeData({...bikeData, marca: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Modelo</Form.Label>
                          <Form.Control
                            type="text"
                            value={bikeData.modelo}
                            onChange={(e) => setBikeData({...bikeData, modelo: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Año</Form.Label>
                          <Form.Control
                            type="number"
                            value={bikeData.year}
                            onChange={(e) => setBikeData({...bikeData, year: e.target.value})}
                            min="1990"
                            max="2024"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Button variant="primary" type="submit">
                      Guardar Información de Bicicleta
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;