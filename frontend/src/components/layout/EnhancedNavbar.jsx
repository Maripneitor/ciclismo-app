// frontend/src/components/layout/EnhancedNavbar.jsx - CORREGIDO
import React, { useState, useEffect } from 'react';
import { 
  Navbar, Nav, Container, Button, Dropdown, Badge, 
  Offcanvas, InputGroup, Form 
} from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext'; // AÑADIDO: Importar useTheme

const EnhancedNavbar = ({ scrolled }) => {
  const { user, logout, isAuthenticated, isAdmin, isOrganizer } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme(); // AÑADIDO: Obtener tema
  const location = useLocation();
  const navigate = useNavigate();
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const API_BASE_URL = import.meta.env.MODE === 'development' 
    ? 'http://localhost:5000' 
    : '';

  const getProfileImageUrl = () => {
    if (user?.profileImageUrl) {
      return `${API_BASE_URL}${user.profileImageUrl}`;
    }
    return null;
  };

  const mainNavigation = [
    { 
      path: '/', 
      label: 'Inicio', 
      icon: '🏠',
      activeIcon: '🏡'
    },
    { 
      path: '/eventos', 
      label: 'Eventos', 
      icon: '🚴‍♂️',
      activeIcon: '🚴‍♀️',
      badge: 'Nuevo'
    },
    { 
      path: '/rutas', 
      label: 'Rutas', 
      icon: '🗺️',
      activeIcon: '🗾'
    },
    { 
      path: '/comunidad', 
      label: 'Comunidad', 
      icon: '👥',
      activeIcon: '🧑‍🤝‍🧑'
    }
  ];

  const userNavigation = [
    { 
      path: '/cuenta/dashboard', 
      label: 'Dashboard', 
      icon: '📊'
    },
    { 
      path: '/cuenta/inscripciones', 
      label: 'Mis Inscripciones', 
      icon: '🎫'
    },
    { 
      path: '/cuenta/equipos', 
      label: 'Mis Equipos', 
      icon: '👥'
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowOffcanvas(false);
  };

  const isActivePath = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const ProfileAvatar = ({ size = 'sm', className = '' }) => {
    const profileImageUrl = getProfileImageUrl();
    
    if (profileImageUrl) {
      return (
        <img 
          src={profileImageUrl} 
          alt="Perfil"
          className={`user-avatar user-avatar-${size} ${className}`}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      );
    }
    
    return (
      <div className={`user-avatar user-avatar-${size} ${className}`}>
        {user?.nombre_completo?.charAt(0) || '👤'}
      </div>
    );
  };

  return (
    <>
      <Navbar 
        expand="lg" 
        fixed="top" 
        className={`modern-navbar ${scrolled ? 'navbar-scrolled' : ''}`}
      >
        <Container>
          <Navbar.Brand as={Link} to="/" className="navbar-brand-enhanced">
            <div className="brand-container">
              <span className="brand-icon">🚴‍♂️</span>
              <div className="brand-text">
                <span className="brand-main">Ciclismo</span>
                <span className="brand-sub">Pro</span>
              </div>
            </div>
          </Navbar.Brand>

          <Navbar.Toggle 
            aria-controls="main-navigation"
            onClick={() => setShowOffcanvas(true)}
            className="navbar-toggler-enhanced"
          >
            <span className="toggler-icon">☰</span>
          </Navbar.Toggle>

          <Navbar.Collapse id="main-navigation">
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

            <Nav className="align-items-center user-actions">
              {/* AÑADIDO: Botón de toggle de tema */}
              <Button
                variant="outline-primary"
                className="theme-toggle me-2"
                onClick={toggleDarkMode}
                aria-label={darkMode ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
                size="sm"
              >
                {darkMode ? '☀️' : '🌙'}
              </Button>

              {isAuthenticated ? (
                <Dropdown align="end" className="user-dropdown">
                  <Dropdown.Toggle variant="outline-primary" className="user-toggle">
                    <ProfileAvatar />
                    <span className="user-name">
                      {user?.nombre_completo?.split(' ')[0] || 'Usuario'}
                    </span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="user-menu">
                    <div className="user-menu-header">
                      <ProfileAvatar size="lg" />
                      <div className="user-info">
                        <div className="user-name">{user?.nombre_completo}</div>
                        <div className="user-email">{user?.email}</div>
                        <Badge bg={user?.rol === 'admin' ? 'danger' : 'primary'}>
                          {user?.rol}
                        </Badge>
                      </div>
                    </div>

                    <Dropdown.Divider />

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
                        </div>
                      </Dropdown.Item>
                    ))}

                    {(isOrganizer || isAdmin) && (
                      <>
                        <Dropdown.Divider />
                        <Dropdown.Item as={Link} to="/organizador/dashboard" className="user-menu-item">
                          <span className="menu-icon">🎯</span>
                          <div className="menu-content">
                            <div className="menu-label">Panel Organizador</div>
                          </div>
                        </Dropdown.Item>
                      </>
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
        </Container>
      </Navbar>

      {/* Offcanvas para móvil */}
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

          {isAuthenticated && (
            <div className="mobile-user-section">
              <div className="mobile-user-info">
                <ProfileAvatar />
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

          <div className="mobile-actions">
            {/* AÑADIDO: Botón de tema en móvil */}
            <div className="d-grid gap-2 mb-3">
              <Button
                variant="outline-secondary"
                onClick={toggleDarkMode}
                className="d-flex align-items-center justify-content-center"
              >
                <span className="me-2">{darkMode ? '☀️' : '🌙'}</span>
                {darkMode ? 'Tema Claro' : 'Tema Oscuro'}
              </Button>
            </div>

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

      <div className="navbar-spacer"></div>

      <style>{`
        .user-avatar {
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
          overflow: hidden;
        }
        
        .user-avatar-sm {
          width: 32px;
          height: 32px;
          font-size: 14px;
        }
        
        .user-avatar-lg {
          width: 60px;
          height: 60px;
          font-size: 24px;
        }
        
        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .theme-toggle {
          transition: all 0.3s ease !important;
        }

        .theme-toggle:hover {
          transform: rotate(15deg) scale(1.1);
        }
      `}</style>
    </>
  );
};

export default EnhancedNavbar;