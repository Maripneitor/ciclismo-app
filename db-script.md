# Base de Datos - Sistema de Ciclismo

## Estructura en Español

### Tablas Principales

#### usuarios
- `id_usuario` (PK): Identificador único
- `nombre_completo`: Nombre del usuario
- `correo_electronico`: Email único
- `contrasena`: Contraseña encriptada
- `rol`: Tipo de usuario (usuario/organizador/administrador)

#### eventos  
- `id_evento` (PK): Identificador único
- `id_organizador` (FK): Usuario que crea el evento
- `nombre`: Nombre del evento
- `fecha_inicio`: Fecha y hora de inicio
- `estado`: Estado del evento (próximo/en_curso/finalizado/cancelado)

#### equipos
- `id_equipo` (PK): Identificador único
- `nombre`: Nombre del equipo
- `id_capitan` (FK): Líder del equipo
- `activo`: Si el equipo está activo

### Relaciones Principales

1. **usuarios** → **datos_ciclista** (1:1)
2. **usuarios** → **eventos** (1:N - organizador)
3. **usuarios** → **inscripciones** (1:N)
4. **eventos** → **inscripciones** (1:N)
5. **equipos** → **miembros_equipo** (1:N)

### Vistas Disponibles

- `vista_equipos_detallados`: Información completa de equipos y miembros
- `vista_resultados_completos`: Resultados consolidados de eventos
























-- =============================================================================
-- SCRIPT DE ESTRUCTURA - BASE DE DATOS CICLISMO (ESPAÑOL)
-- PostgreSQL PGAdmin 4 v16
-- Exportado el: 2025-10-24
-- =============================================================================

-- TIPOS ENUM
CREATE TYPE public.genero AS ENUM ('masculino', 'femenino', 'otro', 'prefiero_no_decir');
CREATE TYPE public.nivel_experiencia AS ENUM ('principiante', 'intermedio', 'avanzado', 'experto');
CREATE TYPE public.talla_playera AS ENUM ('XS', 'S', 'M', 'L', 'XL', 'XXL');
CREATE TYPE public.tipo_bicicleta AS ENUM ('ruta', 'montaña', 'urbana', 'hibrida', 'gravel');
CREATE TYPE public.estado_evento AS ENUM ('proximo', 'en_curso', 'finalizado', 'cancelado');
CREATE TYPE public.rol_usuario AS ENUM ('usuario', 'organizador', 'administrador');
CREATE TYPE public.estado_inscripcion AS ENUM ('pendiente', 'confirmada', 'cancelada');
CREATE TYPE public.estado_pago AS ENUM ('pendiente', 'aprobado', 'rechazado');
CREATE TYPE public.estado_resultado AS ENUM ('finalizo', 'no_finalizo', 'descalificado');

-- TABLA: usuarios
CREATE TABLE public.usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    correo_electronico VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    rol public.rol_usuario NOT NULL DEFAULT 'usuario',
    telefono VARCHAR(20),
    url_imagen_perfil TEXT,
    telefono_verificado BOOLEAN DEFAULT false,
    puede_crear_equipo BOOLEAN DEFAULT false,
    fecha_verificacion TIMESTAMPTZ,
    ultimo_acceso TIMESTAMPTZ,
    fecha_creacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: datos_ciclista
CREATE TABLE public.datos_ciclista (
    id_ciclista SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL UNIQUE REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE,
    fecha_nacimiento TIMESTAMPTZ,
    genero public.genero,
    contacto_emergencia VARCHAR(100),
    telefono_emergencia VARCHAR(20),
    talla_playera public.talla_playera,
    tipo_bicicleta public.tipo_bicicleta,
    nivel_experiencia public.nivel_experiencia,
    alergias TEXT,
    condiciones_medicas TEXT,
    direccion VARCHAR(255),
    ciudad VARCHAR(100),
    pais VARCHAR(100),
    codigo_postal VARCHAR(20),
    marca_bicicleta VARCHAR(50),
    modelo_bicicleta VARCHAR(50),
    ano_bicicleta INTEGER,
    talla_bicicleta VARCHAR(20),
    fecha_actualizacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: eventos
CREATE TABLE public.eventos (
    id_evento SERIAL PRIMARY KEY,
    id_organizador INTEGER NOT NULL REFERENCES public.usuarios(id_usuario),
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    fecha_inicio TIMESTAMPTZ NOT NULL,
    fecha_fin TIMESTAMPTZ,
    fecha_limite_inscripcion TIMESTAMPTZ,
    estado public.estado_evento NOT NULL DEFAULT 'proximo',
    tipo VARCHAR(50),
    ubicacion VARCHAR(200),
    distancia_km NUMERIC(6,2),
    elevacion_total NUMERIC(8,2),
    dificultad VARCHAR(20),
    cuota_inscripcion NUMERIC(10,2) DEFAULT 0.00 NOT NULL,
    maximo_participantes INTEGER,
    maximo_miembros_equipo INTEGER,
    permite_union_equipos BOOLEAN DEFAULT true,
    url_imagen TEXT,
    coordenadas_ruta JSONB,
    sectores_ruta JSONB,
    instrucciones_especiales TEXT,
    fecha_creacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: categorias
CREATE TABLE public.categorias (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    edad_minima INTEGER,
    edad_maxima INTEGER,
    genero_permitido VARCHAR(20),
    nivel VARCHAR(50),
    activa BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: categorias_evento
CREATE TABLE public.categorias_evento (
    id_categoria_evento SERIAL PRIMARY KEY,
    id_evento INTEGER NOT NULL REFERENCES public.eventos(id_evento) ON DELETE CASCADE,
    id_categoria INTEGER NOT NULL REFERENCES public.categorias(id_categoria) ON DELETE CASCADE,
    cuota_categoria NUMERIC(10,2),
    maximo_participantes INTEGER,
    id_punto_control_final INTEGER,
    fecha_creacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_evento, id_categoria)
);

-- TABLA: equipos
CREATE TABLE public.equipos (
    id_equipo SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    id_capitan INTEGER NOT NULL REFERENCES public.usuarios(id_usuario),
    descripcion TEXT,
    url_imagen TEXT,
    enlace_invitacion VARCHAR(255) UNIQUE,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: miembros_equipo
CREATE TABLE public.miembros_equipo (
    id_equipo INTEGER NOT NULL REFERENCES public.equipos(id_equipo),
    id_usuario INTEGER NOT NULL REFERENCES public.usuarios(id_usuario),
    fecha_union TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_equipo, id_usuario)
);

-- TABLA: tallas_playera
CREATE TABLE public.tallas_playera (
    id_talla_playera SERIAL PRIMARY KEY,
    nombre VARCHAR(10) NOT NULL UNIQUE,
    descripcion VARCHAR(50)
);

-- TABLA: inscripciones
CREATE TABLE public.inscripciones (
    id_inscripcion SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES public.usuarios(id_usuario),
    id_evento INTEGER NOT NULL REFERENCES public.eventos(id_evento),
    id_categoria INTEGER NOT NULL,
    id_talla_playera INTEGER NOT NULL REFERENCES public.tallas_playera(id_talla_playera),
    id_equipo INTEGER REFERENCES public.equipos(id_equipo),
    numero_dorsal INTEGER NOT NULL,
    alias_dorsal VARCHAR(3) NOT NULL,
    estado public.estado_inscripcion DEFAULT 'pendiente',
    numero_telefono VARCHAR(20),
    fecha_nacimiento DATE,
    genero VARCHAR(50),
    nombre_contacto_emergencia VARCHAR(100),
    telefono_contacto_emergencia VARCHAR(20),
    url_identificacion TEXT,
    tiempo_total INTERVAL,
    posicion_general INTEGER,
    posicion_categoria INTEGER,
    distancia_completada NUMERIC(8,2),
    ritmo_promedio NUMERIC(6,2),
    fecha_inscripcion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_evento, numero_dorsal),
    UNIQUE(id_evento, alias_dorsal)
);

-- TABLA: pagos
CREATE TABLE public.pagos (
    id_pago SERIAL PRIMARY KEY,
    id_inscripcion INTEGER NOT NULL UNIQUE REFERENCES public.inscripciones(id_inscripcion),
    fecha_pago DATE,
    numero_referencia VARCHAR(100),
    url_comprobante TEXT,
    estado public.estado_pago NOT NULL
);

-- VISTAS
CREATE OR REPLACE VIEW public.vista_equipos_detallados AS
SELECT e.id_equipo, e.nombre AS nombre_equipo, e.descripcion, e.enlace_invitacion,
       e.fecha_creacion, u_capitan.id_usuario AS id_capitan, 
       u_capitan.nombre_completo AS nombre_capitan, COUNT(me.id_usuario) AS total_miembros,
       ARRAY_AGG(DISTINCT u_miembro.nombre_completo) AS nombres_miembros
FROM public.equipos e
JOIN public.usuarios u_capitan ON e.id_capitan = u_capitan.id_usuario
LEFT JOIN public.miembros_equipo me ON e.id_equipo = me.id_equipo
LEFT JOIN public.usuarios u_miembro ON me.id_usuario = u_miembro.id_usuario
WHERE e.activo = true OR e.activo IS NULL
GROUP BY e.id_equipo, e.nombre, e.descripcion, e.enlace_invitacion, 
         e.fecha_creacion, u_capitan.id_usuario, u_capitan.nombre_completo;

CREATE OR REPLACE VIEW public.vista_resultados_completos AS
SELECT e.id_evento, e.nombre AS nombre_evento, u.id_usuario, u.nombre_completo,
       i.numero_dorsal, i.alias_dorsal, c.nombre AS categoria,
       COALESCE(i.tiempo_total, re.tiempo_total) AS tiempo_total,
       COALESCE(i.posicion_general, re.posicion) AS posicion_general,
       COALESCE(i.distancia_completada, re.distancia_completada) AS distancia_completada,
       re.fecha_registro
FROM public.eventos e
JOIN public.inscripciones i ON e.id_evento = i.id_evento
JOIN public.usuarios u ON i.id_usuario = u.id_usuario
LEFT JOIN public.categorias_evento ec ON i.id_categoria = ec.id_categoria_evento
LEFT JOIN public.categorias c ON ec.id_categoria = c.id_categoria
LEFT JOIN public.resultados_evento re ON e.id_evento = re.id_evento AND u.id_usuario = re.id_usuario
WHERE i.estado = 'confirmada';