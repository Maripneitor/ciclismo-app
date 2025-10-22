// frontend/src/components/home/HeroSection.jsx - VERSIÓN CON MÁS ANIMACIONES
import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { initCounters } from '../../utils/counterAnimation';

const HeroSection = () => {
  const { isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const timer = setTimeout(() => {
      initCounters();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero-section position-relative overflow-hidden">
      {/* Fondo del Hero con partículas animadas */}
      <div className="hero-bg-container">
        <div className="hero-gradient-bg"></div>
        <ParticlesBackground />
      </div>

      {/* Contenido Hero */}
      <Container>
        <Row className="min-vh-100 align-items-center">
          <Col xs={12} lg={8} className="hero-content text-white text-center text-lg-start">
            <AnimatedBadge />
            
            {/* Titular Principal con animación de escritura mejorada */}
            <EnhancedAnimatedTitle />
            
            {/* Subtítulo con efecto de máquina de escribir */}
            <TypingSubtitle />
            
            {/* Estadísticas con contadores animados */}
            <AnimatedStats />
            
            <div className="hero-actions d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-2 gap-sm-3 slide-up delay-2">
              {!isAuthenticated ? (
                <>
                  <AnimatedButton 
                    as={Link}
                    to="/registro"
                    className="btn-hero-primary"
                    size="lg"
                    delay="0s"
                  >
                    🚀 COMENZAR GRATIS
                  </AnimatedButton>
                  <AnimatedButton 
                    as={Link}
                    to="/eventos"
                    className="btn-hero-secondary"
                    variant="outline-light"
                    size="lg"
                    delay="0.2s"
                  >
                    📅 EXPLORAR EVENTOS
                  </AnimatedButton>
                </>
              ) : (
                <>
                  <AnimatedButton 
                    as={Link}
                    to="/cuenta/dashboard"
                    className="btn-hero-primary"
                    size="lg"
                    delay="0s"
                  >
                    📊 MI DASHBOARD
                  </AnimatedButton>
                  <AnimatedButton 
                    as={Link}
                    to="/eventos"
                    className="btn-hero-secondary"
                    variant="outline-light"
                    size="lg"
                    delay="0.2s"
                  >
                    🎯 NUEVO EVENTO
                  </AnimatedButton>
                </>
              )}
            </div>
          </Col>
          
          {/* Visual Mobile/Tablet con ciclista animado */}
          <Col xs={12} lg={4} className="hero-visual mt-4 mt-lg-0">
            <EnhancedCyclingAnimation />
          </Col>
        </Row>
      </Container>

      {/* Scroll Indicator animado */}
      <AnimatedScrollIndicator />
    </section>
  );
};

// Badge con animación de entrada
const AnimatedBadge = () => {
  return (
    <Badge bg="warning" text="dark" className="hero-badge mb-3 badge-pop-in">
      🚀 PLATAFORMA INNOVADORA
    </Badge>
  );
};

// Componente de título con animación de escritura mejorada
const EnhancedAnimatedTitle = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentLine, setCurrentLine] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  const lines = [
    "VIVE EL CICLISMO",
    "COMO NUNCA ANTES"
  ];

  useEffect(() => {
    if (currentLine < lines.length) {
      const currentLineText = lines[currentLine];
      let currentCharIndex = 0;

      const typeLine = () => {
        if (currentCharIndex <= currentLineText.length) {
          const newText = lines.slice(0, currentLine).join('\n') + 
                         (currentLine > 0 ? '\n' : '') + 
                         currentLineText.slice(0, currentCharIndex);
          setDisplayedText(newText);
          currentCharIndex++;
          setTimeout(typeLine, 100);
        } else {
          setTimeout(() => {
            setCurrentLine(prev => prev + 1);
          }, 500);
        }
      };

      typeLine();
    } else {
      // Animación del cursor después de completar todo el texto
      const cursorInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);

      return () => clearInterval(cursorInterval);
    }
  }, [currentLine]);

  const renderText = () => {
    return displayedText.split('\n').map((line, index) => (
      <div key={index} className={`title-line ${index === 1 ? 'highlight-line' : ''}`}>
        {line}
        {index === displayedText.split('\n').length - 1 && showCursor && (
          <span className="typing-cursor">|</span>
        )}
      </div>
    ));
  };

  return (
    <div className="enhanced-title display-4 display-lg-2 fw-bold mb-3 mb-lg-4">
      {renderText()}
    </div>
  );
};

// Subtítulo con efecto de máquina de escribir
const TypingSubtitle = () => {
  const [displayedSubtitle, setDisplayedSubtitle] = useState('');
  const [subtitleComplete, setSubtitleComplete] = useState(false);

  const fullSubtitle = "Tecnología avanzada, comunidad activa y experiencias únicas sobre dos ruedas";

  useEffect(() => {
    let currentIndex = 0;

    const typeSubtitle = () => {
      if (currentIndex <= fullSubtitle.length) {
        setDisplayedSubtitle(fullSubtitle.slice(0, currentIndex));
        currentIndex++;
        setTimeout(typeSubtitle, 50);
      } else {
        setSubtitleComplete(true);
      }
    };

    // Iniciar después de que el título termine
    const timer = setTimeout(typeSubtitle, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <p className="hero-subtitle lead mb-4 typing-subtitle">
      {displayedSubtitle}
      {!subtitleComplete && <span className="typing-cursor">|</span>}
    </p>
  );
};

// Componente de estadísticas con contadores
const AnimatedStats = () => {
  return (
    <div className="hero-stats d-flex justify-content-center justify-content-lg-start gap-4 my-4 stats-fade-in">
      <div className="stat-item text-center stat-pop-in" style={{ animationDelay: '1.2s' }}>
        <div className="stat-number h4 mb-1 text-warning">
          <span className="counter" data-target="89">0+</span>
        </div>
        <div className="stat-label small text-light">Eventos</div>
      </div>
      <div className="stat-item text-center stat-pop-in" style={{ animationDelay: '1.4s' }}>
        <div className="stat-number h4 mb-1 text-warning">
          <span className="counter" data-target="1250">0+</span>
        </div>
        <div className="stat-label small text-light">Ciclistas</div>
      </div>
      <div className="stat-item text-center stat-pop-in" style={{ animationDelay: '1.6s' }}>
        <div className="stat-number h4 mb-1 text-warning">
          <span className="counter" data-target="45">0K</span>
        </div>
        <div className="stat-label small text-light">Km Recorridos</div>
      </div>
    </div>
  );
};

// Botones con animación de entrada escalonada
const AnimatedButton = ({ children, delay = '0s', ...props }) => {
  return (
    <Button 
      {...props}
      className={`btn-animated ${props.className || ''}`}
      style={{ animationDelay: delay }}
    >
      {children}
    </Button>
  );
};

// Animación del ciclista mejorada
const EnhancedCyclingAnimation = () => {
  const [bounce, setBounce] = useState(0);
  const [pedalRotation, setPedalRotation] = useState(0);
  const [wheelRotation, setWheelRotation] = useState(0);

  useEffect(() => {
    const bounceInterval = setInterval(() => {
      setBounce(prev => (prev + 1) % 100);
    }, 50);

    const pedalInterval = setInterval(() => {
      setPedalRotation(prev => (prev + 10) % 360);
    }, 100);

    const wheelInterval = setInterval(() => {
      setWheelRotation(prev => (prev + 5) % 360);
    }, 50);

    return () => {
      clearInterval(bounceInterval);
      clearInterval(pedalInterval);
      clearInterval(wheelInterval);
    };
  }, []);

  const bounceHeight = Math.sin((bounce / 100) * Math.PI * 2) * 20;
  const moveDistance = (bounce / 100) * 50;

  return (
    <div className="floating-elements d-flex justify-content-center">
      <div className="enhanced-cycling-animation">
        <div 
          className="cycling-scene"
          style={{ transform: `translateX(${moveDistance}px)` }}
        >
          <div 
            className="bike-container"
            style={{ transform: `translateY(${bounceHeight}px)` }}
          >
            <div className="bicycle">
              <div className="frame"></div>
              <div 
                className="front-wheel wheel"
                style={{ transform: `rotate(${wheelRotation}deg)` }}
              >
                <div className="wheel-spoke"></div>
                <div className="wheel-spoke"></div>
                <div className="wheel-spoke"></div>
              </div>
              <div 
                className="rear-wheel wheel"
                style={{ transform: `rotate(${wheelRotation}deg)` }}
              >
                <div className="wheel-spoke"></div>
                <div className="wheel-spoke"></div>
                <div className="wheel-spoke"></div>
              </div>
              <div 
                className="pedals"
                style={{ transform: `rotate(${pedalRotation}deg)` }}
              >
                <div className="pedal left-pedal"></div>
                <div className="pedal right-pedal"></div>
              </div>
              <div className="cyclist">
                <div className="body"></div>
                <div className="head"></div>
                <div className="arms"></div>
                <div className="legs"></div>
              </div>
            </div>
          </div>
          <div className="moving-road">
            <div className="road-line"></div>
            <div className="road-line"></div>
            <div className="road-line"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Indicador de scroll animado
const AnimatedScrollIndicator = () => {
  const [bounce, setBounce] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBounce(prev => (prev + 1) % 100);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const bounceHeight = Math.sin((bounce / 100) * Math.PI * 2) * 10;

  return (
    <div className="scroll-indicator-enhanced">
      <div 
        className="scroll-arrow-enhanced"
        style={{ transform: `translateY(${bounceHeight}px)` }}
      >
        <div className="arrow-line"></div>
        <div className="arrow-line"></div>
        <div className="arrow-line"></div>
      </div>
      <div className="scroll-text">Desplázate</div>
    </div>
  );
};

// Fondo con partículas animadas
const ParticlesBackground = () => {
  return (
    <div className="particles-container">
      <div className="particle particle-1"></div>
      <div className="particle particle-2"></div>
      <div className="particle particle-3"></div>
      <div className="particle particle-4"></div>
      <div className="particle particle-5"></div>
    </div>
  );
};

export default HeroSection;