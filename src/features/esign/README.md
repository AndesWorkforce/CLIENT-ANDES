# Frontend ESIGN

Componentes y cliente API para el módulo interno de firma electrónica.

## Feature Flag

No renderizar componentes ESIGN si `process.env.NEXT_PUBLIC_ENABLE_ESIGN !== 'true'` (agregar lógica en layout principal).

## Componentes

- `EsignFieldCanvas`: canvas de administración para colocar campos en PDF (usa proporciones).
- `SignPage`: captura de firma con `signature_pad` y envío al backend.
- `RecipientProgressBar`: visualiza progreso serial.

## Uso Básico

```tsx
import { EsignFieldCanvas } from '@/features/esign/components/EsignFieldCanvas';
import { SignPage } from '@/features/esign/components/SignPage';

// Ejemplo builder
<EsignFieldCanvas pdfUrl={pdfUrl} fields={fields} onChange={setFields} />

// Página de firma
<SignPage documentId={docId} recipientId={recipientId} token={token} />
```

## Cliente API

Funciones en `api/esignClient.ts` para crear documentos, añadir recipients/campos, enviar y firmar.

## Mejoras Futuras

- Drag & resize con handles.
- Vista previa de firma incrustada.
- Reenvío de correo desde UI.
- Accesibilidad por teclado (flechas para mover campo).

## Advertencia

Este módulo no sustituye una solución certificada (eIDAS / HSM). Para contratos con requisitos estrictos se recomienda integrar proveedor externo.
