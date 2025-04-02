# Documentación del Proyecto Andes Client

## Tecnologías Utilizadas

### Frontend

- **Next.js 15.2.0**: Framework de React utilizado como base del proyecto
- **React 19.0.0**: Biblioteca para la construcción de interfaces de usuario
- **TypeScript**: Lenguaje de programación tipado utilizado en todo el proyecto
- **TailwindCSS 4**: Framework CSS para el diseño y estilizado
- **Zustand 5.0.3**: Biblioteca para el manejo del estado global
- **React Hook Form 7.54.2**: Para manejar formularios con validación
- **Zod 3.24.2**: Biblioteca para validación de esquemas
- **Axios**: Cliente HTTP para realizar peticiones al backend
- **React Email/Resend**: Para el envío de correos electrónicos
- **React PDF**: Para generación y visualización de archivos PDF
- **React Quill**: Editor de texto enriquecido
- **Slate**: Framework para edición de texto

### Configuración

- **ESLint**: Para linting de código
- **Prettier**: Para formateo de código (implícito en la configuración)
- **PostCSS**: Para procesamiento de CSS

## Estructura del Proyecto

```
andes-client/
├── .next/               # Archivos compilados de Next.js
├── node_modules/        # Dependencias instaladas
├── public/              # Archivos estáticos públicos
├── src/                 # Código fuente
│   ├── app/             # Rutas y páginas de la aplicación (App Router de Next.js)
│   │   ├── api/         # Rutas de API (API Routes de Next.js)
│   │   ├── auth/        # Páginas relacionadas con autenticación
│   │   ├── admin/       # Área de administradores
│   │   ├── account/     # Gestión de cuenta de usuario
│   │   ├── profile/     # Perfil de usuario
│   │   └── components/  # Componentes específicos de la app
│   ├── components/      # Componentes reutilizables
│   │   ├── ui/          # Componentes de interfaz
│   │   └── icons/       # Iconos personalizados
│   ├── assets/          # Recursos estáticos
│   ├── hooks/           # Hooks personalizados
│   ├── services/        # Servicios y API clients
│   │   ├── axios.client.ts    # Cliente Axios (lado cliente)
│   │   ├── axios.server.ts    # Cliente Axios (lado servidor)
│   │   └── axios.instance.ts  # Instancia base de Axios
│   └── store/           # Estado global (Zustand)
├── .env.local           # Variables de entorno locales
├── .gitignore           # Archivos ignorados por git
├── package.json         # Dependencias y scripts
├── pnpm-lock.yaml       # Lock file de pnpm
├── tsconfig.json        # Configuración de TypeScript
├── tailwind.config.ts   # Configuración de TailwindCSS
└── next.config.ts       # Configuración de Next.js
```

## Cómo Ejecutar el Proyecto

### Requisitos Previos

- Node.js (v18 o superior)
- pnpm, yarn o npm (preferiblemente pnpm)

### Pasos para Ejecución Local

1. **Clonar el repositorio**

   ```bash
   git clone [URL_DEL_REPOSITORIO]
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

## Monitoreo

Para monitorear el rendimiento de la aplicación, puedes usar:

1. PM2 que incluye monitoreo básico: `pm2 monit`
2. Configurar herramientas como Prometheus + Grafana para monitoreo avanzado

## Actualización de la Aplicación

```bash
cd /var/www/andes-client
git pull
pnpm install
pnpm build
pm2 restart andes-client
```

## Solución de Problemas Comunes

1. **Errores de conexión a la API**

   - Verificar que NEXT_PUBLIC_API_URL esté correctamente configurado
   - Comprobar que la API esté funcionando correctamente

2. **Problemas con envío de correos**

   - Verificar las credenciales de Office 365 o correo tradicional
   - Comprobar la clave de Resend si se usa este servicio

3. **Errores 502 Bad Gateway**
   - Verificar que la aplicación Next.js esté en ejecución: `pm2 list`
   - Revisar logs de Nginx: `tail -f /var/log/nginx/error.log`
