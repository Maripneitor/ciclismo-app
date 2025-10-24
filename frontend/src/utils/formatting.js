// Utilidades para formateo de datos

/**
 * Formatea una fecha a formato legible en español
 * @param {string|Date} dateString - Fecha a formatear
 * @param {Object} options - Opciones adicionales de formato
 * @returns {string} Fecha formateada
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'Fecha no disponible';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Fecha inválida';

  const defaultOptions = {
    day: 'numeric',
    month: 'short', 
    year: 'numeric',
    ...options
  };

  return date.toLocaleDateString('es-ES', defaultOptions);
};

/**
 * Formatea una fecha con hora
 * @param {string|Date} dateString - Fecha a formatear
 * @returns {string} Fecha y hora formateadas
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return 'Fecha no disponible';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Fecha inválida';

  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Formatea un número como moneda
 * @param {number} amount - Cantidad a formatear
 * @param {string} currency - Código de moneda (default: 'EUR')
 * @returns {string} Cantidad formateada como moneda
 */
export const formatCurrency = (amount, currency = 'EUR') => {
  if (amount === null || amount === undefined) return '€0.00';
  
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

/**
 * Formatea una distancia en kilómetros
 * @param {number} distance - Distancia en kilómetros
 * @returns {string} Distancia formateada
 */
export const formatDistance = (distance) => {
  if (!distance && distance !== 0) return 'Distancia no disponible';
  return `${distance} km`;
};

/**
 * Formatea un número grande con abreviaciones
 * @param {number} num - Número a formatear
 * @returns {string} Número formateado
 */
export const formatNumber = (num) => {
  if (!num && num !== 0) return '0';
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Calcula el progreso como porcentaje
 * @param {number} current - Valor actual
 * @param {number} total - Valor total
 * @returns {number} Porcentaje de progreso
 */
export const calculateProgress = (current, total) => {
  if (!total || total === 0) return 0;
  return Math.round((current / total) * 100);
};