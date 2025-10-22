// frontend/src/pages/HomePage.jsx - VERSIÓN CORREGIDA
import React from 'react';

// Nuevos componentes
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import FeaturedEvents from '../components/home/FeaturedEvents';
import StatsSection from '../components/home/StatsSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CTASection from '../components/home/CTASection';

// Importar estilos
import '../styles/components/homepage.css';

const HomePage = () => {
  return (
    <div className="homepage-modern">
      {/* Hero Section con Video */}
      <HeroSection />
      
      {/* Estadísticas Globales */}
      <StatsSection />
      
      {/* Características Interactivas */}
      <FeaturesSection />
      
      {/* Eventos Destacados */}
      <FeaturedEvents />
      
      {/* Testimonios */}
      <TestimonialsSection />
      
      {/* CTA Final */}
      <CTASection />
    </div>
  );
};

export default HomePage;