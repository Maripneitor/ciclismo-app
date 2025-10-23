// frontend/src/components/home/HeroSection.jsx - CORREGIDO
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const HeroSection = () => {
  const { isAuthenticated } = useAuth();
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [displayedSubtitle, setDisplayedSubtitle] = useState('');
  const [titleComplete, setTitleComplete] = useState(false);
  const [subtitleComplete, setSubtitleComplete] = useState(false);

  const fullTitle = "VIVE EL CICLISMO COMO NUNCA ANTES";
  const fullSubtitle = "Tecnología avanzada, comunidad activa y experiencias únicas sobre dos ruedas";

  useEffect(() => {
    // Animación del título
    let currentIndex = 0;
    const typeTitle = () => {
      if (currentIndex <= fullTitle.length) {
        setDisplayedTitle(fullTitle.slice(0, currentIndex));
        currentIndex++;
        setTimeout(typeTitle, 100);
      } else {
        setTitleComplete(true);
        // Iniciar subtítulo después de una pausa
        setTimeout(() => {
          let subtitleIndex = 0;
          const typeSubtitle = () => {
            if (subtitleIndex <= fullSubtitle.length) {
              setDisplayedSubtitle(fullSubtitle.slice(0, subtitleIndex));
              subtitleIndex++;
              setTimeout(typeSubtitle, 50);
            } else {
              setSubtitleComplete(true);
            }
          };
          typeSubtitle();
        }, 500);
      }
    };

    typeTitle();
  }, []);

  return (
    <section className="hero-section position-relative overflow-hidden">
      <div className="hero-bg-container">
        <div className="hero-gradient-bg"></div>
      </div>

      <Container>
        <Row className="min-vh-100 align-items-center">
          <Col xs={12} lg={8} className="hero-content text-white text-center text-lg-start">
            <Badge bg="warning" text="dark" className="hero-badge mb-3">
              PLATAFORMA INNOVADORA
            </Badge>
            
            <div className="enhanced-title display-4 display-lg-2 fw-bold mb-3 mb-lg-4">
              {displayedTitle}
              {!titleComplete && <span className="typing-cursor">|</span>}
            </div>
            
            <p className="hero-subtitle lead mb-4">
              {displayedSubtitle}
              {!subtitleComplete && <span className="typing-cursor">|</span>}
            </p>
            
            <div className="hero-stats d-flex justify-content-center justify-content-lg-start gap-4 my-4">
              <div className="stat-item text-center">
                <div className="stat-number h4 mb-1 text-warning">
                  89+
                </div>
                <div className="stat-label small text-light">Eventos</div>
              </div>
              <div className="stat-item text-center">
                <div className="stat-number h4 mb-1 text-warning">
                  1250+
                </div>
                <div className="stat-label small text-light">Ciclistas</div>
              </div>
              <div className="stat-item text-center">
                <div className="stat-number h4 mb-1 text-warning">
                  45K
                </div>
                <div className="stat-label small text-light">Km Recorridos</div>
              </div>
            </div>
            
            <div className="hero-actions d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-2 gap-sm-3">
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
          
          <Col xs={12} lg={4} className="hero-visual mt-4 mt-lg-0">
            <div className="simple-cycling-animation">
              <div className="bike">
                <div className="bike-frame">
                  <div className="wheel front-wheel"></div>
                  <div className="wheel back-wheel"></div>
                  <div className="cyclist">
                    <div className="cyclist-body"></div>
                  </div>
                </div>
              </div>
              <div className="road"></div>
            </div>
          </Col>
        </Row>
      </Container>

      <div className="scroll-indicator">
        <div className="scroll-arrow"></div>
        <div className="scroll-text">Desplázate</div>
      </div>
    </section>
  );
};

export default HeroSection;