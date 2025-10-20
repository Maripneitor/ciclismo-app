import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Tabs, Tab } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const ResultsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('publicos');

  const publicResults = [
    { id: 1, evento: 'Gran Fondo Sierra Nevada', fecha: '2024-01-15', ganador: 'Carlos Rodríguez', tiempo: '2:45:30' },
    { id: 2, evento: 'Carrera Montaña Madrid', fecha: '2024-01-10', ganador: 'Ana Martínez', tiempo: '3:15:45' },
    { id: 3, evento: 'Maratón Costa Barcelona', fecha: '2024-01-05', ganador: 'David López', tiempo: '2:55:20' },
  ];

  const myResults = [
    { id: 1, evento: 'Gran Fondo Sierra Nevada', fecha: '2024-01-15', posicion: 15, tiempo: '3:05:30', categoria: '30-40' },
    { id: 2, evento: 'Carrera Montaña Madrid', fecha: '2024-01-10', posicion: 8, tiempo: '3:25:45', categoria: '30-40' },
  ];

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <h1>Resultados de Eventos</h1>
          <p className="lead">Consulta los resultados de eventos pasados y tu desempeño personal</p>
        </Col>
      </Row>

      <Tabs
        activeKey={activeTab}
        onSelect={(tab) => setActiveTab(tab)}
        className="mb-4"
      >
        <Tab eventKey="publicos" title="Resultados Públicos">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Resultados de Todos los Eventos</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th>Evento</th>
                    <th>Fecha</th>
                    <th>Ganador</th>
                    <th>Tiempo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {publicResults.map((result) => (
                    <tr key={result.id}>
                      <td>{result.evento}</td>
                      <td>{result.fecha}</td>
                      <td>{result.ganador}</td>
                      <td>{result.tiempo}</td>
                      <td>
                        <Button variant="outline-primary" size="sm">
                          Ver Detalles
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        {isAuthenticated && (
          <Tab eventKey="personales" title="Mis Resultados">
            <Card>
              <Card.Header>
                <h5 className="mb-0">Mi Historial de Resultados</h5>
              </Card.Header>
              <Card.Body>
                {myResults.length > 0 ? (
                  <Table responsive striped hover>
                    <thead>
                      <tr>
                        <th>Evento</th>
                        <th>Fecha</th>
                        <th>Posición</th>
                        <th>Tiempo</th>
                        <th>Categoría</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myResults.map((result) => (
                        <tr key={result.id}>
                          <td>{result.evento}</td>
                          <td>{result.fecha}</td>
                          <td>
                            <span className={`badge ${
                              result.posicion <= 3 ? 'bg-success' : 
                              result.posicion <= 10 ? 'bg-warning' : 'bg-secondary'
                            }`}>
                              {result.posicion}º
                            </span>
                          </td>
                          <td>{result.tiempo}</td>
                          <td>{result.categoria}</td>
                          <td>
                            <Button variant="outline-primary" size="sm">
                              Ver Certificado
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted">No tienes resultados registrados aún.</p>
                    <Button variant="primary">Explorar Eventos</Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Tab>
        )}
      </Tabs>

      {!isAuthenticated && (
        <Card className="bg-light">
          <Card.Body className="text-center">
            <h5>¿Quieres ver tus resultados personales?</h5>
            <p className="text-muted mb-3">
              Inicia sesión para acceder a tu historial completo y estadísticas personalizadas.
            </p>
            <Button variant="primary" href="/login">
              Iniciar Sesión
            </Button>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default ResultsPage;