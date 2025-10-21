import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para que el siguiente renderizado muestre la UI alternativa
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Puedes también registrar el error en un servicio de reporte de errores
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    console.error('Error capturado por Error Boundary:', error, errorInfo);
  }

  componentDidUpdate(prevProps, prevState) {
    // MEJORA: Reset error boundary cuando las props cambian
    if (prevProps.children !== this.props.children) {
      this.setState({ 
        hasError: false, 
        error: null, 
        errorInfo: null 
      });
    }
  }

  render() {
    if (this.state.hasError) {
      // Puedes renderizar cualquier UI alternativa
      return (
        <div className="error-boundary">
          <div className="error-content glass-card p-4">
            <h2 className="text-gradient">¡Algo salió mal!</h2>
            <div className="error-details mt-3">
              <details className="error-stack">
                <summary>Detalles del error (para desarrolladores)</summary>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </details>
            </div>
            {/* MEJORA: Botón de reintentar en lugar de recargar toda la página */}
            <button 
              className="btn btn-primary mt-3"
              onClick={() => this.setState({ 
                hasError: false, 
                error: null, 
                errorInfo: null 
              })}
            >
              Reintentar
            </button>
            {/* MEJORA: Botón adicional para recargar página si es necesario */}
            <button 
              className="btn btn-secondary mt-3 ms-2"
              onClick={() => window.location.reload()}
            >
              Recargar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;