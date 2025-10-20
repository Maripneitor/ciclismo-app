// src/components/common/ButtonSport.jsx
import React from 'react';
import { Button } from 'react-bootstrap';

const ButtonSport = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  loading = false,
  ...props 
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      disabled={loading}
      className="d-flex align-items-center gap-2 sport-button"
      {...props}
    >
      {loading && (
        <div className="spinner-border spinner-border-sm" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      )}
      {icon && !loading && <span>{icon}</span>}
      {children}
    </Button>
  );
};

export default ButtonSport;