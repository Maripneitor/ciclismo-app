// frontend/src/components/home/StatsSection.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const StatsSection = () => {
  const stats = [
    { icon: '👥', number: '1,250+', label: 'Ciclistas Activos' },
    { icon: '📅', number: '89+', label: 'Eventos Organizados' },
    { icon: '🛣️', number: '45,600', label: 'Km Recorridos' },
    { icon: '🌍', number: '15+', label: 'Comunidades' }
  ];

  return (
    <section className="stats-section py-5 bg-white">
      <Container>
        <Row className="g-4">
          {stats.map((stat, index) => (
            <Col key={index} xs={6} md={3}>
              <div className="stat-card text-center h-100">
                <div className="stat-icon mb-3">{stat.icon}</div>
                <h3 className="stat-number h2 text-primary fw-bold">{stat.number}</h3>
                <p className="stat-label text-muted mb-0">{stat.label}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default StatsSection;