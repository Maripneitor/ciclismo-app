import React from 'react';
import { Card, ProgressBar, Row, Col, Badge } from 'react-bootstrap';

const RouteSectors = ({ sectors }) => {
  const defaultSectors = sectors || [
    { name: 'Inicio', distance: 0, elevation: 650 },
    { name: 'Subida Collado', distance: 25, elevation: 950 },
    { name: 'Descenso Técnico', distance: 45, elevation: 720 },
    { name: 'Llegada', distance: 70, elevation: 650 }
  ];

  const totalDistance = defaultSectors[defaultSectors.length - 1].distance;

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <h6 className="mb-3">Sectores del Recorrido</h6>
        
        {defaultSectors.map((sector, index) => {
          const progress = (sector.distance / totalDistance) * 100;
          const isLast = index === defaultSectors.length - 1;
          
          return (
            <div key={index} className="mb-3">
              <Row className="align-items-center mb-2">
                <Col>
                  <div className="d-flex align-items-center">
                    <Badge 
                      bg={isLast ? "success" : "primary"} 
                      className="me-2"
                    >
                      {index + 1}
                    </Badge>
                    <span className="fw-semibold">{sector.name}</span>
                  </div>
                </Col>
                <Col xs="auto">
                  <small className="text-muted">
                    {sector.distance} km • {sector.elevation} m
                  </small>
                </Col>
              </Row>
              
              <ProgressBar 
                now={progress} 
                variant={isLast ? "success" : "primary"}
                style={{ height: '6px' }}
              />
              
              {!isLast && (
                <div className="text-center mt-1">
                  <small className="text-muted">
                    ▲ {defaultSectors[index + 1].elevation - sector.elevation > 0 ? 
                      `+${defaultSectors[index + 1].elevation - sector.elevation}m` : 
                      `${defaultSectors[index + 1].elevation - sector.elevation}m`
                    }
                  </small>
                </div>
              )}
            </div>
          );
        })}
      </Card.Body>
    </Card>
  );
};

export default RouteSectors;