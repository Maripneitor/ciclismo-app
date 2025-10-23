// frontend/src/components/home/StatsSection.jsx - CONECTADO A API
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { homeAPI } from '../../services/api';

const StatsSection = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const statsData = await homeAPI.getHomeStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
      setError('Error cargando estadísticas');
      // Fallback a estadísticas por defecto
      setStats({
        total_usuarios: 1250,
        total_eventos: 89,
        total_inscripciones: 45600,
        total_comunidades: 15
      });
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    { 
      icon: '👥', 
      number: `${stats?.total_usuarios || 0}+`, 
      label: 'Ciclistas Activos' 
    },
    { 
      icon: '📅', 
      number: `${stats?.total_eventos || 0}+`, 
      label: 'Eventos Organizados' 
    },
    { 
      icon: '🛣️', 
      number: stats?.total_inscripciones ? 
        `${(stats.total_inscripciones / 1000).toFixed(0)}K+` : '45.6K', 
      label: 'Km Recorridos' 
    },
    { 
      icon: '🌍', 
      number: `${stats?.total_comunidades || 15}+`, 
      label: 'Comunidades' 
    }
  ];

  if (loading) {
    return (
      <section className="stats-section py-5 bg-white">
        <Container>
          <Row>
            <Col className="text-center">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Cargando estadísticas...</p>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }

  return (
    <section className="stats-section py-5 bg-white">
      <Container>
        {error && (
          <Alert variant="warning" className="mb-4">
            {error}
          </Alert>
        )}
        <Row className="g-4">
          {statsData.map((stat, index) => (
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