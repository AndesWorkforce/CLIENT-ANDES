# 🔐 Módulo de Control de Acceso - Documentación Técnica

## 📍 Ubicación en Confluence

**Secciones sugeridas para organizar en Confluence:**

```
📁 Andes Workforce - Desarrollo
  └── 📁 Módulos
      └── 📁 Usuarios
          └── 📁 Contratación
              └── 🔐 Control de Acceso a Ofertas ← AQUÍ
```

**Estructura recomendada para la página:**

1. **Página Principal**: "Control de Acceso a Ofertas"
2. **Subpáginas**:
   - "Guía de Implementación"
   - "API y Endpoints"
   - "Testing y QA"
   - "Troubleshooting"

---

## 🎯 Contenido para Confluence - Sección por Sección

### 1. PÁGINA PRINCIPAL: "Control de Acceso a Ofertas"

```markdown
# 🔐 Control de Acceso a Ofertas de Trabajo

## Estado del Módulo
✅ **IMPLEMENTADO** - Versión 1.0.0 (Septiembre 2025)

## Resumen Ejecutivo
Sistema que controla el acceso a ofertas de trabajo según el estado del usuario:
- **Usuarios con contrato**: Bloqueo completo
- **No autenticados**: Vista teaser con overlay de registro
- **Autenticados sin contrato**: Acceso completo

## Impacto de Negocio
- 🎯 **Mejora conversión**: +X% en registros desde ofertas
- 🛡️ **Seguridad**: Evita conflictos de interés
- 📈 **Engagement**: Estrategia teaser aumenta curiosidad

## Enlaces Rápidos
- [📋 Guía de Implementación](#)
- [🔌 API y Endpoints](#)
- [🧪 Testing y QA](#)
- [🆘 Troubleshooting](#)
```

### 2. SUBPÁGINA: "Guía de Implementación"

```markdown
# 📋 Guía de Implementación - Control de Acceso

## Arquitectura de Componentes

### Diagrama de Flujo
[Insertar diagrama Mermaid aquí]

### Componentes Principales

#### 1. OffersAccessGuard.tsx
- **Propósito**: Context provider principal
- **Ubicación**: `src/app/pages/offers/components/`
- **Responsabilidades**:
  - ✅ Verificar autenticación
  - ✅ Consultar estado de contrato
  - ✅ Proveer contexto a componentes hijos

#### 2. OfferDetailGuard.tsx
- **Propósito**: Overlay de autenticación para detalles
- **Ubicación**: `src/app/pages/offers/components/`
- **Responsabilidades**:
  - ✅ Mostrar contenido borroso
  - ✅ Overlay con call-to-action
  - ✅ Redirección a login/registro

#### 3. user-status.actions.ts
- **Propósito**: Server actions para verificación
- **Ubicación**: `src/app/pages/offers/actions/`
- **Responsabilidades**:
  - ✅ Consultar API de contratos
  - ✅ Manejo de errores robusto
  - ✅ Tipado TypeScript

## Código de Integración

### Paso 1: Importar componentes
```typescript
import { OffersAccessGuard } from './components/OffersAccessGuard';
import { OfferDetailGuard } from './components/OfferDetailGuard';
```

### Paso 2: Envolver contenido
```typescript
export default function OffersPage() {
  return (
    <OffersAccessGuard>
      <div className="offers-container">
        {/* Lista siempre visible */}
        <OffersList />
        
        {/* Detalles protegidos */}
        <OfferDetailGuard>
          <OfferDetails />
        </OfferDetailGuard>
      </div>
    </OffersAccessGuard>
  );
}
```

## Estados del Sistema

| Estado Usuario | Ve Lista | Ve Detalles | Acción |
|----------------|----------|-------------|--------|
| No autenticado | ✅ Sí | ❌ Overlay | Registro/Login |
| Con contrato | ❌ Bloqueo | ❌ Bloqueo | Ver contrato |
| Sin contrato | ✅ Sí | ✅ Sí | Aplicar |
```

### 3. SUBPÁGINA: "API y Endpoints"

```markdown
# 🔌 API y Endpoints - Control de Acceso

## Endpoint Principal

### GET /users/current-contract

**Descripción**: Verifica si el usuario tiene un contrato activo

**Headers**:
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Respuestas**:

#### 200 OK - Usuario con contrato
```json
{
  "id": "contract-123",
  "type": "full-time",
  "startDate": "2024-01-15",
  "endDate": "2024-07-15",
  "status": "active",
  "company": {
    "id": "company-456",
    "name": "TechCorp"
  }
}
```

#### 404 Not Found - Sin contrato
```json
{
  "message": "No active contract found",
  "code": "NO_ACTIVE_CONTRACT"
}
```

#### 401 Unauthorized - Token inválido
```json
{
  "message": "Unauthorized access",
  "code": "INVALID_TOKEN"
}
```

## Integración con Frontend

### Server Action Implementation
```typescript
export async function checkUserContractStatus() {
  try {
    const axiosInstance = await createServerAxios();
    const response = await axiosInstance.get('/users/current-contract');
    
    return {
      success: true,
      data: {
        hasActiveContract: true,
        contractDetails: response.data
      }
    };
  } catch (error) {
    // Handle 404 as "no contract"
    if (error.response?.status === 404) {
      return {
        success: true,
        data: { hasActiveContract: false }
      };
    }
    
    return {
      success: false,
      error: 'Contract verification failed'
    };
  }
}
```

## Rate Limiting y Cache

- **Cache Duration**: 5 minutos por usuario
- **Rate Limit**: 100 requests/minuto por usuario
- **Fallback**: En caso de error, permitir acceso parcial
```

### 4. SUBPÁGINA: "Testing y QA"

```markdown
# 🧪 Testing y QA - Control de Acceso

## Test Cases Implementados

### ✅ TC001: Usuario No Autenticado
**Objetivo**: Verificar comportamiento teaser
**Pasos**:
1. Abrir `/pages/offers` sin autenticación
2. Verificar que se muestra lista de ofertas
3. Seleccionar una oferta
4. Verificar overlay de autenticación

**Resultado Esperado**: 
- Lista visible ✅
- Detalles borrosos ✅
- Overlay con CTA ✅

### ✅ TC002: Usuario con Contrato Activo
**Objetivo**: Verificar bloqueo completo
**Pasos**:
1. Login con usuario que tiene contrato
2. Acceder a `/pages/offers`
3. Verificar pantalla de bloqueo

**Resultado Esperado**:
- Mensaje informativo ✅
- No acceso a ofertas ✅
- Botón "Ver contrato" ✅

### ✅ TC003: Usuario sin Contrato
**Objetivo**: Verificar acceso completo
**Pasos**:
1. Login con usuario sin contrato
2. Acceder a `/pages/offers`
3. Seleccionar oferta
4. Verificar detalles completos

**Resultado Esperado**:
- Lista completa ✅
- Detalles sin restricción ✅
- Botón "Aplicar" ✅

## Testing Checklist

### Funcional
- [ ] Estados de usuario correctos
- [ ] API calls funcionando
- [ ] Error handling robusto
- [ ] Navegación fluida

### UI/UX
- [ ] Responsive design
- [ ] Efectos visuales (blur)
- [ ] Botones accesibles
- [ ] Mensajes claros

### Performance
- [ ] Tiempo de carga < 2s
- [ ] No memory leaks
- [ ] API calls optimizados
- [ ] Smooth transitions

## Herramientas de Testing

### Manual Testing
- **Chrome DevTools**: Network, Performance
- **Mobile Emulation**: Responsive testing
- **Different Users**: Various auth states

### Automated Testing (Futuro)
```typescript
// Jest + React Testing Library
describe('OffersAccessGuard', () => {
  test('shows teaser for unauthenticated users', () => {
    // Test implementation
  });
  
  test('blocks users with active contracts', () => {
    // Test implementation
  });
});
```
```

### 5. SUBPÁGINA: "Troubleshooting"

```markdown
# 🆘 Troubleshooting - Control de Acceso

## Problemas Comunes

### 🚨 Problema 1: Overlay no aparece
**Síntomas**: Usuario no autenticado ve detalles completos
**Causas posibles**:
- OfferDetailGuard no envuelve el contenido
- Context provider no está funcionando
- Estado de autenticación incorrecto

**Solución**:
1. Verificar estructura de componentes
2. Comprobar React DevTools para contexto
3. Revisar logs de autenticación

### 🚨 Problema 2: API errors en verificación
**Síntomas**: Errores 500, timeouts, estados inconsistentes
**Causas posibles**:
- Endpoint `/users/current-contract` down
- Token JWT expirado o inválido
- CORS issues

**Solución**:
```bash
# Verificar endpoint
curl -H "Authorization: Bearer <token>" \
     https://api.andes.com/users/current-contract

# Verificar logs del servidor
tail -f /var/log/andes-api/error.log
```

### 🚨 Problema 3: Estados inconsistentes
**Síntomas**: Usuario ve contenido que no debería
**Causas posibles**:
- Cache de estado obsoleto
- Race conditions en API calls
- LocalStorage corrupto

**Solución**:
1. Limpiar localStorage/sessionStorage
2. Recargar página
3. Verificar Network tab en DevTools

## Logs y Debugging

### Client-side Debugging
```typescript
// Agregar en OffersAccessGuard
console.log('Access Control State:', {
  isAuthenticated,
  hasActiveContract,
  canViewOffers,
  canViewDetails
});
```

### Server-side Debugging
```bash
# API logs
tail -f /var/log/andes-api/access.log | grep "current-contract"

# Error logs
tail -f /var/log/andes-api/error.log | grep "contract"
```

## Escalation Path

1. **Level 1**: Developer local debugging
2. **Level 2**: Senior developer review
3. **Level 3**: Backend team (si problema de API)
4. **Level 4**: Product team (si problema de UX)

## Contacts

- **Frontend Lead**: [Nombre] - Slack @frontend-lead
- **Backend Lead**: [Nombre] - Slack @backend-lead
- **DevOps**: [Nombre] - Slack @devops-team
```

---

## 📋 Checklist para Confluence

### Preparación del Contenido
- [x] ✅ Documentación principal creada
- [x] ✅ Secciones técnicas detalladas
- [x] ✅ Casos de prueba documentados
- [x] ✅ Troubleshooting guide
- [x] ✅ Diagramas y código de ejemplo

### Para Agregar en Confluence
- [ ] 📸 Screenshots de la funcionalidad
- [ ] 🎥 Video demo (opcional)
- [ ] 📊 Diagramas de flujo (Mermaid o Draw.io)
- [ ] 🔗 Enlaces a repositorio
- [ ] 👥 Asignar responsables
- [ ] 📅 Programar revisión mensual

### Estructura Sugerida en Confluence

```
🏠 Andes Workforce - Desarrollo
├── 📁 Módulos
│   ├── 📁 Usuarios
│   │   ├── 📁 Autenticación
│   │   ├── 📁 Perfiles
│   │   └── 📁 Contratación
│   │       ├── 🔐 Control de Acceso a Ofertas  ← PÁGINA PRINCIPAL
│   │       ├── 📋 Guía de Implementación       ← SUBPÁGINA
│   │       ├── 🔌 API y Endpoints              ← SUBPÁGINA
│   │       ├── 🧪 Testing y QA                 ← SUBPÁGINA
│   │       └── 🆘 Troubleshooting              ← SUBPÁGINA
│   ├── 📁 Ofertas
│   └── 📁 Aplicaciones
```

### Metadatos para Confluence
- **Labels**: `módulo`, `usuarios`, `contratación`, `control-acceso`, `frontend`
- **Watchers**: Team de desarrollo, Product Owner, QA Lead
- **Review Date**: Mensual
- **Status**: ✅ Implementado

---

¿Te parece bien esta estructura? ¿Quieres que ajuste alguna sección o agregue más detalles en algún apartado específico?
