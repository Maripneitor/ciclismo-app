// frontend/src/components/search/AdvancedSearchFilters.jsx - RESPONSIVO
import React, { useState } from 'react';
import { Row, Col, Form, Button, Card, Accordion } from 'react-bootstrap';

const AdvancedSearchFilters = ({ onFiltersChange, loading = false }) => {
  const [filters, setFilters] = useState({
    tipo: '',
    dificultad: '',
    distanciaMin: '',
    distanciaMax: '',
    fechaInicio: '',
    fechaFin: '',
    ubicacion: '',
    precioMin: '',
    precioMax: '',
    estado: ''
  });

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      tipo: '',
      dificultad: '',
      distanciaMin: '',
      distanciaMax: '',
      fechaInicio: '',
      fechaFin: '',
      ubicacion: '',
      precioMin: '',
      precioMax: '',
      estado: ''
    };
    setFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  return (
    <Card className="search-filters-card border-0 shadow-sm mb-4">
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0 fw-bold">Filtros de Búsqueda</h5>
          <Button 
            variant="outline-secondary" 
            size="sm" 
            onClick={handleReset}
            disabled={loading}
          >
            Limpiar
          </Button>
        </div>

        <Row className="g-3">
          {/* Filtros principales - siempre visibles */}
          <Col xs={12} md={6} lg={3}>
            <Form.Group>
              <Form.Label className="fw-semibold small">Tipo de Evento</Form.Label>
              <Form.Select
                value={filters.tipo}
                onChange={(e) => handleFilterChange('tipo', e.target.value)}
                disabled={loading}
              >
                <option value="">Todos los tipos</option>
                <option value="ruta">Ruta</option>
                <option value="montaña">Montaña</option>
                <option value="urbano">Urbano</option>
                <option value="competitivo">Competitivo</option>
                <option value="recreativo">Recreativo</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col xs={12} md={6} lg={3}>
            <Form.Group>
              <Form.Label className="fw-semibold small">Dificultad</Form.Label>
              <Form.Select
                value={filters.dificultad}
                onChange={(e) => handleFilterChange('dificultad', e.target.value)}
                disabled={loading}
              >
                <option value="">Todas</option>
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
                <option value="Extrema">Extrema</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col xs={12} md={6} lg={3}>
            <Form.Group>
              <Form.Label className="fw-semibold small">Estado</Form.Label>
              <Form.Select
                value={filters.estado}
                onChange={(e) => handleFilterChange('estado', e.target.value)}
                disabled={loading}
              >
                <option value="">Todos</option>
                <option value="Próximo">Próximo</option>
                <option value="En curso">En curso</option>
                <option value="Finalizado">Finalizado</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col xs={12} md={6} lg={3}>
            <Form.Group>
              <Form.Label className="fw-semibold small">Ubicación</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ciudad, provincia..."
                value={filters.ubicacion}
                onChange={(e) => handleFilterChange('ubicacion', e.target.value)}
                disabled={loading}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Filtros avanzados - en acordeón para móviles */}
        <Accordion className="mt-3" flush>
          <Accordion.Item eventKey="0" className="border-0">
            <Accordion.Header className="p-0">
              <span className="fw-semibold">Filtros Avanzados</span>
            </Accordion.Header>
            <Accordion.Body className="px-0 pt-3">
              <Row className="g-3">
                <Col xs={12} sm={6} lg={3}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Distancia Mínima (km)</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="0"
                      value={filters.distanciaMin}
                      onChange={(e) => handleFilterChange('distanciaMin', e.target.value)}
                      disabled={loading}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} sm={6} lg={3}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Distancia Máxima (km)</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="200"
                      value={filters.distanciaMax}
                      onChange={(e) => handleFilterChange('distanciaMax', e.target.value)}
                      disabled={loading}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} sm={6} lg={3}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Precio Mínimo (€)</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="0"
                      value={filters.precioMin}
                      onChange={(e) => handleFilterChange('precioMin', e.target.value)}
                      disabled={loading}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} sm={6} lg={3}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Precio Máximo (€)</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="100"
                      value={filters.precioMax}
                      onChange={(e) => handleFilterChange('precioMax', e.target.value)}
                      disabled={loading}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} sm={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Fecha Desde</Form.Label>
                    <Form.Control
                      type="date"
                      value={filters.fechaInicio}
                      onChange={(e) => handleFilterChange('fechaInicio', e.target.value)}
                      disabled={loading}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} sm={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Fecha Hasta</Form.Label>
                    <Form.Control
                      type="date"
                      value={filters.fechaFin}
                      onChange={(e) => handleFilterChange('fechaFin', e.target.value)}
                      disabled={loading}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card.Body>
    </Card>
  );
};

export default AdvancedSearchFilters;