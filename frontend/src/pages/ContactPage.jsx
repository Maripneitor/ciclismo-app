import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
    
    setFormData({
      nombre: '',
      email: '',
      asunto: '',
      mensaje: ''
    });
  };

  return (
    <Container className="py-4">
      <Row>
        <Col lg={8} className="mx-auto">
          <h1>Contacto</h1>
          <p className="lead">¿Tienes preguntas? Nos encantaría escucharte.</p>

          {showAlert && (
            <Alert variant="success" className="mb-4">
              ¡Mensaje enviado correctamente! Te contactaremos pronto.
            </Alert>
          )}

          <Row>
            <Col md={8}>
              <Card>
                <Card.Body className="p-4">
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Nombre completo *</Form.Label>
                          <Form.Control
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                            placeholder="Tu nombre"
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
                            onChange={handleChange}
                            required
                            placeholder="tu@email.com"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Asunto *</Form.Label>
                      <Form.Select
                        name="asunto"
                        value={formData.asunto}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Selecciona un asunto</option>
                        <option value="soporte">Soporte Técnico</option>
                        <option value="eventos">Información sobre Eventos</option>
                        <option value="colaboracion">Colaboración</option>
                        <option value="otros">Otros</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Mensaje *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        name="mensaje"
                        value={formData.mensaje}
                        onChange={handleChange}
                        required
                        placeholder="Describe tu consulta o sugerencia..."
                      />
                    </Form.Group>

                    <Button variant="primary" type="submit" size="lg">
                      Enviar Mensaje
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="bg-light">
                <Card.Body>
                  <h5>Información de Contacto</h5>
                  
                  <div className="mb-4">
                    <h6>Email</h6>
                    <p className="text-muted mb-0">info@ciclismoapp.com</p>
                  </div>

                  <div className="mb-4">
                    <h6>Teléfono</h6>
                    <p className="text-muted mb-0">+34 912 345 678</p>
                  </div>

                  <div className="mb-4">
                    <h6>Horario de Atención</h6>
                    <p className="text-muted mb-0">
                      Lunes - Viernes: 9:00 - 18:00<br />
                      Sábados: 10:00 - 14:00
                    </p>
                  </div>

                  <div>
                    <h6>Dirección</h6>
                    <p className="text-muted mb-0">
                      Calle del Ciclismo, 123<br />
                      28001 Madrid, España
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactPage;