import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          🚴‍♂️ Ciclismo App
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            <Nav.Link as={Link} to="/events">Eventos</Nav.Link>
            
            {isAuthenticated && (
              <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            )}
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <>
                <Navbar.Text className="me-3">
                  Hola, {user?.nombre}
                </Navbar.Text>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="outline-light" 
                  className="me-2"
                >
                  Iniciar Sesión
                </Button>
                <Button as={Link} to="/register" variant="primary">
                  Registrarse
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;