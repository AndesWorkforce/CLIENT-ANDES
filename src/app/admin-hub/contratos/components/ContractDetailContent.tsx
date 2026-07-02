"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download } from "lucide-react";
import { useNotificationStore } from "@/store/notifications.store";
import AdminHubBreadcrumbs from "../../components/AdminHubBreadcrumbs";
import AdminHubDatePicker from "../../components/AdminHubDatePicker";
import AdminHubFormField from "../../components/AdminHubFormField";
import AdminHubTableShell, {
  ADMIN_HUB_TABLE_HEAD_FIRST_CELL,
  ADMIN_HUB_TABLE_HEAD_LAST_CELL,
  ADMIN_HUB_TABLE_ROW,
} from "../../components/AdminHubTableShell";
import { PAYROLL_VARIABLE_TABS } from "../../nominas/data/mock-payroll-variables";
import { formatMoney } from "../../nominas/data/payroll-data";
import { getMetodoPagoDisplay, getPaisDisplay } from "../data/contract-display";
import {
  formatContractSalary,
  formatVariableImpact,
  getDiscretionaryBonusLabel,
} from "../data/contract-detail-display";
import type { ContractDetail } from "../data/mock-contract-detail";
import { personaToDetailPath } from "../../personas/data/mock-persona-detail";
import { MOCK_CONTRACTORS } from "../../nominas/data/mock-contractors";
import ContractApprovalBadge from "./ContractApprovalBadge";
import ContractInfoCard from "./ContractInfoCard";

interface ContractDetailContentProps {
  detail: ContractDetail;
}

type ContractVariableTab = (typeof PAYROLL_VARIABLE_TABS)[number]["key"];
type EditableSection = "general" | "residence" | "labor" | "financial";

interface ContractFormState {
  nombreCompleto: string;
  correo: string;
  telefono: string;
  documentoIdentidad: string;
  fechaNacimiento: string;
  pais: string;
  estadoResidencia: string;
  ciudadResidencia: string;
  direccionResidencia: string;
  codigoContrato: string;
  fechaInicioContrato: string;
  fechaUltimaModificacionContrato: string;
  puestoTrabajo: string;
  empresaNombre: string;
  salario: string;
  tarifaHrNacional: string;
  bonusLabel: string;
  ipbBalance: string;
  paisFacturacion: string;
  metodoPago: string;
  dollarTag: string;
  bancoNombre: string;
  numeroCuentaBancaria: string;
  bancoFacturacionNombre: string;
  numeroCuentaFacturacion: string;
}

function displayOptional(value: string | null): string {
  return value ?? "No especificado";
}

function buildContractFormState(detail: ContractDetail): ContractFormState {
  const pais = getPaisDisplay(detail.paisCodigo, detail.paisFacturacion);
  const metodoPago = detail.usaDollarApp
    ? "Transferencia Bancaria"
    : getMetodoPagoDisplay(detail);

  return {
    nombreCompleto: detail.nombreCompleto,
    correo: detail.correo,
    telefono: detail.telefono,
    documentoIdentidad: detail.documentoIdentidad,
    fechaNacimiento: detail.fechaNacimiento,
    pais,
    estadoResidencia: detail.estadoResidencia,
    ciudadResidencia: detail.ciudadResidencia,
    direccionResidencia: detail.direccionResidencia,
    codigoContrato: detail.codigoContrato,
    fechaInicioContrato: detail.fechaInicioContrato,
    fechaUltimaModificacionContrato: detail.fechaUltimaModificacionContrato,
    puestoTrabajo: detail.puestoTrabajo,
    empresaNombre: detail.empresaNombre,
    salario: formatContractSalary(detail.ofertaSalarial, detail.monedaSalario),
    tarifaHrNacional: detail.tarifaHrNacional.toFixed(1),
    bonusLabel: detail.bonusLabel,
    ipbBalance: getDiscretionaryBonusLabel(detail.discretionaryBonusType),
    paisFacturacion: pais,
    metodoPago,
    dollarTag: displayOptional(detail.dollarTag),
    bancoNombre: displayOptional(detail.bancoNombre),
    numeroCuentaBancaria: displayOptional(detail.numeroCuentaBancaria),
    bancoFacturacionNombre: displayOptional(detail.bancoFacturacionNombre),
    numeroCuentaFacturacion: displayOptional(detail.numeroCuentaFacturacion),
  };
}

export default function ContractDetailContent({ detail }: ContractDetailContentProps) {
  const router = useRouter();
  const { addNotification } = useNotificationStore();
  const [form, setForm] = useState<ContractFormState>(() => buildContractFormState(detail));
  const [editingSections, setEditingSections] = useState<Record<EditableSection, boolean>>({
    general: false,
    residence: false,
    labor: false,
    financial: false,
  });
  const [activeVariableTab, setActiveVariableTab] = useState<ContractVariableTab>("todos");
  const [selectedPayrollHistoryIds, setSelectedPayrollHistoryIds] = useState<Set<string>>(
    new Set()
  );
  const [selectedVariableIds, setSelectedVariableIds] = useState<Set<string>>(new Set());

  const checkboxClass = "size-4 rounded border-[#EFEFEF] accent-[#0097B2]";

  const breadcrumbItems = useMemo(
    () => [
      { label: "Administrador", href: "/admin-hub/dashboard" },
      { label: "Contratos", href: "/admin-hub/contratos" },
      { label: `Contrato - ${detail.codigoContrato}` },
    ],
    [detail.codigoContrato]
  );

  const filteredVariables = useMemo(() => {
    if (activeVariableTab === "todos") return detail.variablesNomina;
    return detail.variablesNomina.filter(
      (variable) => variable.categoria === activeVariableTab
    );
  }, [activeVariableTab, detail.variablesNomina]);

  const payrollTotal = useMemo(
    () => detail.historialNomina.reduce((sum, row) => sum + row.totalPagado, 0),
    [detail.historialNomina]
  );

  const allPayrollHistorySelected =
    detail.historialNomina.length > 0 &&
    detail.historialNomina.every((row) => selectedPayrollHistoryIds.has(row.id));

  const allVariablesSelected =
    filteredVariables.length > 0 &&
    filteredVariables.every((variable) => selectedVariableIds.has(variable.id));

  function togglePayrollHistoryAll() {
    if (allPayrollHistorySelected) {
      setSelectedPayrollHistoryIds(new Set());
    } else {
      setSelectedPayrollHistoryIds(new Set(detail.historialNomina.map((row) => row.id)));
    }
  }

  function togglePayrollHistoryOne(id: string) {
    setSelectedPayrollHistoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleVariablesAll() {
    if (allVariablesSelected) {
      setSelectedVariableIds((prev) => {
        const next = new Set(prev);
        filteredVariables.forEach((variable) => next.delete(variable.id));
        return next;
      });
    } else {
      setSelectedVariableIds((prev) => {
        const next = new Set(prev);
        filteredVariables.forEach((variable) => next.add(variable.id));
        return next;
      });
    }
  }

  function toggleVariableOne(id: string) {
    setSelectedVariableIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function updateField<K extends keyof ContractFormState>(key: K, value: ContractFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleSectionEdit(section: EditableSection) {
    if (editingSections[section]) {
      setEditingSections((prev) => ({ ...prev, [section]: false }));
      addNotification("Cambios guardados correctamente.", "success");
      return;
    }

    setEditingSections((prev) => ({ ...prev, [section]: true }));
  }

  function handleExport() {
    addNotification("La exportación del contrato estará disponible próximamente.", "info");
  }

  function handleGoToPayrollVariables() {
    const params = new URLSearchParams({ contractor: detail.nombreCompleto });
    router.push(`/admin-hub/nominas/variables?${params.toString()}`);
  }

  function handleGoToProfile() {
    const contractor = MOCK_CONTRACTORS.find(
      (item) => item.name === detail.nombreCompleto
    );

    if (contractor) {
      router.push(personaToDetailPath(contractor));
      return;
    }

    addNotification("No se encontró el perfil del contratista.", "info");
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminHubBreadcrumbs items={breadcrumbItems} />

      <div className="flex flex-col gap-1">
        <h1 className="text-[32px] font-bold leading-[1.3] text-black">
          Contrato - {detail.codigoContrato}
        </h1>
        <p className="text-[16px] leading-[1.3] text-[#343434]">
          {detail.nombreCompleto} - {detail.puestoTrabajo}
        </p>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex h-9 items-center justify-center gap-2.5 rounded-[8px] border border-[#0097B2] px-[22px] text-[14px] font-medium leading-[1.2] text-[#0097B2] transition-colors hover:bg-[#DFFAFF]"
        >
          <Download size={20} />
          Exportar
        </button>
        <button
          type="button"
          onClick={handleGoToProfile}
          className="inline-flex h-9 items-center justify-center rounded-[8px] bg-[#0097B2] px-[22px] text-[14px] font-medium leading-[1.2] text-white transition-colors hover:bg-[#008099]"
        >
          Ir al perfil
        </button>
      </div>

      <div className="flex flex-col gap-[18px]">
        <div className="grid gap-[18px] lg:grid-cols-2">
          <ContractInfoCard
            title="Información General"
            isEditing={editingSections.general}
            onEditClick={() => toggleSectionEdit("general")}
          >
            <AdminHubFormField
              type="input"
              label="Nombre completo"
              value={form.nombreCompleto}
              onChange={(value) => updateField("nombreCompleto", value)}
              viewOnly={!editingSections.general}
            />
            <AdminHubFormField
              type="input"
              label="Email"
              value={form.correo}
              onChange={(value) => updateField("correo", value)}
              viewOnly={!editingSections.general}
            />
            <AdminHubFormField
              type="input"
              label="Télefono"
              value={form.telefono}
              onChange={(value) => updateField("telefono", value)}
              viewOnly={!editingSections.general}
            />
            <AdminHubFormField
              type="input"
              label="N° de documento"
              value={form.documentoIdentidad}
              onChange={(value) => updateField("documentoIdentidad", value)}
              viewOnly={!editingSections.general}
            />
            <AdminHubDatePicker
              label="Fecha de nacimiento"
              value={form.fechaNacimiento}
              onChange={(value) => updateField("fechaNacimiento", value)}
              viewOnly={!editingSections.general}
            />
            <AdminHubFormField
              type="input"
              label="País"
              value={form.pais}
              onChange={(value) => updateField("pais", value)}
              viewOnly={!editingSections.general}
            />
          </ContractInfoCard>

          <ContractInfoCard
            title="Dirección de Residencia"
            isEditing={editingSections.residence}
            onEditClick={() => toggleSectionEdit("residence")}
          >
            <AdminHubFormField
              type="input"
              label="País"
              value={form.pais}
              onChange={(value) => updateField("pais", value)}
              viewOnly={!editingSections.residence}
            />
            <AdminHubFormField
              type="input"
              label="Estado"
              value={form.estadoResidencia}
              onChange={(value) => updateField("estadoResidencia", value)}
              viewOnly={!editingSections.residence}
            />
            <AdminHubFormField
              type="input"
              label="Ciudad"
              value={form.ciudadResidencia}
              onChange={(value) => updateField("ciudadResidencia", value)}
              viewOnly={!editingSections.residence}
            />
            <AdminHubFormField
              type="input"
              label="Dirección"
              value={form.direccionResidencia}
              onChange={(value) => updateField("direccionResidencia", value)}
              viewOnly={!editingSections.residence}
            />
          </ContractInfoCard>
        </div>

        <div className="grid gap-[18px] lg:grid-cols-2">
          <ContractInfoCard
            title="Información Laboral"
            isEditing={editingSections.labor}
            onEditClick={() => toggleSectionEdit("labor")}
          >
            <AdminHubFormField
              type="input"
              label="ID Contrato"
              value={form.codigoContrato}
              onChange={(value) => updateField("codigoContrato", value)}
              viewOnly={!editingSections.labor}
            />
            <AdminHubDatePicker
              label="Fecha inicio de Contrato"
              value={form.fechaInicioContrato}
              onChange={(value) => updateField("fechaInicioContrato", value)}
              viewOnly={!editingSections.labor}
            />
            <AdminHubDatePicker
              label="Fecha última modificación de Contrato"
              value={form.fechaUltimaModificacionContrato}
              onChange={(value) => updateField("fechaUltimaModificacionContrato", value)}
              viewOnly={!editingSections.labor}
            />
            <AdminHubFormField
              type="input"
              label="Posición"
              value={form.puestoTrabajo}
              onChange={(value) => updateField("puestoTrabajo", value)}
              viewOnly={!editingSections.labor}
            />
            <AdminHubFormField
              type="input"
              label="Cliente"
              value={form.empresaNombre}
              onChange={(value) => updateField("empresaNombre", value)}
              viewOnly={!editingSections.labor}
            />
            <AdminHubFormField
              type="input"
              label="Salario"
              value={form.salario}
              onChange={(value) => updateField("salario", value)}
              viewOnly={!editingSections.labor}
            />
            <AdminHubFormField
              type="input"
              label="HR Rate Holidays"
              value={form.tarifaHrNacional}
              onChange={(value) => updateField("tarifaHrNacional", value)}
              viewOnly={!editingSections.labor}
            />
            <AdminHubFormField
              type="input"
              label="Bonos"
              value={form.bonusLabel}
              onChange={(value) => updateField("bonusLabel", value)}
              viewOnly={!editingSections.labor}
            />
            <AdminHubFormField
              type="input"
              label="IPB Balance"
              value={form.ipbBalance}
              onChange={(value) => updateField("ipbBalance", value)}
              viewOnly={!editingSections.labor}
            />
          </ContractInfoCard>

          <ContractInfoCard
            title="Información Financiera"
            isEditing={editingSections.financial}
            onEditClick={() => toggleSectionEdit("financial")}
          >
            <AdminHubFormField
              type="input"
              label="País de Facturación"
              value={form.paisFacturacion}
              onChange={(value) => updateField("paisFacturacion", value)}
              viewOnly={!editingSections.financial}
            />
            <AdminHubFormField
              type="input"
              label="Método de pago"
              value={form.metodoPago}
              onChange={(value) => updateField("metodoPago", value)}
              viewOnly={!editingSections.financial}
            />
            <AdminHubFormField
              type="input"
              label="Dollar Tag"
              required={false}
              value={form.dollarTag}
              onChange={(value) => updateField("dollarTag", value)}
              viewOnly={!editingSections.financial}
            />
            <AdminHubFormField
              type="input"
              label="Banco Personal"
              required={false}
              value={form.bancoNombre}
              onChange={(value) => updateField("bancoNombre", value)}
              viewOnly={!editingSections.financial}
            />
            <AdminHubFormField
              type="input"
              label="Numero de cuenta bancaria personal"
              required={false}
              value={form.numeroCuentaBancaria}
              onChange={(value) => updateField("numeroCuentaBancaria", value)}
              viewOnly={!editingSections.financial}
            />
            <AdminHubFormField
              type="input"
              label="Nombre del Banco de Facturación"
              required={false}
              value={form.bancoFacturacionNombre}
              onChange={(value) => updateField("bancoFacturacionNombre", value)}
              viewOnly={!editingSections.financial}
            />
            <AdminHubFormField
              type="input"
              label="Numero de cuenta de Facturación"
              required={false}
              value={form.numeroCuentaFacturacion}
              onChange={(value) => updateField("numeroCuentaFacturacion", value)}
              viewOnly={!editingSections.financial}
            />
          </ContractInfoCard>
        </div>

        <section className="rounded-[12px] border border-[#EFEFEF] bg-white px-5 py-6">
          <h2 className="mb-[15px] text-[18px] font-bold leading-[1.3] text-black">
            Historial de nómina
          </h2>

          <AdminHubTableShell variant="nested">
            <table className="w-full min-w-[700px] border-collapse bg-white">
              <thead>
                <tr className="border-b border-[#EFEFEF]">
                  <th className={ADMIN_HUB_TABLE_HEAD_FIRST_CELL}>
                    <input
                      type="checkbox"
                      checked={allPayrollHistorySelected}
                      onChange={togglePayrollHistoryAll}
                      className={checkboxClass}
                      aria-label="Seleccionar todo el historial de nómina"
                    />
                  </th>
                  <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                    Período
                  </th>
                  <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                    Total Pagado
                  </th>
                  <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                    Estado
                  </th>
                  <th className={ADMIN_HUB_TABLE_HEAD_LAST_CELL} />
                </tr>
              </thead>
              <tbody>
                {detail.historialNomina.map((row) => (
                  <tr key={row.id} className={ADMIN_HUB_TABLE_ROW}>
                    <td className="px-6 py-6">
                      <input
                        type="checkbox"
                        checked={selectedPayrollHistoryIds.has(row.id)}
                        onChange={() => togglePayrollHistoryOne(row.id)}
                        className={checkboxClass}
                        aria-label={`Seleccionar ${row.periodo}`}
                      />
                    </td>
                    <td className="px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585]">
                      {row.periodo}
                    </td>
                    <td className="px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585]">
                      {formatMoney(row.totalPagado)}
                    </td>
                    <td className="px-3 py-6">
                      <ContractApprovalBadge status={row.estado} />
                    </td>
                    <td className="px-6 py-6" />
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-[#EFEFEF]">
                  <td className="rounded-bl-[12px] bg-white px-6 py-6" />
                  <td className="bg-white px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585]">
                    Total
                  </td>
                  <td className="bg-white px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585]">
                    {formatMoney(payrollTotal)}
                  </td>
                  <td colSpan={2} className="rounded-br-[12px] bg-white px-3 py-6" />
                </tr>
              </tfoot>
            </table>
          </AdminHubTableShell>
        </section>

        <section className="rounded-[12px] border border-[#EFEFEF] bg-white px-5 py-6">
          <div className="mb-[15px] flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-[18px] font-bold leading-[1.3] text-black">
              Variable de la nómina
            </h2>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleGoToPayrollVariables}
                className="inline-flex h-9 items-center justify-center rounded-[8px] border border-[#0097B2] px-[22px] text-[14px] font-medium leading-[1.2] text-[#0097B2] transition-colors hover:bg-[#DFFAFF]"
              >
                Ir
              </button>
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex h-9 items-center justify-center gap-2.5 rounded-[8px] border border-[#0097B2] px-[22px] text-[14px] font-medium leading-[1.2] text-[#0097B2] transition-colors hover:bg-[#DFFAFF]"
              >
                <Download size={20} />
                Exportar
              </button>
            </div>
          </div>

          <div className="mb-6 border-b border-[#EFEFEF]">
            <div className="flex flex-wrap gap-[38px]">
              {PAYROLL_VARIABLE_TABS.map((tab) => {
                const isActive = activeVariableTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveVariableTab(tab.key)}
                    className={`flex flex-col items-center gap-3.5 pb-0 text-[14px] font-medium leading-[1.2] transition-colors ${
                      isActive ? "text-[#0097B2]" : "text-[#858585] hover:text-[#0097B2]"
                    }`}
                  >
                    {tab.label}
                    {isActive ? (
                      <span className="h-0.5 w-full rounded-full bg-[#0097B2]" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          <AdminHubTableShell variant="nested">
            <table className="w-full min-w-[900px] border-collapse bg-white">
              <thead>
                <tr className="border-b border-[#EFEFEF]">
                  <th className={ADMIN_HUB_TABLE_HEAD_FIRST_CELL}>
                    <input
                      type="checkbox"
                      checked={allVariablesSelected}
                      onChange={toggleVariablesAll}
                      className={checkboxClass}
                      aria-label="Seleccionar todas las variables de nómina"
                    />
                  </th>
                  <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                    Periodo
                  </th>
                  <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                    Tipo
                  </th>
                  <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                    Impacto
                  </th>
                  <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                    Descripción
                  </th>
                  <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                    Estado
                  </th>
                  <th className={ADMIN_HUB_TABLE_HEAD_LAST_CELL} />
                </tr>
              </thead>
              <tbody>
                {filteredVariables.map((variable) => (
                  <tr key={variable.id} className={ADMIN_HUB_TABLE_ROW}>
                    <td className="px-6 py-6">
                      <input
                        type="checkbox"
                        checked={selectedVariableIds.has(variable.id)}
                        onChange={() => toggleVariableOne(variable.id)}
                        className={checkboxClass}
                        aria-label={`Seleccionar ${variable.tipo} — ${variable.periodo}`}
                      />
                    </td>
                    <td className="px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585]">
                      {variable.periodo}
                    </td>
                    <td className="px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585]">
                      {variable.tipo}
                    </td>
                    <td className="px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585]">
                      {formatVariableImpact(variable.impacto)}
                    </td>
                    <td className="px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585]">
                      {variable.descripcion}
                    </td>
                    <td className="px-3 py-6">
                      <ContractApprovalBadge status={variable.estado} />
                    </td>
                    <td className="px-6 py-6" />
                  </tr>
                ))}
              </tbody>
            </table>
          </AdminHubTableShell>
        </section>

        <section className="rounded-[12px] border border-[#EFEFEF] bg-white px-[30px] py-[33px]">
          <h2 className="mb-[23px] text-[18px] font-bold leading-[1.3] text-black">
            Historial de cambios del contrato
          </h2>
          <ul className="list-disc space-y-[18px] pl-5 text-[16px] leading-[1.3] text-[#343434]">
            {detail.historialCambios.map((entry) => (
              <li key={entry.id} className="border-b border-[#C8C8C8] pb-[18px] last:border-b-0 last:pb-0">
                {entry.descripcion} · {entry.fecha}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
