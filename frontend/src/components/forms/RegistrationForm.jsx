// frontend/src/components/forms/RegistrationForm.jsx - MEJORADO
import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert, Spinner, Card } from 'react-bootstrap';
import { registrationsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const RegistrationForm = ({ event, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    categoria_id: '',
    talla_playera_id: '',
    equipo_id: '',
    condiciones_medicas: '',
    alergias: '',
    contacto_emergencia: '',
    telefono_emergencia: '',
    acepta_terminos: false
  });

  const [categories, setCategories] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [userTeams, setUserTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadRegistrationData();
  }, [event]);

  const loadRegistrationData = async () => {
    try {
      setLoadingData(true);
      
      // Cargar categorías del evento
      const categoriasData = await registrationsAPI.getCategorias(event.evento_id || event.id);
      setCategories(categoriasData);

      // Cargar tallas disponibles
      const tallasData = await registrationsAPI.getTallas();
      setTallas(tallasData);

      // Cargar equipos del usuario
      const teamsData = await registrationsAPI.getUserTeams(); // Asumiendo que existe este endpoint
      setUserTeams(teamsData);

      // Establecer valores por defecto
      if (categoriasData.length > 0) {
        setFormData(prev => ({ ...prev, categoria_id: categoriasData[0].categoria_id }));
      }
      if (tallasData.length > 0) {
        setFormData(prev => ({ ...prev, talla_playera_id: tallasData[0].talla_id }));
      }

    } catch (error) {
      console.error('Error loading registration data:', error);
      setError('Error cargando datos de inscripción');
    } finally {
      setLoadingData(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.acepta_terminos) {
      setError('Debes aceptar los términos y condiciones');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const registrationData = {
        evento_id: event.evento_id || event.id,
        categoria_id: formData.categoria_id,
        talla_playera_id: formData.talla_playera_id,
        equipo_id: formData.equipo_id || null,
        condiciones_medicas: formData.condiciones_medicas,
        alergias: formData.alergias,
        contacto_emergencia: formData.contacto_emergencia,
        telefono_emergencia: formData.telefono_emergencia
      };

      const result = await registrationsAPI.registerForEvent(registrationData);
      
      onSuccess(`¡Inscripción exitosa! ${result.message || 'Te has registrado correctamente en el evento.'}`);

    } catch (error) {
      console.error('Error in registration:', error);
      setError(error.message || 'Error al procesar la inscripción');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Cargando datos de inscripción...</p>
      </div>
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Card className="mb-4">
        <Card.Body>
          <h6 className="fw-bold mb-3">Resumen del Evento</h6>
          <Row>
            <Col sm={6}>
              <p><strong>Evento:</strong> {event.nombre}</p>
              <p><strong>Fecha:</strong> {new Date(event.fecha).toLocaleDateString('es-ES')}</p>
            </Col>
            <Col sm={6}>
              <p><strong>Ubicación:</strong> {event.ubicacion}</p>
              <p><strong>Costo:</strong> €{event.cuota_inscripcion || 0}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Categoría *</Form.Label>
            <Form.Select
              name="categoria_id"
              value={formData.categoria_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((categoria) => (
                <option key={categoria.categoria_id} value={categoria.categoria_id}>
                  {categoria.nombre} {categoria.descripcion ? `- ${categoria.descripcion}` : ''}
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
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccionar talla</option>
              {tallas.map((talla) => (
                <option key={talla.talla_id} value={talla.talla_id}>
                  {talla.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {userTeams.length > 0 && (
        <Form.Group className="mb-3">
          <Form.Label>Equipo (Opcional)</Form.Label>
          <Form.Select
            name="equipo_id"
            value={formData.equipo_id}
            onChange={handleInputChange}
          >
            <option value="">Participar individualmente</option>
            {userTeams.map((team) => (
              <option key={team.equipo_id} value={team.equipo_id}>
                {team.nombre}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      )}

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
              placeholder="Número de contacto"
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Condiciones Médicas</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="condiciones_medicas"
          value={formData.condiciones_medicas}
          onChange={handleInputChange}
          placeholder="Información médica relevante que debamos conocer..."
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Alergias</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="alergias"
          value={formData.alergias}
          onChange={handleInputChange}
          placeholder="Alergias a alimentos, medicamentos, etc."
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Check
          type="checkbox"
          name="acepta_terminos"
          checked={formData.acepta_terminos}
          onChange={handleInputChange}
          label={
            <span>
              Acepto los{' '}
              <a href="/terminos" target="_blank" rel="noopener noreferrer">
                términos y condiciones
              </a>
              {' '}y la{' '}
              <a href="/privacidad" target="_blank" rel="noopener noreferrer">
                política de privacidad
              </a>
            </span>
          }
          required
        />
      </Form.Group>

      <div className="d-flex gap-3">
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="flex-grow-1"
        >
          {loading ? (
            <>
              <Spinner size="sm" className="me-2" />
              Procesando...
            </>
          ) : (
            `Inscribirse - €${event.cuota_inscripcion || 0}`
          )}
        </Button>
      </div>
    </Form>
  );
};

export default RegistrationForm;