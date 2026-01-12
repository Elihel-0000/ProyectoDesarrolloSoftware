# Frontend - Plataforma de Denuncias Urbanas

Frontend para la gestión y visualización de denuncias ciudadanas (baches, basura, alumbrado, etc.). Desarrollado con **Next.js** y **TypeScript**.

## Características Principales

- **Autenticación y Registro de Usuarios**
  - Inicio de sesión y registro seguro.
  - Manejo de roles: ciudadano, autoridad, administrador.
- **Gestión de Denuncias**
  - Creación de denuncias con ubicación en mapa e imágenes.
  - Visualización de denuncias en lista y mapa interactivo.
  - Filtros por estado, categoría y usuario.
- **Panel de Usuario y Admin**
  - Dashboard con estadísticas y métricas.
  - Visualización de denuncias propias y globales.
- **Interacción**
  - Comentarios y votos en denuncias.
  - Notificaciones visuales.

## Tecnologías

- **Framework**: [Next.js](https://nextjs.org/)
- **Lenguaje**: TypeScript
- **UI**: Tailwind CSS, componentes personalizados
- **Mapas**: Leaflet
- **Autenticación**: JWT (integración con backend)

## Instalación y Configuración

### 1. Requisitos previos
- Node.js (v18 o superior)
- npm o bun

### 2. Clonar el repositorio e instalar dependencias

```bash
git clone <URL_DEL_REPOSITORIO>
cd frontend
npm install # o bun install
```

### 3. Configuración de Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto basándote en el siguiente ejemplo:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000 # URL del backend
```

### 4. Ejecutar la Aplicación

```bash
# Modo desarrollo
npm run dev
# o
bun run dev

# Modo producción
npm run build
npm start
```

## Estructura de Carpetas

- `app/` - Páginas y rutas principales
- `components/` - Componentes reutilizables
- `lib/` - Lógica de API y utilidades
- `hooks/` - Custom hooks
- `data/` - Datos de ejemplo/mock
- `public/` - Recursos estáticos
- `styles/` - Estilos globales

## Notas

- Asegúrate de que el backend esté corriendo y accesible en la URL configurada.
- Para mapas, se utiliza Leaflet y puede requerir configuración adicional de estilos.
