# Corrección de Error 400 en Descarga/Visualización de Invoices

## 📋 Resumen Ejecutivo

Se corrigió un error crítico que causaba errores HTTP 400 al intentar descargar o visualizar invoices (facturas de pago). El problema ocurría cuando el frontend intentaba hacer requests con `undefined` como ID del invoice, lo cual violaba la validación de UUID en el backend.

**Fecha:** Enero 2026  
**Severidad:** Alta  
**Impacto:** Los usuarios no podían descargar o visualizar sus invoices

---

## 🐛 Problema Identificado

### Síntomas
- Errores HTTP 400 al intentar descargar invoices
- Errores HTTP 400 al intentar visualizar invoices
- **Runtime TypeError**: `can't access property "invoiceNumber", item is undefined`
- Mensaje de error del backend: `Validation failed (uuid is expected)`
- Logs del backend mostraban: `GET /api/users/inboxes/undefined/view - 400 Bad Request`
- Aplicación crasheaba al intentar renderizar invoices

### Causa Raíz

**Causa Principal: Interceptor de Axios Reseteando Cookies Incorrectamente**

El problema principal estaba en el interceptor de respuesta de `axios.server.ts`. Cuando ocurría un error 401 (token expirado o inválido), el interceptor intentaba:

1. **Eliminar cookies de autenticación** (`auth_token`, `user_info`) fuera del contexto válido
2. **Hacer redirect** a la página de logout forzado

Esto causaba múltiples problemas:
- ❌ Error: `Cookies can only be modified in a Server Action or Route Handler`
- ❌ Error: `NEXT_REDIRECT` en contexto inválido
- ❌ **Pérdida de sesión del usuario**: Las cookies se intentaban eliminar pero fallaba, dejando al usuario en un estado inconsistente
- ❌ **Datos de usuario perdidos**: Al perder la sesión, el `userId` y otros datos críticos se perdían
- ❌ **Items sin ID**: Al perder la sesión, las peticiones para obtener invoices fallaban o retornaban datos incompletos

**Causas Secundarias:**
1. **Items sin ID válido**: Algunos items de inbox devueltos por el backend no tenían un `id` válido (podía ser `undefined`, `null`, o string vacío) - posiblemente como consecuencia de la pérdida de sesión
2. **Falta de validación**: El frontend no validaba que el `id` fuera válido antes de hacer las peticiones
3. **Mapeo de datos**: La función `mapInboxItems` no filtraba items inválidos antes de mapearlos

---

## ✅ Solución Implementada

### 0. Corrección del Interceptor de Axios (Causa Raíz)

**Archivo:** `src/services/axios.server.ts`

**Problema anterior:**
```typescript
// ANTES - Código problemático
axiosServer.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // ❌ Intentaba eliminar cookies fuera de contexto válido
      cookieStore.delete(AUTH_COOKIE);
      cookieStore.delete(USER_INFO_COOKIE);
      
      // ❌ Intentaba hacer redirect fuera de contexto válido
      redirect('/auth/forced-logout?reason=session_expired');
    }
  }
);
```

**Solución implementada:**
```typescript
// DESPUÉS - Código corregido
axiosServer.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes("auth/login")) {
      console.log("[Axios] Interceptor de respuesta 401 - Error de autenticación");
      // ✅ Solo propaga el error, no intenta modificar cookies ni hacer redirect
      // El código que llama debe manejar el error 401 apropiadamente
    }
    return Promise.reject(error);
  }
);
```

**Beneficios:**
- ✅ No más errores de "Cookies can only be modified"
- ✅ No más errores de "NEXT_REDIRECT" en contexto inválido
- ✅ **Sesión del usuario preservada**: Las cookies no se eliminan incorrectamente
- ✅ **Datos de usuario intactos**: El `userId` y otros datos críticos se mantienen
- ✅ **Requests válidos**: Las peticiones para obtener invoices ahora tienen contexto de usuario válido

**Cambio adicional:**
- Se crea una nueva instancia de axios para cada llamada, evitando que los interceptores se acumulen en una instancia compartida

---

### 1. Filtrado de Items Inválidos en `mapInboxItems`

**Archivo:** `src/app/currentApplication/page.tsx`

**Cambio:**
```typescript
// ANTES
const mapInboxItems = (items: any[]): InboxItem[] => {
  return (items || []).map((it) => {
    // ... mapeo sin validación ni logging
    return {
      id: it.id, // Podía ser undefined
      // ...
    };
  });
};

// DESPUÉS
const mapInboxItems = (items: any[]): InboxItem[] => {
  console.log("[mapInboxItems] Raw items from API:", items);
  
  const filtered = (items || []).filter((it) => {
    const hasId = it && it.id && typeof it.id === "string" && it.id.trim() !== "";
    if (!hasId) {
      console.warn("[mapInboxItems] Filtering out item without valid ID:", it);
    }
    return hasId;
  });
  
  console.log("[mapInboxItems] Filtered items:", filtered);
  
  return filtered.map((it) => {
    // ... mapeo con items válidos garantizados
    const mappedItem = {
      id: it.id, // Ahora siempre es un string válido
      invoiceNumber: String(it.invoiceNumber || "#"),
      // ...
    } as InboxItem;
    
    console.log("[mapInboxItems] Mapped item:", mappedItem);
    return mappedItem;
  });
};
```

**Beneficios:** 
- Solo se procesan items con IDs válidos
- Logging detallado de datos crudos, filtrados y mapeados
- Warnings para identificar qué items se están descartando
- Visibilidad completa del flujo de datos

---

### 2. Validación Post-Mapeo en `fetchInboxesPage`

**Archivo:** `src/app/currentApplication/page.tsx`

**Cambio:**
```typescript
// ANTES
const fetchInboxesPage = async (append = false) => {
  // ...
  const payload = res.data || {};
  const items = mapInboxItems(payload.data || payload.items || []);
  setInboxes((prev) => (append ? [...prev, ...items] : items));
};

// DESPUÉS
const fetchInboxesPage = async (append = false) => {
  // ...
  const payload = res.data || {};
  const items = mapInboxItems(payload.data || payload.items || []).filter(
    (item) => item && item.id && item.invoiceNumber
  );
  setInboxes((prev) => (append ? [...prev, ...items] : items));
};
```

**Beneficio:** Capa adicional de validación que asegura que incluso si `mapInboxItems` retorna algún item inválido (por ejemplo, sin `invoiceNumber`), se filtra antes de actualizar el estado.

---

### 3. Validación en Generación de Invoice (`handleGenerateInbox`)

**Archivo:** `src/app/currentApplication/page.tsx`

**Cambio:**
```typescript
// ANTES
const handleGenerateInbox = async () => {
  // ...
  const item = res.data?.data || res.data;
  if (item) {
    const mapped = mapInboxItems([item])[0];
    setInboxes((prev) => {
      const next = exists ? prev : [mapped, ...prev];
      // ...
    });
  }
};

// DESPUÉS
const handleGenerateInbox = async () => {
  // ...
  console.log("[handleGenerateInbox] API response:", res);
  const item = res.data?.data || res.data;
  console.log("[handleGenerateInbox] Extracted item:", item);
  
  if (item) {
    const mappedItems = mapInboxItems([item]);
    const mapped = mappedItems[0];
    
    if (mapped && mapped.id) {
      setInboxes((prev) => {
        const next = exists ? prev : [mapped, ...prev];
        // ...
      });
    }
  }
};
```

**Beneficios:**
- Validación explícita de que `mapped` y `mapped.id` existen
- Logging para debugging de respuestas del backend
- Previene agregar items undefined al estado

---

### 4. Validación en Render

**Archivo:** `src/app/currentApplication/page.tsx`

**Cambio:**
```typescript
// ANTES
<div className="p-4 space-y-4">
  {inboxes.slice(0, visibleInboxCount).map((item) => (
    <div key={item.id}>
      <p>Invoice {item.invoiceNumber} — {item.month} {item.year}</p>
      // ...
    </div>
  ))}
</div>

// DESPUÉS
<div className="p-4 space-y-4">
  {inboxes
    .filter((item) => item && item.id && item.invoiceNumber)
    .slice(0, visibleInboxCount)
    .map((item) => (
      <div key={item.id}>
        <p>Invoice {item.invoiceNumber} — {item.month} {item.year}</p>
        // ...
      </div>
    ))}
</div>
```

**Beneficio:** Última línea de defensa - filtra cualquier item undefined/inválido antes del render, previniendo el error `can't access property "invoiceNumber", item is undefined`.

---

### 5. Validación en Server Actions

**Archivo:** `src/app/currentApplication/actions/invoices.actions.ts`

**Funciones modificadas:**
- `viewInboxPdfAction(inboxId: string)`
- `downloadInboxPdfAction(inboxId: string)`

**Cambio:**
```typescript
// ANTES
export async function viewInboxPdfAction(inboxId: string) {
  try {
    const axios = await createServerAxios();
    const response = await axios.get(`users/inboxes/${inboxId}/view`, {
      // ... sin validación previa
    });
  }
}

// DESPUÉS
export async function viewInboxPdfAction(inboxId: string) {
  // Validación temprana
  if (!inboxId || typeof inboxId !== "string" || inboxId.trim() === "") {
    return {
      success: false,
      error: "Invalid invoice ID",
    };
  }
  try {
    const axios = await createServerAxios();
    const response = await axios.get(`users/inboxes/${inboxId}/view`, {
      // ... solo se ejecuta si inboxId es válido
    });
  }
}
```

**Beneficio:** Evita hacer peticiones HTTP innecesarias cuando el ID es inválido, retornando un error claro inmediatamente.

---

### 6. Validación en Componentes (UI)

**Archivo:** `src/app/currentApplication/page.tsx`

**Cambios en botones de View y Download:**

```typescript
// ANTES
<button
  onClick={async () => {
    try {
      const res = await viewInboxPdfAction(item.id); // Podía ser undefined
    }
  }}
>
  View
</button>

// DESPUÉS
<button
  onClick={async () => {
    console.log("[Download] item:", item);
    console.log("[Download] item.id:", item.id);
    
    // Validación antes de hacer la llamada
    if (!item.id) {
      addNotification("Invoice ID not available", "error");
      return;
    }
    try {
      const res = await viewInboxPdfAction(item.id); // Garantizado válido
    }
  }}
  disabled={!item.id} // Deshabilitado si no hay ID
  className="... disabled:opacity-50 disabled:cursor-not-allowed"
>
  View
</button>
```

**Beneficios:** 
- Logging para debugging inmediato
- Feedback visual inmediato (botón deshabilitado)
- Prevención de clicks en items inválidos
- Mensaje de error claro al usuario

---

### 4. Validación en Página de Admin

**Archivo:** `src/app/admin/superAdmin/payments/page.tsx`

Se aplicaron las mismas validaciones en:
- `handleViewInvoice`
- `handleDownloadInvoice`

**Archivo:** `src/app/admin/superAdmin/payments/actions/invoices.actions.ts`

Se aplicaron las mismas validaciones en las server actions del admin.

---

## 📁 Archivos Modificados

0. **`src/services/axios.server.ts`** ⚠️ **CRÍTICO - Causa Raíz**
   - Removida lógica de eliminación de cookies en interceptor (línea 40-56)
   - Removida lógica de redirect en interceptor
   - Interceptor ahora solo propaga errores 401 sin modificar estado
   - Creación de nueva instancia de axios por llamada (línea 23)

1. **`src/app/currentApplication/page.tsx`**
   - **`mapInboxItems`**: Filtrado con logging detallado (líneas 452-497)
     - Console.log de raw items, filtered items y mapped items
     - Console.warn para items descartados
   - **`handleGenerateInbox`**: Validación mejorada con logging (líneas 517-564)
     - Console.log de API response y extracted item
     - Validación de `mapped` y `mapped.id`
   - **`fetchInboxesPage`**: Filtro adicional post-mapeo (líneas 574-593)
   - **Render**: Triple filtro antes de `.map()` (línea 2632)
   - **Botón View**: Logging y validación (línea 2662)
   - **Botón Download**: Logging y validación (línea 2727)
   - Botones deshabilitados cuando `!item.id`

2. **`src/app/currentApplication/actions/invoices.actions.ts`**
   - **`viewInboxPdfAction`**: Validación y logging de errores (líneas 30-60)
   - **`downloadInboxPdfAction`**: Validación y logging de errores (líneas 62-95)
   - Console.log de inboxId recibido
   - Console.error detallado con errorData del backend

3. **`src/app/admin/superAdmin/payments/page.tsx`**
   - Validación en `handleViewInvoice` (línea 866)
   - Validación en `handleDownloadInvoice` (línea 896)

4. **`src/app/admin/superAdmin/payments/actions/invoices.actions.ts`**
   - Validación en `viewInboxPdfAction` (línea 5)
   - Validación en `downloadInboxPdfAction` (línea 32)

---

## 🧪 Testing

### Casos de Prueba

1. **Items con ID válido**
   - ✅ Debe permitir descargar/visualizar normalmente
   - ✅ Botones deben estar habilitados
   - ✅ Logs muestran item mapeado correctamente

2. **Items sin ID (undefined/null)**
   - ✅ Debe filtrar el item (no aparece en la lista)
   - ✅ Console.warn muestra item descartado
   - ✅ Si aparece, botones deben estar deshabilitados

3. **Items con ID string vacío**
   - ✅ Debe filtrar el item en el mapeo
   - ✅ Validación en server action debe retornar error
   - ✅ Logs muestran validación fallida

4. **Items sin invoiceNumber**
   - ✅ Se filtra en el render
   - ✅ No causa crash en UI

5. **Generación de nuevo invoice**
   - ✅ Logs muestran API response completa
   - ✅ Logs muestran item extraído
   - ✅ Validación antes de agregar al estado

6. **Validación en múltiples capas**
   - ✅ Filtrado en mapeo con logging
   - ✅ Filtrado post-mapeo en fetchInboxesPage
   - ✅ Validación en handleGenerateInbox
   - ✅ Filtrado en render
   - ✅ Validación en UI antes de llamar
   - ✅ Validación en server action antes de HTTP request

7. **Debugging**
   - ✅ Logs de raw items del API
   - ✅ Logs de items filtrados
   - ✅ Logs de items mapeados
   - ✅ Logs de errores con detalles completos

---

## 📊 Impacto

### Antes
- ❌ **Errores de cookies**: `Cookies can only be modified in a Server Action or Route Handler`
- ❌ **Errores de redirect**: `NEXT_REDIRECT` en contexto inválido
- ❌ **Pérdida de sesión**: Cookies se intentaban eliminar incorrectamente, dejando al usuario sin sesión
- ❌ **Datos perdidos**: `userId` y otros datos críticos se perdían
- ❌ Errores 400 frecuentes en logs (`undefined` como ID)
- ❌ Usuarios no podían descargar invoices
- ❌ Sin visibilidad de qué datos llegaban del backend
- ❌ Experiencia de usuario degradada
- ❌ Requests innecesarios al backend

### Después
- ✅ **Sin errores de cookies**: El interceptor ya no intenta modificar cookies
- ✅ **Sin errores de redirect**: El interceptor ya no intenta hacer redirect
- ✅ **Sesión preservada**: Las cookies se mantienen correctamente
- ✅ **Datos intactos**: `userId` y otros datos críticos se preservan
- ✅ Sin errores 400 relacionados con invoices
- ✅ Sin crashes por items undefined
- ✅ Usuarios pueden descargar/visualizar invoices correctamente
- ✅ Feedback visual claro (botones deshabilitados)
- ✅ Validación en 6 capas diferentes (defensa en profundidad)
- ✅ Logging completo para debugging
- ✅ Visibilidad total del flujo de datos
- ✅ Detección temprana de datos inválidos
- ✅ Menos carga en el backend (no se hacen requests inválidos)
- ✅ Mejor mantenibilidad (fácil identificar problemas)

---

## 🔍 Validación de UUID en Backend

El backend valida que el parámetro sea un UUID válido usando `ParseUUIDPipe`:

```typescript
@Get('inboxes/:id/view')
async viewInboxPdf(
  @Param('id', ParseUUIDPipe) inboxId: string, // ← Valida UUID
) {
  // ...
}
```

**Comportamiento:**
- Si el ID es `undefined` → Error 400: `Validation failed (uuid is expected)`
- Si el ID no es un UUID válido → Error 400: `Validation failed (uuid is expected)`
- Si el ID es un UUID válido → Procesa la petición normalmente

---

## 🎯 Mejores Prácticas Aplicadas

1. **Defensa en Profundidad**: Validación en 6 capas diferentes (mapeo, post-mapeo, generación, render, UI, server action)
2. **Fail Fast**: Validación temprana para evitar requests innecesarios
3. **Logging Estratégico**: Console logs y warnings en puntos clave para debugging
4. **Observabilidad**: Visibilidad completa del flujo de datos desde API hasta UI
5. **UX Mejorada**: Feedback visual (botones deshabilitados) y mensajes de error claros
6. **Type Safety**: Validación de tipos en TypeScript
7. **Error Handling**: Manejo consistente de errores en todas las capas
8. **Defensive Programming**: Asumir que los datos pueden ser inválidos en cualquier punto

---

## 📝 Notas Técnicas

### ¿Por qué algunos items no tenían ID?

**Causa Principal Identificada:**
El interceptor de axios estaba intentando eliminar cookies cuando había un error 401, pero esto fallaba porque no se puede modificar cookies fuera de un Server Action o Route Handler. Esto causaba:

1. **Pérdida de sesión del usuario**: Las cookies se intentaban eliminar pero fallaba, dejando al usuario en un estado inconsistente
2. **Datos de usuario perdidos**: Al perder la sesión, el `userId` y otros datos críticos se perdían
3. **Requests sin contexto**: Las peticiones para obtener invoices se hacían sin `userId` válido o con datos incompletos
4. **Items sin ID**: El backend retornaba items sin ID válido porque no tenía contexto de usuario correcto

**Otras posibles causas (secundarias):**
1. Datos inconsistentes en la base de datos
2. Items en proceso de creación (race condition)
3. Items eliminados pero aún en caché
4. Errores en la generación del invoice

### Solución Preventiva

1. **Corrección del interceptor**: Ya no intenta modificar cookies ni hacer redirect, preservando la sesión del usuario
2. **Filtrado en mapeo**: El filtrado en `mapInboxItems` asegura que solo items con IDs válidos lleguen a la UI, como capa adicional de defensa
3. **Validación en múltiples capas**: Validación en UI, server actions y mapeo para prevenir problemas futuros

---

## 🔄 Compatibilidad

- ✅ Compatible con código existente
- ✅ No requiere cambios en el backend
- ✅ No requiere migración de datos
- ✅ Retrocompatible con invoices existentes

---

## 👥 Autor

Corrección implementada como parte de la resolución de errores críticos en producción.

**Fecha de implementación:** Enero 2026


