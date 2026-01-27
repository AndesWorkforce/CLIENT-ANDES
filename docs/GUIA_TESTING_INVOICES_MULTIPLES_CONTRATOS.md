# Guía: Testing de Invoices con Múltiples Contratos

Esta guía te ayudará a crear una cuenta de testeo, asignarle 2 contratos desde el admin, y probar la generación de invoices para verificar que la corrección de múltiples contratos funciona correctamente.

**Fecha:** Enero 2026  
**Objetivo:** Verificar que usuarios con múltiples contratos pueden generar y ver todos sus invoices correctamente

---

## 📋 Prerequisitos

1. Tener acceso a una cuenta de **ADMIN** o **EMPLEADO_ADMIN**
2. Tener el frontend y backend corriendo (`localhost:3000` y puerto del backend)
3. Tener acceso a la base de datos (opcional, para verificar datos)

---

## 🔐 Paso 1: Crear Usuario de Testeo

### Opción A: Desde el Panel de Admin (Recomendado)

1. **Iniciar sesión como Admin**
   - Ve a `http://localhost:3000/auth/login`
   - Inicia sesión con tu cuenta de admin

2. **Ir al Panel de Usuarios**
   - Navega a: `/admin/superAdmin/users`
   - O desde el menú: **Super Admin** → **Users**

3. **Crear Nuevo Usuario**
   - Haz clic en el botón **"Create User"** (botón con icono `+`)
   - Completa el formulario:
     ```
     Nombre: Test
     Apellido: User
     Correo: test.user@example.com (o el que prefieras)
     Contraseña: Test123456! (o la que prefieras)
     Teléfono: (opcional)
     Residencia: (opcional)
     ```
   - Haz clic en **"Create"** o **"Guardar"**
   - ✅ Deberías ver una notificación: "User created successfully"

4. **Verificar que el usuario se creó**
   - El usuario debería aparecer en la tabla de usuarios
   - Anota el **correo** y **contraseña** para usarlo más tarde

### Opción B: Desde el Registro Público (Alternativa)

1. **Ir a la página de registro**
   - Ve a `http://localhost:3000/auth/register`
   - Completa el formulario de registro
   - ⚠️ **Nota:** Este método crea un usuario con rol `CANDIDATO`, que es lo que necesitamos

---

## 📝 Paso 2: Crear Ofertas de Trabajo (Si no existen)

Para asignar contratos, necesitas tener ofertas de trabajo disponibles. Si ya tienes ofertas, puedes saltar este paso.

1. **Ir al Dashboard de Ofertas**
   - Navega a: `/admin/dashboard/offers`
   - O desde el menú: **Dashboard** → **Offers**

2. **Crear Primera Oferta**
   - Haz clic en **"Create Offer"** o **"Nueva Oferta"**
   - Completa los datos básicos:
     ```
     Título: Desarrollador Frontend - Contrato 1
     Descripción: Oferta de prueba para contrato 1
     Departamento: Technology
     Seniority: Mid-Level
     País: (el que prefieras)
     Modalidad: Remote
     ```
   - Guarda la oferta
   - **Anota el ID de la oferta** (puedes verlo en la URL o en la tabla)

3. **Crear Segunda Oferta**
   - Repite el proceso para crear una segunda oferta:
     ```
     Título: Desarrollador Backend - Contrato 2
     Descripción: Oferta de prueba para contrato 2
     ```
   - **Anota el ID de la segunda oferta**

---

## 👤 Paso 3: Asignar Postulaciones al Usuario de Testeo

Para crear contratos, primero necesitas asignar al usuario a las ofertas (crear postulaciones).

### 3.1 Asignar Primera Postulación

1. **Ir a Postulantes**
   - Navega a: `/admin/dashboard/postulants`
   - O desde el menú: **Dashboard** → **Postulants**

2. **Buscar o Crear el Usuario de Testeo**
   - Si el usuario no aparece, haz clic en **"Create Applicant"** o **"Crear Candidato"**
   - Completa los datos del usuario de testeo
   - O busca el usuario en la lista si ya existe

3. **Asignar a Primera Oferta**
   - Haz clic en el botón **"Assign"** o **"Asignar"** junto al usuario
   - Selecciona la **primera oferta** (Desarrollador Frontend - Contrato 1)
   - Haz clic en **"Assign"** o **"Asignar"**
   - ✅ Deberías ver una notificación de éxito
   - **Anota el `postulacionId`** (puedes verlo en la URL o en los logs de la consola)

### 3.2 Asignar Segunda Postulación

1. **Asignar a Segunda Oferta**
   - Repite el proceso para asignar al mismo usuario a la **segunda oferta** (Desarrollador Backend - Contrato 2)
   - ⚠️ **Importante:** El sistema permite múltiples postulaciones activas para el mismo usuario
   - **Anota el segundo `postulacionId`**

---

## 📋 Paso 4: Cambiar Estado de Postulaciones a "ACEPTADA"

⚠️ **IMPORTANTE:** El botón "Sign Contract" solo aparece cuando la postulación está en estado **"ACEPTADA"** (ACCEPTED). Debes cambiar el estado antes de poder crear el contrato.

### 4.1 Cambiar Primera Postulación a "ACEPTADA"

1. **Ir a Postulantes**
   - Navega a: `/admin/dashboard/postulants`
   - Busca el usuario de testeo en la lista

2. **Abrir Modal de Cambio de Estado**
   - En la columna **"Stage"**, haz clic en el badge del estado actual (ej: "Available", "Profile Incomplete", etc.)
   - O haz clic en el botón **"Edit"** en la columna **"Applicant Status"**
   - Se abrirá un modal para cambiar el estado

3. **Cambiar Estado a "ACEPTADA"**
   - En el modal, selecciona el estado **"ACEPTADA"** o **"ACCEPTED"**
   - Haz clic en **"Update"** o **"Actualizar"**
   - ✅ Deberías ver una notificación de éxito
   - El estado en la columna "Stage" debería cambiar a **"Hired"**

### 4.2 Cambiar Segunda Postulación a "ACEPTADA"

1. **Repetir para Segunda Postulación**
   - Busca la **segunda postulación** del mismo usuario (debería aparecer como una fila separada o expandida)
   - Haz clic en el badge del estado en la columna "Stage"
   - Cambia el estado a **"ACEPTADA"**
   - ✅ Verifica que ambas postulaciones estén en estado "ACEPTADA"

---

## 📄 Paso 5: Crear Contratos desde Admin

Ahora que las postulaciones están en estado "ACEPTADA", el botón "Sign Contract" debería aparecer en la columna **"Actions"** (icono de documento 📄).

### 5.1 Crear Primer Contrato

1. **Ir a Postulantes**
   - Navega a: `/admin/dashboard/postulants`
   - Busca el usuario de testeo en la lista

2. **Localizar el Botón "Sign Contract"**
   - En la columna **"Actions"** (última columna de la tabla, a la derecha), busca el icono de **documento** (📄 FileText)
   - El botón aparece como un icono azul de documento en la columna "Actions"
   - ⚠️ **IMPORTANTE:** Este botón solo aparece si:
     - La postulación está en estado **"ACEPTADA"** (verificado en Paso 4)
     - El candidato tiene una postulación activa (columna "Current Application" no dice "No applications")
   - **Ubicación visual:** 
     - Columna: **"Actions"** (última columna)
     - Icono: 📄 (FileText, color azul `#0097B2`)
     - Posición: Junto a otros iconos de acciones (lápiz ✏️, sobre ✉️, marcador 🔖)
   - Si no ves el botón, verifica que el estado sea "ACEPTADA" (ver Paso 4) y refresca la página

3. **Abrir Modal de Contrato**
   - Haz clic en el icono de **documento** (📄) en la columna "Actions" junto a la primera postulación
   - Se abrirá un modal con el formulario de contrato

3. **Completar Datos del Contrato**
   ```
   Nombre Completo: Test User
   Puesto de Trabajo: Desarrollador Frontend
   Oferta Salarial: 5000
   Moneda Salario: USD
   Fecha Inicio Labores: (fecha futura, ej: 2026-02-01)
   ```
   - Selecciona un **template de contrato** (si hay disponibles)
   - O sube un archivo PDF del contrato

4. **Completar Datos del Contrato**
   ```
   Nombre Completo: Test User
   Puesto de Trabajo: Desarrollador Frontend
   Oferta Salarial: 5000
   Moneda Salario: USD
   Fecha Inicio Labores: (fecha futura, ej: 2026-02-01)
   ```
   - Selecciona un **template de contrato** (si hay disponibles)
   - O sube un archivo PDF del contrato

5. **Enviar Contrato**
   - Haz clic en **"Send Contract"** o **"Enviar Contrato"**
   - ✅ Deberías ver una notificación: "Contract sent successfully"
   - **Anota el `procesoContratacionId`** del primer contrato (puedes verlo en los logs o en la respuesta)

### 5.2 Crear Segundo Contrato

1. **Repetir para Segunda Postulación**
   - Busca la **segunda postulación** del mismo usuario
   - Haz clic en el icono de **documento** (📄) en la columna "Actions"
   - Completa los datos:
     ```
     Nombre Completo: Test User
     Puesto de Trabajo: Desarrollador Backend
     Oferta Salarial: 6000
     Moneda Salario: USD
     Fecha Inicio Labores: (fecha futura, ej: 2026-02-01)
     ```
   - Envía el contrato
   - **Anota el `procesoContratacionId`** del segundo contrato

### 5.3 Verificar Contratos Creados

1. **Ir a Contratos**
   - Navega a: `/admin/dashboard/contracts`
   - Busca el usuario de testeo
   - ✅ Deberías ver **2 contratos** para el mismo usuario
   - Verifica que ambos tengan `estadoContratacion` diferente de "CANCELLED" o "EXPIRED"

---

## 🔐 Paso 6: Iniciar Sesión con Usuario de Testeo

1. **Cerrar Sesión de Admin**
   - Haz clic en tu perfil → **"Logout"** o **"Cerrar Sesión"**

2. **Iniciar Sesión con Usuario de Testeo**
   - Ve a `http://localhost:3000/auth/login`
   - Ingresa las credenciales:
     ```
     Correo: test.user@example.com (el que creaste)
     Contraseña: Test123456! (la que configuraste)
     ```
   - Haz clic en **"Login"** o **"Iniciar Sesión"**

3. **Verificar que estás logueado**
   - Deberías ver tu nombre en el Navbar
   - Navega a `/currentApplication` para ver tus contratos

---

## 💰 Paso 7: Generar Invoices

Ahora vamos a probar la funcionalidad de invoices con múltiples contratos.

### 7.1 Verificar que Tienes Múltiples Contratos

1. **Ir a Current Application**
   - Navega a: `/currentApplication`
   - Deberías ver un **selector de contratos** (dropdown) si tienes múltiples contratos activos
   - ✅ Verifica que puedas ver ambos contratos en el selector

### 7.2 Generar Primer Invoice

1. **Seleccionar Primer Contrato**
   - En el selector de contratos, selecciona el **primer contrato** (Desarrollador Frontend)

2. **Ir a la Pestaña "Inboxes"**
   - Haz clic en la pestaña **"Inboxes"** o **"Invoices"**

3. **Generar Invoice**
   - Selecciona un **mes** y **año** (ej: Enero 2026)
   - Haz clic en **"Generate Invoice"** o **"Generar Invoice"**
   - ✅ Deberías ver una notificación: "Invoice generated"
   - ✅ El invoice debería aparecer en la lista

4. **Verificar en Consola**
   - Abre la consola del navegador (F12 → Console)
   - Busca los logs:
     ```
     [mapInboxItems] Raw items from API: [...]
     [mapInboxItems] Mapped item: {id: "...", procesoContratacionId: "...", ...}
     ```
   - ✅ Verifica que el `procesoContratacionId` esté presente en el item mapeado

### 7.3 Generar Segundo Invoice (Mismo Mes, Diferente Contrato)

⚠️ **IMPORTANTE:** El sistema permite 1 invoice por mes **POR CADA CONTRATO**. Para generar un segundo invoice del mismo mes, debes **cambiar de contrato** primero.

1. **Cambiar al Segundo Contrato**
   - En la sección "Generate Invoice", verás un **selector azul** que dice "📋 Select Contract for Invoice"
   - Selecciona el **segundo contrato** (Desarrollador Backend)
   - 💡 **Tip:** El mensaje bajo el selector indica: "You can generate one invoice per month for each contract"

2. **Generar Invoice para el Mismo Mes**
   - Selecciona el **mismo mes y año** que usaste antes (ej: Enero 2026)
   - Haz clic en **"Generate Invoice"**
   - ✅ Deberías ver una notificación: "Invoice generated"

3. **Verificar que Ambos Invoices Aparecen**
   - ✅ **CRÍTICO:** Ambos invoices deberían aparecer en la lista
   - ✅ Cada invoice ahora muestra una **etiqueta azul** con el nombre del contrato al que pertenece (ej: "📋 Desarrollador Frontend", "📋 Desarrollador Backend")
   - ✅ No debería desaparecer el primer invoice
   - ✅ Deberías ver 2 invoices para el mismo mes (uno por cada contrato)

4. **Verificar en Consola**
   - Revisa los logs en la consola:
     ```
     [mapInboxItems] Raw items from API: [{...}, {...}]  // 2 items
     ```
   - ✅ Verifica que ambos items tengan `procesoContratacionId` diferentes
   - ✅ Verifica que ambos items tengan el mismo `añoMes` pero diferentes `procesoContratacionId`

---

## ✅ Paso 8: Verificar la Corrección

### 8.1 Verificar que la Corrección Funciona

**Antes de la corrección:**
- ❌ Solo se veía 1 invoice (el último generado)
- ❌ El primer invoice desaparecía al generar el segundo

**Después de la corrección:**
- ✅ Ambos invoices aparecen en la lista
- ✅ Los invoices se distinguen por `procesoContratacionId`
- ✅ No hay errores en la consola

### 8.2 Verificar Logs

Revisa la consola del navegador para verificar:

1. **Logs de Mapeo**
   ```
   [mapInboxItems] Raw items from API: [...]
   [mapInboxItems] Filtered items: [...]
   [mapInboxItems] Mapped item: {id: "...", procesoContratacionId: "...", ...}
   ```
   - ✅ Cada item mapeado debe tener `procesoContratacionId`

2. **Logs de Generación**
   ```
   [handleGenerateInbox] API response: {...}
   [handleGenerateInbox] Extracted item: {...}
   ```
   - ✅ El item extraído debe tener `procesoContratacionId`

3. **Verificación de Duplicados**
   - La verificación de duplicados ahora compara:
     - `year` ✅
     - `month` ✅
     - `procesoContratacionId` ✅ (NUEVO)

### 8.3 Verificar en Base de Datos (Opcional)

Si tienes acceso a la base de datos, puedes verificar:

```sql
-- Ver todos los invoices del usuario de testeo
SELECT 
  id,
  usuarioId,
  procesoContratacionId,
  añoMes,
  invoiceNumber,
  createdAt
FROM PaymentInbox
WHERE usuarioId = 'ID_DEL_USUARIO_DE_TESTEO'
ORDER BY createdAt DESC;
```

Deberías ver:
- ✅ 2 registros con el mismo `añoMes` pero diferentes `procesoContratacionId`
- ✅ Ambos con `usuarioId` igual al usuario de testeo

---

## 🐛 Troubleshooting

### Problema: No puedo crear el usuario desde admin

**Solución:**
- Verifica que tengas permisos de ADMIN o EMPLEADO_ADMIN
- Verifica que el correo no esté ya registrado
- Revisa los logs del backend para ver errores

### Problema: No puedo asignar postulaciones

**Solución:**
- Verifica que el usuario tenga rol `CANDIDATO`
- Verifica que las ofertas existan y estén activas
- Revisa los logs del backend

### Problema: No veo el botón "Sign Contract" (icono de documento)

**Solución:**
- ⚠️ **CRÍTICO:** El botón solo aparece cuando la postulación está en estado **"ACEPTADA"**
- Verifica que hayas cambiado el estado de la postulación a "ACEPTADA" (ver Paso 4)
- Verifica que el candidato tenga una postulación activa (columna "Current Application" no debe decir "No applications")
- Si el estado es "ACEPTADA", el badge en "Stage" debería mostrar "Hired"
- Refresca la página si acabas de cambiar el estado

### Problema: No puedo crear contratos

**Solución:**
- Verifica que las postulaciones estén en estado "ACEPTADA"
- Verifica que tengas permisos de admin
- Revisa que el template de contrato esté disponible
- Revisa los logs del backend para errores de SignWell

### Problema: Solo veo 1 invoice en la lista

**Solución:**
- ✅ **Esto es el problema que estamos corrigiendo**
- Verifica en la consola que ambos invoices tengan `procesoContratacionId` diferentes
- Verifica que la verificación de duplicados incluya `procesoContratacionId`
- Revisa los logs de `handleGenerateInbox` para ver si detecta duplicados incorrectamente

### Problema: No me deja generar más de 1 invoice

**Solución:**
- ⚠️ **El sistema permite 1 invoice por mes POR CADA CONTRATO**
- Si intentas generar un segundo invoice para el mismo mes **sin cambiar de contrato**, el sistema dirá "Invoice already exists for that month"
- **Para generar múltiples invoices del mismo mes:**
  1. Verifica que tengas múltiples contratos activos (deberías ver el selector "📋 Select Contract for Invoice")
  2. Genera el primer invoice con el Contrato A
  3. **Cambia al Contrato B** usando el selector
  4. Genera el segundo invoice (mismo mes, pero diferente contrato)
- Si solo tienes 1 contrato activo, solo podrás generar 1 invoice por mes
- Cada invoice en la lista ahora muestra una etiqueta azul indicando a qué contrato pertenece

### Problema: Los invoices no se generan

**Solución:**
- Verifica que el contrato esté en estado `CONTRATO_FINALIZADO` o similar
- Verifica que tengas permisos para generar invoices
- Revisa los logs del backend para errores
- Verifica que el mes/año seleccionado sea válido

---

## 📊 Checklist de Verificación

Usa este checklist para verificar que todo funciona correctamente:

- [ ] Usuario de testeo creado exitosamente
- [ ] 2 ofertas de trabajo creadas
- [ ] 2 postulaciones asignadas al usuario de testeo
- [ ] 2 contratos creados para el usuario de testeo
- [ ] Usuario de testeo puede iniciar sesión
- [ ] Usuario de testeo puede ver ambos contratos en `/currentApplication`
- [ ] Primer invoice generado exitosamente (Contrato 1, Enero 2026)
- [ ] Segundo invoice generado exitosamente (Contrato 2, Enero 2026)
- [ ] **Ambos invoices aparecen en la lista** ✅
- [ ] Los invoices tienen `procesoContratacionId` diferentes
- [ ] Los invoices tienen el mismo `añoMes`
- [ ] No hay errores en la consola del navegador
- [ ] No hay errores en los logs del backend
- [ ] Los botones "View" y "Download" funcionan para ambos invoices

---

## 🎯 Resultado Esperado

Al finalizar esta guía, deberías tener:

1. ✅ Un usuario de testeo con 2 contratos activos
2. ✅ 2 invoices generados para el mismo mes pero diferentes contratos
3. ✅ Ambos invoices visibles en la lista de invoices
4. ✅ Verificación de que la corrección de múltiples contratos funciona correctamente

---

## 📝 Notas Adicionales

### Estados de Contrato

Para que los invoices se puedan generar, el contrato debe estar en uno de estos estados:
- `CONTRATO_FINALIZADO` (recomendado para testing)
- `FIRMADO_CANDIDATO`
- `FIRMADO_PROVEEDOR`

### Fechas de Invoice

- Los invoices se generan para un mes/año específico
- El mes debe ser válido (1-12)
- El año debe ser válido (generalmente el año actual o anterior)

### Múltiples Contratos

- El sistema permite que un usuario tenga múltiples contratos activos simultáneamente
- Cada invoice está asociado a un contrato específico (`procesoContratacionId`)
- La restricción única en la BD es `[procesoContratacionId, añoMes]`, lo que permite:
  - ✅ Múltiples invoices del mismo mes para diferentes contratos
  - ❌ Solo un invoice por mes para el mismo contrato

---

## 👥 Autor

Guía creada para facilitar el testing de la corrección de invoices con múltiples contratos.

**Fecha de creación:** Enero 2026

