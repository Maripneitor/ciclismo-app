import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Spinner, Alert } from 'react-bootstrap';
import { queriesAPI } from '../services/api';

const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      setLoading(true);
      const resultsData = await queriesAPI.getResults();
      setResults(resultsData);
    } catch (error) {
      console.error('Error cargando resultados:', error);
      setError('Error cargando resultados de eventos');
    } finally {
      setLoading(false);
    }
  };

  const getPositionBadge = (position) => {
    switch(position) {
      case 1: return <Badge bg="warning" className="fs-6">🥇 1º</Badge>;
      case 2: return <Badge bg="secondary" className="fs-6">🥈 2º</Badge>;
      case 3: return <Badge bg="danger" className="fs-6">🥉 3º</Badge>;
      default: return <Badge bg="light" text="dark" className="fs-6">{position}º</Badge>;
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
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
            Consulta los resultados oficiales de eventos pasados
          </p>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">📊 Últimos Resultados</h5>
            </Card.Header>
            <Card.Body className="p-0">
              {results.length > 0 ? (
                <Table responsive hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Posición</th>
                      <th>Ciclista</th>
                      <th>Evento</th>
                      <th>Tiempo</th>
                      <th>Categoría</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr key={index}>
                        <td>{getPositionBadge(result.posicion)}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-sm bg-primary rounded-circle d-flex align-items-center justify-content-center me-2">
                              <span className="text-white small fw-bold">
                                {result.ciclista_nombre?.charAt(0) || 'C'}
                              </span>
                            </div>
                            {result.ciclista_nombre || 'Ciclista'}
                          </div>
                        </td>
                        <td>{result.evento_nombre}</td>
                        <td>
                          <Badge bg="outline-primary" className="border">
                            {result.tiempo}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg="light" text="dark">
                            {result.categoria}
                          </Badge>
                        </td>
                        <td>
                          {result.fecha ? new Date(result.fecha).toLocaleDateString('es-ES') : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-5">
                  <span className="display-1 text-muted">🏁</span>
                  <h5 className="text-muted mt-3">No hay resultados disponibles</h5>
                  <p className="text-muted">
                    Los resultados de eventos próximos aparecerán aquí después de su finalización
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ResultsPage;