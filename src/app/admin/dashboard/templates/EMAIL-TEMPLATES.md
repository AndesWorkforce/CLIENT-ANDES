# Email Templates API

Este módulo permite la gestión de plantillas de correo electrónico en el sistema Andes. Solo los usuarios con rol `ADMIN` o `EMPLEADO_ADMIN` pueden acceder a estos endpoints.

---

## Endpoints

| Método | Endpoint                       | Descripción                                   | Autenticación |
| ------ | ------------------------------ | --------------------------------------------- | ------------- |
| POST   | `/email-templates`             | Crear una nueva plantilla de correo           | Sí (JWT)      |
| GET    | `/email-templates`             | Obtener todas las plantillas de correo        | Sí (JWT)      |
| GET    | `/email-templates/:id`         | Obtener una plantilla de correo por ID        | Sí (JWT)      |
| POST   | `/email-templates/:id/preview` | Previsualizar una plantilla con variables     | Sí (JWT)      |
| PATCH  | `/email-templates/:id`         | Actualizar una plantilla de correo            | Sí (JWT)      |
| DELETE | `/email-templates/:id`         | Desactivar (eliminar) una plantilla de correo | Sí (JWT)      |

---

## Ejemplos de consumo desde el frontend

> **Nota:** Cambia la URL base (`/email-templates`) por la de tu API si es necesario (por ejemplo, `http://localhost:3000/email-templates`).  
> Todos los endpoints requieren autenticación JWT en el header `Authorization`.

### 1. Crear una plantilla

```javascript
fetch("/email-templates", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
  body: JSON.stringify({
    nombre: "Bienvenida",
    asunto: "¡Bienvenido a Andes!",
    contenido: "<p>Hola {{nombre}}, gracias por registrarte.</p>",
    variables: ["nombre"],
    descripcion: "Plantilla de bienvenida",
  }),
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

### 2. Listar plantillas

```javascript
fetch("/email-templates", {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

### 3. Obtener una plantilla por ID

```javascript
fetch("/email-templates/123", {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

### 4. Previsualizar plantilla

```javascript
fetch("/email-templates/123/preview", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
  body: JSON.stringify({
    nombre: "Juan",
  }),
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

### 5. Actualizar plantilla

```javascript
fetch("/email-templates/123", {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
  body: JSON.stringify({
    asunto: "Nuevo asunto",
    contenido: "<p>Nuevo cuerpo</p>",
    variables: ["nombre"],
  }),
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

### 6. Eliminar (desactivar) plantilla

```javascript
fetch("/email-templates/123", {
  method: "DELETE",
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

Modelo Prisma

```prisma
model EmailTemplate {
  id                 String   @id @default(uuid())
  nombre             String
  asunto             String
  contenido          String
  esHtml             Boolean  @default(true)
  variables          String[] // Variables que se pueden reemplazar en la plantilla
  descripcion        String?
  fechaCreacion      DateTime @default(now())
  fechaActualizacion DateTime @updatedAt
  creadoPorId        String?
  activo             Boolean  @default(true)
  creadoPor          Usuario? @relation("CreadorEmailTemplate", fields: [creadoPorId], references: [id])
}
```
