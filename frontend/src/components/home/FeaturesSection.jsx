// frontend/src/components/home/FeaturesSection.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const FeaturesSection = () => {
  const features = [
    {
      id: 1,
      icon: '📅',
      title: 'Gestión de Eventos',
      description: 'Crea, organiza y gestiona eventos de ciclismo de forma sencilla y profesional.',
      color: 'primary'
    },
    {
      id: 2,
      icon: '👥',
      title: 'Comunidad Activa',
      description: 'Conecta con miles de ciclistas, comparte rutas y participa en desafíos.',
      color: 'success'
    },
    {
      id: 3,
      icon: '📊',
      title: 'Seguimiento de Resultados',
      description: 'Analiza tu rendimiento, compara tiempos y mejora tus marcas personales.',
      color: 'warning'
    },
    {
      id: 4,
      icon: '🏆',
      title: 'Sistema de Logros',
      description: 'Desbloquea logros, gana insignias y muestra tu progreso en la comunidad.',
      color: 'info'
    }
  ];

  return (
    <section className="features-section py-5">
      <Container>
        <Row className="mb-5">
          <Col className="text-center">
            <h2 className="section-title h1 display-4 fw-bold mb-3">
              Características <span className="text-primary">Destacadas</span>
            </h2>
            <p className="section-subtitle lead text-muted">
              Todo lo que necesitas para tu experiencia ciclista en un solo lugar
            </p>
          </Col>
        </Row>

        <Row className="g-4">
          {features.map((feature, index) => (
            <Col key={feature.id} xs={12} md={6} lg={3}>
              <FeatureCard 
                feature={feature} 
                index={index}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

const FeatureCard = ({ feature, index }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div 
      className={`feature-card card h-100 border-0 shadow-sm ${isHovered ? 'feature-card-hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationDelay: `${index * 0.1}s`
      }}
    >
      <div className="card-body text-center p-4">
        {/* Icono Animado */}
        <div className={`feature-icon mb-3 icon-${feature.color} ${isHovered ? 'icon-hovered' : ''}`}>
          <span className="feature-icon-char">{feature.icon}</span>
          <div className="icon-pulse"></div>
        </div>
        
        {/* Contenido */}
        <h5 className="feature-title fw-bold mb-3">{feature.title}</h5>
        <p className="feature-description text-muted mb-0">
          {feature.description}
        </p>
        
        {/* Efecto de Brillo en Hover */}
        <div className="feature-glow"></div>
      </div>
    </div>
  );
};

export default FeaturesSection;