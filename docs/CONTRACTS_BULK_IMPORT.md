# Bulk Contract Import Layout (Version 1.0)

This document describes the CSV / Excel layout for mass generation and sending of contracts for the three latest templates:

- `psa-col-english` (Professional Services Agreement – Colombia)
- `psa-international-english` (International Professional Services Agreement)
- `ica-usa-english` (Independent Contractor Agreement – USA)

Each row in the file corresponds to one contract to generate and (optionally) send. Non‑required columns can be left blank; the ingestion tool will ignore them if the selected template does not need them.

---

## 1. Master Column Set

Order is recommended but not mandatory; header names must match exactly.

| Column                  | Required for PSA Colombia                | Required for International PSA | Required for USA ICA     | Description / Notes                                                                                   |
| ----------------------- | ---------------------------------------- | ------------------------------ | ------------------------ | ----------------------------------------------------------------------------------------------------- |
| `layout_version`        | optional                                 | optional                       | optional                 | For future schema evolution. Use `1.0`.                                                               |
| `contract_template`     | YES                                      | YES                            | YES                      | One of: `psa-col-english`, `psa-international-english`, `ica-usa-english`.                            |
| `correo_electronico`    | YES                                      | YES                            | YES                      | Contractor email; primary unique identifier for candidate matching & notifications.                   |
| `nombre_completo`       | YES                                      | YES                            | YES                      | Full legal name.                                                                                      |
| `cedula`                | YES                                      | YES                            | optional                 | ID / document number; USA ICA may omit.                                                               |
| `telefono`              | optional                                 | optional                       | optional                 | Contact phone. International format recommended.                                                      |
| `nacionalidad`          | YES                                      | YES                            | optional                 | Country of nationality / residence.                                                                   |
| `direccion_completa`    | optional                                 | optional                       | optional                 | Full mailing address.                                                                                 |
| `city_country`          | NO                                       | NO                             | YES                      | City and Country (e.g. `Miami, USA`). Required for USA ICA.                                           |
| `puesto_trabajo`        | optional (auto if blank)                 | optional (auto if blank)       | optional                 | Role / position; used for display and some PDFs.                                                      |
| `descripcion_servicios` | YES (Clause One)                         | YES (Clause One)               | YES (Services paragraph) | General service / scope description. Minimum 20 chars recommended.                                    |
| `psa_clause_one`        | optional override                        | optional override              | ignored                  | If provided (non-empty) overrides `descripcion_servicios` for PSA templates. Leave blank for USA ICA. |
| `oferta_salarial`       | YES (monthly fee USD)                    | YES                            | YES                      | Numeric monthly fee (e.g. `1100`).                                                                    |
| `monto_en_letras_usd`   | YES                                      | YES                            | NO                       | Amount in words (e.g. `One thousand one hundred`). Ignored for USA ICA.                               |
| `moneda_salario`        | optional (default USD)                   | optional (default USD)         | optional (default USD)   | ISO currency code. Keep `USD` unless special case.                                                    |
| `fecha_inicio_labores`  | YES                                      | YES                            | optional                 | Start date (MM/DD/YYYY). USA ICA may omit unless needed for exhibit.                                  |
| `fecha_ejecucion`       | YES                                      | YES                            | YES                      | Execution / signing / effective date (MM/DD/YYYY).                                                    |
| `notify_email`          | optional (default TRUE if email present) | optional                       | optional                 | `TRUE` / `FALSE` to send notification email.                                                          |
| `generar_pdf`           | optional (default TRUE)                  | optional                       | optional                 | `TRUE` to generate & send, `FALSE` for dry-run validation only.                                       |
| `internal_notes`        | optional                                 | optional                       | optional                 | Free text for internal tracking.                                                                      |

---

## 2. Template-Specific Requirements Recap

### PSA – Colombia (`psa-col-english`)

Required columns: `contract_template`, `correo_electronico`, `nombre_completo`, `cedula`, `nacionalidad`, `oferta_salarial`, `monto_en_letras_usd`, `fecha_inicio_labores`, `fecha_ejecucion`, plus either `descripcion_servicios` or `psa_clause_one`.

### International PSA (`psa-international-english`)

Required columns: `contract_template`, `correo_electronico`, `nombre_completo`, `cedula`, `nacionalidad`, `oferta_salarial`, `monto_en_letras_usd`, `fecha_inicio_labores`, `fecha_ejecucion`, plus either `descripcion_servicios` or `psa_clause_one`.

### USA ICA (`ica-usa-english`)

Required columns: `contract_template`, `correo_electronico`, `nombre_completo`, `city_country`, `oferta_salarial`, `fecha_ejecucion`, `descripcion_servicios`.

If `psa_clause_one` is present and non-empty for PSA templates it overrides `descripcion_servicios`. For USA ICA the field is ignored.

---

## 3. Date & Format Rules

- Dates must be `MM/DD/YYYY` (e.g., `12/01/2025`). The system will convert them to the PDF display format (`Month Day, Year`).
- `oferta_salarial` must be a positive number (integer or decimal).
- `monto_en_letras_usd` should match the numeric value conceptually; no auto-conversion is performed.
- `city_country` format: `City, Country` (comma required).
- Minimum length for `descripcion_servicios` or `psa_clause_one`: 20 characters recommended to avoid empty Clause One.

---

## 4. Validation Logic (Simplified)

1. Check `contract_template` is one of allowed values.
2. Ensure `correo_electronico` present (global requirement for identification).
3. Use `psa_clause_one` if provided; else fall back to `descripcion_servicios` for PSA templates.
4. Verify `oferta_salarial > 0`.
5. For PSA templates ensure `monto_en_letras_usd` is not empty.
6. Validate date formats; optionally enforce logical ordering (e.g., `fecha_ejecucion` ≤ `fecha_inicio_labores + 7 days`).
7. Reject duplicates: the combination `(contract_template, correo_electronico, fecha_inicio_labores)` should be unique (or log as potential re-send).
8. If `generar_pdf = FALSE` perform validation only and output a report without creating contracts.

---

## 5. Sample CSV

```csv
layout_version,contract_template,correo_electronico,nombre_completo,cedula,telefono,nacionalidad,direccion_completa,city_country,puesto_trabajo,descripcion_servicios,psa_clause_one,oferta_salarial,monto_en_letras_usd,moneda_salario,fecha_inicio_labores,fecha_ejecucion,notify_email,generar_pdf,internal_notes
1.0,psa-col-english,jane.doe@email.com,Jane Doe,1034567890,+57 3001234567,Colombian,Cra 123 #45-67,,Administrative Assistant,"Client intake, document processing, scheduling coordination","",1100,One thousand one hundred,USD,12/01/2025,11/20/2025,TRUE,TRUE,Colombia batch Nov
1.0,psa-international-english,pedro.rios@email.com,Pedro Rios,AB456789,+51 992334455,Peruvian,Av. Lima 555,,Operations Specialist,"Operational monitoring and escalation","Clause One override: monitoring SLAs and reporting",1400,One thousand four hundred,USD,12/08/2025,11/20/2025,TRUE,TRUE,Intl expansion
1.0,ica-usa-english,lisa.hall@email.com,Lisa Hall,US998877,+1 (555) 777-1212,American,101 NW 1st St,Miami, USA,Onboarding Coordinator,"Onboarding and cross-team coordination","",2000,,USD,12/15/2025,11/20/2025,TRUE,TRUE,USA onboarding
```

Notes:

- Empty `monto_en_letras_usd` in USA ICA row is acceptable.
- `psa_clause_one` left empty defaults to `descripcion_servicios` (first row). Second row overrides Clause One.

---

## 6. Recommended Spreadsheet Aids

- Conditional formatting: highlight required empty cells in light red.
- Data validation lists:
  - `contract_template`: list of allowed template IDs.
  - `notify_email` / `generar_pdf`: TRUE, FALSE.
- Duplicate detection: custom formula on combined key.

Example formula (Excel) to flag duplicates in helper column:

```
=IF(COUNTIFS(B:B,B2,C:C,C2,Q:Q,Q2)>1,"DUPLICATE","OK")
```

Assuming `B` = contract_template, `C` = correo_electronico, `Q` = fecha_inicio_labores.

---

## 7. Processing Flow (Backend Overview)

1. Read CSV rows.
2. Normalize strings (trim, standardize case).
3. Validate per template rules.
4. Build PDF data object (mapping `psa_clause_one` fallback logic).
5. Render PDF → base64.
6. Persist contract + send signing links if `generar_pdf = TRUE`.
7. Dispatch notification email if `notify_email = TRUE`.
8. Aggregate a result report (success / errors) for the batch.

---

## 8. Error Examples

| Code                   | Message Example                                                              |
| ---------------------- | ---------------------------------------------------------------------------- |
| `MISSING_FIELD`        | Row 7: correo_electronico required for psa-international-english             |
| `MISSING_FIELD`        | Row 8: oferta_salarial required for psa-col-english                          |
| `INVALID_DATE`         | Row 12: fecha_ejecucion invalid format (expected MM/DD/YYYY)                 |
| `DUPLICATE_ENTRY`      | Row 15: Duplicate contract (ica-usa-english + user@email.com + 12/15/2025)   |
| `INVALID_TEMPLATE`     | Row 2: Unknown contract_template 'psa-peru-english'                          |
| `CLAUSE_EMPTY`         | Row 9: Clause One (descripcion_servicios / psa_clause_one) must not be empty |
| `AMOUNT_WORDS_MISSING` | Row 4: monto_en_letras_usd required for psa-international-english            |

---

## 9. Future Extension Fields (Optional)

You can later add columns without breaking existing ingest (backward compatible):

- `clause_confidentiality_override`
- `clause_payment_terms_override`
- `annual_increase_percent`
- `holiday_bonus_percent`

The ingestion tool should ignore unknown columns unless explicitly mapped.

---

## 10. Quick Checklist Before Submission

- All required columns present.
- Dates in MM/DD/YYYY.
- No red (empty required) cells via conditional formatting.
- Clause One text present (PSA templates).
- Monthly fee numeric and > 0.
- Amount in words present for PSA templates.
- No duplicate key combinations.

---

## 11. Glossary

| Term            | Meaning                                                  |
| --------------- | -------------------------------------------------------- |
| Clause One      | Primary description of services / scope.                 |
| Execution Date  | Signing or effective date appearing on the contract.     |
| Start Date      | Date services commence (may differ from execution date). |
| Monthly Fee     | Fixed monthly compensation (USD).                        |
| Amount in Words | Written form of monthly fee (only PSA variants).         |

---

## 12. Support

If the company encounters validation errors, they should correct the CSV and re-run in `generar_pdf = FALSE` mode until it passes, then switch to `TRUE`.

---

_Version 1.0 – Prepared for bulk contract onboarding._
