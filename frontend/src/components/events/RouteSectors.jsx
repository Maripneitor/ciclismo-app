// frontend/src/components/events/RouteSectors.jsx
import React from 'react';
import { Card, ListGroup, Badge, ProgressBar, Row, Col } from 'react-bootstrap';

const RouteSectors = ({ sectors, onSectorSelect, selectedSector }) => {
  const totalDistance = sectors[sectors.length - 1]?.distance || 0;
  
  const getDifficultyVariant = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'fácil': return 'success';
      case 'medio': return 'warning';
      case 'difícil': return 'danger';
      default: return 'secondary';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'fácil': return '🟢';
      case 'medio': return '🟡';
      case 'difícil': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-white border-0">
        <h6 className="mb-0">Desglose de Sectores</h6>
      </Card.Header>
      <Card.Body className="p-0">
        <ListGroup variant="flush">
          {sectors.map((sector, index) => (
            <ListGroup.Item 
              key={sector.id}
              className={`p-3 sector-item ${
                selectedSector?.id === sector.id ? 'bg-light border-start border-primary border-3' : ''
              }`}
              style={{ cursor: 'pointer' }}
              onClick={() => onSectorSelect(sector)}
            >
              <Row className="align-items-center">
                <Col xs={1}>
                  <div className="text-center">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto"
                         style={{width: '30px', height: '30px', fontSize: '12px'}}>
                      {index + 1}
                    </div>
                  </div>
                </Col>
                
                <Col xs={7}>
                  <div className="d-flex align-items-center mb-1">
                    <span className="me-2">{getDifficultyIcon(sector.difficulty)}</span>
                    <h6 className="mb-0">{sector.name}</h6>
                  </div>
                  <p className="text-muted small mb-1">{sector.description}</p>
                  <div className="d-flex gap-3">
                    <small className="text-muted">
                      <strong>Dist:</strong> {sector.distance} km
                    </small>
                    <small className="text-muted">
                      <strong>Elev:</strong> {sector.elevation} m
                    </small>
                    <small className="text-muted">
                      <strong>Tiempo:</strong> {sector.estimatedTime}
                    </small>
                  </div>
                </Col>
                
                <Col xs={4}>
                  <div className="text-end">
                    <Badge bg={getDifficultyVariant(sector.difficulty)} className="mb-2">
                      {sector.difficulty}
                    </Badge>
                    
                    {/* Barra de progreso del sector */}
                    <div className="mt-2">
                      <div className="d-flex justify-content-between small text-muted mb-1">
                        <span>Km {sectors[index - 1]?.distance || 0}</span>
                        <span>Km {sector.distance}</span>
                      </div>
                      <ProgressBar 
                        now={((sector.distance || 0) / totalDistance) * 100}
                        variant={getDifficultyVariant(sector.difficulty)}
                        style={{height: '4px'}}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default RouteSectors;