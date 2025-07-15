# Documentación del Proyecto Andes Client

## Descripción del Proyecto

Andes Client es una plataforma web de gestión de recursos humanos que conecta candidatos con oportunidades laborales. La aplicación permite a los candidatos crear perfiles completos, postularse a ofertas de trabajo, y gestionar sus aplicaciones, mientras que las empresas pueden publicar ofertas, revisar candidatos y gestionar procesos de contratación.

## Tecnologías Utilizadas

### Frontend

- **Next.js 15.2.0**: Framework de React utilizado como base del proyecto
- **React 19.0.0**: Biblioteca para la construcción de interfaces de usuario
- **TypeScript**: Lenguaje de programación tipado utilizado en todo el proyecto
- **TailwindCSS 4**: Framework CSS para el diseño y estilizado
- **Zustand 5.0.3**: Biblioteca para el manejo del estado global
- **React Hook Form 7.54.2**: Para manejar formularios con validación
- **Zod 3.24.2**: Biblioteca para validación de esquemas
- **Axios 1.8.4**: Cliente HTTP para realizar peticiones al backend
- **React Email/Resend**: Para el envío de correos electrónicos
- **React PDF 9.2.1**: Para generación y visualización de archivos PDF
- **React Quill 2.0.0**: Editor de texto enriquecido
- **Slate 0.112.0**: Framework para edición de texto
- **Lucide React 0.477.0**: Biblioteca de iconos
- **Nodemailer 6.10.0**: Para envío de emails
- **Crypto-js 4.2.0**: Para funciones de encriptación
- **DOMPurify 3.2.4**: Para sanitización de HTML

### Herramientas de Desarrollo

- **ESLint 9**: Para linting de código
- **PostCSS**: Para procesamiento de CSS
- **TypeScript Types**: Tipos para Node.js, React, y librerías externas

## Estructura del Proyecto

```
andes-client/
├── .next/               # Archivos compilados de Next.js
├── node_modules/        # Dependencias instaladas
├── public/              # Archivos estáticos públicos
│   ├── docs/            # Documentos públicos
│   ├── images/          # Imágenes del proyecto
│   ├── favicon.ico      # Icono de la aplicación
│   ├── logo-andes.png   # Logo de Andes
│   └── manifest.json    # Manifiesto de la aplicación web
├── src/                 # Código fuente
│   ├── app/             # Rutas y páginas de la aplicación (App Router de Next.js)
│   │   ├── account/     # Gestión de cuenta de usuario
│   │   ├── admin/       # Área de administradores
│   │   │   ├── applicants/    # Gestión de candidatos
│   │   │   ├── dashboard/     # Dashboard principal de admin
│   │   │   ├── login/         # Login de administradores
│   │   │   ├── offers/        # Gestión de ofertas laborales
│   │   │   └── superAdmin/    # Funciones de super administrador
│   │   ├── api/         # Rutas de API (API Routes de Next.js)
│   │   ├── applications/ # Aplicaciones de candidatos
│   │   ├── auth/        # Páginas relacionadas con autenticación
│   │   ├── companies/   # Área de empresas
│   │   │   ├── account/       # Gestión de cuenta de empresa
│   │   │   ├── components/    # Componentes específicos de empresas
│   │   │   ├── context/       # Contextos de empresas
│   │   │   └── dashboard/     # Dashboard de empresas
│   │   ├── components/  # Componentes específicos de la app
│   │   ├── currentApplication/ # Aplicación actual del usuario
│   │   ├── pages/       # Páginas estáticas (términos, privacidad, etc.)
│   │   ├── profile/     # Perfil de usuario
│   │   ├── types/       # Tipos TypeScript globales
│   │   ├── layout.tsx   # Layout principal de la aplicación
│   │   ├── page.tsx     # Página de inicio
│   │   └── globals.css  # Estilos globales
│   ├── assets/          # Recursos estáticos
│   ├── components/      # Componentes reutilizables
│   │   ├── ui/          # Componentes de interfaz
│   │   └── icons/       # Iconos personalizados
│   ├── hooks/           # Hooks personalizados
│   │   ├── use-application-history.ts # Hook para historial de aplicaciones
│   │   ├── useOutsideClick.ts        # Hook para detectar clicks fuera
│   │   ├── useRouteExclusion.ts      # Hook para exclusión de rutas
│   │   └── useScrollShadow.ts        # Hook para sombras de scroll
│   ├── interfaces/      # Interfaces TypeScript
│   ├── lib/             # Utilidades y funciones auxiliares
│   ├── services/        # Servicios y API clients
│   │   ├── axios.client.ts    # Cliente Axios (lado cliente)
│   │   ├── axios.server.ts    # Cliente Axios (lado servidor)
│   │   └── axios.instance.ts  # Instancia base de Axios
│   ├── store/           # Estado global (Zustand)
│   │   ├── auth.store.ts        # Store de autenticación
│   │   └── notifications.store.ts # Store de notificaciones
│   └── middleware.ts    # Middleware de Next.js
├── .env.local           # Variables de entorno locales
├── .gitignore           # Archivos ignorados por git
├── eslint.config.mjs    # Configuración de ESLint
├── next.config.ts       # Configuración de Next.js
├── package.json         # Dependencias y scripts
├── pnpm-lock.yaml       # Lock file de pnpm
├── postcss.config.mjs   # Configuración de PostCSS
├── tailwind.config.ts   # Configuración de TailwindCSS
└── tsconfig.json        # Configuración de TypeScript
```

## Funcionalidades Principales

### Para Candidatos

- **Registro y Autenticación**: Sistema completo de registro, login y recuperación de contraseña
- **Perfil Completo**: Creación de perfil con información personal, experiencia laboral, educación y habilidades
- **Carga de Documentos**: Subida de CV, video de presentación, fotos de identificación y capturas de PC
- **Búsqueda y Aplicación**: Exploración de ofertas laborales y postulación a las mismas
- **Seguimiento de Aplicaciones**: Visualización del estado de todas las aplicaciones enviadas
- **Formularios Dinámicos**: Completar formularios específicos para cada oferta
- **Generación de PDF**: Descarga del perfil completo en formato PDF

### Para Empresas

- **Dashboard de Empresa**: Panel de control para gestionar ofertas y candidatos
- **Publicación de Ofertas**: Creación y gestión de ofertas laborales
- **Revisión de Candidatos**: Visualización de perfiles completos de postulantes
- **Gestión de Empleados**: Administración del equipo de la empresa
- **Proceso de Contratación**: Seguimiento del proceso desde aplicación hasta contratación

### Para Administradores

- **Dashboard Administrativo**: Panel de control completo del sistema
- **Gestión de Usuarios**: Administración de candidatos, empresas y otros administradores
- **Gestión de Ofertas**: Supervisión y moderación de todas las ofertas
- **Sistema de Notificaciones**: Envío de emails automáticos en diferentes etapas
- **Reportes y Analytics**: Análisis de datos de la plataforma
- **Configuración del Sistema**: Gestión de roles, permisos y configuraciones generales

## Arquitectura de la Aplicación

### Patrón de Diseño

- **App Router de Next.js**: Utiliza el nuevo sistema de rutas basado en carpetas
- **Server Components**: Componentes renderizados en el servidor para mejor performance
- **Client Components**: Componentes interactivos del lado del cliente
- **API Routes**: Endpoints internos para funcionalidades específicas

### Gestión de Estado

- **Zustand**: Store global para autenticación y notificaciones
- **React Hook Form**: Gestión de estado de formularios
- **React Context**: Contextos específicos para diferentes secciones

### Comunicación con el Backend

- **Axios**: Cliente HTTP configurado para diferentes entornos
- **Interceptors**: Manejo automático de tokens y errores
- **Error Handling**: Gestión centralizada de errores de API

## Sistemas de Notificaciones

### Email Templates

- **React Email**: Plantillas de correo con componentes React
- **Nodemailer + Office 365**: Integración con Microsoft para envío de emails
- **Resend**: Servicio alternativo para envío de correos

### Tipos de Notificaciones

- Confirmación de registro
- Notificaciones de aplicaciones
- Actualizaciones de estado de postulaciones
- Invitaciones a entrevistas
- Notificaciones de contratación
- Emails de eliminación de candidatos

## Sistema de Autenticación y Autorización

### Roles de Usuario

- **Candidato**: Acceso a perfil personal y aplicaciones
- **Empresa/Empleado de Empresa**: Gestión de ofertas y candidatos
- **Admin/Empleado Admin**: Administración completa
- **Admin Reclutamiento**: Funciones específicas de reclutamiento
- **Super Admin**: Acceso total al sistema

### Protección de Rutas

- Middleware para verificación de autenticación
- Protección basada en roles
- Redirecciones automáticas según el tipo de usuario

## Componentes Principales

### Componentes de UI Reutilizables

- **Modales**: Sistema de modales para diferentes propósitos
- **Formularios**: Componentes de formulario con validación
- **Tablas**: Componentes de tabla con paginación y filtros
- **Notificaciones Toast**: Sistema de notificaciones en tiempo real
- **Loaders y Skeletons**: Componentes de carga para mejor UX

### Componentes Específicos

- **CandidateProfileModal**: Modal completo de perfil de candidato
- **ApplicantsModal**: Gestión de candidatos para ofertas
- **VideoModal**: Visualización de videos de presentación
- **PDF Components**: Generación y visualización de PDFs
- **Assessment Components**: Gestión de evaluaciones

## Cómo Ejecutar el Proyecto

### Requisitos Previos

- Node.js (v18 o superior)
- pnpm, yarn o npm (preferiblemente pnpm)

### Pasos para Ejecución Local

1. **Clonar el repositorio**

   ```bash
   git clone [URL_DEL_REPOSITOR]
   cd andes-client
   ```

2. **Instalar dependencias**

   ```bash
   pnpm install
   # o
   yarn install
   # o
   npm install
   ```

3. **Configurar variables de entorno**

   - Crear un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

   ```
   # URL de la API
   NEXT_PUBLIC_API_URL=https://tu-api.com/api/

   # Configuración de correo para Office 365
   OFFICE365MAIL_CLIENT_ID="tu-client-id"
   OFFICE365MAIL_TENANT="tu-tenant-id"
   OFFICE365MAIL_CLIENT_SECRET="tu-client-secret"

   # Configuración correo (alternativa)
   EMAIL_USER="tucorreo@ejemplo.com"
   EMAIL_PASSWORD="tu-contraseña"

   # API key de Resend para envío de emails
   SECRET_KEY_RESEND="tu-clave-resend"
   ```

4. **Ejecutar en modo desarrollo**

   ```bash
   pnpm dev
   # o
   yarn dev
   # o
   npm run dev
   ```

5. **Acceder a la aplicación**
   - Abre http://localhost:3000 en tu navegador

## Variables de Entorno

### Variables Requeridas

```env
# URL de la API Backend
NEXT_PUBLIC_API_URL=https://tu-api.com/api/

# Configuración de correo para Office 365
OFFICE365MAIL_CLIENT_ID="tu-client-id"
OFFICE365MAIL_TENANT="tu-tenant-id"
OFFICE365MAIL_CLIENT_SECRET="tu-client-secret"

# Configuración alternativa de correo (SMTP tradicional)
EMAIL_USER="tucorreo@ejemplo.com"
EMAIL_PASSWORD="tu-contraseña"

# API key de Resend para envío de emails
SECRET_KEY_RESEND="tu-clave-resend"

# Configuración de autenticación
NEXTAUTH_SECRET="tu-secret-key-para-nextauth"
NEXTAUTH_URL="http://localhost:3000" # URL base de la aplicación
```

### Variables Opcionales

```env
# Para desarrollo local
NODE_ENV=development

# Para configuración de CORS
ALLOWED_ORIGINS="http://localhost:3000,https://tu-dominio.com"

# Para configuración de uploads
MAX_FILE_SIZE=10485760  # 10MB en bytes
ALLOWED_FILE_TYPES="image/jpeg,image/png,application/pdf,video/mp4"
```

## Sistema de Archivos y Uploads

### Tipos de Archivos Soportados

- **Imágenes**: JPEG, PNG (para fotos de perfil, capturas de PC, documentos de identidad)
- **Videos**: MP4 (para videos de presentación)
- **Documentos**: PDF (para CVs, assessments, contratos)

### Gestión de Uploads

- **Validación de tamaño**: Límite de 10MB por archivo
- **Validación de tipo**: Solo tipos permitidos
- **Sanitización**: Nombres de archivo seguros
- **Almacenamiento**: Integración con servicios de almacenamiento en la nube

## Flujo de Trabajo de la Aplicación

### Para Candidatos

1. **Registro**: Crear cuenta con email y contraseña
2. **Verificación**: Confirmar email (si está habilitado)
3. **Completar Perfil**:
   - Información personal
   - Experiencia laboral
   - Educación
   - Habilidades
   - Documentos (CV, video, fotos ID, capturas PC)
4. **Explorar Ofertas**: Buscar y filtrar ofertas disponibles
5. **Aplicar**: Completar formularios específicos y enviar aplicación
6. **Seguimiento**: Monitorear estado de aplicaciones
7. **Entrevistas**: Gestionar invitaciones a entrevistas
8. **Contratación**: Revisar y firmar contratos

### Para Empresas

1. **Registro de Empresa**: Crear cuenta empresarial
2. **Configuración**: Completar información de la empresa
3. **Publicar Ofertas**: Crear ofertas laborales detalladas
4. **Recibir Aplicaciones**: Revisar candidatos que aplican
5. **Evaluar Candidatos**: Revisar perfiles, videos y documentos
6. **Proceso de Selección**:
   - Filtrado inicial
   - Primera entrevista
   - Segunda entrevista
   - Finalista
7. **Contratación**: Enviar contrato y gestionar proceso de firma

### Para Administradores

1. **Supervisión General**: Monitorear actividad de la plataforma
2. **Gestión de Usuarios**: Administrar candidatos y empresas
3. **Moderación**: Revisar y aprobar ofertas y perfiles
4. **Comunicaciones**: Gestionar notificaciones y emails automáticos
5. **Analytics**: Generar reportes y análisis de datos
6. **Configuración**: Mantener configuraciones del sistema

## Integración con Servicios Externos

### Microsoft Office 365

- **Envío de Emails**: Integración con Exchange Online
- **Autenticación**: Uso de Azure AD para algunas funcionalidades
- **Calendario**: Sincronización de entrevistas (futuro)

### Servicios de Email

- **Nodemailer**: Cliente principal para envío de correos
- **Resend**: Servicio alternativo/backup para envío
- **React Email**: Plantillas de correo modernas y responsivas

### Almacenamiento de Archivos

- **AWS S3**: Almacenamiento principal de archivos
- **Validación de archivos**: Verificación de tipos y tamaños
- **CDN**: Distribución optimizada de contenido estático

## Performance y Optimización

### Optimizaciones de Next.js

- **Server Side Rendering (SSR)**: Para páginas críticas
- **Static Site Generation (SSG)**: Para contenido estático
- **Image Optimization**: Optimización automática de imágenes
- **Code Splitting**: Carga lazy de componentes

### Optimizaciones de Frontend

- **Lazy Loading**: Carga diferida de componentes pesados
- **Memoización**: React.memo y useMemo para evitar re-renders
- **Debouncing**: En búsquedas y filtros
- **Paginación**: Para listas grandes de datos

### Caching

- **React Query**: Cache de datos de API (si se implementa)
- **Browser Cache**: Para recursos estáticos
- **API Response Cache**: Cache temporal de respuestas

## Seguridad

### Autenticación y Autorización

- **JWT Tokens**: Para sesiones de usuario
- **Role-based Access Control**: Control de acceso basado en roles
- **Route Protection**: Middleware para proteger rutas
- **Session Management**: Gestión segura de sesiones

### Validación de Datos

- **Zod Schemas**: Validación tanto frontend como backend
- **Input Sanitization**: Limpieza de inputs de usuario
- **File Validation**: Verificación de archivos subidos
- **XSS Protection**: Protección contra ataques cross-site scripting

### Headers de Seguridad

- **CORS**: Configuración de Cross-Origin Resource Sharing
- **CSP**: Content Security Policy
- **HSTS**: HTTP Strict Transport Security
- **X-Frame-Options**: Protección contra clickjacking

## Despliegue en VPS desde Cero

### Preparación del Servidor

1. **Configurar un servidor Ubuntu/Debian**

   ```bash
   # Actualizar paquetes
   apt update && apt upgrade -y

   # Instalar dependencias básicas
   apt install -y git curl build-essential
   ```

2. **Instalar Node.js**

   ```bash
   # Usar nvm para instalar Node.js
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
   source ~/.bashrc
   nvm install --lts
   ```

3. **Instalar pnpm**
   ```bash
   npm install -g pnpm
   ```

### Instalación de Nginx

1. **Instalar Nginx**

   ```bash
   apt install -y nginx
   ```

2. **Configurar firewall (si está activo)**
   ```bash
   ufw allow 'Nginx Full'
   ufw allow ssh
   ```

### Despliegue de la Aplicación

1. **Clonar el repositorio**

   ```bash
   git clone [URL_DEL_REPOSITORIO] /var/www/andes-client
   cd /var/www/andes-client
   ```

2. **Instalar dependencias y compilar**

   ```bash
   pnpm install
   pnpm build
   ```

3. **Configurar variables de entorno**

   ```bash
   nano .env.local
   ```

   Añadir las variables necesarias como en el ejemplo anterior.

4. **Configurar PM2 para mantener la aplicación funcionando**

   ```bash
   # Instalar PM2
   npm install -g pm2

   # Iniciar la aplicación con PM2
   pm2 start pnpm --name "andes-client" -- start

   # Configurar inicio automático
   pm2 startup
   pm2 save
   ```

### Configuración de Nginx como Proxy Inverso

1. **Crear archivo de configuración para Nginx**

   ```bash
   nano /etc/nginx/sites-available/andes-client
   ```

2. **Añadir la configuración**

   ```nginx
   server {
       listen 80;
       server_name tudominio.com www.tudominio.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Habilitar el sitio y reiniciar Nginx**
   ```bash
   ln -s /etc/nginx/sites-available/andes-client /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

### Configuración de SSL/TLS con Certbot

1. **Instalar Certbot**

   ```bash
   apt install -y certbot python3-certbot-nginx
   ```

2. **Obtener certificado SSL**

   ```bash
   certbot --nginx -d tudominio.com -d www.tudominio.com
   ```

3. **Configurar renovación automática**
   ```bash
   # Comprobar que la renovación funciona correctamente
   certbot renew --dry-run
   ```

### Configuración para Seguridad Adicional

1. **Configurar encabezados de seguridad en Nginx**

   ```bash
   nano /etc/nginx/sites-available/andes-client
   ```

   Añadir dentro del bloque `server`:

   ```nginx
   # Encabezados de seguridad
   add_header X-Frame-Options "SAMEORIGIN";
   add_header X-XSS-Protection "1; mode=block";
   add_header X-Content-Type-Options "nosniff";
   add_header Referrer-Policy "strict-origin-when-cross-origin";
   add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self' https:;";

   # Habilitar HSTS
   add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";
   ```

2. **Reiniciar Nginx**
   ```bash
   nginx -t
   systemctl restart nginx
   ```

### Backups Automáticos

1. **Crear script de backup**

   ```bash
   nano /var/www/backup-andes.sh
   ```

   Contenido:

   ```bash
   #!/bin/bash
   DATE=$(date +%Y-%m-%d)
   BACKUP_DIR="/var/backups/andes"
   mkdir -p $BACKUP_DIR

   # Backup de archivos de la aplicación
   tar -czf $BACKUP_DIR/andes-client-$DATE.tar.gz /var/www/andes-client

   # Retener solo últimos 7 backups
   find $BACKUP_DIR -type f -name "andes-client-*.tar.gz" -mtime +7 -delete
   ```

2. **Hacer ejecutable el script y programarlo**

   ```bash
   chmod +x /var/www/backup-andes.sh

   # Añadir a crontab para ejecución diaria
   (crontab -l 2>/dev/null; echo "0 2 * * * /var/www/backup-andes.sh") | crontab -
   ```

## Testing

### Configuración de Testing (Recomendado)

```bash
# Instalar dependencias de testing
pnpm add -D @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom

# Crear jest.config.js
echo "module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}" > jest.config.js

# Crear jest.setup.js
echo "import '@testing-library/jest-dom'" > jest.setup.js
```

### Tipos de Tests Recomendados

- **Unit Tests**: Para funciones utilitarias y hooks
- **Component Tests**: Para componentes individuales
- **Integration Tests**: Para flujos completos
- **API Tests**: Para endpoints internos

## Debugging y Desarrollo

### Herramientas de Debug

- **React DevTools**: Para debugging de componentes
- **Redux DevTools**: Para Zustand store debugging
- **Network Tab**: Para monitorear requests de API
- **Console Logging**: Sistema de logs estructurado

### Modo Desarrollo

```bash
# Ejecutar en modo desarrollo con debugging
NODE_ENV=development pnpm dev

# Ejecutar con debugging de Node.js
NODE_OPTIONS="--inspect" pnpm dev
```

### Variables de Debug

```env
# Habilitar logs detallados
DEBUG=true
NEXT_PUBLIC_DEBUG_MODE=true

# Logs de API
LOG_LEVEL=debug
```

## Deployment y CI/CD

### Build de Producción

```bash
# Limpiar cache y dependencias
rm -rf .next node_modules pnpm-lock.yaml

# Reinstalar dependencias
pnpm install

# Build optimizado
pnpm build

# Verificar build
pnpm start
```

### Configuración de CI/CD (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install

      - name: Build application
        run: pnpm build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}

      - name: Deploy to server
        run: |
          # Script de deployment personalizado
          ./deploy.sh
```

### Variables de Entorno por Ambiente

#### Desarrollo

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NODE_ENV=development
```

#### Staging

```env
NEXT_PUBLIC_API_URL=https://staging-api.teamandes.com/api
NODE_ENV=production
```

#### Producción

```env
NEXT_PUBLIC_API_URL=https://api.teamandes.com/api
NODE_ENV=production
```

## Monitoreo y Analytics

### Métricas Recomendadas

- **Performance**: Core Web Vitals
- **Errores**: Error tracking con Sentry (recomendado)
- **Usage**: Google Analytics o similar
- **API Performance**: Tiempo de respuesta de endpoints

### Configuración de Monitoreo

```typescript
// lib/analytics.ts
export const trackEvent = (eventName: string, properties?: object) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, properties);
  }
};

// Ejemplo de uso
trackEvent("application_submitted", {
  offer_id: offerId,
  candidate_id: candidateId,
});
```

## Mantenimiento

### Actualización de Dependencias

```bash
# Verificar dependencias obsoletas
pnpm outdated

# Actualizar dependencias menores
pnpm update

# Actualizar dependencias mayores (con cuidado)
pnpm add package@latest
```

### Limpieza de Cache

```bash
# Limpiar cache de Next.js
rm -rf .next

# Limpiar cache de pnpm
pnpm store prune

# Limpiar cache completo
pnpm store path | xargs rm -rf
```

### Backup de Datos

```bash
#!/bin/bash
# backup-frontend.sh

DATE=$(date +%Y-%m-%d)
BACKUP_DIR="/var/backups/andes-frontend"

# Crear directorio de backup
mkdir -p $BACKUP_DIR

# Backup de configuración
tar -czf $BACKUP_DIR/config-$DATE.tar.gz \
  .env.local \
  next.config.ts \
  tailwind.config.ts \
  tsconfig.json

# Backup de código fuente (sin node_modules)
tar --exclude=node_modules \
    --exclude=.next \
    --exclude=.git \
    -czf $BACKUP_DIR/source-$DATE.tar.gz .

# Retener últimos 30 días
find $BACKUP_DIR -type f -mtime +30 -delete
```

## Migración y Actualizaciones

### Migración de Next.js

```bash
# Actualizar Next.js a versión más reciente
pnpm add next@latest react@latest react-dom@latest

# Verificar breaking changes
npx @next/codemod@latest
```

### Migración de Base de Datos Frontend (LocalStorage/SessionStorage)

```typescript
// utils/migration.ts
export const migrateLocalStorage = () => {
  const version = localStorage.getItem("app_version");

  if (!version || version < "2.0.0") {
    // Migrar datos de versión anterior
    const oldData = localStorage.getItem("old_key");
    if (oldData) {
      localStorage.setItem("new_key", transformData(oldData));
      localStorage.removeItem("old_key");
    }

    localStorage.setItem("app_version", "2.0.0");
  }
};
```

## Troubleshooting

### Problemas Comunes

#### 1. Error de Hydration

```typescript
// Solución: Usar dynamic import para componentes del cliente
import dynamic from "next/dynamic";

const DynamicComponent = dynamic(() => import("./Component"), {
  ssr: false,
});
```

#### 2. CORS Errors

```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE" },
        ],
      },
    ];
  },
};
```

#### 3. Performance Issues

```typescript
// Lazy loading de componentes pesados
const HeavyComponent = lazy(() => import("./HeavyComponent"));

// Memoización de cálculos costosos
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);
```

#### 4. Memory Leaks

```typescript
// Limpieza de efectos
useEffect(() => {
  const subscription = subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, []);
```

### Logs y Debugging

#### Estructura de Logs

```typescript
// utils/logger.ts
export const logger = {
  error: (message: string, data?: any) => {
    console.error(`[ERROR] ${message}`, data);
    // Enviar a servicio de logging
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data);
  },
  info: (message: string, data?: any) => {
    console.info(`[INFO] ${message}`, data);
  },
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === "development") {
      console.debug(`[DEBUG] ${message}`, data);
    }
  },
};
```

## Contacto y Soporte

### Equipo de Desarrollo

- **Frontend Lead**: [Nombre del desarrollador frontend]
- **Backend Lead**: [Nombre del desarrollador backend]
- **DevOps**: [Nombre del especialista en infraestructura]

### Recursos Adicionales

- **Repositorio**: [URL del repositorio]
- **Documentación API**: [URL de la documentación del backend]
- **Issue Tracker**: [URL para reportar bugs]
- **Wiki**: [URL de documentación adicional]

---

_Última actualización: Julio 2025_
_Versión del documento: 2.0_
