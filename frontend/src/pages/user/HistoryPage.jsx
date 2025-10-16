import React from 'react';
import { Container, Row, Col, Card, Table, ProgressBar } from 'react-bootstrap';

const HistoryPage = () => {
  const activities = [
    { id: 1, evento: 'Gran Fondo Sierra Nevada', fecha: '2024-01-15', distancia: '120km', tiempo: '4:15:30', calorias: 3200 },
    { id: 2, evento: 'Carrera Montaña Madrid', fecha: '2024-01-10', distancia: '45km', tiempo: '2:45:20', calorias: 1800 },
    { id: 3, evento: 'Training Urbano', fecha: '2024-01-08', distancia: '30km', tiempo: '1:15:45', calorias: 850 },
  ];

  const stats = {
    totalDistance: 195,
    totalEvents: 3,
    avgSpeed: 28.5,
    elevationGain: 2450
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <h2>Mi Historial</h2>
          <p className="text-muted">Sigue tu progreso y estadísticas</p>
        </Col>
      </Row>

      {/* Estadísticas rápidas */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-primary">{stats.totalDistance}km</h3>
              <p className="text-muted mb-0">Distancia Total</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-success">{stats.totalEvents}</h3>
              <p className="text-muted mb-0">Eventos Completados</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-warning">{stats.avgSpeed}km/h</h3>
              <p className="text-muted mb-0">Velocidad Promedio</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-info">{stats.elevationGain}m</h3>
              <p className="text-muted mb-0">Desnivel Acumulado</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Actividad Reciente</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Evento</th>
                    <th>Fecha</th>
                    <th>Distancia</th>
                    <th>Tiempo</th>
                    <th>Calorías</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity) => (
                    <tr key={activity.id}>
                      <td>{activity.evento}</td>
                      <td>{activity.fecha}</td>
                      <td>{activity.distancia}</td>
                      <td>{activity.tiempo}</td>
                      <td>{activity.calorias}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Metas Mensuales</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Distancia (500km)</span>
                  <span>65%</span>
                </div>
                <ProgressBar now={65} variant="primary" />
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Eventos (5 eventos)</span>
                  <span>60%</span>
                </div>
                <ProgressBar now={60} variant="success" />
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Elevación (5000m)</span>
                  <span>45%</span>
                </div>
                <ProgressBar now={45} variant="warning" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HistoryPage;