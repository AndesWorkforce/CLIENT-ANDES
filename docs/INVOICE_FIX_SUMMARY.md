# Resumen: Corrección Error 400 en Invoices

## Problema

### Causa Raíz Principal
- **Interceptor de Axios reseteando cookies incorrectamente**: Cuando había un error 401, el interceptor intentaba eliminar cookies (`auth_token`, `user_info`) fuera del contexto válido
- **Errores resultantes**: 
  - `Cookies can only be modified in a Server Action or Route Handler`
  - `NEXT_REDIRECT` en contexto inválido
- **Consecuencias**:
  - ❌ Pérdida de sesión del usuario
  - ❌ Datos de usuario perdidos (`userId`, etc.)
  - ❌ Requests sin contexto válido
  - ❌ Items sin ID válido en invoices

### Síntomas
- Errores HTTP 400 al descargar/visualizar invoices
- Backend recibía `undefined` como ID → `Validation failed (uuid is expected)`
- Usuarios no podían acceder a sus invoices

## Solución (5 capas de validación)

### 0. Corrección del Interceptor de Axios ⚠️ **CRÍTICO**
```typescript
// ANTES - Intentaba eliminar cookies y hacer redirect
cookieStore.delete(AUTH_COOKIE); // ❌ Error
redirect('/auth/forced-logout'); // ❌ Error

// DESPUÉS - Solo propaga el error
console.log("Error 401 detectado");
return Promise.reject(error); // ✅ Preserva sesión
```
**Beneficio:** Sesión del usuario preservada, datos intactos, requests válidos

### 1. Filtrado en Mapeo
```typescript
// Filtra items sin ID válido antes de mapearlos
.filter((it) => it.id && typeof it.id === "string" && it.id.trim() !== "")
```

### 2. Validación en Server Actions
```typescript
// Valida antes de hacer HTTP request
if (!inboxId || typeof inboxId !== "string" || inboxId.trim() === "") {
  return { success: false, error: "Invalid invoice ID" };
}
```

### 3. Validación en UI
```typescript
// Valida antes de llamar a la función
if (!item.id) {
  addNotification("Invoice ID not available", "error");
  return;
}
```

### 4. Botones Deshabilitados
```typescript
// Feedback visual
disabled={!item.id}
className="... disabled:opacity-50 disabled:cursor-not-allowed"
```

## Archivos Modificados
- **`src/services/axios.server.ts`** ⚠️ **CRÍTICO - Causa Raíz**
- `src/app/currentApplication/page.tsx`
- `src/app/currentApplication/actions/invoices.actions.ts`
- `src/app/admin/superAdmin/payments/page.tsx`
- `src/app/admin/superAdmin/payments/actions/invoices.actions.ts`

## Resultado
✅ **Sin errores de cookies/redirect** (causa raíz corregida)  
✅ **Sesión del usuario preservada**  
✅ **Datos de usuario intactos**  
✅ Sin errores 400  
✅ Usuarios pueden descargar/visualizar invoices  
✅ Validación en múltiples capas (defensa en profundidad)  
✅ Mejor UX (botones deshabilitados + mensajes claros)


