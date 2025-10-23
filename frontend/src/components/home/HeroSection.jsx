// frontend/src/components/home/HeroSection.jsx - CON CONTADORES ANIMADOS
import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { homeAPI } from '../../services/api';

const HeroSection = () => {
  const { isAuthenticated } = useAuth();
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [displayedSubtitle, setDisplayedSubtitle] = useState('');
  const [titleComplete, setTitleComplete] = useState(false);
  const [subtitleComplete, setSubtitleComplete] = useState(false);
  const [stats, setStats] = useState({ events: 0, cyclists: 0, distance: 0 });
  const [animatedStats, setAnimatedStats] = useState({ events: 0, cyclists: 0, distance: 0 });
  const sectionRef = useRef(null);

  const fullTitle = "VIVE EL CICLISMO COMO NUNCA ANTES";
  const fullSubtitle = "Tecnología avanzada, comunidad activa y experiencias únicas sobre dos ruedas";

  // Cargar estadísticas reales
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const statsData = await homeAPI.getHomeStats();
      setStats({
        events: statsData.total_eventos || 89,
        cyclists: statsData.total_usuarios || 1250,
        distance: 45 // En una implementación real, esto vendría de la API
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      // Valores por defecto
      setStats({ events: 89, cyclists: 1250, distance: 45 });
    }
  };

  // Animación de escritura
  useEffect(() => {
    let currentIndex = 0;
    const typeTitle = () => {
      if (currentIndex <= fullTitle.length) {
        setDisplayedTitle(fullTitle.slice(0, currentIndex));
        currentIndex++;
        setTimeout(typeTitle, 100);
      } else {
        setTitleComplete(true);
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

  // Animación de contadores con IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animateCounters();
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [stats]);

  const animateCounters = () => {
    const duration = 2000; // 2 segundos
    const steps = 60;
    const stepDuration = duration / steps;

    Object.keys(stats).forEach(statKey => {
      const targetValue = stats[statKey];
      let currentStep = 0;

      const counterInterval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const currentValue = Math.floor(targetValue * progress);

        setAnimatedStats(prev => ({
          ...prev,
          [statKey]: currentValue
        }));

        if (currentStep >= steps) {
          clearInterval(counterInterval);
          setAnimatedStats(prev => ({
            ...prev,
            [statKey]: targetValue
          }));
        }
      }, stepDuration);
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };

  return (
    <section ref={sectionRef} className="hero-section position-relative overflow-hidden">
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
                  {formatNumber(animatedStats.events)}+
                </div>
                <div className="stat-label small text-light">Eventos</div>
              </div>
              <div className="stat-item text-center">
                <div className="stat-number h4 mb-1 text-warning">
                  {formatNumber(animatedStats.cyclists)}+
                </div>
                <div className="stat-label small text-light">Ciclistas</div>
              </div>
              <div className="stat-item text-center">
                <div className="stat-number h4 mb-1 text-warning">
                  {animatedStats.distance}K
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
                    to="/calendario"
                    className="btn-hero-secondary"
                    variant="outline-light"
                    size="lg"
                  >
                    VER CALENDARIO
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