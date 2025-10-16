import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={6}>
            <h5>🚴‍♂️ Ciclismo App</h5>
            <p className="mb-0">
              Tu plataforma para gestionar eventos de ciclismo
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <p className="mb-0">
              &copy; 2024 Ciclismo App. Todos los derechos reservados.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;