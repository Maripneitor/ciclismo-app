// frontend/src/components/events/AdvancedSearchFilters.jsx - NUEVO COMPONENTE
import React from 'react';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';

const AdvancedSearchFilters = ({ onFiltersChange, loading }) => {
  const [filters, setFilters] = React.useState({
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

  const handleFilterChange = (name, value) => {
    const newFilters = {
      ...filters,
      [name]: value
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
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
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-white border-0">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">🔍 Filtros Avanzados</h6>
          {hasActiveFilters && (
            <Button 
              variant="link" 
              size="sm" 
              onClick={clearFilters}
              className="text-danger p-0"
            >
              Limpiar
            </Button>
          )}
        </div>
      </Card.Header>
      
      <Card.Body>
        <Form>
          {/* Tipo de Evento */}
          <Form.Group className="mb-3">
            <Form.Label className="small fw-semibold">Tipo de Evento</Form.Label>
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

          {/* Dificultad */}
          <Form.Group className="mb-3">
            <Form.Label className="small fw-semibold">Dificultad</Form.Label>
            <Form.Select
              value={filters.dificultad}
              onChange={(e) => handleFilterChange('dificultad', e.target.value)}
              disabled={loading}
            >
              <option value="">Todas las dificultades</option>
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="extrema">Extrema</option>
            </Form.Select>
          </Form.Group>

          {/* Estado */}
          <Form.Group className="mb-3">
            <Form.Label className="small fw-semibold">Estado</Form.Label>
            <Form.Select
              value={filters.estado}
              onChange={(e) => handleFilterChange('estado', e.target.value)}
              disabled={loading}
            >
              <option value="">Todos los estados</option>
              <option value="próximo">Próximo</option>
              <option value="en curso">En Curso</option>
              <option value="finalizado">Finalizado</option>
            </Form.Select>
          </Form.Group>

          {/* Ubicación */}
          <Form.Group className="mb-3">
            <Form.Label className="small fw-semibold">Ubicación</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ciudad o región..."
              value={filters.ubicacion}
              onChange={(e) => handleFilterChange('ubicacion', e.target.value)}
              disabled={loading}
            />
          </Form.Group>

          {/* Rango de Distancia */}
          <Form.Group className="mb-3">
            <Form.Label className="small fw-semibold">Distancia (km)</Form.Label>
            <Row className="g-2">
              <Col>
                <Form.Control
                  type="number"
                  placeholder="Mín"
                  value={filters.distanciaMin}
                  onChange={(e) => handleFilterChange('distanciaMin', e.target.value)}
                  disabled={loading}
                />
              </Col>
              <Col>
                <Form.Control
                  type="number"
                  placeholder="Máx"
                  value={filters.distanciaMax}
                  onChange={(e) => handleFilterChange('distanciaMax', e.target.value)}
                  disabled={loading}
                />
              </Col>
            </Row>
          </Form.Group>

          {/* Rango de Precio */}
          <Form.Group className="mb-3">
            <Form.Label className="small fw-semibold">Precio (€)</Form.Label>
            <Row className="g-2">
              <Col>
                <Form.Control
                  type="number"
                  placeholder="Mín"
                  value={filters.precioMin}
                  onChange={(e) => handleFilterChange('precioMin', e.target.value)}
                  disabled={loading}
                />
              </Col>
              <Col>
                <Form.Control
                  type="number"
                  placeholder="Máx"
                  value={filters.precioMax}
                  onChange={(e) => handleFilterChange('precioMax', e.target.value)}
                  disabled={loading}
                />
              </Col>
            </Row>
          </Form.Group>

          {/* Rango de Fechas */}
          <Form.Group className="mb-3">
            <Form.Label className="small fw-semibold">Rango de Fechas</Form.Label>
            <Form.Control
              type="date"
              placeholder="Desde"
              value={filters.fechaInicio}
              onChange={(e) => handleFilterChange('fechaInicio', e.target.value)}
              disabled={loading}
              className="mb-2"
            />
            <Form.Control
              type="date"
              placeholder="Hasta"
              value={filters.fechaFin}
              onChange={(e) => handleFilterChange('fechaFin', e.target.value)}
              disabled={loading}
            />
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AdvancedSearchFilters;