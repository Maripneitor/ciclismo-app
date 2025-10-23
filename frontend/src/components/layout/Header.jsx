// frontend/src/components/layout/Header.jsx - Versión Mejorada
import React, { useState, useCallback, useEffect } from 'react';
import { Navbar, Nav, Container, Button, Dropdown, InputGroup, Form, Offcanvas } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Header = () => {
    const { user, logout, isAuthenticated, isAdmin, isOrganizer } = useAuth();
    const { darkMode, toggleDarkMode } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [searchQuery, setSearchQuery] = useState('');
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setShowOffcanvas(false);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        // Implementar búsqueda aquí
    };

    const closeOffcanvas = () => setShowOffcanvas(false);

    // Navegación principal
    const mainNavItems = [
        { path: '/', label: 'Inicio', icon: '' },
        { path: '/eventos', label: 'Eventos', icon: '' },
        { path: '/resultados', label: 'Resultados', icon: '' },
        { path: '/comunidad', label: 'Comunidad', icon: '' },
    ];

    // Navegación de usuario
    const userNavItems = [
        { path: '/cuenta/dashboard', label: 'Mi Dashboard', icon: '📊' },
        { path: '/cuenta/perfil', label: 'Mi Perfil', icon: '👤' },
        { path: '/cuenta/inscripciones', label: 'Mis Inscripciones', icon: '📝' },
        { path: '/cuenta/equipos', label: 'Mis Equipos', icon: '👥' },
    ];

    return (
        <>
            <Navbar expand="lg" className="modern-navbar" fixed="top">
                <Container>
                    {/* Logo y Brand */}
                    <Navbar.Brand as={Link} to="/" className="navbar-brand-modern d-flex align-items-center">
                        <span className="brand-icon me-2">🚴</span>
                        <span className="brand-text d-none d-sm-block">
                            <strong>Ciclismo</strong>App
                        </span>
                    </Navbar.Brand>

                    {/* Toggle para móvil */}
                    <Navbar.Toggle 
                        aria-controls="basic-navbar-nav" 
                        onClick={() => setShowOffcanvas(true)}
                        className="border-0"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </Navbar.Toggle>

                    {/* Navegación Desktop */}
                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
                        {/* Navegación Principal */}
                        <Nav className="mx-auto">
                            {mainNavItems.map((item) => (
                                <Nav.Link
                                    key={item.path}
                                    as={Link}
                                    to={item.path}
                                    className={`nav-link-modern mx-2 ${location.pathname === item.path ? 'active' : ''}`}
                                >
                                    <span className="d-none d-lg-inline">{item.icon} </span>
                                    {item.label}
                                </Nav.Link>
                            ))}
                        </Nav>

                        {/* Acciones del Usuario */}
                        <Nav className="align-items-center">
                            {/* Toggle de Tema */}
                            <Button
                                variant="outline-light"
                                className="theme-toggle me-2"
                                onClick={toggleDarkMode}
                                aria-label={darkMode ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
                                size="sm"
                            >
                                {darkMode ? '☀️' : '🌙'}
                            </Button>

                            {isAuthenticated ? (
                                <Dropdown align="end">
                                    <Dropdown.Toggle 
                                        variant="outline-light" 
                                        className="user-dropdown-toggle d-flex align-items-center"
                                        size="sm"
                                    >
                                        <span className="user-avatar me-2">👤</span>
                                        <span className="d-none d-md-inline">
                                            {user?.nombre || user?.nombre_completo || 'Usuario'}
                                        </span>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="user-dropdown-menu">
                                        {userNavItems.map((item) => (
                                            <Dropdown.Item 
                                                key={item.path}
                                                as={Link} 
                                                to={item.path}
                                                className="d-flex align-items-center"
                                            >
                                                <span className="me-2">{item.icon}</span>
                                                {item.label}
                                            </Dropdown.Item>
                                        ))}
                                        
                                        {(isOrganizer || isAdmin) && (
                                            <>
                                                <Dropdown.Divider />
                                                <Dropdown.Item as={Link} to="/organizador/dashboard" className="d-flex align-items-center">
                                                    <span className="me-2">🎯</span>
                                                    Panel Organizador
                                                </Dropdown.Item>
                                            </>
                                        )}
                                        
                                        {isAdmin && (
                                            <Dropdown.Item as={Link} to="/admin/dashboard" className="d-flex align-items-center">
                                                <span className="me-2">⚙️</span>
                                                Administración
                                            </Dropdown.Item>
                                        )}
                                        
                                        <Dropdown.Divider />
                                        <Dropdown.Item onClick={handleLogout} className="text-danger d-flex align-items-center">
                                            <span className="me-2">🚪</span>
                                            Cerrar Sesión
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            ) : (
                                <div className="auth-buttons d-flex gap-2">
                                    <Button 
                                        as={Link} 
                                        to="/login" 
                                        variant="outline-light"
                                        size="sm"
                                    >
                                        Iniciar Sesión
                                    </Button>
                                    <Button 
                                        as={Link} 
                                        to="/registro" 
                                        className="btn-gradient"
                                        size="sm"
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
            <Offcanvas show={showOffcanvas} onHide={closeOffcanvas} placement="end">
                <Offcanvas.Header closeButton className="border-bottom">
                    <Offcanvas.Title>
                        <span className="brand-icon me-2">🚴</span>
                        <strong>Ciclismo</strong>App
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {/* Navegación móvil */}
                    <Nav className="flex-column">
                        {mainNavItems.map((item) => (
                            <Nav.Link
                                key={item.path}
                                as={Link}
                                to={item.path}
                                className="nav-link-mobile d-flex align-items-center py-3 border-bottom"
                                onClick={closeOffcanvas}
                            >
                                <span className="me-3 fs-5">{item.icon}</span>
                                {item.label}
                            </Nav.Link>
                        ))}
                    </Nav>

                    {/* Usuario en móvil */}
                    {isAuthenticated && (
                        <div className="mt-4 pt-3 border-top">
                            <h6 className="text-muted mb-3">Mi Cuenta</h6>
                            <Nav className="flex-column">
                                {userNavItems.map((item) => (
                                    <Nav.Link
                                        key={item.path}
                                        as={Link}
                                        to={item.path}
                                        className="nav-link-mobile d-flex align-items-center py-2"
                                        onClick={closeOffcanvas}
                                    >
                                        <span className="me-3">{item.icon}</span>
                                        {item.label}
                                    </Nav.Link>
                                ))}
                            </Nav>
                        </div>
                    )}

                    {/* Acciones en móvil */}
                    <div className="mt-auto pt-4">
                        <div className="d-grid gap-2">
                            <Button
                                variant="outline-primary"
                                onClick={toggleDarkMode}
                                className="d-flex align-items-center justify-content-center"
                            >
                                <span className="me-2">{darkMode ? '☀️' : '🌙'}</span>
                                {darkMode ? 'Tema Claro' : 'Tema Oscuro'}
                            </Button>
                            
                            {!isAuthenticated ? (
                                <>
                                    <Button 
                                        as={Link} 
                                        to="/login" 
                                        variant="outline-primary"
                                        onClick={closeOffcanvas}
                                    >
                                        Iniciar Sesión
                                    </Button>
                                    <Button 
                                        as={Link} 
                                        to="/registro" 
                                        variant="primary"
                                        onClick={closeOffcanvas}
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

            {/* Espacio para el navbar fixed */}
            <div style={{ height: '76px' }}></div>
        </>
    );
};

export default Header;