import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Alert, Card } from 'react-bootstrap';
import { eventsAPI } from '../../services/api';

const RegistrationForm = ({ event, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    categoria_id: '',
    talla_playera_id: '',
    equipo_id: '',
    numero_telefono: '',
    fecha_nacimiento: '',
    genero: '',
    nombre_contacto_emergencia: '',
    telefono_contacto_emergencia: '',
    url_identificacion: ''
  });
  
  const [categories, setCategories] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEventData();
  }, [event]);

  const loadEventData = async () => {
    try {
      const cats = await eventsAPI.getCategories(event.evento_id);
      setCategories(cats);
      
      const userTeams = await teamsAPI.getMyTeams();
      setTeams(userTeams);
    } catch (error) {
      console.error('Error cargando datos del evento:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const registrationData = {
        ...formData,
        evento_id: event.evento_id
      };

      await eventsAPI.registerToEvent(registrationData);
      onSuccess('¡Inscripción exitosa!');
    } catch (error) {
      setError(error.message || 'Error en la inscripción');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">Inscripción: {event.nombre}</h5>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Categoría *</Form.Label>
                <Form.Select
                  name="categoria_id"
                  value={formData.categoria_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map(cat => (
                    <option key={cat.categoria_id} value={cat.categoria_id}>
                      {cat.nombre} - €{cat.cuota_categoria || event.cuota_inscripcion}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Talla de Playera *</Form.Label>
                <Form.Select
                  name="talla_playera_id"
                  value={formData.talla_playera_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar talla</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Equipo (Opcional)</Form.Label>
            <Form.Select
              name="equipo_id"
              value={formData.equipo_id}
              onChange={handleChange}
            >
              <option value="">Individual (Sin equipo)</option>
              {teams.map(team => (
                <option key={team.equipo_id} value={team.equipo_id}>
                  {team.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Teléfono *</Form.Label>
                <Form.Control
                  type="tel"
                  name="numero_telefono"
                  value={formData.numero_telefono}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Fecha de Nacimiento *</Form.Label>
                <Form.Control
                  type="date"
                  name="fecha_nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Género</Form.Label>
            <Form.Select
              name="genero"
              value={formData.genero}
              onChange={handleChange}
            >
              <option value="">Seleccionar</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
              <option value="Prefiero no decir">Prefiero no decir</option>
            </Form.Select>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Contacto de Emergencia *</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre_contacto_emergencia"
                  value={formData.nombre_contacto_emergencia}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Teléfono de Emergencia *</Form.Label>
                <Form.Control
                  type="tel"
                  name="telefono_contacto_emergencia"
                  value={formData.telefono_contacto_emergencia}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label>URL de Identificación (Opcional)</Form.Label>
            <Form.Control
              type="url"
              name="url_identificacion"
              value={formData.url_identificacion}
              onChange={handleChange}
              placeholder="https://..."
            />
          </Form.Group>

          <div className="d-flex gap-2 justify-content-end">
            <Button variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Confirmar Inscripción'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default RegistrationForm;