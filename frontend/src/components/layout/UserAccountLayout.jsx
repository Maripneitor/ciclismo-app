import React from 'react';
import { Container, Row, Col, Nav, Card } from 'react-bootstrap';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserAccountLayout = () => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { path: '/cuenta/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/cuenta/perfil', label: 'Mi Perfil', icon: '👤' },
    { path: '/cuenta/historial', label: 'Mi Historial', icon: '📈' },
    { path: '/cuenta/eventos', label: 'Mis Eventos', icon: '🚴' },
    { path: '/cuenta/configuracion', label: 'Configuración', icon: '⚙️' },
  ];

  return (
    <Container fluid className="py-4">
      <Row>
        {/* Sidebar */}
        <Col md={3} lg={2}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Mi Cuenta</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Nav variant="pills" className="flex-column">
                {menuItems.map((item) => (
                  <Nav.Item key={item.path}>
                    <Nav.Link
                      as={Link}
                      to={item.path}
                      className="d-flex align-items-center py-3 px-3 border-bottom"
                      active={location.pathname === item.path}
                    >
                      <span className="me-2">{item.icon}</span>
                      {item.label}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
            </Card.Body>
          </Card>
        </Col>

        {/* Contenido principal */}
        <Col md={9} lg={10}>
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default UserAccountLayout;