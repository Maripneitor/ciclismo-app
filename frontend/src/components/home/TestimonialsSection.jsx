// frontend/src/components/home/TestimonialsSection.jsx
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "María González",
      role: "Ciclista Profesional",
      content: "Esta plataforma ha revolucionado mi forma de entrenar y competir. La gestión de eventos es impecable y la comunidad es increíblemente activa.",
      avatar: ""
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      role: "Organizador de Eventos",
      content: "Como organizador, la plataforma me ha permitido gestionar eventos de forma mucho más eficiente. Los participantes están más involucrados que nunca.",
      avatar: ""
    },
    {
      id: 3,
      name: "Ana Martínez",
      role: "Ciclista Recreativa",
      content: "He encontrado una comunidad maravillosa y eventos perfectos para mi nivel. La aplicación es intuitiva y las rutas son espectaculares.",
      avatar: ""
    }
  ];

  return (
    <section className="testimonials-section py-5 bg-dark text-white">
      <Container>
        <Row className="mb-5">
          <Col className="text-center">
            <h2 className="section-title h1 display-4 fw-bold mb-3 text-white">
              Lo Que Dicen <span className="text-warning">Nuestros Ciclistas</span>
            </h2>
            <p className="section-subtitle lead opacity-75">
              Descubre por qué miles de ciclistas confían en nosotros
            </p>
          </Col>
        </Row>
        
        <Row className="g-4">
          {testimonials.map((testimonial) => (
            <Col key={testimonial.id} xs={12} md={6} lg={4}>
              <Card className="testimonial-card h-100 border-0 bg-light text-dark">
                <Card.Body className="text-center d-flex flex-column p-4">
                  <div className="testimonial-avatar mb-3" style={{fontSize: '3rem'}}>
                    {testimonial.avatar}
                  </div>
                  <Card.Text className="fst-italic mb-3 flex-grow-1">
                    "{testimonial.content}"
                  </Card.Text>
                  <div>
                    <Card.Title className="h6 mb-1 fw-bold">
                      {testimonial.name}
                    </Card.Title>
                    <Card.Text className="text-primary small fw-semibold">
                      {testimonial.role}
                    </Card.Text>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default TestimonialsSection;