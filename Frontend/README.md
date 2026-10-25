# Frontend - Biblioteca Ciudad Quesada

## Requisitos

- Node.js y npm
- Backend ejecutándose en `http://localhost:3000`
- MongoDB configurado y disponible para que el backend pueda autenticar

## Instalación y ejecución

Desde esta carpeta:

```powershell
npm install
npm run dev
```

Abre `http://localhost:3001`. El frontend usa el puerto `3001`, que es el origen permitido por la configuración CORS actual del backend.

El servicio API predeterminado es `http://localhost:3000`. Para cambiarlo, copia `.env.example` a `.env.local`, ajusta `VITE_API_URL` y reinicia el servidor de desarrollo.

El login usa `POST /api/auth/login`. Después de iniciar sesión, el panel administra usuarios mediante `/api/users`, registra y finaliza sesiones de las 14 computadoras mediante `/api/computer-lab`, y comparte el estado de seis cubículos mediante `/api/cubicles`. Las rutas Préstamos, Accesos y Reportes permanecen visibles como módulos pendientes, sin funcionalidades ni llamadas a sus endpoints.

Los códigos de usuario nuevos son cadenas numéricas únicas de cuatro dígitos; pueden empezar con cero. Para actualizar los códigos existentes y los que aparecen en el historial de Sala Informática, ejecuta `npm run migrate:user-codes` desde `Backend` (no uses `npm run seed`, porque reinicia los usuarios).

## Estructura de pantallas

La interfaz utiliza React y JSX en el inicio de sesión y en todas las pantallas administrativas. Cada sección tiene un componente y módulo separado con su ruta hash. Puedes abrirlas directamente después de iniciar sesión o navegar entre ellas con el menú y los botones Atrás/Adelante del navegador:

- `#/dashboard` — `src/pages/dashboard.jsx`
- `#/users` — `src/pages/users.jsx`
- `#/loans` — `src/pages/loans.jsx` (módulo pendiente)
- `#/computer-lab` — `src/pages/computer-lab.jsx`
- `#/access` — `src/pages/access.jsx` (módulo pendiente)
- `#/reports` — `src/pages/reports.jsx` (pantalla informativa; aún no genera reportes)

`src/main.jsx` monta la aplicación y define el login, el marco y la navegación. `src/components.jsx` reúne elementos reutilizables y `src/core.js` comparte el estado de sesión y la comunicación con la API. `vite.config.js` configura el soporte JSX.

Para probar el inicio de sesión, primero carga el seed desde la carpeta `Backend` con `npm run seed`. Las credenciales de prueba están documentadas en `Backend/GUIA_FRONTEND.md`.
