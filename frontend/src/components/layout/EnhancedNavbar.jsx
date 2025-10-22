// frontend/src/components/layout/EnhancedNavbar.jsx - Nueva versión
import React, { useState, useEffect } from 'react';
import { 
  Navbar, Nav, Container, Button, Dropdown, Badge, 
  Offcanvas, InputGroup, Form 
} from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const EnhancedNavbar = () => {
  const { user, logout, isAuthenticated, isAdmin, isOrganizer } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Navegación principal con iconos mejorados
  const mainNavigation = [
    { 
      path: '/', 
      label: 'Inicio', 
      icon: '🏠',
      activeIcon: '🏡',
      description: 'Página principal'
    },
    { 
      path: '/eventos', 
      label: 'Eventos', 
      icon: '🚴‍♂️',
      activeIcon: '🚴‍♀️',
      description: 'Explorar eventos',
      badge: 'Nuevo'
    },
    { 
      path: '/rutas', 
      label: 'Rutas', 
      icon: '🗺️',
      activeIcon: '🗾',
      description: 'Descubrir rutas'
    },
    { 
      path: '/comunidad', 
      label: 'Comunidad', 
      icon: '👥',
      activeIcon: '🧑‍🤝‍🧑',
      description: 'Conectar con ciclistas'
    },
    { 
      path: '/resultados', 
      label: 'Resultados', 
      icon: '🏆',
      activeIcon: '📊',
      description: 'Ver resultados'
    }
  ];

  // Navegación de usuario autenticado
  const userNavigation = [
    { 
      path: '/cuenta/dashboard', 
      label: 'Dashboard', 
      icon: '📊',
      description: 'Mi panel principal'
    },
    { 
      path: '/cuenta/inscripciones', 
      label: 'Mis Inscripciones', 
      icon: '🎫',
      description: 'Eventos inscritos'
    },
    { 
      path: '/cuenta/equipos', 
      label: 'Mis Equipos', 
      icon: '👥',
      description: 'Gestionar equipos'
    },
    { 
      path: '/cuenta/logros', 
      label: 'Logros', 
      icon: '⭐',
      description: 'Mis logros y estadísticas'
    }
  ];

  // Efecto para detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowOffcanvas(false);
  };

  const isActivePath = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <Navbar 
        expand="lg" 
        fixed="top" 
        className={`modern-navbar ${scrolled ? 'navbar-scrolled' : ''} ${darkMode ? 'navbar-dark' : 'navbar-light'}`}
      >
        <Container>
          {/* Logo y Brand */}
          <Navbar.Brand as={Link} to="/" className="navbar-brand-enhanced">
            <div className="brand-container">
              <span className="brand-icon">🚴‍♂️</span>
              <div className="brand-text">
                <span className="brand-main">Ciclismo</span>
                <span className="brand-sub">Pro</span>
              </div>
            </div>
          </Navbar.Brand>

          {/* Desktop Navigation */}
          <Navbar.Collapse id="main-navigation">
            {/* Navegación Principal */}
            <Nav className="mx-auto main-nav">
              {mainNavigation.map((item) => (
                <Nav.Item key={item.path}>
                  <Nav.Link
                    as={Link}
                    to={item.path}
                    className={`nav-link-enhanced ${isActivePath(item.path) ? 'active' : ''}`}
                  >
                    <span className="nav-icon">
                      {isActivePath(item.path) ? item.activeIcon : item.icon}
                    </span>
                    <span className="nav-label">{item.label}</span>
                    {item.badge && (
                      <Badge bg="danger" className="nav-badge">{item.badge}</Badge>
                    )}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>

            {/* Acciones del Usuario */}
            <Nav className="align-items-center user-actions">
              {/* Buscador */}
              <InputGroup className="search-container">
                <Form.Control
                  placeholder="Buscar eventos, rutas..."
                  className="search-input"
                />
                <Button variant="outline-secondary">
                  🔍
                </Button>
              </InputGroup>

              {/* Toggle de Tema */}
              <Button
                variant="outline-secondary"
                className="theme-toggle"
                onClick={toggleDarkMode}
                title={darkMode ? 'Modo claro' : 'Modo oscuro'}
              >
                {darkMode ? '☀️' : '🌙'}
              </Button>

              {isAuthenticated ? (
                <Dropdown align="end" className="user-dropdown">
                  <Dropdown.Toggle variant="outline-primary" className="user-toggle">
                    <span className="user-avatar">
                      {user?.nombre_completo?.charAt(0) || '👤'}
                    </span>
                    <span className="user-name">
                      {user?.nombre_completo?.split(' ')[0] || 'Usuario'}
                    </span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="user-menu">
                    {/* Header del usuario */}
                    <div className="user-menu-header">
                      <div className="user-avatar-large">
                        {user?.nombre_completo?.charAt(0) || '👤'}
                      </div>
                      <div className="user-info">
                        <div className="user-name">{user?.nombre_completo}</div>
                        <div className="user-email">{user?.email}</div>
                        <Badge bg={user?.rol === 'admin' ? 'danger' : 'primary'}>
                          {user?.rol}
                        </Badge>
                      </div>
                    </div>

                    <Dropdown.Divider />

                    {/* Navegación de usuario */}
                    {userNavigation.map((item) => (
                      <Dropdown.Item
                        key={item.path}
                        as={Link}
                        to={item.path}
                        className="user-menu-item"
                      >
                        <span className="menu-icon">{item.icon}</span>
                        <div className="menu-content">
                          <div className="menu-label">{item.label}</div>
                          <div className="menu-description">{item.description}</div>
                        </div>
                      </Dropdown.Item>
                    ))}

                    {/* Navegación especial por rol */}
                    {(isOrganizer || isAdmin) && (
                      <>
                        <Dropdown.Divider />
                        <Dropdown.Header>Gestión</Dropdown.Header>
                        <Dropdown.Item as={Link} to="/organizador/dashboard" className="user-menu-item">
                          <span className="menu-icon">🎯</span>
                          <div className="menu-content">
                            <div className="menu-label">Panel Organizador</div>
                            <div className="menu-description">Gestionar eventos</div>
                          </div>
                        </Dropdown.Item>
                      </>
                    )}

                    {isAdmin && (
                      <Dropdown.Item as={Link} to="/admin/dashboard" className="user-menu-item">
                        <span className="menu-icon">⚙️</span>
                        <div className="menu-content">
                          <div className="menu-label">Administración</div>
                          <div className="menu-description">Configuración del sistema</div>
                        </div>
                      </Dropdown.Item>
                    )}

                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout} className="user-menu-item logout-item">
                      <span className="menu-icon">🚪</span>
                      <div className="menu-content">
                        <div className="menu-label">Cerrar Sesión</div>
                      </div>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <div className="auth-buttons">
                  <Button 
                    as={Link} 
                    to="/login" 
                    variant="outline-primary"
                    className="me-2"
                  >
                    Iniciar Sesión
                  </Button>
                  <Button 
                    as={Link} 
                    to="/registro" 
                    className="btn-gradient"
                  >
                    Registrarse
                  </Button>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>

          {/* Mobile Toggle */}
          <Button
            variant="outline-primary"
            className="navbar-toggler-enhanced"
            onClick={() => setShowOffcanvas(true)}
          >
            <span className="toggler-icon">☰</span>
          </Button>
        </Container>
      </Navbar>

      {/* Offcanvas Mobile */}
      <Offcanvas 
        show={showOffcanvas} 
        onHide={() => setShowOffcanvas(false)} 
        placement="end"
        className="mobile-navigation"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <div className="brand-container">
              <span className="brand-icon">🚴‍♂️</span>
              <div className="brand-text">
                <span className="brand-main">Ciclismo</span>
                <span className="brand-sub">Pro</span>
              </div>
            </div>
          </Offcanvas.Title>
        </Offcanvas.Header>
        
        <Offcanvas.Body>
          {/* Navegación móvil */}
          <Nav className="flex-column mobile-nav">
            {mainNavigation.map((item) => (
              <Nav.Link
                key={item.path}
                as={Link}
                to={item.path}
                className={`mobile-nav-item ${isActivePath(item.path) ? 'active' : ''}`}
                onClick={() => setShowOffcanvas(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.badge && (
                  <Badge bg="danger" className="nav-badge">{item.badge}</Badge>
                )}
              </Nav.Link>
            ))}
          </Nav>

          {/* Usuario en móvil */}
          {isAuthenticated && (
            <div className="mobile-user-section">
              <div className="mobile-user-info">
                <span className="user-avatar">{user?.nombre_completo?.charAt(0) || '👤'}</span>
                <div className="user-details">
                  <div className="user-name">{user?.nombre_completo}</div>
                  <div className="user-email">{user?.email}</div>
                </div>
              </div>
              
              <Nav className="flex-column mobile-user-nav">
                {userNavigation.map((item) => (
                  <Nav.Link
                    key={item.path}
                    as={Link}
                    to={item.path}
                    className="mobile-user-nav-item"
                    onClick={() => setShowOffcanvas(false)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {item.label}
                  </Nav.Link>
                ))}
              </Nav>
            </div>
          )}

          {/* Acciones móviles */}
          <div className="mobile-actions">
            <div className="d-grid gap-2">
              {!isAuthenticated ? (
                <>
                  <Button 
                    as={Link} 
                    to="/login" 
                    variant="outline-primary"
                    onClick={() => setShowOffcanvas(false)}
                  >
                    Iniciar Sesión
                  </Button>
                  <Button 
                    as={Link} 
                    to="/registro" 
                    variant="primary"
                    onClick={() => setShowOffcanvas(false)}
                  >
                    Registrarse
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline-danger" 
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </Button>
              )}
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Espacio para navbar fixed */}
      <div className="navbar-spacer"></div>
    </>
  );
};

export default EnhancedNavbar;