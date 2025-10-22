// frontend/src/components/home/HeroSection.jsx
import React, { useState, useRef } from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const HeroSection = () => {
  const { isAuthenticated } = useAuth();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  return (
    <section className="hero-section position-relative overflow-hidden">
      {/* Video de Fondo */}
      <div className="hero-video-container">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster="/videos/cycling-hero-poster.jpg"
          onLoadedData={handleVideoLoad}
          className="hero-video"
        >
          <source src="/videos/cycling-hero.mp4" type="video/mp4" />
          {/* Fallback para navegadores que no soportan video */}
          <div className="hero-fallback"></div>
        </video>
        <div className="video-overlay"></div>
      </div>

      {/* Contenido Hero */}
      <Container>
        <Row className="min-vh-100 align-items-center">
          <Col xs={12} lg={8} className="hero-content text-white text-center text-lg-start">
            <Badge bg="warning" text="dark" className="hero-badge mb-3 animate-fade-in">
              🚀 PLATAFORMA INNOVADORA
            </Badge>
            
            {/* Titular Principal Animado */}
            <AnimatedTitle />
            
            <p className="hero-subtitle lead mb-4 animate-slide-up delay-1">
              Tecnología avanzada, comunidad activa y experiencias únicas sobre dos ruedas
            </p>
            
            {/* Contador de Estadísticas */}
            <StatsCounter />
            
            <div className="hero-actions d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-2 gap-sm-3 animate-slide-up delay-2">
              {!isAuthenticated ? (
                <>
                  <Button
                    as={Link}
                    to="/registro"
                    className="btn-hero-primary"
                    size="lg"
                  >
                    COMENZAR GRATIS
                  </Button>
                  <Button
                    as={Link}
                    to="/eventos"
                    className="btn-hero-secondary"
                    variant="outline-light"
                    size="lg"
                  >
                    EXPLORAR EVENTOS
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    as={Link}
                    to="/cuenta/dashboard"
                    className="btn-hero-primary"
                    size="lg"
                  >
                    MI DASHBOARD
                  </Button>
                  <Button
                    as={Link}
                    to="/eventos"
                    className="btn-hero-secondary"
                    variant="outline-light"
                    size="lg"
                  >
                    NUEVO EVENTO
                  </Button>
                </>
              )}
            </div>
          </Col>
          
          {/* Visual Mobile/Tablet */}
          <Col xs={12} lg={4} className="hero-visual mt-4 mt-lg-0">
            <div className="floating-elements d-flex justify-content-center">
              <div className="cycling-animation">
                <span className="bike-icon">🚴‍♂️</span>
                <div className="moving-road"></div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      
      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <div className="scroll-arrow"></div>
      </div>
    </section>
  );
};

// Componente para el título animado
const AnimatedTitle = () => {
  const [displayedTitle, setDisplayedTitle] = useState('');
  const fullTitle = "VIVE EL CICLISMO COMO NUNCA ANTES";
  const highlightedText = "CICLISMO";

  React.useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullTitle.length) {
        setDisplayedTitle(fullTitle.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 80);

    return () => clearInterval(typingInterval);
  }, []);

  const renderAnimatedTitle = () => {
    const beforeHighlight = fullTitle.split(highlightedText)[0];
    const afterHighlight = fullTitle.split(highlightedText)[1];
    
    return (
      <h1 className="hero-title display-4 display-lg-3 fw-bold mb-3 mb-lg-4">
        {displayedTitle.includes(highlightedText) ? (
          <>
            {beforeHighlight}
            <span className="text-warning highlight-word">{highlightedText}</span>
            {afterHighlight ? afterHighlight.slice(0, displayedTitle.length - beforeHighlight.length - highlightedText.length) : ''}
          </>
        ) : (
          displayedTitle
        )}
        {displayedTitle.length === fullTitle.length && (
          <span className="typing-cursor">|</span>
        )}
      </h1>
    );
  };

  return renderAnimatedTitle();
};

// Componente para el contador de estadísticas
const StatsCounter = () => {
  const [counters, setCounters] = useState({
    events: 0,
    users: 0,
    kilometers: 0
  });

  const targetCounters = {
    events: 89,
    users: 1250,
    kilometers: 45600
  };

  React.useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    const animateCounter = (key, target) => {
      let current = 0;
      const increment = target / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setCounters(prev => ({
          ...prev,
          [key]: Math.floor(current)
        }));
      }, stepDuration);
    };

    // Iniciar animaciones con delays diferentes
    setTimeout(() => animateCounter('events', targetCounters.events), 500);
    setTimeout(() => animateCounter('users', targetCounters.users), 700);
    setTimeout(() => animateCounter('kilometers', targetCounters.kilometers), 900);
  }, []);

  return (
    <div className="hero-stats d-flex justify-content-center justify-content-lg-start gap-4 my-4 animate-fade-in delay-3">
      <div className="stat-item text-center">
        <div className="stat-number h4 mb-1">{counters.events}+</div>
        <div className="stat-label small">Eventos</div>
      </div>
      <div className="stat-item text-center">
        <div className="stat-number h4 mb-1">{counters.users}+</div>
        <div className="stat-label small">Ciclistas</div>
      </div>
      <div className="stat-item text-center">
        <div className="stat-number h4 mb-1">{counters.kilometers}K</div>
        <div className="stat-label small">Km Recorridos</div>
      </div>
    </div>
  );
};

export default HeroSection;