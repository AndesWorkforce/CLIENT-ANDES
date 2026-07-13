# Imágenes Services — subir a S3

Archivos en esta carpeta (desarrollo local). Subir a:

`s3://andes-workforce-s3/images/page_andesworkforce/Services/`

| Archivo local | Uso |
|---------------|-----|
| `contact-hero-bg.jpg` | Fondo izquierdo del formulario de contacto |
| `contact-hero-overlay.png` | Overlay teal sobre el fondo |
| `contact-available-badge.png` | Icono badge "Available now" |
| `benefits-office.jpg` | Imagen derecha sección beneficios |
| `icon-vetted-talent.png` | Icono "Vetted Elite Talent" |
| `icon-high-impact.png` | Icono "High-Impact Performance" |
| `icon-exceptional-value.png` | Icono "Exceptional Value" |

Después de subir a S3, en `src/app/pages/services/services-assets.ts` poner `USE_S3 = true`.
