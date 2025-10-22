import React, { useState, useCallback, useEffect } from 'react';
import { 
    Row, 
    Col, 
    Form, 
    Button, 
    Badge,
    Spinner,
    Collapse
} from 'react-bootstrap';
import Slider from 'rc-slider';
import DatePicker from 'react-datepicker';
import { MapContainer, TileLayer, Rectangle, useMap } from 'react-leaflet';
import 'rc-slider/assets/index.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'leaflet/dist/leaflet.css';

const AdvancedSearchFilters = ({ 
    filters, 
    onFiltersChange, 
    events,
    onSearch 
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [mapBounds, setMapBounds] = useState(null);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // Tipos de eventos con iconos
    const eventTypes = [
        { id: 'montaña', label: 'Montaña', icon: '⛰️', color: 'success' },
        { id: 'ruta', label: 'Ruta', icon: '🛣️', color: 'primary' },
        { id: 'urbano', label: 'Urbano', icon: '🏙️', color: 'info' },
        { id: 'competitivo', label: 'Competitivo', icon: '🏆', color: 'warning' },
        { id: 'recreativo', label: 'Recreativo', icon: '😊', color: 'secondary' }
    ];

    // Sugerencias de búsqueda
    const [suggestions, setSuggestions] = useState([]);

    // Generar sugerencias basadas en la búsqueda
    useEffect(() => {
        if (searchQuery.length > 1) {
            const newSuggestions = generateSuggestions(searchQuery);
            setSuggestions(newSuggestions);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    }, [searchQuery, events]);

    // Mostrar filtros avanzados cuando el usuario empiece a escribir
    useEffect(() => {
        if (searchQuery.length > 2) {
            setShowAdvancedFilters(true);
        }
    }, [searchQuery]);

    const generateSuggestions = (query) => {
        const queryLower = query.toLowerCase();
        const results = [];

        // Sugerencias de eventos
        events.forEach(event => {
            if (event.nombre.toLowerCase().includes(queryLower)) {
                results.push({
                    type: 'event',
                    title: event.nombre,
                    subtitle: `${event.distancia_km}km • ${event.ubicacion}`,
                    icon: getEventTypeIcon(event.tipo),
                    data: event
                });
            }
        });

        // Sugerencias de ubicaciones
        const uniqueLocations = [...new Set(events.map(e => e.ubicacion))];
        uniqueLocations.forEach(location => {
            if (location.toLowerCase().includes(queryLower)) {
                results.push({
                    type: 'location',
                    title: location,
                    subtitle: `Ubicación`,
                    icon: '📍',
                    data: { location }
                });
            }
        });

        // Sugerencias de tipos
        eventTypes.forEach(type => {
            if (type.label.toLowerCase().includes(queryLower)) {
                results.push({
                    type: 'event_type',
                    title: type.label,
                    subtitle: `Tipo de evento`,
                    icon: type.icon,
                    data: { type: type.id }
                });
            }
        });

        return results.slice(0, 8); // Limitar a 8 sugerencias
    };

    const getEventTypeIcon = (type) => {
        const found = eventTypes.find(t => t.id === type);
        return found ? found.icon : '🚴';
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion.title);
        setShowSuggestions(false);
        
        // Aplicar filtro automáticamente según el tipo de sugerencia
        switch (suggestion.type) {
            case 'event':
                onSearch(suggestion.title);
                break;
            case 'location':
                onFiltersChange({
                    ...filters,
                    ubicacion: suggestion.data.location
                });
                break;
            case 'event_type':
                onFiltersChange({
                    ...filters,
                    tipos: [suggestion.data.type]
                });
                break;
        }
    };

    const handleSearch = useCallback(() => {
        setIsSearching(true);
        onSearch(searchQuery);
        setTimeout(() => setIsSearching(false), 500);
    }, [searchQuery, onSearch]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const clearFilters = () => {
        onFiltersChange({
            tipos: [],
            distancia: [0, 200],
            precio: [0, 100],
            fecha: null,
            ubicacion: '',
            bounds: null
        });
        setSearchQuery('');
        setShowAdvancedFilters(false);
    };

    const toggleAdvancedFilters = () => {
        setShowAdvancedFilters(!showAdvancedFilters);
    };

    const MapBoundsSelector = () => {
        const map = useMap();

        useEffect(() => {
            if (mapBounds) {
                map.fitBounds(mapBounds);
            }
        }, [mapBounds, map]);

        return mapBounds ? (
            <Rectangle
                bounds={mapBounds}
                pathOptions={{ color: 'blue', fillOpacity: 0.1 }}
            />
        ) : null;
    };

    const activeFiltersCount = Object.values(filters).filter(filter => {
        if (Array.isArray(filter)) {
            if (filter === filters.distancia) return filter[0] !== 0 || filter[1] !== 200;
            if (filter === filters.precio) return filter[0] !== 0 || filter[1] !== 100;
            return filter.length > 0;
        }
        if (filter instanceof Date) return true;
        return filter !== null && filter !== '' && filter !== undefined;
    }).length;

    return (
        <div className="search-filters-container">
            {/* Barra de búsqueda con autocompletado */}
            <Row className="mb-3">
                <Col lg={8}>
                    <div className="search-autocomplete">
                        <Form.Control
                            type="text"
                            placeholder="🔍 Buscar eventos, ubicaciones, tipos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="search-input-enhanced"
                            onFocus={() => {
                                if (searchQuery.length > 0) {
                                    setShowAdvancedFilters(true);
                                }
                            }}
                        />
                        {isSearching && (
                            <div className="search-loading">
                                <Spinner animation="border" size="sm" />
                            </div>
                        )}
                        
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="autocomplete-suggestions">
                                {suggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className="suggestion-item"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        <span className="suggestion-icon">
                                            {suggestion.icon}
                                        </span>
                                        <div className="suggestion-content">
                                            <div className="suggestion-title">
                                                {suggestion.title}
                                            </div>
                                            <div className="suggestion-subtitle">
                                                {suggestion.subtitle}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Col>
                <Col lg={2}>
                    <Button 
                        variant="primary" 
                        className="w-100 h-100"
                        onClick={handleSearch}
                        disabled={isSearching}
                    >
                        {isSearching ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Buscando...
                            </>
                        ) : (
                            '🔍 Buscar'
                        )}
                    </Button>
                </Col>
                <Col lg={2}>
                    <Button 
                        variant={showAdvancedFilters ? "outline-primary" : "outline-secondary"}
                        className="w-100 h-100"
                        onClick={toggleAdvancedFilters}
                    >
                        {showAdvancedFilters ? '🙈 Ocultar Filtros' : '🎛️ Mostrar Filtros'}
                    </Button>
                </Col>
            </Row>

            {/* Controles rápidos de filtros */}
            <Row className="mb-3">
                <Col>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            {activeFiltersCount > 0 && (
                                <Badge bg="primary" className="me-2">
                                    {activeFiltersCount} filtros activos
                                </Badge>
                            )}
                            <small className="text-muted">
                                Escribe en la barra de búsqueda o usa los filtros avanzados
                            </small>
                        </div>
                        {activeFiltersCount > 0 && (
                            <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={clearFilters}
                            >
                                🗑️ Limpiar Todo
                            </Button>
                        )}
                    </div>
                </Col>
            </Row>

            {/* Filtros Avanzados - Colapsables */}
            <Collapse in={showAdvancedFilters}>
                <div>
                    {/* Filtros Visuales */}
                    <Row>
                        {/* Tipos de Evento */}
                        <Col md={6} lg={3}>
                            <div className="filter-group">
                                <div className="filter-title">
                                    <span>🚴 Tipo de Evento</span>
                                </div>
                                <div className="event-type-filters">
                                    {eventTypes.map(type => (
                                        <div
                                            key={type.id}
                                            className={`event-type-btn ${
                                                filters.tipos?.includes(type.id) ? 'active' : ''
                                            }`}
                                            onClick={() => {
                                                const newTipos = filters.tipos?.includes(type.id)
                                                    ? filters.tipos.filter(t => t !== type.id)
                                                    : [...(filters.tipos || []), type.id];
                                                onFiltersChange({ ...filters, tipos: newTipos });
                                            }}
                                        >
                                            <span className="event-type-icon">{type.icon}</span>
                                            <span className="event-type-label">{type.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Col>

                        {/* Filtro por Distancia */}
                        <Col md={6} lg={3}>
                            <div className="filter-group">
                                <div className="filter-title">
                                    <span>📏 Distancia (km)</span>
                                </div>
                                <div className="slider-container">
                                    <Slider
                                        range
                                        min={0}
                                        max={200}
                                        value={filters.distancia || [0, 200]}
                                        onChange={(value) => onFiltersChange({ 
                                            ...filters, 
                                            distancia: value 
                                        })}
                                    />
                                    <div className="slider-labels">
                                        <span>{filters.distancia?.[0]} km</span>
                                        <span>{filters.distancia?.[1]} km</span>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        {/* Filtro por Precio */}
                        <Col md={6} lg={3}>
                            <div className="filter-group">
                                <div className="filter-title">
                                    <span>💰 Precio (€)</span>
                                </div>
                                <div className="slider-container">
                                    <Slider
                                        range
                                        min={0}
                                        max={100}
                                        value={filters.precio || [0, 100]}
                                        onChange={(value) => onFiltersChange({ 
                                            ...filters, 
                                            precio: value 
                                        })}
                                    />
                                    <div className="slider-labels">
                                        <span>€{filters.precio?.[0]}</span>
                                        <span>€{filters.precio?.[1]}</span>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        {/* Filtro por Fecha */}
                        <Col md={6} lg={3}>
                            <div className="filter-group">
                                <div className="filter-title">
                                    <span>📅 Fecha</span>
                                </div>
                                <DatePicker
                                    selected={filters.fecha}
                                    onChange={(date) => onFiltersChange({ ...filters, fecha: date })}
                                    placeholderText="Seleccionar fecha"
                                    className="form-control date-picker-enhanced"
                                    dateFormat="dd/MM/yyyy"
                                    isClearable
                                />
                            </div>
                        </Col>
                    </Row>

                    {/* Mapa Interactivo */}
                    <Row className="mt-3">
                        <Col>
                            <div className="filter-group">
                                <div className="filter-title">
                                    <span>🗺️ Filtrar por Ubicación</span>
                                </div>
                                <div className="map-filter-container">
                                    <div className="map-placeholder">
                                        🗺️ Mapa Interactivo - Selecciona una zona
                                        <br />
                                        <small className="text-muted">
                                            (Próximamente: selecciona áreas en el mapa)
                                        </small>
                                    </div>
                                </div>
                                <div className="map-controls">
                                    <Button 
                                        variant="outline-primary" 
                                        size="sm"
                                        onClick={() => setMapBounds([[36, -6], [44, 4]])} // España
                                    >
                                        Seleccionar España
                                    </Button>
                                    <Button 
                                        variant="outline-secondary" 
                                        size="sm"
                                        onClick={() => setMapBounds(null)}
                                    >
                                        Limpiar Mapa
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Collapse>
        </div>
    );
};

export default AdvancedSearchFilters;