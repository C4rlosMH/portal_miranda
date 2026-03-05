# Miranda Net - Portal del Cliente (v3.0)

Bienvenido al repositorio frontend del **Portal del Cliente de Miranda Net**. Esta aplicación es la interfaz orientada al usuario final de nuestro sistema integral de gestión ISP (Internet Service Provider). 

Como parte de la **Versión 3.0** del ecosistema Miranda Net, este portal empodera a los suscriptores permitiéndoles autogestionar sus pagos, solicitar soporte técnico y monitorear el estado de su conexión, reduciendo la carga operativa del equipo administrativo.

---

## Características Principales

### Gestión Financiera y Pagos (v2.0+)
* **Integración con Mercado Pago:** Generación de links de pago seguros en tiempo real.
* **Opciones Flexibles:** Los clientes pueden liquidar su deuda total, pagar su mensualidad actual o realizar abonos personalizados (mínimo $20.00).
* **Historial de Transacciones:** Registro detallado de todos los pagos realizados.
* **Prórrogas Automáticas:** Sistema de aplazamiento de pagos con registro de auditoría.

### Service Desk y Soporte Técnico (v3.0)
* **Gestión de Tickets:** Creación de reportes categorizados y con niveles de prioridad (Baja, Media, Alta).
* **Comunicación Bidireccional:** Chat integrado en cada ticket para dialogar con el equipo de soporte.
* **Notificaciones de Actividad:** Indicadores visuales automáticos cuando el soporte responde un ticket abierto.
* **Calificación de Servicio:** Sistema de valoración de 1 a 5 estrellas y feedback escrito al cerrar un ticket.

### Gestión de Cuenta
* Dashboard interactivo con el estado financiero actual del suscriptor.
* Actualización de información de contacto (correo electrónico y teléfono).
* Cambio seguro de contraseña.

---

## Stack Tecnológico

Este proyecto está construido con herramientas modernas enfocadas en el rendimiento y la experiencia de usuario:

* **Core:** [React 18](https://reactjs.org/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Enrutamiento:** [React Router v6](https://reactrouter.com/)
* **Estilos:** SCSS (Módulos CSS) + Tailwind CSS (Utilidades)
* **Iconografía:** [Lucide React](https://lucide.dev/)
* **Peticiones HTTP:** [Axios](https://axios-http.com/)
* **Notificaciones:** [Sonner](https://sonner.emilkowal.ski/)

---

## Instalación y Configuración Local

Sigue estos pasos para levantar el entorno de desarrollo local:

### 1. Clonar el repositorio
\`\`\`bash

git clone https://github.com/tu-usuario/portal_miranda.git

cd portal_miranda

\`\`\`

### 2. Instalar dependencias
Asegúrate de tener Node.js instalado en tu sistema.
\`\`\`bash
npm install
\`\`\`

### 3. Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto basándote en el archivo de ejemplo (si existe) o configura la URL de tu backend:

\`\`\`env

VITE_API_URL=http://localhost:3000/api  #colocar la direccion del backend

\`\`\`

### 4. Ejecutar el servidor de desarrollo
\`\`\`bash

npm run dev

\`\`\`

La aplicación estará disponible en `http://localhost:5173`.

---

## Estructura del Proyecto

src/
<<<<<<< HEAD
├── api/             # Configuración de Axios e interceptores
├── assets/          # Imágenes, logos y recursos estáticos
├── components/      # Componentes reutilizables (Modales, Navbars, etc.)
│   ├── portal/      # Componentes específicos del área privada
│   └── public/      # Componentes de las vistas públicas
├── config/          # Variables de configuración global (Moneda, Locale)
├── context/         # Contextos de React (AuthContext)
├── hooks/           # Custom Hooks (useTheme, etc.)
├── pages/           # Vistas principales de la aplicación
│   ├── portal/      # Dashboard, Soporte, Pagos, Perfil (Rutas protegidas)
│   └── public/      # Landing, Planes, Contacto (Rutas públicas)
└── styles/          # Archivos SCSS globales
=======
├── api/            # Configuración de Axios e interceptores
├── assets/         # Imágenes, logos y recursos estáticos
├── components/     # Componentes reutilizables (Modales, Navbars, etc.)
│   ├── portal/     # Componentes específicos del área privada
│   └── public/     # Componentes de las vistas públicas
├── config/         # Variables de configuración global (Moneda, Locale)
├── context/        # Contextos de React (AuthContext)
├── hooks/          # Custom Hooks (useTheme, etc.)
├── pages/          # Vistas principales de la aplicación
│   ├── portal/     # Dashboard, Soporte, Pagos, Perfil (Rutas protegidas)
│   └── public/     # Landing, Planes, Contacto (Rutas públicas)
└── styles/         # Archivos SCSS globales

>>>>>>> ff273f9 (se edita el readme)

---

## Roadmap Histórico del Proyecto

* **v1.0 - Core Administrativo:** Gestión de inventario, contabilidad básica y control interno. (Desplegado en el panel de Admin).
* **v2.0 - Automatización y Pagos:** Integración de Mercado Pago, uso de la API de Mikrotik para cortes automáticos de servicio mediante CRON Jobs.
* **v3.0 - Experiencia del Cliente (Actual):** Lanzamiento de este Portal del Cliente y el módulo de HelpDesk con métricas de rendimiento y satisfacción.

---

## 🧑Autor

Desarrollado y mantenido por el equipo de **Miranda Net** (Carlos Miranda).
