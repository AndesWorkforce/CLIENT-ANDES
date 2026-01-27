# Problema: Invoices con Múltiples Contratos y IDs Undefined

## 📋 Resumen Ejecutivo

Se identificaron dos problemas críticos relacionados con los invoices (facturas de pago):

1. **IDs undefined**: Los invoices se están enviando con `undefined` como ID al backend, causando errores 400
2. **Invoices desaparecen con múltiples contratos**: Usuarios con más de un contrato solo pueden ver un invoice a la vez; cuando generan un segundo invoice, el primero desaparece

**Fecha:** Enero 2026  
**Severidad:** Alta  
**Impacto:** Usuarios con múltiples contratos no pueden gestionar correctamente sus invoices

---

## 🐛 Problema 1: IDs Undefined en Requests

### Síntomas
- Errores HTTP 400 en logs del backend:
  ```
  GET /api/users/inboxes/undefined/view - 400 Bad Request: Validation failed (uuid is expected)
  GET /api/users/inboxes/undefined/download - 400 Bad Request: Validation failed (uuid is expected)
  ```
- Mensajes de error en el frontend:
  ```json
  {"success":false,"error":"HTTP 400 - Request failed with status code 400"}
  ```

### Causa Raíz Potencial

Según la documentación previa (`INVOICE_ERROR_400_FIX.md`), el problema principal era:

**Interceptor de Axios reseteando cookies incorrectamente**: Cuando había un error 401, el interceptor intentaba eliminar cookies (`auth_token`, `user_info`) fuera del contexto válido, causando:
- ❌ Pérdida de sesión del usuario
- ❌ Datos de usuario perdidos (`userId`, etc.)
- ❌ Requests sin contexto válido
- ❌ Items sin ID válido en invoices

**Estado actual**: El interceptor de axios está correctamente implementado (no intenta modificar cookies), pero el problema de IDs undefined persiste.

### Solución Implementada: Logging Detallado

Se implementaron logs estratégicos en múltiples capas para rastrear dónde se pierde el ID:

#### 1. **mapInboxItems** - Mapeo de items del backend
```typescript
console.log("[mapInboxItems] Raw items from API:", items);
console.log("[mapInboxItems] Number of items:", items?.length || 0);

// Log detallado de cada item antes del filtrado
items.forEach((it, index) => {
  console.log(`[mapInboxItems] Item ${index}:`, {
    id: it?.id,
    idType: typeof it?.id,
    idValue: JSON.stringify(it?.id),
    hasId: !!(it && it.id),
    fullItem: it
  });
});
```

#### 2. **fetchInboxesPage** - Carga de inboxes
```typescript
console.log("[fetchInboxesPage] Payload received:", payload);
console.log("[fetchInboxesPage] Mapped items after mapInboxItems:", mappedItems);
console.log("[fetchInboxesPage] Final filtered items:", items);
console.log("[fetchInboxesPage] Next inboxes IDs:", next.map(i => i?.id));
```

#### 3. **useEffect para monitoreo de inboxes**
```typescript
useEffect(() => {
  console.log("[useEffect inboxes] Total inboxes:", inboxes.length);
  inboxes.forEach((item, index) => {
    const hasValidId = item && item.id && typeof item.id === "string" && item.id.trim() !== "";
    if (!hasValidId) {
      console.error(`[useEffect inboxes] ⚠️ Item ${index} sin ID válido:`, item);
    }
  });
}, [inboxes]);
```

#### 4. **Botones View/Download**
```typescript
console.log("[View Button] Full item object:", item);
console.log("[View Button] item.id:", item.id);
console.log("[View Button] item.id type:", typeof item.id);
console.log("[View Button] item.id value:", JSON.stringify(item.id));
```

#### 5. **Server Actions**
```typescript
console.log("[viewInboxPdfAction] Received inboxId parameter:", inboxId);
console.log("[viewInboxPdfAction] inboxId type:", typeof inboxId);
console.log("[viewInboxPdfAction] inboxId value:", JSON.stringify(inboxId));
```

#### 6. **Interceptor de Axios Server**
```typescript
if (error.response?.status === 401) {
  console.error("[Axios Server] ⚠️ ERROR 401 DETECTADO - Posible pérdida de sesión");
  console.error("[Axios Server] URL:", error.config?.url);
  console.error("[Axios Server] ⚠️ Esto podría causar que los items no tengan ID válido");
}
```

### Cómo Testear el Problema de IDs Undefined

#### Vista del Frontend
- **Ruta**: `/currentApplication`
- **Tab**: "Inboxes" o "Invoices"
- **Consola**: F12 → Console para ver los logs

#### Qué Buscar en los Logs
1. **Si el backend retorna items sin ID**: Revisar `[mapInboxItems] Raw items from API`
2. **Si el ID se pierde durante el mapeo**: Comparar "Raw items" vs "Mapped item"
3. **Si el ID se pierde al actualizar el estado**: Revisar `setInboxes` y `useEffect inboxes`
4. **Si el ID se pierde al hacer click**: Revisar logs de botones View/Download
5. **Si hay errores 401**: Revisar logs del interceptor de axios

---

## 🐛 Problema 2: Invoices Desaparecen con Múltiples Contratos

### Síntomas Reportados
- "Las personas con más de 1 contrato, solo pueden subir 1 invoice"
- "Cuando quieren subir un segundo, parece que se actualiza el primero y solo se ve el segundo invoice subido"
- Usuarios con múltiples contratos activos solo ven un invoice a la vez

### Análisis de la Lógica

#### Backend (✅ Correcto)

**Modelo de Datos**:
```prisma
model PaymentInbox {
  id                    String   @id @default(uuid())
  usuarioId             String
  procesoContratacionId String
  añoMes               String
  // ...
  
  @@unique([procesoContratacionId, añoMes])
}
```

**Restricción única**: `@@unique([procesoContratacionId, añoMes])`
- ✅ Permite múltiples invoices del mismo mes para **diferentes contratos**
- ✅ Previene duplicados del mismo contrato en el mismo mes

**getUserPaymentInboxes**:
```typescript
async getUserPaymentInboxes(usuarioId: string, params: { cursor?: string; limit?: number }) {
  const query: any = {
    where: { usuarioId }, // ✅ Retorna TODOS los invoices del usuario
    orderBy: { generatedAt: 'desc' },
    take,
  };
  // ...
}
```
- ✅ Retorna **todos** los invoices del usuario, sin filtrar por contrato

**generateUserInboxForMonth**:
```typescript
// Evitar duplicados: si ya existe, devolverlo
const existing = await this.prisma.paymentInbox.findFirst({
  where: { procesoContratacionId: proceso.id, añoMes: ym },
});
```
- ✅ Verifica duplicados por `procesoContratacionId + añoMes` (correcto)

#### Frontend (❌ Problema Identificado)

**Tipo InboxItem**:
```typescript
type InboxItem = {
  id: string;
  invoiceNumber: string;
  month: string;
  year: number;
  amount: number;
  currency: string;
  generatedAt: string;
  status: "PAID" | "PENDING";
  viewUrl?: string;
  downloadUrl?: string;
  // ❌ FALTA: procesoContratacionId
};
```

**handleGenerateInbox - Verificación de Duplicados**:
```typescript
const exists = prev.some(
  (p) => p.year === mapped.year && p.month === mapped.month
  // ❌ PROBLEMA: Solo compara año y mes, NO el contrato
);
const next = exists ? prev : [mapped, ...prev];
```

### Problema Confirmado

**Escenario**:
1. Usuario tiene **Contrato A** y **Contrato B** activos
2. Genera invoice para **Contrato A** en enero 2026 → ✅ Se agrega al estado
3. Genera invoice para **Contrato B** en enero 2026 → ❌ El código detecta que "ya existe" un invoice en enero 2026
4. Resultado: **NO se agrega** el segundo invoice al estado (mantiene `prev`)
5. El invoice **SÍ se crea en el backend**, pero **NO aparece en el frontend**

**Código Problemático**:
```typescript:564:567:CLIENT-ANDES/src/app/currentApplication/page.tsx
const exists = prev.some(
  (p) => p.year === mapped.year && p.month === mapped.month
);
const next = exists ? prev : [mapped, ...prev];
```

### Solución Propuesta

#### Opción 1: Agregar procesoContratacionId al tipo y comparación (Recomendada)

1. **Actualizar tipo InboxItem**:
```typescript
type InboxItem = {
  id: string;
  procesoContratacionId: string; // ✅ Agregar
  invoiceNumber: string;
  month: string;
  year: number;
  // ...
};
```

2. **Incluir en el mapeo**:
```typescript
const mappedItem = {
  id: it.id,
  procesoContratacionId: it.procesoContratacionId, // ✅ Agregar
  invoiceNumber: String(it.invoiceNumber || "#"),
  // ...
};
```

3. **Actualizar verificación de duplicados**:
```typescript
const exists = prev.some(
  (p) => p.year === mapped.year && 
        p.month === mapped.month && 
        p.procesoContratacionId === mapped.procesoContratacionId // ✅ Agregar
);
```

#### Opción 2: Confiar en el backend y siempre agregar

Como el backend ya valida duplicados correctamente, podríamos simplemente agregar el nuevo invoice sin verificar duplicados en el frontend:

```typescript
// Siempre agregar el nuevo invoice (el backend ya valida duplicados)
setInboxes((prev) => {
  // Verificar si ya existe por ID (más seguro)
  const existsById = prev.some(p => p.id === mapped.id);
  if (existsById) {
    // Actualizar el existente
    return prev.map(p => p.id === mapped.id ? mapped : p);
  }
  // Agregar nuevo
  return [mapped, ...prev].sort(/* ... */);
});
```

---

## 📁 Archivos Modificados

### Logging Implementado

1. **`CLIENT-ANDES/src/app/currentApplication/page.tsx`**
   - Logs en `mapInboxItems` (líneas 452-523)
   - Logs en `fetchInboxesPage` (líneas 610-656)
   - Logs en `useEffect` para monitoreo de inboxes (líneas 669-697)
   - Logs en botones View/Download (líneas 2720-2745, 2754-2780)

2. **`CLIENT-ANDES/src/app/currentApplication/actions/invoices.actions.ts`**
   - Logs en `viewInboxPdfAction` (líneas 32-76)
   - Logs en `downloadInboxPdfAction` (líneas 79-123)

3. **`CLIENT-ANDES/src/services/axios.server.ts`**
   - Logs mejorados en interceptor para errores 401 (líneas 47-54)

### Archivos que Requieren Corrección

1. **`CLIENT-ANDES/src/app/currentApplication/page.tsx`**
   - Línea 98-109: Agregar `procesoContratacionId` al tipo `InboxItem`
   - Línea 500-513: Incluir `procesoContratacionId` en el mapeo
   - Línea 564-567: Actualizar verificación de duplicados para incluir contrato

---

## 🧪 Testing

### Casos de Prueba para Problema 1 (IDs Undefined)

1. **Items con ID válido**
   - ✅ Debe permitir descargar/visualizar normalmente
   - ✅ Logs muestran item mapeado correctamente

2. **Items sin ID (undefined/null)**
   - ✅ Debe filtrar el item (no aparece en la lista)
   - ✅ Console.warn muestra item descartado
   - ✅ Logs muestran validación fallida

3. **Errores 401 que causan pérdida de sesión**
   - ✅ Logs del interceptor muestran error 401
   - ✅ Verificar si los items pierden ID después del error

### Casos de Prueba para Problema 2 (Múltiples Contratos)

1. **Usuario con un solo contrato**
   - ✅ Debe poder generar múltiples invoices para diferentes meses
   - ✅ Todos los invoices deben aparecer en la lista

2. **Usuario con múltiples contratos activos**
   - ✅ Debe poder generar invoice para Contrato A en enero 2026
   - ✅ Debe poder generar invoice para Contrato B en enero 2026
   - ✅ **Ambos invoices deben aparecer en la lista** (actualmente falla)

3. **Cambio de contrato seleccionado**
   - ✅ Al cambiar de contrato, debe mostrar todos los invoices del usuario
   - ✅ No debe filtrar por contrato seleccionado

---

## 🔍 Rutas del Backend para Testing

### Base URL
```
/api/users
```

### 1. Obtener lista de inboxes (paginado)
```
GET /api/users/:userId/inboxes
```

**Parámetros**:
- `userId` (UUID): ID del usuario
- `cursor` (query, opcional): Cursor para paginación
- `limit` (query, opcional): Límite de items (default: 20, max: 50)

**Ejemplo**:
```bash
GET /api/users/4dc84b45-5ef6-437f-a529-e413e098e435/inboxes?limit=20
```

**Respuesta esperada**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-del-inbox",
      "procesoContratacionId": "uuid-del-contrato",
      "invoiceNumber": "INV-001",
      "añoMes": "2026-01",
      "amount": 1000,
      "currency": "USD",
      "createdAt": "2026-01-23T...",
      ...
    }
  ],
  "nextCursor": "uuid-del-ultimo-item"
}
```

### 2. Ver PDF de invoice (inline)
```
GET /api/users/inboxes/:inboxId/view
```

**Headers requeridos**:
- `Authorization: Bearer <token>`

### 3. Descargar PDF de invoice
```
GET /api/users/inboxes/:inboxId/download
```

**Headers requeridos**:
- `Authorization: Bearer <token>`

### 4. Generar nuevo invoice
```
POST /api/users/:userId/inboxes/generate
```

**Body**:
```json
{
  "yearMonth": "2026-01",
  "processId": "uuid-opcional"
}
```

**Headers requeridos**:
- `Authorization: Bearer <token>`

---

## 📊 Impacto

### Antes
- ❌ Errores 400 frecuentes (`undefined` como ID)
- ❌ Usuarios con múltiples contratos solo ven un invoice
- ❌ Invoices generados desaparecen al generar nuevos
- ❌ Sin visibilidad de dónde se pierde el ID
- ❌ Experiencia de usuario degradada

### Después (con correcciones)
- ✅ Sin errores 400 relacionados con invoices
- ✅ Usuarios con múltiples contratos pueden ver todos sus invoices
- ✅ Invoices no desaparecen al generar nuevos
- ✅ Logging completo para debugging
- ✅ Validación correcta de duplicados por contrato
- ✅ Mejor experiencia de usuario

---

## 🎯 Próximos Pasos

1. **Implementar corrección del Problema 2**:
   - Agregar `procesoContratacionId` al tipo `InboxItem`
   - Actualizar mapeo para incluir `procesoContratacionId`
   - Corregir verificación de duplicados en `handleGenerateInbox`

2. **Monitorear logs del Problema 1**:
   - Revisar logs en producción para identificar dónde se pierde el ID
   - Verificar si hay errores 401 que causen pérdida de sesión
   - Analizar si el problema está en el backend o frontend

3. **Testing exhaustivo**:
   - Probar con usuarios que tienen múltiples contratos
   - Verificar que todos los invoices aparecen correctamente
   - Confirmar que no hay errores 400

---

## 📝 Notas Técnicas

### Relación entre Invoices y Contratos

- Un usuario puede tener **múltiples contratos activos** simultáneamente
- Cada invoice está asociado a un **contrato específico** (`procesoContratacionId`)
- La restricción única en la BD es `[procesoContratacionId, añoMes]`, lo que permite:
  - ✅ Múltiples invoices del mismo mes para diferentes contratos
  - ❌ Solo un invoice por mes para el mismo contrato

### Flujo de Generación de Invoice

1. Usuario selecciona mes y año
2. Frontend llama a `generateUserInboxAction` con `selectedContractId` (opcional)
3. Backend busca el contrato:
   - Si se pasa `processId`: usa ese contrato específico
   - Si no: usa el contrato activo más reciente
4. Backend verifica duplicados por `procesoContratacionId + añoMes`
5. Si no existe, crea el invoice
6. Frontend recibe el invoice y lo agrega al estado

### Problema en el Flujo Actual

En el paso 6, el frontend verifica duplicados **solo por año-mes**, ignorando el contrato. Esto causa que invoices de diferentes contratos se consideren duplicados y no se agreguen al estado.

---

## 👥 Autor

Análisis y documentación generada como parte de la resolución de problemas críticos en producción.

**Fecha de análisis:** Enero 2026

