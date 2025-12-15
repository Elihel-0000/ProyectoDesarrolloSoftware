# Sistema de Reporte de Incidencias Urbanas - Municipalidad del Cusco

## Descripción

Aplicación web para reportar incidencias urbanas (pistas dañadas, alumbrado público, basura acumulada, etc.). Permite:
- Reportes **anónimos** o de **usuarios registrados**
- Seguimiento de reportes por código
- Interfaz de **administrador** para gestionar reportes
- Almacenamiento en `localStorage` (sin base de datos)

## Características

### Para Usuarios
- ✅ Registro con datos completos (DNI, teléfono, sexo, fecha nacimiento, dirección)
- ✅ Login seguro
- ✅ Envío de reportes anónimos o autenticados
- ✅ Búsqueda de estado de reportes
- ✅ Sesión persistente

### Para Administradores
- ✅ Registro con código de seguridad (`ADMIN2025`)
- ✅ Acceso al dashboard
- ✅ Gestión de reportes

## Estructura de Archivos

```
/Proyecto
├── index.html              # Inicio, reporte, seguimiento
├── register.html           # Registro de usuario
├── login.html              # Login usuario
├── admin_register.html     # Registro administrador (requiere código)
├── admin_login.html        # Login administrador
├── dashboard.html          # Panel de administrador
├── app.js                  # Lógica principal (todos los formularios)
├── style.css               # Estilos globales
├── dashboard.css           # Estilos dashboard (opcional)
└── README.md              # Este archivo
```

## Cómo Usar

### 1. Registrar Usuario Normal
1. Ir a [register.html](register.html)
2. Completar datos:
   - Nombre (mín. 3 caracteres)
   - DNI (8 dígitos)
   - Correo
   - Teléfono
   - Fecha de nacimiento
   - Sexo
   - Dirección (opcional)
   - Contraseña (mín. 6 caracteres)
3. Registrarse → ir a login

### 2. Iniciar Sesión Usuario
1. Ir a [login.html](login.html)
2. Ingresar correo y contraseña

### 3. Enviar Reporte
1. Ir a [index.html](index.html) → sección "Formulario de Reporte"
2. Opciones:
   - **Anónimo**: Marcar checkbox, enviar sin login
   - **Registrado**: Iniciar sesión antes (se mostrará tu nombre)
3. Completar: Título, tipo, descripción, ubicación
4. Enviar → recibir código de reporte (ej: `R1702345678`)

### 4. Hacer Seguimiento
1. Ir a [index.html](index.html) → sección "Seguimiento de Reportes"
2. Ingresar código del reporte
3. Ver estado: Recibido, En Proceso, Resuelto

### 5. Registrar Administrador
1. Ir a [admin_register.html](admin_register.html)
2. Completar datos
3. **Código de administrador**: `ADMIN2025`
4. Registrarse → ir a login admin

### 6. Login Administrador
1. Ir a [admin_login.html](admin_login.html)
2. Ingresar credenciales
3. Acceder a [dashboard.html](dashboard.html)

## Datos de Prueba

### Usuarios Registrados (creados automáticamente)
Crea tus propias cuentas. Los datos se almacenan en `localStorage`.

### Código Administrador
```
ADMIN2025
```

## Almacenamiento en localStorage

Los datos se guardan automáticamente en el navegador:
- `users` - Usuarios registrados
- `admins` - Administradores
- `reports` - Reportes enviados
- `currentUser` - Usuario actual (sesión)

Para limpiar datos:
```javascript
// En consola del navegador (F12)
localStorage.clear();
location.reload();
```

## Validaciones Implementadas

✅ **Registro Usuario:**
- Nombre: mín. 3 caracteres
- DNI: 8 dígitos numéricos exactos
- Correo: formato válido
- Teléfono: no vacío
- Contraseña: mín. 6 caracteres
- Fecha nacimiento: requerida
- Sexo: requerido
- DNI/Correo únicos (no duplicados)

✅ **Registro Admin:**
- Validaciones igual a usuario
- Código de administrador verificado

✅ **Reportes:**
- Título y descripción obligatorios
- Se requiere login O marcar como anónimo

## Estructura de Reporte

```json
{
  "id": "R1702345678",
  "titulo": "Pista con baches",
  "tipo": "pista_danada",
  "descripcion": "La avenida principal tiene varios baches",
  "ubicacion": "Av. Principal, cuadra 5",
  "fecha": "2025-12-15T10:30:00.000Z",
  "estado": "recibido",
  "anonimo": false,
  "reporter": {
    "nombre": "Juan Pérez",
    "correo": "juan@example.com"
  }
}
```

## Navegación

| Página | URL | Descripción |
|--------|-----|-------------|
| Inicio | [index.html](index.html) | Hero, cómo funciona, reportar, seguimiento |
| Registro Usuario | [register.html](register.html) | Formulario registro |
| Login Usuario | [login.html](login.html) | Iniciar sesión |
| Registro Admin | [admin_register.html](admin_register.html) | Crear admin (requiere código) |
| Login Admin | [admin_login.html](admin_login.html) | Admin login |
| Dashboard | [dashboard.html](dashboard.html) | Panel administrador |

## Mejoras Realizadas

### Presentación (index.html)
- ✅ Hero section atractivo
- ✅ Grid de características (4 cards)
- ✅ Formulario de reporte mejorado
- ✅ Sección de seguimiento con búsqueda

### Registros
- ✅ Más campos (DNI, teléfono, sexo, fecha nacimiento, dirección)
- ✅ Validación completa
- ✅ Detección de duplicados

### Admin
- ✅ Código de seguridad para registrar
- ✅ Rol separado en sesión

### Estilos
- ✅ Hero section con gradiente
- ✅ Features con hover effect
- ✅ Formularios responsivos
- ✅ Badges de estado
- ✅ Mejora mobile (768px)

## Funciones Clave (app.js)

```javascript
// Registro usuario con más datos
registerUser({nombre, dni, correo, telefono, fechaNac, sexo, direccion, password})

// Login usuario
loginUser({correo, password})

// Registro admin con código
registerAdmin({nombre, correo, password, codigo})

// Login admin
loginAdmin({correo, password})

// Envío de reporte
submitReport({titulo, tipo, descripcion, ubicacion, anonimo})

// Búsqueda de reporte
// (implementado en form-seguimiento)
```

## Próximas Mejoras (Opcional)

- [ ] Backend con API REST
- [ ] Base de datos real
- [ ] Email de confirmación
- [ ] Mapa interactivo de reportes
- [ ] Historial de cambios de estado
- [ ] Sistema de calificación de reportes
- [ ] Fotos/evidencia en reportes
- [ ] Notificaciones push
- [ ] Exportar reportes a PDF/Excel

## Notas Importantes

1. **localStorage tiene límite**: ~5-10 MB por dominio
2. **Sin persistencia real**: Los datos se pierden si se limpia localStorage
3. **Contraseñas**: Codificadas con `btoa()` (Base64, NO seguro para producción)
4. **Código admin**: Visible en código (cambiar antes de producción)

## Contacto

Municipalidad Provincial del Cusco
📞 084-227152
📍 Plaza Regocijo S/N

---

**Última actualización**: 15 de diciembre de 2025
