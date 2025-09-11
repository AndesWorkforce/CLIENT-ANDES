# Sistema de Control de Acceso a Ofertas de Trabajo

## Descripción

Se ha implementado un sistema de control de acceso inteligente para la vista de ofertas de trabajo que cumple con los siguientes requerimientos:

1. **Usuarios con contrato activo**: No pueden ver ni acceder a la vista de ofertas (bloqueo completo)
2. **Usuarios no autenticados**: Pueden ver la lista de ofertas para generar curiosidad, pero los detalles están borrosos con overlay de autenticación

## Enfoque de UX Mejorado

El sistema utiliza una estrategia de "teaser" que:

- **Muestra las ofertas** (títulos, fechas, lista básica) a usuarios no autenticados
- **Bloquea los detalles** con un efecto blur y overlay de autenticación
- **Genera curiosidad y engagement** sin frustrar al usuario

## Componentes Implementados

### 1. Actions para verificar estado del usuario

**Archivo**: `src/app/pages/offers/actions/user-status.actions.ts`

```typescript
export async function checkUserContractStatus(): Promise<{
  success: boolean;
  data?: UserContractStatus;
  error?: string;
}>;
```

Esta función:

- Hace una llamada al endpoint `/users/current-contract`
- Si devuelve 200: El usuario tiene un contrato activo
- Si devuelve 404: El usuario no tiene contrato activo
- Cualquier otro error: Se maneja como error del sistema

### 2. Componente Guard de Acceso Principal

**Archivo**: `src/app/pages/offers/components/OffersAccessGuard.tsx`

Este componente:

- Provee contexto de autenticación via React Context
- Solo bloquea completamente a usuarios con contrato activo
- Permite a usuarios no autenticados ver la lista de ofertas

#### Estados de Acceso:

1. **Loading**: Mientras se verifica el estado del usuario
2. **Usuario con contrato activo**: Bloqueo completo con pantalla informativa
3. **Usuario no autenticado**: Acceso a lista, detalles controlados por OfferDetailGuard
4. **Usuario autenticado sin contrato**: Acceso completo
5. **Administradores**: Bypass completo (ADMIN y EMPLEADO_ADMIN)

### 3. Componente Guard de Detalles

**Archivo**: `src/app/pages/offers/components/OfferDetailGuard.tsx`

Este componente controla específicamente el acceso a los detalles de las ofertas:

#### Funcionalidades:

**Para usuarios no autenticados**:

- Efecto blur sobre el contenido real
- Overlay elegante con call-to-action
- Botones para Login y Registro
- Mensaje motivacional sobre encontrar trabajo

**Para usuarios autenticados**:

- Contenido completamente visible
- Funcionalidad de aplicación habilitada

#### Pantallas Implementadas:

**Pantalla de Contrato Activo** (solo OffersAccessGuard):

- Icono y colores naranjas para indicar estado "en progreso"
- Información sobre el puesto de trabajo actual
- Botón para ver el contrato actual
- Botón para regresar al home
- Mensaje explicativo sobre cuándo podrá acceder nuevamente

**Overlay de Autenticación** (OfferDetailGuard):

- Fondo semi-transparente con blur
- Modal elegante centrado
- Call-to-action atractivo
- Mensaje sobre beneficios de registrarse

### 4. Integración en la página principal

**Archivo**: `src/app/pages/offers/page.tsx`

Se modificó para:

1. Envolver todo el contenido con `OffersAccessGuard` (contexto)
2. Envolver la sección de detalles (columna derecha) con `OfferDetailGuard`

```typescript
return (
  <OffersAccessGuard>
    <div className="container mx-auto bg-white min-h-screen">
      {/* Lista de ofertas siempre visible */}
      <div className="w-1/3">{/* Lista de ofertas */}</div>

      {/* Detalles protegidos */}
      <div className="w-2/3">
        <OfferDetailGuard>
          {/* Contenido detallado de la oferta */}
        </OfferDetailGuard>
      </div>
    </div>
  </OffersAccessGuard>
);
```

### 5. Modal de Vista (Mobile)

**Archivo**: `src/app/components/ViewOfferModal.tsx`

Se modificó para mostrar diferentes contenidos según el estado de autenticación:

- **Usuario no autenticado**: Pantalla de call-to-action para login/registro
- **Usuario autenticado**: Contenido completo del modal

## Flujo de Usuario

### Usuario No Autenticado

1. Accede a `/pages/offers`
2. **Ve la lista completa de ofertas** (títulos, fechas, empresa)
3. Al **seleccionar una oferta**, ve el contenido borroso con overlay
4. Puede elegir Login o Registro desde el overlay
5. Después de autenticarse, ve el contenido completo (si no tiene contrato activo)

### Usuario con Contrato Activo

1. Accede a `/pages/offers`
2. Sistema detecta contrato activo via API
3. Ve pantalla informativa de "Contrato en Progreso"
4. Puede ir a ver su contrato actual o regresar al home
5. **No puede ver ni aplicar a ofertas hasta que su contrato finalice**

### Usuario Autenticado sin Contrato

1. Accede a `/pages/offers`
2. Ve todas las ofertas disponibles
3. Puede aplicar normalmente

### Administradores

1. Acceso completo sin restricciones
2. Pueden ver ofertas independientemente de su estado

## Características Técnicas

### Arquitectura de Contexto

- Utiliza React Context para compartir estado de autenticación
- Hook personalizado `useAccessControl()` para acceder al contexto
- Separación clara entre guard general y guard de detalles

### Verificación de Estado

- Utiliza el endpoint existente `/users/current-contract`
- Manejo de errores robusto
- Estados de loading apropiados

### Efectos Visuales

- Efecto blur CSS (`filter: blur-sm`) para contenido restringido
- Overlay semi-transparente (`bg-white/80 backdrop-blur-sm`)
- Transiciones suaves para mejor UX

### Diseño Responsivo

- **Desktop**: Lista izquierda + detalles derecha con blur overlay
- **Mobile**: Modal con call-to-action para autenticación
- Consistencia visual con el resto de la aplicación
- Iconografía clara para cada estado

### Seguridad

- Verificación en el servidor (server actions)
- No se puede bypassear desde el frontend
- Validación de roles para administradores

## Estados del Contrato Considerados como "Activos"

El sistema considera un contrato como activo cuando:

- Existe un `procesoContratacion` con `activo: true`
- El usuario tiene un contrato en cualquier estado excepto finalizado/cancelado

## Mensajes y UX

Todos los mensajes están en inglés para mantener consistencia:

- "Authentication Required"
- "Contract in Progress"
- "You currently have an active contract for the position..."
- "Once your current contract is completed, you will be able to view and apply to new job offers."

## Consideraciones de Rendimiento

- Verificación de estado solo se ejecuta una vez al cargar la página
- Cache del estado durante la sesión de la página
- Loading states para evitar parpadeos

## Testing

Para probar el sistema:

1. **Usuario no autenticado**:

   - Logout y acceder a `/pages/offers`
   - ✅ Debe ver lista de ofertas
   - ✅ Al seleccionar una oferta, debe ver blur + overlay de autenticación
   - ✅ Botones de Login/Register deben funcionar

2. **Usuario con contrato**:

   - Usar cuenta que tenga un proceso de contratación activo
   - ✅ Debe ver pantalla de "Contract in Progress"
   - ✅ No debe poder acceder a ninguna oferta

3. **Usuario sin contrato**:

   - Usar cuenta normal sin contratos activos
   - ✅ Debe ver ofertas completas sin restricciones
   - ✅ Debe poder aplicar a ofertas normalmente

4. **Admin**:
   - Usar cuenta con rol ADMIN o EMPLEADO_ADMIN
   - ✅ Acceso completo sin restricciones

## Beneficios del Nuevo Enfoque

### Marketing y Conversión

- **Genera curiosidad**: Los usuarios ven qué ofertas están disponibles
- **Reduce fricción**: No bloquea completamente el acceso inicial
- **Mejora conversión**: Los usuarios pueden ver el valor antes de registrarse

### Experiencia de Usuario

- **Menos frustrante**: No encuentran una pared completa
- **Más informativo**: Pueden evaluar si vale la pena registrarse
- **Mejor engagement**: Interactúan con el contenido antes de convertir

### Técnico

- **Flexible**: Fácil de ajustar qué se muestra y qué no
- **Mantenible**: Separación clara de responsabilidades
- **Escalable**: Se puede aplicar a otras secciones similares
