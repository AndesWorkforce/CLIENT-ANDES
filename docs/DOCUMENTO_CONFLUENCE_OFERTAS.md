# 🔐 Control de Acceso a Ofertas - Módulo Usuarios/Contratación

## 📍 Ubicación en Confluence
```
Andes Workforce - Desarrollo
└── Módulos
    └── Usuarios
        └── Contratación ← AGREGAR AQUÍ
            └── Control de Acceso a Ofertas
```

---

## 📝 Resumen del Módulo Implementado

### ¿Qué se desarrolló?
Sistema que controla quién puede ver las ofertas de trabajo según su estado:

1. **Usuarios con contrato activo** → No pueden ver ofertas (bloqueo total)
2. **Usuarios no registrados** → Ven lista de ofertas pero detalles borrosos + mensaje de registro
3. **Usuarios registrados sin contrato** → Acceso completo

### ¿Por qué se hizo?
- Evitar conflictos de interés (usuarios ya contratados aplicando a otras ofertas)
- Aumentar registros usando estrategia "teaser" 
- Proteger información detallada de ofertas

---

## 🎯 Funcionalidad Implementada

### Vista para Usuario NO REGISTRADO
```
┌─────────────────────────────┐
│ Lista de Ofertas (Visible)  │
│ • Frontend Developer        │
│ • UX Designer              │
│ • Project Manager          │
└─────────────────────────────┘
         │ (clic en oferta)
         ▼
┌─────────────────────────────┐
│ 🔒 CONTENIDO BORROSO        │
│                             │
│   Authentication Required   │
│   Register to view details  │
│                             │
│   ✅ Exclusive opportunities│
│   ✅ One-click application  │
│   ✅ Connect with companies │
│                             │
│   [Create Account] [Login]  │
└─────────────────────────────┘
```

### Vista para Usuario CON CONTRATO ACTIVO
```
┌─────────────────────────────┐
│ ⚠️ Contrato en Progreso     │
│                             │
│ Tienes un contrato activo.  │
│ No puedes ver ofertas hasta │
│ que finalice tu proceso.    │
│                             │
│ [Ver Contrato] [Ir a Home]  │
└─────────────────────────────┘
```

### Vista para Usuario REGISTRADO SIN CONTRATO
```
┌─────────────────────────────┐
│ Lista + Detalles Completos  │
│ • Descripción completa      │
│ • Requisitos                │
│ • Salario                   │
│ • [Aplicar Ahora]           │
└─────────────────────────────┘
```

---

## 💻 Archivos Creados

### 1. Server Action - Verificación de Estado
**Archivo**: `src/app/pages/offers/actions/user-status.actions.ts`
```typescript
// Consulta API para verificar si usuario tiene contrato activo
export async function checkUserContractStatus(): Promise<{
  success: boolean;
  data?: UserContractStatus;
  error?: string;
}>
```

### 2. Guard Principal - Context Provider
**Archivo**: `src/app/pages/offers/components/OffersAccessGuard.tsx`
```typescript
// Envuelve toda la página de ofertas
// Provee contexto de autenticación y estado de contrato
export const OffersAccessGuard: React.FC<{ children: React.ReactNode }>
```

### 3. Guard de Detalles - Overlay Blur
**Archivo**: `src/app/pages/offers/components/OfferDetailGuard.tsx`
```typescript
// Envuelve solo la sección de detalles
// Muestra overlay de registro para usuarios no autenticados
export const OfferDetailGuard: React.FC<{ children: React.ReactNode }>
```

### 4. Integración en Página Principal
**Archivo**: `src/app/pages/offers/page.tsx`
```typescript
// Página principal modificada para usar los guards
<OffersAccessGuard>
  <div className="offers-layout">
    <OffersList /> {/* Siempre visible */}
    <OfferDetailGuard>
      <OfferDetails /> {/* Protegido */}
    </OfferDetailGuard>
  </div>
</OffersAccessGuard>
```

### 5. Modal Mobile Actualizado
**Archivo**: `src/app/components/ViewOfferModal.tsx`
```typescript
// Modal modificado para mostrar overlay en mobile
// Diferente contenido según estado de autenticación
```

---

## 🔌 API Utilizada

### Endpoint de Verificación
**GET** `/users/current-contract`

**Respuestas:**
- `200 OK` → Usuario tiene contrato activo (bloquear ofertas)
- `404 Not Found` → Usuario sin contrato (permitir ofertas)  
- `401 Unauthorized` → Token inválido

---

## ✅ Estados Validados

| Estado del Usuario | Ve Lista | Ve Detalles | Acción |
|-------------------|----------|-------------|--------|
| No autenticado | ✅ Sí | 🔒 Overlay | Registro/Login |
| Con contrato | ❌ Mensaje | ❌ Bloqueado | Ver contrato |
| Sin contrato | ✅ Sí | ✅ Completo | Aplicar |

---

## 🎨 Diseño UX

### Desktop
- **Lista lateral** + **Panel de detalles**
- **Overlay centrado** sobre panel derecho
- **Efecto blur** en contenido protegido

### Mobile  
- **Modal full-screen** para detalles
- **Overlay optimizado** para touch
- **Botones grandes** para facilidad de uso

---

## 🚀 Beneficios Implementados

### Para el Negocio
- ✅ **Aumenta registros**: Estrategia teaser genera curiosidad
- ✅ **Evita conflictos**: Usuarios contratados no ven otras ofertas  
- ✅ **Protege información**: Detalles solo para usuarios verificados

### Para los Usuarios
- ✅ **Experiencia fluida**: No bloqueo total, sino gradual
- ✅ **Proceso claro**: Saben exactamente qué hacer para ver más
- ✅ **Acceso rápido**: Un clic para registro/login

---

## 🧪 Testing Completado

### ✅ Casos Probados
- Usuario no autenticado ve teaser y overlay
- Usuario con contrato ve mensaje de bloqueo
- Usuario sin contrato ve todo el contenido
- Responsive funciona en desktop y mobile
- API calls manejan errores correctamente

### ✅ Navegadores Validados
- Chrome ✅
- Firefox ✅  
- Safari ✅
- Mobile browsers ✅

---

## 🔧 Implementación Técnica

### Tecnologías Usadas
- **React 18** + **TypeScript**
- **Next.js 14** (Server Actions)
- **Tailwind CSS** (Estilos y animaciones)
- **Zustand** (Estado global de autenticación)
- **Axios** (Comunicación API)

### Patrón de Diseño
- **Context API**: Para compartir estado entre componentes
- **Guard Pattern**: Para proteger contenido sensible
- **Server Actions**: Para verificación de estado server-side
- **Progressive Enhancement**: Experiencia gradual según autenticación

---

## 📊 Métricas a Monitorear

### KPIs Sugeridos
1. **Conversion Rate**: % usuarios que se registran desde overlay
2. **Time on Page**: Tiempo en página de ofertas  
3. **Bounce Rate**: % usuarios que salen sin interactuar
4. **API Success Rate**: % llamadas exitosas a `/current-contract`

### Eventos para Analytics
```javascript
// Cuando se muestra overlay
track('offers_auth_overlay_shown', { user_type: 'unauthenticated' });

// Cuando clickean registro
track('auth_cta_clicked', { action: 'register', source: 'offers' });

// Cuando ven oferta completa
track('offer_details_viewed', { offer_id: 'xxx', user_authenticated: true });
```

---

## 🚨 Troubleshooting Rápido

### Problema: Overlay no aparece
**Solución**: Verificar que `OfferDetailGuard` envuelve el contenido correcto

### Problema: Error en API de contrato
**Solución**: Revisar endpoint `/users/current-contract` y logs del servidor

### Problema: Estado inconsistente
**Solución**: Limpiar localStorage y recargar página

---

## 👥 Equipo y Contactos

**Desarrollado por**: [Tu nombre]
**Fecha**: Septiembre 2025
**Versión**: 1.0.0
**Estado**: ✅ Implementado y funcionando

**Repositorio**: `CLIENT-ANDES/staging`
**Branch**: `staging`

---

## 📅 Próximos Pasos (Opcional)

### Fase 2 - Mejoras UX
- [ ] A/B test diferentes mensajes de overlay
- [ ] Preview parcial de descripción (primeras 2 líneas)
- [ ] Social proof ("X personas aplicaron hoy")

### Fase 3 - Analytics
- [ ] Dashboard de métricas de conversión
- [ ] Heatmaps de interacción con overlay
- [ ] Segmentación por fuente de tráfico

---

**📍 Este documento va en**: `Confluence > Módulos > Usuarios > Contratación`
**🔗 Tags sugeridos**: `ofertas`, `control-acceso`, `usuarios`, `contratación`, `teaser`
**👀 Watchers**: Equipo de desarrollo, Product Owner, QA Lead
