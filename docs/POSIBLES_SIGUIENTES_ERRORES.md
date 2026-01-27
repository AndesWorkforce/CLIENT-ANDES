# Posibles Siguientes Errores - Análisis de Invoices y Proofs

## 📋 Resumen

Este documento identifica problemas potenciales y bugs encontrados que podrían causar errores en la funcionalidad de invoices y proofs, más allá de lo documentado en `INVOICE_ERROR_400_FIX.md`.

**Fecha:** Enero 2026

---

## 🐛 Bug Confirmado #1: Proofs que Desaparecen al Cambiar de Contrato

### Síntomas
- Usuario sube un proof para un contrato
- Usuario cambia a otro contrato usando el selector
- Al volver al contrato original, el proof ya no aparece en la lista
- Los proofs de otros contratos desaparecen

### Causa Raíz

**Archivo:** `src/app/currentApplication/page.tsx`

**Problema:** Inconsistencia entre la carga inicial y el cambio de contrato.

1. **En la carga inicial** (`currentContract()`), se cargan TODOS los proofs de TODOS los contratos activos:
```typescript
// Líneas 687-707 - Carga inicial
const allProofs: MonthlyProof[] = [];
(listRes.data || []).forEach((contract) => {
  if (contract.monthlyProofs && Array.isArray(contract.monthlyProofs)) {
    contract.monthlyProofs.forEach((proof: any) => {
      allProofs.push({ ... });
    });
  }
});
setMonthlyProofs(allProofs); // ✅ Todos los proofs
```

2. **Al cambiar de contrato** (`handleSelectContract()`), se REEMPLAZA con SOLO los proofs de ese contrato:
```typescript
// Línea 763 - Cambio de contrato
setMonthlyProofs(res.data.monthlyProofs || []); // ❌ Solo proofs de 1 contrato
```

### Impacto
- **Pérdida de datos en UI**: Los proofs de otros contratos desaparecen de la interfaz
- **Confusión del usuario**: El usuario piensa que sus proofs se borraron
- **Datos no perdidos en BD**: Los proofs siguen en la base de datos, solo no se muestran

### Solución Propuesta
Modificar `handleSelectContract()` para recargar todos los proofs de todos los contratos:

```typescript
const handleSelectContract = async (contractId: string) => {
  if (!user?.id || !contractId || contractId === selectedContractId) return;
  setIsSwitchingContract(true);
  try {
    const res = await getUserContractById(user.id, contractId);
    if (res.success && res.data) {
      setCurrentJob(res.data);
      setSelectedContractId(contractId);
      
      // ✅ CORREGIDO: Recargar todos los proofs de todos los contratos
      const listRes = await getActiveContractsForUser(user.id);
      if (listRes.success && listRes.data) {
        const allProofs: MonthlyProof[] = [];
        (listRes.data || []).forEach((contract) => {
          if (contract.monthlyProofs && Array.isArray(contract.monthlyProofs)) {
            contract.monthlyProofs.forEach((proof: any) => {
              allProofs.push({
                id: proof.id,
                procesoContratacionId: proof.procesoContratacionId || contract.id,
                month: proof.month || months[parseInt(proof.añoMes?.split('-')[1] || '1') - 1] || 'Unknown',
                year: proof.year || parseInt(proof.añoMes?.split('-')[0] || new Date().getFullYear().toString()),
                file: proof.file || proof.documentoSubido || '',
                fileName: proof.fileName || `proof-${proof.añoMes || 'unknown'}.pdf`,
                uploadDate: proof.uploadDate || proof.fechaSubidaDocumento?.split('T')[0] || '',
                status: proof.status || 'PENDING',
                observacionesRevision: proof.observacionesRevision,
              });
            });
          }
        });
        setMonthlyProofs(allProofs);
      }
      
      // Reset inbox list state
      setInboxes([]);
      setVisibleInboxCount(6);
      setInboxNextCursor(null);
      if (selectedTab === "inboxes") {
        await fetchInboxesPage(false);
      }
    }
  } finally {
    setIsSwitchingContract(false);
  }
};
```

---

## 🐛 Bug Confirmado #2: ID de Proof Potencialmente Incorrecto

### Síntomas
- Proof se sube correctamente a la base de datos
- El proof aparece en la UI con un ID temporal (`proof-1706...`)
- Operaciones posteriores (como editar o eliminar) fallan porque el ID no coincide con la BD

### Causa Raíz

**Archivo:** `src/app/currentApplication/actions/current-contract.actions.ts`

**Problema:** El frontend accede incorrectamente a la respuesta del backend.

El backend devuelve:
```json
{
  "success": true,
  "data": {
    "id": "uuid-real",
    "procesoContratacionId": "...",
    "añoMes": "2026-01",
    ...
  }
}
```

El frontend hace:
```typescript
// Línea 300 - INCORRECTO
return {
  success: true,
  data: {
    id: evaluationResponse.data.id,  // ❌ Esto es UNDEFINED
    file: fileUrl,
  },
};
```

**El problema**: `evaluationResponse.data` es `{ success: true, data: {...} }`, entonces `evaluationResponse.data.id` es `undefined`. El `id` real está en `evaluationResponse.data.data.id`.

### Impacto
- El proof se guarda correctamente en la BD
- El frontend recibe `id: undefined` 
- Se genera un ID temporal `proof-${Date.now()}`
- El proof aparece en la UI pero con ID incorrecto
- **Al recargar la página**, el proof aparece con el ID correcto (de la BD)
- **Antes de recargar**, operaciones de edición/eliminación pueden fallar

### Solución Propuesta

**Archivo:** `src/app/currentApplication/actions/current-contract.actions.ts`

```typescript
// ANTES (línea 300)
return {
  success: true,
  data: {
    id: evaluationResponse.data.id,  // ❌ undefined
    file: fileUrl,
  },
};

// DESPUÉS
const responseData = evaluationResponse.data?.data || evaluationResponse.data;
return {
  success: true,
  data: {
    id: responseData?.id,  // ✅ Accede al nivel correcto
    file: fileUrl,
  },
};
```

---

## ⚠️ Problema Potencial #3: Errores 401 Silenciosos en Carga de Datos

### Descripción
El interceptor de axios ahora maneja los errores 401 correctamente (no intenta modificar cookies), pero los errores 401 en endpoints como `getActiveContractsForUser` pueden causar que no se carguen los proofs.

### Escenario
1. Token expira mientras el usuario está en la página
2. Se llama a `getActiveContractsForUser` que devuelve 401
3. El error se propaga pero no se maneja explícitamente
4. Los proofs no se cargan y la lista aparece vacía
5. Usuario no ve ningún mensaje de error claro

### Verificación Necesaria
Revisar si hay manejo de error 401 en:
- `currentContract()`
- `handleSelectContract()`
- Otros llamados a la API que cargan proofs

### Recomendación
Agregar manejo explícito de errores 401:
```typescript
const response = await getCurrentContract(user?.id);
if (!response.success) {
  if (response.error?.includes("401")) {
    addNotification("Session expired. Please login again.", "error");
    // Opcionalmente redirigir a login
  }
  return;
}
```

---

## ⚠️ Problema Potencial #4: Race Condition en Subida de Proof

### Descripción
Si el usuario sube un proof y rápidamente cambia de contrato antes de que la subida termine, puede haber inconsistencias.

### Escenario
1. Usuario está en Contrato A
2. Hace clic en "Upload Proof"
3. Inmediatamente cambia al Contrato B
4. La subida termina, pero se actualiza el estado con proofs del Contrato A
5. La lista de proofs queda en estado inconsistente

### Recomendación
1. Deshabilitar el selector de contrato mientras se sube un proof
2. O usar un flag de "uploading" para prevenir cambios

```typescript
// En el selector de contrato
<select
  disabled={uploading}  // ✅ Deshabilitar durante upload
  onChange={(e) => handleSelectContract(e.target.value)}
>
```

---

## ⚠️ Problema Potencial #5: Invoices Sin `procesoContratacionId` Válido

### Descripción
Similar al problema documentado de items sin ID, algunos invoices podrían no tener `procesoContratacionId` válido, causando que:
- No se filtren correctamente por contrato
- Aparezcan en todos los contratos o en ninguno

### Verificación en BD
```sql
SELECT id, "procesoContratacionId", "añoMes", "invoiceNumber"
FROM "PaymentInbox"
WHERE "procesoContratacionId" IS NULL 
   OR "procesoContratacionId" = '';
```

### Recomendación
Ya existe filtrado en `mapInboxItems()` que verifica `hasProcesoContratacionId`, pero verificar que se aplica consistentemente.

---

## 📋 Relación con INVOICE_ERROR_400_FIX.md

### ¿La solución de cookies concuerda con los errores de UUID?

**Parcialmente sí**, pero hay causas adicionales:

1. **✅ Documentado correctamente**: El interceptor que intentaba eliminar cookies causaba pérdida de sesión y datos
2. **❌ No documentado**: El bug de acceso incorrecto a la respuesta del backend en `uploadMonthlyProof`
3. **❌ No documentado**: La inconsistencia en la carga de proofs entre `currentContract()` y `handleSelectContract()`

### Causas adicionales de UUID perdidos no documentadas:

| Causa | Documentada | Impacto |
|-------|-------------|---------|
| Interceptor de cookies | ✅ Sí | Alto - Pérdida de sesión |
| Acceso incorrecto a respuesta en uploadMonthlyProof | ❌ No | Medio - ID temporal |
| Inconsistencia en carga de proofs | ❌ No | Alto - Proofs desaparecen |
| Posible race condition | ❌ No | Bajo - Estado inconsistente |

---

## 🔧 Acciones Recomendadas

### Prioridad Alta
1. [x] **Corregir `handleSelectContract()`** para recargar todos los proofs ✅ **CORREGIDO**
2. [x] **Corregir acceso a respuesta** en `uploadMonthlyProof` ✅ **CORREGIDO**

### Prioridad Media
3. [x] Agregar manejo explícito de errores 401 en carga de datos ✅ **CORREGIDO**
4. [x] Deshabilitar selector de contrato durante upload ✅ **CORREGIDO**

### Prioridad Baja
5. [ ] Verificar invoices sin `procesoContratacionId` en BD
6. [ ] Agregar logging adicional para debugging

---

## ✅ Correcciones Aplicadas

### Corrección #1: handleSelectContract - Recarga de todos los proofs
**Archivo:** `src/app/currentApplication/page.tsx`
**Fecha:** Enero 2026

Se modificó `handleSelectContract()` para que al cambiar de contrato, recargue TODOS los proofs de TODOS los contratos activos, en lugar de solo los del contrato seleccionado.

### Corrección #2: uploadMonthlyProof - Acceso correcto a respuesta
**Archivo:** `src/app/currentApplication/actions/current-contract.actions.ts`
**Fecha:** Enero 2026

Se corrigió el acceso a la respuesta del backend para obtener el ID correcto del proof:
```typescript
// Antes: evaluationResponse.data.id (undefined)
// Ahora: evaluationResponse.data?.data?.id || evaluationResponse.data?.id
```

### Corrección #3: Manejo explícito de errores 401
**Archivo:** `src/app/currentApplication/page.tsx`
**Fecha:** Enero 2026

Se agregó manejo explícito de errores 401 en las funciones de carga de datos:
- `currentContract()`: Detecta errores 401/"Not authenticated" y redirige a login
- `handleSelectContract()`: Detecta errores 401/Unauthorized y redirige a login

```typescript
// En currentContract()
if (!response.success) {
  const errorMsg = response.message || "";
  if (errorMsg.includes("401") || errorMsg.includes("Not authenticated")) {
    addNotification("Session expired. Please login again.", "error");
    router.push("/auth/login");
    return;
  }
}

// En handleSelectContract() - similar pero usa response.error
```

### Corrección #4: Deshabilitar selector durante upload
**Archivo:** `src/app/currentApplication/page.tsx`
**Fecha:** Enero 2026

Se deshabilitó el selector de contrato mientras se está subiendo un archivo:
```typescript
<select
  disabled={uploading || isSwitchingContract}
  // ... 
>
```

También se agregó un mensaje dinámico que indica cuando hay un upload en progreso:
```typescript
<p className="text-xs text-gray-500 mt-1">
  {uploading 
    ? "⏳ Please wait while the file is uploading..."
    : "Choose the job you want to manage..."}
</p>
```

---

## 📝 Notas

- Los bugs #1 y #2 son **confirmados** y causan comportamiento incorrecto
- Los problemas #3, #4 y #5 son **potenciales** y requieren verificación adicional
- La documentación en `INVOICE_ERROR_400_FIX.md` es correcta pero incompleta


