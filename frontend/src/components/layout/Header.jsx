import React, { useState, useCallback, useEffect } from 'react';
import { Navbar, Nav, Container, Button, Dropdown, InputGroup, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Header = () => {
    const { user, logout, isAuthenticated, isAdmin, isOrganizer } = useAuth();
    const navigate = useNavigate();
    
    // Estados para el tema y búsqueda
    const [darkMode, setDarkMode] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Función para cambiar el tema
    const toggleDarkMode = useCallback(() => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem('darkMode', JSON.stringify(newDarkMode));

        // Aplicar clase al body
        if (newDarkMode) {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
        }
    }, [darkMode]);

    // Cargar tema al inicio
    useEffect(() => {
        const savedTheme = localStorage.getItem('darkMode');
        if (savedTheme !== null) {
            const isDark = JSON.parse(savedTheme);
            setDarkMode(isDark);
            if (isDark) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.add('light-mode');
            }
        } else {
            document.body.classList.add('dark-mode');
        }
    }, []);

    // Función de búsqueda (puedes adaptarla según tus necesidades)
    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.length > 2) {
            // Aquí implementarías la lógica de búsqueda real
            // Por ahora, solo cerramos los resultados
            setShowSearchResults(false);
        } else {
            setShowSearchResults(false);
        }
    };

    return (
        <Navbar expand="lg" className="modern-navbar" fixed="top">
            <Container>
                <Navbar.Brand as={Link} to="/" className="navbar-brand-modern">
                    <span className="brand-icon">🚴</span>
                    <strong>Ciclismo</strong>App
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/" className="nav-link-modern">
                            Inicio
                        </Nav.Link>
                        <Nav.Link as={Link} to="/eventos" className="nav-link-modern">
                            Eventos
                        </Nav.Link>
                        <Nav.Link as={Link} to="/resultados" className="nav-link-modern">
                            Resultados
                        </Nav.Link>
                        <Nav.Link as={Link} to="/comunidad" className="nav-link-modern">
                            Comunidad
                        </Nav.Link>
                        <Nav.Link as={Link} to="/plus" className="nav-link-modern">
                            Planes Plus
                        </Nav.Link>
                        <Nav.Link as={Link} to="/contacto" className="nav-link-modern">
                            Contacto
                        </Nav.Link>
                    </Nav>

                    {/* Barra de Búsqueda */}
                    <div className="search-container me-3">
                        <InputGroup className="modern-search">
                            <Form.Control
                                type="text"
                                placeholder="Buscar eventos, rutas..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="search-input"
                                aria-label="Buscar eventos"
                                role="searchbox"
                            />
                            <Button variant="outline-primary" className="search-btn">
                                🔍
                            </Button>
                        </InputGroup>
                        
                        {showSearchResults && (
                            <div className="search-results-dropdown">
                                {searchResults.length > 0 ? (
                                    searchResults.map(event => (
                                        <div key={event.id} className="search-result-item">
                                            <Link 
                                                to={`/evento/${event.id}`}
                                                onClick={() => setShowSearchResults(false)}
                                                className="text-decoration-none"
                                            >
                                                <strong>{event.nombre}</strong>
                                                <small>{event.ubicacion} • {event.distancia_km || '0'}km</small>
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <div className="search-result-item text-muted">
                                        No se encontraron resultados
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Toggle de Tema */}
                    <Button
                        variant="outline-light"
                        className="theme-toggle me-2"
                        onClick={toggleDarkMode}
                        aria-label={darkMode ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
                    >
                        {darkMode ? '☀️' : '🌙'}
                    </Button>

                    {/* User Menu */}
                    {isAuthenticated ? (
                        <Dropdown align="end">
                            <Dropdown.Toggle variant="outline-light" className="user-dropdown-toggle">
                                <span className="user-avatar">👤</span>
                                {user?.nombre || user?.nombre_completo || 'Usuario'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="user-dropdown-menu">
                                <Dropdown.Item as={Link} to="/cuenta/dashboard">
                                    Mi Dashboard
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to="/cuenta/perfil">
                                    Mi Perfil
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to="/cuenta/inscripciones">
                                    Mis Inscripciones
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to="/cuenta/equipos">
                                    Mis Equipos
                                </Dropdown.Item>
                                
                                {(isOrganizer || isAdmin) && (
                                    <>
                                        <Dropdown.Divider />
                                        <Dropdown.Item as={Link} to="/organizador/dashboard">
                                            Panel Organizador
                                        </Dropdown.Item>
                                    </>
                                )}
                                
                                {isAdmin && (
                                    <>
                                        <Dropdown.Divider />
                                        <Dropdown.Item as={Link} to="/admin/dashboard">
                                            Administración
                                        </Dropdown.Item>
                                    </>
                                )}
                                
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={handleLogout}>
                                    Cerrar Sesión
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    ) : (
                        <div className="auth-buttons">
    <Button 
        as={Link} 
        to="/login" 
        className="btn-gradient me-2"
    >
        Iniciar Sesión
    </Button>
    <Button 
        as={Link} 
        to="/registro" 
        className="btn-gradient"
    >
        Registrarsse
    </Button>
</div>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;