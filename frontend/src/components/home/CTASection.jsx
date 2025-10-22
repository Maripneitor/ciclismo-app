// frontend/src/components/home/CTASection.jsx
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CTASection = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="cta-section py-5 bg-primary text-white">
      <Container>
        <Row className="text-center">
          <Col xs={12} lg={8} className="mx-auto">
            <h2 className="display-5 display-lg-4 fw-bold mb-3 mb-lg-4">
              ¿Listo para el <span className="text-warning">Próximo Nivel</span>?
            </h2>
            <p className="lead mb-4 opacity-90">
              Únete a la revolución del ciclismo moderno y descubre una nueva forma de vivir tu pasión
            </p>
            <Button
              as={Link}
              to={isAuthenticated ? "/eventos" : "/registro"}
              variant="warning"
              size="lg"
              className="btn-cta px-4 px-lg-5 py-3 fw-bold"
            >
              {isAuthenticated ? "Explorar Eventos" : "Comenzar Ahora"}
            </Button>
            
            {/* Características adicionales */}
            <div className="mt-5 pt-3">
              <Row className="g-4 text-center">
                <Col xs={6} md={3}>
                  <div className="feature-mini">
                    <div className="feature-icon-small mb-2">🚴‍♂️</div>
                    <div className="feature-text small">Eventos Exclusivos</div>
                  </div>
                </Col>
                <Col xs={6} md={3}>
                  <div className="feature-mini">
                    <div className="feature-icon-small mb-2">📊</div>
                    <div className="feature-text small">Seguimiento Avanzado</div>
                  </div>
                </Col>
                <Col xs={6} md={3}>
                  <div className="feature-mini">
                    <div className="feature-icon-small mb-2">👥</div>
                    <div className="feature-text small">Comunidad Global</div>
                  </div>
                </Col>
                <Col xs={6} md={3}>
                  <div className="feature-mini">
                    <div className="feature-icon-small mb-2">🏆</div>
                    <div className="feature-text small">Sistema de Logros</div>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default CTASection;