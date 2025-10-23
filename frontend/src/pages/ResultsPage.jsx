// frontend/src/pages/ResultsPage.jsx - CONECTADO A API
import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Table, Spinner, Alert,
  Form, Button, Badge, InputGroup
} from 'react-bootstrap';
import { eventsAPI, registrationsAPI } from '../services/api';

const ResultsPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError('');
      
      const eventsData = await eventsAPI.getAll();
      
      // Filtrar eventos finalizados
      const finishedEvents = eventsData.filter(event => 
        event.estado?.toLowerCase() === 'finalizado'
      );
      
      setEvents(finishedEvents);
      
      // Seleccionar el primer evento por defecto si hay eventos
      if (finishedEvents.length > 0) {
        setSelectedEvent(finishedEvents[0]);
        loadResults(finishedEvents[0].evento_id || finishedEvents[0].id);
      }
      
    } catch (error) {
      console.error('Error loading events:', error);
      setError('Error cargando eventos');
    } finally {
      setLoading(false);
    }
  };

  const loadResults = async (eventId) => {
    try {
      setLoadingResults(true);
      
      // En una implementación real, esto vendría de una API específica de resultados
      const registrations = await registrationsAPI.getAll();
      
      // Filtrar inscripciones del evento seleccionado y simular resultados
      const eventRegistrations = registrations.filter(reg => 
        reg.evento_id === eventId || reg.evento?.evento_id === eventId
      );
      
      // Simular datos de resultados (en producción vendrían del backend)
      const simulatedResults = eventRegistrations.map((reg, index) => ({
        id: reg.inscripcion_id || reg.id,
        posicion: index + 1,
        nombre_ciclista: reg.usuario?.nombre || `Ciclista ${index + 1}`,
        categoria: reg.categoria?.nombre || 'General',
        tiempo: `${Math.floor(Math.random() * 2) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        equipo: reg.equipo?.nombre || 'Individual',
        diferencia: index === 0 ? '-' : `+${Math.floor(Math.random() * 120)}s`
      }));
      
      setResults(simulatedResults);
      
    } catch (error) {
      console.error('Error loading results:', error);
      setError('Error cargando resultados');
    } finally {
      setLoadingResults(false);
    }
  };

  const handleEventChange = (event) => {
    setSelectedEvent(event);
    loadResults(event.evento_id || event.id);
  };

  const filteredResults = results.filter(result =>
    result.nombre_ciclista.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.equipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPositionBadge = (position) => {
    if (position === 1) return <Badge bg="warning">🥇 {position}°</Badge>;
    if (position === 2) return <Badge bg="secondary">🥈 {position}°</Badge>;
    if (position === 3) return <Badge bg="warning">🥉 {position}°</Badge>;
    return <Badge bg="outline-secondary">{position}°</Badge>;
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3">Cargando resultados...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="display-5 fw-bold">
            Resultados de <span className="text-primary">Eventos</span>
          </h1>
          <p className="text-muted">
            Consulta los resultados de eventos finalizados
          </p>
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

      {events.length === 0 ? (
        <Row>
          <Col>
            <Card className="border-0 shadow-sm text-center py-5">
              <Card.Body>
                <div className="display-1 text-muted mb-3">🏁</div>
                <h4 className="text-muted mb-3">No hay eventos finalizados</h4>
                <p className="text-muted">
                  No hay eventos con resultados disponibles en este momento.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <>
          {/* Selector de Evento */}
          <Row className="mb-4">
            <Col lg={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">Seleccionar Evento</Form.Label>
                <Form.Select
                  value={selectedEvent ? (selectedEvent.evento_id || selectedEvent.id) : ''}
                  onChange={(e) => {
                    const event = events.find(ev => 
                      (ev.evento_id || ev.id) === parseInt(e.target.value)
                    );
                    if (event) handleEventChange(event);
                  }}
                >
                  {events.map((event) => (
                    <option 
                      key={event.evento_id || event.id} 
                      value={event.evento_id || event.id}
                    >
                      {event.nombre} - {new Date(event.fecha).toLocaleDateString('es-ES')}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col lg={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">Buscar Participante</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Buscar por nombre, equipo o categoría..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button variant="outline-secondary">
                    🔍
                  </Button>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          {/* Información del Evento Seleccionado */}
          {selectedEvent && (
            <Row className="mb-4">
              <Col>
                <Card className="border-0 shadow-sm bg-light">
                  <Card.Body className="p-4">
                    <Row className="align-items-center">
                      <Col md={8}>
                        <h4 className="fw-bold mb-2">{selectedEvent.nombre}</h4>
                        <p className="text-muted mb-2">
                          <strong>Fecha:</strong> {new Date(selectedEvent.fecha).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-muted mb-0">
                          <strong>Ubicación:</strong> {selectedEvent.ubicacion} | 
                          <strong> Distancia:</strong> {selectedEvent.distancia_km} km | 
                          <strong> Tipo:</strong> {selectedEvent.tipo}
                        </p>
                      </Col>
                      <Col md={4} className="text-end">
                        <Badge bg="success" className="fs-6 px-3 py-2">
                          Evento Finalizado
                        </Badge>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Resultados */}
          <Row>
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    🏁 Clasificación Final
                    {filteredResults.length > 0 && (
                      <small className="text-muted ms-2">
                        ({filteredResults.length} participantes)
                      </small>
                    )}
                  </h5>
                  
                  {filteredResults.length > 0 && (
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => {
                        // Función para exportar resultados
                        alert('Funcionalidad de exportación en desarrollo');
                      }}
                    >
                      📥 Exportar
                    </Button>
                  )}
                </Card.Header>
                
                <Card.Body className="p-0">
                  {loadingResults ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" variant="primary" />
                      <p className="mt-3">Cargando resultados...</p>
                    </div>
                  ) : filteredResults.length === 0 ? (
                    <div className="text-center py-5">
                      <p className="text-muted">
                        {searchTerm ? 
                          'No se encontraron resultados para la búsqueda' : 
                          'No hay resultados disponibles para este evento'
                        }
                      </p>
                      {searchTerm && (
                        <Button 
                          variant="outline-primary" 
                          onClick={() => setSearchTerm('')}
                        >
                          Limpiar búsqueda
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Table responsive hover className="mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th width="80">Posición</th>
                          <th>Ciclista</th>
                          <th>Categoría</th>
                          <th>Equipo</th>
                          <th>Tiempo</th>
                          <th>Diferencia</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredResults.map((result) => (
                          <tr key={result.id}>
                            <td>
                              <div className="fw-bold">
                                {getPositionBadge(result.posicion)}
                              </div>
                            </td>
                            <td>
                              <div className="fw-semibold">
                                {result.nombre_ciclista}
                              </div>
                            </td>
                            <td>
                              <Badge bg="outline-primary">
                                {result.categoria}
                              </Badge>
                            </td>
                            <td>
                              <small className="text-muted">
                                {result.equipo}
                              </small>
                            </td>
                            <td className="fw-bold text-primary">
                              {result.tiempo}
                            </td>
                            <td>
                              <small className="text-muted">
                                {result.diferencia}
                              </small>
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

          {/* Estadísticas Rápidas */}
          {filteredResults.length > 0 && (
            <Row className="mt-4">
              <Col md={3} sm={6}>
                <Card className="border-0 shadow-sm text-center">
                  <Card.Body className="py-3">
                    <h6 className="text-muted mb-1">Total Participantes</h6>
                    <h4 className="text-primary fw-bold mb-0">
                      {filteredResults.length}
                    </h4>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={3} sm={6}>
                <Card className="border-0 shadow-sm text-center">
                  <Card.Body className="py-3">
                    <h6 className="text-muted mb-1">Ganador</h6>
                    <h6 className="fw-bold mb-0 text-truncate">
                      {filteredResults[0]?.nombre_ciclista}
                    </h6>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={3} sm={6}>
                <Card className="border-0 shadow-sm text-center">
                  <Card.Body className="py-3">
                    <h6 className="text-muted mb-1">Mejor Tiempo</h6>
                    <h6 className="fw-bold mb-0">
                      {filteredResults[0]?.tiempo}
                    </h6>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={3} sm={6}>
                <Card className="border-0 shadow-sm text-center">
                  <Card.Body className="py-3">
                    <h6 className="text-muted mb-1">Categorías</h6>
                    <h6 className="fw-bold mb-0">
                      {new Set(filteredResults.map(r => r.categoria)).size}
                    </h6>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </>
      )}
    </Container>
  );
};

export default ResultsPage;