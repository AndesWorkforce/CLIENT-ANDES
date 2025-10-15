# Contracts Rendering Map (2025-10-15)

This document summarizes where contracts are rendered or triggered in the app and marks templates that appear unused.

## Entry points (Client)

- `src/app/admin/dashboard/postulants/page.tsx`
  - Renders `SignContractModal` when a candidate is HIRED (estado === "ACEPTADA").
- `src/app/admin/dashboard/contracts/page.tsx`
  - Lists and manages existing contracts (send to provider, upload, terminate, cancel), not responsible for PDF rendering of new candidate contracts.

## Modal responsible for rendering/sending contracts

- `src/app/admin/dashboard/postulants/components/SignContractModal.tsx`
  - Uses `@react-pdf/renderer` `PDFViewer` to render a PDF preview.
  - Actively uses these templates:
    - `templates/StatementOfWorkPDF.tsx` (default)
    - `templates/StatementOfWorkEnglishPDF.tsx`
    - `templates/NewStatementOfWorkEnglishPDF.tsx`
  - Sends contracts to SignWell through `../actions/contracts.actions.ts`.

## Deprecated / Unused preview

- `src/app/admin/dashboard/postulants/components/PDFPreviewSSG.tsx`
  - Marked as DEPRECATED. Not referenced by `page.tsx` or `SignContractModal`.
  - Historically referenced a broader set of templates for static generation.

## Templates overview

Active (used by SignContractModal):

- `templates/StatementOfWorkPDF.tsx`
- `templates/StatementOfWorkEnglishPDF.tsx`
- `templates/NewStatementOfWorkEnglishPDF.tsx`

Exist but currently unused (kept for reference; safe to delete if confirmed):

- `templates/EnglishServiceAgreementPDF.tsx`
- `templates/SimpleEnglishContractPDF.tsx`
- `templates/StatementOfWorkSpanishPDF.tsx`
- `templates/ClasificacionCorreoContractPDF.tsx`
- `templates/AdmisionesContractPDF.tsx`
- `templates/AdministracionCasosContractPDF.tsx`
- `templates/EntradaDatosContractPDF.tsx`
- `templates/LlamadaBienvenidaContractPDF.tsx`

Note: Unused templates were annotated with `UNUSED TEMPLATE (2025-10-15)` comment headers.

## Backend contract initiation

- API `andes-api/src/admin/admin.service.ts`
  - `iniciarContratacionConSignWell(...)`
  - `finalizarContrato(...)`, `cancelarContrato(...)`

## Next steps

- If you agree these templates are obsolete, we can either:

  1. Remove them entirely in a follow-up PR; or
  2. Hide them behind a feature flag (e.g., `NEXT_PUBLIC_ENABLE_LEGACY_CONTRACT_TEMPLATES=false`).

- If Spanish contracts are needed again, rewire `SignContractModal` to include `StatementOfWorkSpanishPDF.tsx` as an option.
