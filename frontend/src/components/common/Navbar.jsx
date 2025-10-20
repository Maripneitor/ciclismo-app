// En components/common/Navbar.jsx
import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <BootstrapNavbar bg="light" expand="lg">
            <Container>
                <BootstrapNavbar.Brand as={Link} to="/">
                    Ciclismo App
                </BootstrapNavbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/">Inicio</Nav.Link>
                    <Nav.Link as={Link} to="/eventos">Eventos</Nav.Link>
                </Nav>
            </Container>
        </BootstrapNavbar>
    );
};

export default Navbar;