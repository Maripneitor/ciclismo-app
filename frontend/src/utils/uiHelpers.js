// Utilidades para UI: variantes, iconos, etc.

// Mapeo de estados a variantes de Bootstrap
export const getStatusVariant = (status) => {
  if (!status) return 'secondary';
  
  const statusLower = status.toLowerCase();
  
  const statusMap = {
    'próximo': 'warning',
    'proximo': 'warning',
    'pending': 'warning',
    'en curso': 'success',
    'en_curso': 'success',
    'active': 'success',
    'in progress': 'success',
    'finalizado': 'secondary',
    'completed': 'secondary',
    'finished': 'secondary',
    'cancelado': 'danger',
    'canceled': 'danger',
    'confirmada': 'success',
    'confirmed': 'success',
    'pendiente': 'warning',
    'pending': 'warning'
  };

  return statusMap[statusLower] || 'secondary';
};

// Mapeo de dificultades a variantes
export const getDifficultyVariant = (difficulty) => {
  if (!difficulty) return 'secondary';
  
  const difficultyLower = difficulty.toLowerCase();
  
  const difficultyMap = {
    'baja': 'success',
    'low': 'success',
    'easy': 'success',
    'media': 'warning',
    'medium': 'warning',
    'intermediate': 'warning',
    'alta': 'danger',
    'high': 'danger',
    'hard': 'danger',
    'difícil': 'danger',
    'difícil': 'danger',
    'extrema': 'dark',
    'extreme': 'dark'
  };

  return difficultyMap[difficultyLower] || 'secondary';
};

// Mapeo de tipos de equipo a variantes
export const getTeamTypeVariant = (teamType) => {
  if (!teamType) return 'primary';
  
  const typeLower = teamType.toLowerCase();
  
  const typeMap = {
    'competitivo': 'danger',
    'competitive': 'danger',
    'recreativo': 'success',
    'recreational': 'success',
    'entrenamiento': 'info',
    'training': 'info',
    'mixto': 'warning',
    'mixed': 'warning'
  };

  return typeMap[typeLower] || 'primary';
};

// Mapeo de tipos de evento a iconos
export const getEventTypeIcon = (eventType) => {
  if (!eventType) return '🚴';
  
  const typeLower = eventType.toLowerCase();
  
  const iconMap = {
    'ruta': '🛣️',
    'route': '🛣️',
    'road': '🛣️',
    'montaña': '⛰️',
    'mountain': '⛰️',
    'mtb': '⛰️',
    'urbano': '🏙️',
    'urban': '🏙️',
    'city': '🏙️',
    'competitivo': '🏆',
    'competitive': '🏆',
    'race': '🏆',
    'carrera': '🏆',
    'recreativo': '😊',
    'recreational': '😊',
    'leisure': '😊',
    'entrenamiento': '💪',
    'training': '💪'
  };

  return iconMap[typeLower] || '🚴';
};

// Mapeo de roles de usuario a variantes
export const getUserRoleVariant = (role) => {
  if (!role) return 'secondary';
  
  const roleLower = role.toLowerCase();
  
  const roleMap = {
    'admin': 'danger',
    'administrador': 'danger',
    'organizador': 'warning',
    'organizer': 'warning',
    'usuario': 'info',
    'user': 'info',
    'cyclist': 'primary'
  };

  return roleMap[roleLower] || 'secondary';
};

// Mapeo de géneros a variantes
export const getGenderVariant = (gender) => {
  if (!gender) return 'secondary';
  
  const genderLower = gender.toLowerCase();
  
  const genderMap = {
    'masculino': 'primary',
    'male': 'primary',
    'femenino': 'pink',
    'female': 'pink',
    'otro': 'info',
    'other': 'info',
    'prefiero_no_decir': 'secondary',
    'prefer_not_to_say': 'secondary'
  };

  return genderMap[genderLower] || 'secondary';
};

/**
 * Obtiene el texto legible para un estado
 * @param {string} status - Estado técnico
 * @returns {string} Texto legible
 */
export const getStatusText = (status) => {
  if (!status) return 'Desconocido';
  
  const statusLower = status.toLowerCase();
  
  const textMap = {
    'próximo': 'Próximo',
    'proximo': 'Próximo',
    'en curso': 'En Curso',
    'en_curso': 'En Curso',
    'finalizado': 'Finalizado',
    'cancelado': 'Cancelado',
    'confirmada': 'Confirmada',
    'pendiente': 'Pendiente'
  };

  return textMap[statusLower] || status;
};