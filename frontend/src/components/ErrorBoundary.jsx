// frontend/src/components/ErrorBoundary.jsx
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
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    console.error('Error capturado por Error Boundary:', error);
    // NO console.error del stack completo para evitar loops
  }

  // AGREGAR ESTE MÉTODO PARA PREVENIR EL ERROR
  shouldComponentUpdate(nextProps, nextState) {
    // Prevenir updates si hay error y las props no cambiaron
    if (this.state.hasError && !nextState.hasError) {
      return true;
    }
    return !this.state.hasError;
  }

  componentDidUpdate(prevProps) {
    // Reset error boundary cuando las props cambian
    if (prevProps.children !== this.props.children && this.state.hasError) {
      this.setState({ 
        hasError: false, 
        error: null, 
        errorInfo: null 
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary p-4 m-4 border border-danger rounded">
          <div className="error-content">
            <h2 className="text-danger">¡Algo salió mal!</h2>
            <p>La aplicación encontró un error inesperado.</p>
            
            {/* SOLUCIÓN: Botón simple sin manipulación compleja del DOM */}
            <div className="d-grid gap-2">
              <button 
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                🔄 Recargar Página
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;