import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import EventCard from '../common/EventCard';
import { homeAPI, eventsAPI } from '../../services/api';

const FeaturedEvents = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFeaturedEvents();
  }, []);

  const loadFeaturedEvents = async () => {
    try {
      setLoading(true);
      setError('');
      
      try {
        const eventsData = await homeAPI.getFeaturedEvents();
        if (Array.isArray(eventsData)) {
          setFeaturedEvents(eventsData.slice(0, 3));
        } else {
          throw new Error('Formato de datos inválido');
        }
      } catch (apiError) {
        console.warn('Error API eventos destacados, usando datos de respaldo:', apiError);
        try {
          const fallbackEvents = await eventsAPI.getAll();
          if (Array.isArray(fallbackEvents)) {
            setFeaturedEvents(fallbackEvents.slice(0, 3));
          } else {
            setFeaturedEvents(getFallbackEvents());
          }
        } catch (fallbackError) {
          console.warn('Error en fallback, usando datos de ejemplo:', fallbackError);
          setFeaturedEvents(getFallbackEvents());
        }
      }
      
    } catch (error) {
      console.error('Error loading featured events:', error);
      setError('Error cargando eventos destacados');
      setFeaturedEvents(getFallbackEvents());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackEvents = () => {
    return [
      {
        id: 1,
        nombre: 'Gran Fondo Montaña',
        descripcion: 'Una emocionante ruta de montaña para ciclistas experimentados',
        ubicacion: 'Sierra Nevada, Granada',
        fecha: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        tipo: 'montaña',
        estado: 'próximo',
        dificultad: 'Alta',
        distancia_km: 85,
        elevacion: 1500,
        cuota_inscripcion: 45,
        participantes_inscritos: 45,
        cupo_maximo: 100,
        imagen: '/images/mountain-race.jpg'
      },
      {
        id: 2,
        nombre: 'Tour Urbano Nocturno',
        descripcion: 'Recorrido urbano iluminado por la ciudad',
        ubicacion: 'Centro Histórico, Madrid',
        fecha: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        tipo: 'urbano',
        estado: 'próximo',
        dificultad: 'Media',
        distancia_km: 35,
        elevacion: 200,
        cuota_inscripcion: 20,
        participantes_inscritos: 78,
        cupo_maximo: 120,
        imagen: '/images/night-tour.jpg'
      },
      {
        id: 3,
        nombre: 'Ruta Costera Relax',
        descripcion: 'Paseo tranquilo junto al mar para todos los niveles',
        ubicacion: 'Costa del Sol, Málaga',
        fecha: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        tipo: 'ruta',
        estado: 'próximo',
        dificultad: 'Baja',
        distancia_km: 40,
        elevacion: 150,
        cuota_inscripcion: 15,
        participantes_inscritos: 92,
        cupo_maximo: 150,
        imagen: '/images/coastal-ride.jpg'
      }
    ];
  };

  const getEventTypeIcon = (type) => {
    const icons = {
      'ruta': '🛣️',
      'montaña': '⛰️',
      'urbano': '🏙️',
      'competitivo': '🏆',
      'recreativo': '😊'
    };
    return icons[type] || '🚴';
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'próximo': return 'warning';
      case 'en curso': return 'success';
      case 'finalizado': return 'secondary';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="featured-events py-5">
        <Container>
          <Row>
            <Col className="text-center">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Cargando eventos destacados...</p>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }

  if (error && featuredEvents.length === 0) {
    return (
      <section className="featured-events py-5">
        <Container>
          <Row>
            <Col>
              <Alert variant="warning">
                {error}
              </Alert>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }

  return (
    <section className="featured-events py-5 bg-light">
      <Container>
        <Row className="mb-5">
          <Col className="text-center">
            <h2 className="section-title h1 display-4 fw-bold mb-3">
              Próximos <span className="text-primary">Eventos Destacados</span>
            </h2>
            <p className="section-subtitle lead text-muted">
              No te pierdas estas increíbles experiencias ciclistas
            </p>
          </Col>
        </Row>

        {featuredEvents.length === 0 ? (
          <Row>
            <Col className="text-center">
              <p className="text-muted">No hay eventos destacados disponibles</p>
            </Col>
          </Row>
        ) : (
          <>
            {error && (
              <Row className="mb-3">
                <Col>
                  <Alert variant="warning" className="mb-0">
                    {error} - Mostrando datos de ejemplo
                  </Alert>
                </Col>
              </Row>
            )}
            <Row className="g-4">
              {featuredEvents.map((event) => (
                <Col key={event.evento_id || event.id} xs={12} md={6} lg={4}>
                  <EventCard 
                    event={event}
                    layoutVariant="featured"
                    showDateHighlight={true}
                    getEventTypeIcon={getEventTypeIcon}
                    getStatusVariant={getStatusVariant}
                    formatDate={formatDate}
                    showActions={false}
                  />
                </Col>
              ))}
            </Row>
          </>
        )}

        <Row className="mt-5">
          <Col className="text-center">
            <Button 
              as={Link} 
              to="/eventos" 
              variant="primary" 
              size="lg"
              className="px-5"
            >
              Ver Todos los Eventos
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default FeaturedEvents;