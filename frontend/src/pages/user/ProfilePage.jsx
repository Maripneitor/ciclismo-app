import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tab, Tabs, Badge, ProgressBar } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
    const { user, updateProfile } = useAuth();
    const [activeTab, setActiveTab] = useState('personal');
    const [showAlert, setShowAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [personalData, setPersonalData] = useState({
        nombre_completo: '',
        email: '',
        telefono: '',
        fecha_nacimiento: '',
        genero: '',
        bio: ''
    });

    const [bikeData, setBikeData] = useState({
        tipo_bicicleta: '',
        marca: '',
        modelo: '',
        talla: '',
        year: ''
    });

    const [preferences, setPreferences] = useState({
        notificaciones_email: true,
        notificaciones_eventos: true,
        newsletter: false,
        privacidad_perfil: 'publico'
    });

    useEffect(() => {
        if (user) {
            setPersonalData({
                nombre_completo: user.nombre_completo || '',
                email: user.email || '',
                telefono: user.telefono || '',
                fecha_nacimiento: user.fecha_nacimiento || '',
                genero: user.genero || '',
                bio: user.bio || ''
            });
        }
    }, [user]);

    const handlePersonalSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await updateProfile(personalData);
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        } catch (error) {
            setError('Error actualizando perfil: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBikeSubmit = (e) => {
        e.preventDefault();
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    };

    const handlePreferencesSubmit = (e) => {
        e.preventDefault();
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    };

    const calculateAge = (fechaNacimiento) => {
        if (!fechaNacimiento) return null;
        const today = new Date();
        const birthDate = new Date(fechaNacimiento);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const getMemberSince = () => {
        if (!user?.fecha_creacion) return null;
        return new Date(user.fecha_creacion).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long'
        });
    };

    return (
        <Container fluid>
            <Row>
                <Col>
                    <h2>Mi Perfil</h2>
                    <p className="text-muted">Gestiona tu información personal y preferencias</p>

                    {showAlert && (
                        <Alert variant="success" className="mb-4">
                            ✅ Perfil actualizado correctamente
                        </Alert>
                    )}

                    {error && (
                        <Alert variant="danger" className="mb-4">
                            ❌ {error}
                        </Alert>
                    )}
                </Col>
            </Row>

            <Row className="mb-4">
                <Col lg={3}>
                    {/* Tarjeta de Información del Usuario */}
                    <Card className="sticky-top" style={{ top: '20px' }}>
                        <Card.Body className="text-center">
                            <div className="mb-3">
                                <div 
                                    className="rounded-circle bg-primary d-inline-flex align-items-center justify-content-center text-white fs-2"
                                    style={{ width: '80px', height: '80px' }}
                                >
                                    {user?.nombre_completo?.charAt(0) || 'U'}
                                </div>
                            </div>
                            <h5>{user?.nombre_completo}</h5>
                            <p className="text-muted mb-2">{user?.email}</p>
                            <Badge bg={user?.rol === 'admin' ? 'danger' : user?.rol === 'organizador' ? 'warning' : 'secondary'}>
                                {user?.rol?.toUpperCase()}
                            </Badge>
                            
                            <div className="mt-3">
                                <small className="text-muted">
                                    <strong>Miembro desde:</strong> {getMemberSince()}
                                </small>
                            </div>
                            {personalData.fecha_nacimiento && (
                                <div className="mt-1">
                                    <small className="text-muted">
                                        <strong>Edad:</strong> {calculateAge(personalData.fecha_nacimiento)} años
                                    </small>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={9}>
                    <Tabs
                        activeKey={activeTab}
                        onSelect={(tab) => setActiveTab(tab)}
                        className="mb-4"
                    >
                        {/* Información Personal */}
                        <Tab eventKey="personal" title="👤 Información Personal">
                            <Card>
                                <Card.Header>
                                    <h5 className="mb-0">Información Personal</h5>
                                </Card.Header>
                                <Card.Body>
                                    <Form onSubmit={handlePersonalSubmit}>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Nombre completo *</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={personalData.nombre_completo}
                                                        onChange={(e) =>
                                                            setPersonalData({...personalData, nombre_completo: e.target.value})
                                                        }
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Email *</Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        value={personalData.email}
                                                        onChange={(e) =>
                                                            setPersonalData({...personalData, email: e.target.value})
                                                        }
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Teléfono</Form.Label>
                                                    <Form.Control
                                                        type="tel"
                                                        value={personalData.telefono}
                                                        onChange={(e) =>
                                                            setPersonalData({...personalData, telefono: e.target.value})
                                                        }
                                                        placeholder="+34 600 000 000"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Fecha de nacimiento</Form.Label>
                                                    <Form.Control
                                                        type="date"
                                                        value={personalData.fecha_nacimiento}
                                                        onChange={(e) =>
                                                            setPersonalData({...personalData, fecha_nacimiento: e.target.value})
                                                        }
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Género</Form.Label>
                                            <Form.Select
                                                value={personalData.genero}
                                                onChange={(e) =>
                                                    setPersonalData({...personalData, genero: e.target.value})
                                                }
                                            >
                                                <option value="">Seleccionar</option>
                                                <option value="Masculino">Masculino</option>
                                                <option value="Femenino">Femenino</option>
                                                <option value="Otro">Otro</option>
                                                <option value="Prefiero no decir">Prefiero no decir</option>
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group className="mb-4">
                                            <Form.Label>Biografía</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                value={personalData.bio}
                                                onChange={(e) =>
                                                    setPersonalData({...personalData, bio: e.target.value})
                                                }
                                                placeholder="Cuéntanos sobre ti como ciclista, tus logros, preferencias..."
                                                maxLength={500}
                                            />
                                            <Form.Text className="text-muted">
                                                {personalData.bio.length}/500 caracteres
                                            </Form.Text>
                                        </Form.Group>
                                        <Button variant="primary" type="submit" disabled={loading}>
                                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Tab>

                        {/* Mi Bicicleta */}
                        <Tab eventKey="bike" title="🚴 Mi Bicicleta">
                            <Card>
                                <Card.Header>
                                    <h5 className="mb-0">Información de Mi Bicicleta</h5>
                                </Card.Header>
                                <Card.Body>
                                    <Form onSubmit={handleBikeSubmit}>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Tipo de bicicleta</Form.Label>
                                                    <Form.Select
                                                        value={bikeData.tipo_bicicleta}
                                                        onChange={(e) => setBikeData({...bikeData, tipo_bicicleta: e.target.value})}
                                                    >
                                                        <option value="">Seleccionar tipo</option>
                                                        <option value="carretera">Carretera</option>
                                                        <option value="montaña">Montaña</option>
                                                        <option value="urbana">Urbana</option>
                                                        <option value="hibrida">Híbrida</option>
                                                        <option value="gravel">Gravel</option>
                                                        <option value="bmx">BMX</option>
                                                        <option value="electrica">Eléctrica</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Marca</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={bikeData.marca}
                                                        onChange={(e) => setBikeData({...bikeData, marca: e.target.value})}
                                                        placeholder="Ej: Specialized, Trek, Giant..."
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Modelo</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={bikeData.modelo}
                                                        onChange={(e) => setBikeData({...bikeData, modelo: e.target.value})}
                                                        placeholder="Ej: Tarmac, Domane, Defy..."
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Año</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        value={bikeData.year}
                                                        onChange={(e) => setBikeData({...bikeData, year: e.target.value})}
                                                        min="1990"
                                                        max="2024"
                                                        placeholder="2024"
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Talla</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={bikeData.talla}
                                                onChange={(e) => setBikeData({...bikeData, talla: e.target.value})}
                                                placeholder="Ej: M, 54cm, 19 pulgadas..."
                                            />
                                        </Form.Group>
                                        <Button variant="primary" type="submit">
                                            Guardar Información de Bicicleta
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Tab>

                        {/* Preferencias */}
                        <Tab eventKey="preferences" title="⚙️ Preferencias">
                            <Card>
                                <Card.Header>
                                    <h5 className="mb-0">Preferencias y Notificaciones</h5>
                                </Card.Header>
                                <Card.Body>
                                    <Form onSubmit={handlePreferencesSubmit}>
                                        <h6 className="mb-3">🔔 Configuración de Notificaciones</h6>
                                        
                                        <Form.Group className="mb-3">
                                            <Form.Check
                                                type="checkbox"
                                                label="Notificaciones por email"
                                                checked={preferences.notificaciones_email}
                                                onChange={(e) => setPreferences({...preferences, notificaciones_email: e.target.checked})}
                                                className="mb-2"
                                            />
                                            <Form.Text className="text-muted">
                                                Recibir notificaciones sobre eventos, inscripciones y actualizaciones importantes
                                            </Form.Text>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Check
                                                type="checkbox"
                                                label="Alertas de eventos"
                                                checked={preferences.notificaciones_eventos}
                                                onChange={(e) => setPreferences({...preferences, notificaciones_eventos: e.target.checked})}
                                                className="mb-2"
                                            />
                                            <Form.Text className="text-muted">
                                                Notificaciones sobre nuevos eventos y recordatorios de eventos próximos
                                            </Form.Text>
                                        </Form.Group>

                                        <Form.Group className="mb-4">
                                            <Form.Check
                                                type="checkbox"
                                                label="Newsletter mensual"
                                                checked={preferences.newsletter}
                                                onChange={(e) => setPreferences({...preferences, newsletter: e.target.checked})}
                                                className="mb-2"
                                            />
                                            <Form.Text className="text-muted">
                                                Recibir nuestro newsletter con noticias, consejos y eventos destacados
                                            </Form.Text>
                                        </Form.Group>

                                        <h6 className="mb-3">🔒 Privacidad</h6>
                                        <Form.Group className="mb-4">
                                            <Form.Label>Visibilidad del perfil</Form.Label>
                                            <Form.Select
                                                value={preferences.privacidad_perfil}
                                                onChange={(e) => setPreferences({...preferences, privacidad_perfil: e.target.value})}
                                            >
                                                <option value="publico">Público</option>
                                                <option value="solo_amigos">Solo amigos</option>
                                                <option value="privado">Privado</option>
                                            </Form.Select>
                                            <Form.Text className="text-muted">
                                                Controla quién puede ver tu perfil y actividad
                                            </Form.Text>
                                        </Form.Group>

                                        <Button variant="primary" type="submit">
                                            Guardar Preferencias
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Tab>

                        {/* Estadísticas Personales */}
                        <Tab eventKey="stats" title="📊 Mis Estadísticas">
                            <Card>
                                <Card.Header>
                                    <h5 className="mb-0">Mis Estadísticas y Logros</h5>
                                </Card.Header>
                                <Card.Body>
                                    <Row className="mb-4">
                                        <Col md={4}>
                                            <div className="text-center">
                                                <div className="fs-1">🎯</div>
                                                <h3>12</h3>
                                                <p className="text-muted">Eventos Completados</p>
                                            </div>
                                        </Col>
                                        <Col md={4}>
                                            <div className="text-center">
                                                <div className="fs-1">📏</div>
                                                <h3>856km</h3>
                                                <p className="text-muted">Distancia Total</p>
                                            </div>
                                        </Col>
                                        <Col md={4}>
                                            <div className="text-center">
                                                <div className="fs-1">⏱️</div>
                                                <h3>45h</h3>
                                                <p className="text-muted">Tiempo Total</p>
                                            </div>
                                        </Col>
                                    </Row>

                                    <h6 className="mb-3">Progreso de Objetivos</h6>
                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span>Objetivo Anual - 50 Eventos</span>
                                            <span>24%</span>
                                        </div>
                                        <ProgressBar now={24} variant="primary" />
                                    </div>

                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span>Distancia Mensual - 300km</span>
                                            <span>65%</span>
                                        </div>
                                        <ProgressBar now={65} variant="success" />
                                    </div>

                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span>Participación Comunidad</span>
                                            <span>80%</span>
                                        </div>
                                        <ProgressBar now={80} variant="warning" />
                                    </div>

                                    <h6 className="mb-3">🎖️ Logros</h6>
                                    <Row>
                                        <Col md={6}>
                                            <Badge bg="success" className="me-2 mb-2 p-2">🚴 Ciclista Novato</Badge>
                                            <Badge bg="info" className="me-2 mb-2 p-2">📅 Primer Evento</Badge>
                                            <Badge bg="warning" className="me-2 mb-2 p-2">💪 10 Eventos</Badge>
                                        </Col>
                                        <Col md={6}>
                                            <Badge bg="primary" className="me-2 mb-2 p-2">🏆 Top 10</Badge>
                                            <Badge bg="danger" className="me-2 mb-2 p-2">🔥 Streak 5 Eventos</Badge>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Tab>
                    </Tabs>
                </Col>
            </Row>
        </Container>
    );
};

export default ProfilePage;