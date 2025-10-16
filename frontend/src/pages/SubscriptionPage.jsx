import React from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const SubscriptionPage = () => {
  const { isAuthenticated } = useAuth();

  const plans = [
    {
      name: 'Free',
      price: '0€',
      period: 'para siempre',
      description: 'Perfecto para empezar',
      features: [
        'Acceso a eventos públicos',
        'Inscripción a 2 eventos/mes',
        'Resultados básicos',
        'Comunidad limitada'
      ],
      buttonVariant: 'outline-primary',
      popular: false
    },
    {
      name: 'Plus',
      price: '9,99€',
      period: 'por mes',
      description: 'Para ciclistas comprometidos',
      features: [
        'Inscripción ilimitada a eventos',
        'Resultados avanzados con análisis',
        'Comunidad completa',
        'Descuentos exclusivos',
        'Soporte prioritario',
        'Certificados digitales'
      ],
      buttonVariant: 'primary',
      popular: true
    },
    {
      name: 'Pro',
      price: '19,99€',
      period: 'por mes',
      description: 'Para atletas profesionales',
      features: [
        'Todo lo de Plus',
        'Análisis de rendimiento avanzado',
        'Entrenamiento personalizado',
        'Asesoramiento 1-a-1',
        'Acceso early a eventos',
        'Kit de bienvenida'
      ],
      buttonVariant: 'outline-primary',
      popular: false
    }
  ];

  return (
    <Container className="py-5">
      <Row className="text-center mb-5">
        <Col>
          <h1 className="display-4 fw-bold mb-3">Planes de Suscripción</h1>
          <p className="lead text-muted">
            Elige el plan que mejor se adapte a tus necesidades como ciclista
          </p>
        </Col>
      </Row>

      <Row className="g-4 justify-content-center">
        {plans.map((plan, index) => (
          <Col key={index} md={6} lg={4}>
            <Card className={`h-100 shadow-sm ${plan.popular ? 'border-primary' : ''}`}>
              {plan.popular && (
                <div className="position-absolute top-0 start-50 translate-middle mt-2">
                  <Badge bg="primary" className="fs-6 px-3 py-2">
                    Más Popular
                  </Badge>
                </div>
              )}
              <Card.Body className="d-flex flex-column p-4">
                <div className="text-center mb-4">
                  <h3 className="fw-bold">{plan.name}</h3>
                  <div className="my-3">
                    <span className="display-4 fw-bold text-primary">{plan.price}</span>
                    <span className="text-muted">/{plan.period}</span>
                  </div>
                  <p className="text-muted">{plan.description}</p>
                </div>

                <ListGroup variant="flush" className="mb-4 flex-grow-1">
                  {plan.features.map((feature, featureIndex) => (
                    <ListGroup.Item key={featureIndex} className="border-0 px-0 py-2">
                      <span className="text-success me-2">✓</span>
                      {feature}
                    </ListGroup.Item>
                  ))}
                </ListGroup>

                {isAuthenticated ? (
                  <Button 
                    variant={plan.buttonVariant} 
                    size="lg" 
                    className="w-100 mt-auto"
                    disabled={plan.name === 'Free'}
                  >
                    {plan.name === 'Free' ? 'Plan Actual' : 'Elegir Plan'}
                  </Button>
                ) : (
                  <Button 
                    as={Link}
                    to="/register"
                    variant={plan.buttonVariant} 
                    size="lg" 
                    className="w-100 mt-auto"
                  >
                    Comenzar
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mt-5">
        <Col lg={8} className="mx-auto">
          <Card className="bg-light">
            <Card.Body className="text-center p-5">
              <h3>¿Tienes un equipo o organización?</h3>
              <p className="text-muted mb-4">
                Contáctanos para planes personalizados con descuentos para grupos y funcionalidades avanzadas de gestión.
              </p>
              <Button variant="outline-primary" size="lg">
                Contactar Ventas
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SubscriptionPage;