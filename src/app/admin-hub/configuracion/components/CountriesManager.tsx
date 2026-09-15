"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Globe2, Pencil, Plus, Search, X } from "lucide-react";
import { useNotificationStore } from "@/store/notifications.store";
import { includesSearchText, normalizeSearchText } from "../../lib/search-text";
import AdminHubBreadcrumbs from "../../components/AdminHubBreadcrumbs";
import AdminHubTableShell, { ADMIN_HUB_TABLE_ROW } from "../../components/AdminHubTableShell";
import AdminHubConfirmModal from "../../nominas/components/AdminHubConfirmModal";
import { useAdminHubI18n } from "../../i18n";
import {
  createCountry,
  getCountries,
  updateCountry,
  type CountryConfig,
  type CountryConfigInput,
} from "../actions/countries.actions";

type FormState = Record<keyof CountryConfigInput, string>;

const EMPTY_FORM: FormState = {
  nombre: "",
  activo: "true",
  tarifaHrNacional: "",
  diasLaboralesMes: "20",
  tarifaFestivo: "1.5",
  tarifaOTDiaSemana: "1",
  tarifaOTSabado: "1.5",
  tarifaOTDomingo: "1.5",
};

const NUMBER_FIELDS: Array<{
  key: Exclude<keyof CountryConfigInput, "nombre" | "activo">;
  labelKey: string;
  step: string;
  min: string;
  max?: string;
}> = [
  {
    key: "tarifaHrNacional",
    labelKey: "configuracion.countryFields.nationalHourlyRate",
    step: "0.0001",
    min: "0",
  },
  {
    key: "diasLaboralesMes",
    labelKey: "configuracion.countryFields.workingDays",
    step: "1",
    min: "1",
    max: "31",
  },
  {
    key: "tarifaFestivo",
    labelKey: "configuracion.countryFields.holidayRate",
    step: "0.0001",
    min: "0",
  },
  {
    key: "tarifaOTDiaSemana",
    labelKey: "configuracion.countryFields.weekdayOvertime",
    step: "0.0001",
    min: "0",
  },
  {
    key: "tarifaOTSabado",
    labelKey: "configuracion.countryFields.saturdayOvertime",
    step: "0.0001",
    min: "0",
  },
  {
    key: "tarifaOTDomingo",
    labelKey: "configuracion.countryFields.sundayOvertime",
    step: "0.0001",
    min: "0",
  },
];

function countryToForm(country: CountryConfig): FormState {
  return {
    nombre: country.nombre,
    activo: String(country.activo),
    tarifaHrNacional: String(country.tarifaHrNacional),
    diasLaboralesMes: String(country.diasLaboralesMes),
    tarifaFestivo: String(country.tarifaFestivo),
    tarifaOTDiaSemana: String(country.tarifaOTDiaSemana),
    tarifaOTSabado: String(country.tarifaOTSabado),
    tarifaOTDomingo: String(country.tarifaOTDomingo),
  };
}

function formToInput(form: FormState): CountryConfigInput {
  return {
    nombre: form.nombre.trim(),
    activo: form.activo === "true",
    tarifaHrNacional: Number(form.tarifaHrNacional),
    diasLaboralesMes: Number(form.diasLaboralesMes),
    tarifaFestivo: Number(form.tarifaFestivo),
    tarifaOTDiaSemana: Number(form.tarifaOTDiaSemana),
    tarifaOTSabado: Number(form.tarifaOTSabado),
    tarifaOTDomingo: Number(form.tarifaOTDomingo),
  };
}

export default function CountriesManager() {
  const { t } = useAdminHubI18n();
  const { addNotification } = useNotificationStore();
  const [countries, setCountries] = useState<CountryConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [editingCountry, setEditingCountry] = useState<CountryConfig | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [newCode, setNewCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [statusCountry, setStatusCountry] = useState<CountryConfig | null>(null);
  const [changingStatus, setChangingStatus] = useState(false);

  const loadCountries = useCallback(async () => {
    setLoading(true);
    const result = await getCountries();
    if (result.success) {
      setCountries(result.data ?? []);
    } else {
      setCountries([]);
      addNotification(result.message || t("configuracion.countriesLoadError"), "error");
    }
    setLoading(false);
  }, [addNotification, t]);

  useEffect(() => {
    void loadCountries();
  }, [loadCountries]);

  useEffect(() => {
    if (!formOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [formOpen]);

  const filteredCountries = useMemo(() => {
    const query = normalizeSearchText(search);
    return countries.filter((country) => {
      const matchesSearch =
        !query ||
        includesSearchText(country.nombre, query) ||
        includesSearchText(country.codigo, query);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" ? country.activo : !country.activo);
      return matchesSearch && matchesStatus;
    });
  }, [countries, search, statusFilter]);

  function openCreate() {
    setEditingCountry(null);
    setNewCode("");
    setForm(EMPTY_FORM);
    setFormOpen(true);
  }

  function openEdit(country: CountryConfig) {
    setEditingCountry(country);
    setNewCode(country.codigo);
    setForm(countryToForm(country));
    setFormOpen(true);
  }

  function closeForm() {
    if (saving) return;
    setFormOpen(false);
    setEditingCountry(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const input = formToInput(form);
    const result = editingCountry
      ? await updateCountry(editingCountry.codigo, input)
      : await createCountry({ codigo: newCode, ...input });

    if (!result.success) {
      addNotification(result.message || t("configuracion.countrySaveError"), "error");
      setSaving(false);
      return;
    }

    addNotification(
      editingCountry
        ? t("configuracion.countryUpdateSuccess")
        : t("configuracion.countryCreateSuccess"),
      "success",
      "compact",
    );
    setFormOpen(false);
    setEditingCountry(null);
    setSaving(false);
    await loadCountries();
  }

  async function handleStatusChange() {
    if (!statusCountry) return;
    setChangingStatus(true);
    const result = await updateCountry(statusCountry.codigo, {
      activo: !statusCountry.activo,
    });

    if (!result.success) {
      addNotification(result.message || t("configuracion.countryStatusError"), "error");
      setChangingStatus(false);
      setStatusCountry(null);
      return;
    }

    addNotification(
      statusCountry.activo
        ? t("configuracion.countryDeactivated")
        : t("configuracion.countryActivated"),
      "success",
      "compact",
    );
    setChangingStatus(false);
    setStatusCountry(null);
    await loadCountries();
  }

  const headClass =
    "px-4 py-5 text-left text-[12px] font-bold uppercase tracking-[0.24px] text-[#707070]";
  const cellClass = "whitespace-nowrap px-4 py-4 text-[14px] text-[#525252]";

  return (
    <div className="flex flex-col gap-6">
      <AdminHubBreadcrumbs />

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-[32px] font-bold leading-[1.3] text-[#343434]">
            {t("configuracion.title")}
          </h1>
          <p className="mt-2 text-[14px] text-[#707070]">
            {t("configuracion.countriesSubtitle")}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-[#0097B2] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#008099]"
        >
          <Plus size={18} />
          {t("configuracion.addCountry")}
        </button>
      </div>

      <section className="rounded-[12px] border border-[#EFEFEF] bg-white p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#DFFAFF] text-[#0097B2]">
            <Globe2 size={21} />
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-[#343434]">
              {t("configuracion.countriesTitle")}
            </h2>
            <p className="text-[13px] text-[#858585]">
              {t("configuracion.countriesCount", { count: countries.length })}
            </p>
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-[360px]">
            <Search
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#858585]"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("configuracion.searchCountries")}
              className="h-10 w-full rounded-[8px] border border-[#C8C8C8] bg-white pl-10 pr-3 text-[14px] text-[#343434] outline-none transition-colors focus:border-[#0097B2]"
            />
          </div>
          <div className="flex rounded-[8px] bg-[#F3F5F5] p-1">
            {(["all", "active", "inactive"] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-[6px] px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  statusFilter === status
                    ? "bg-white text-[#0097B2] shadow-sm"
                    : "text-[#707070] hover:text-[#343434]"
                }`}
              >
                {t(`configuracion.countryFilters.${status}`)}
              </button>
            ))}
          </div>
        </div>

        <AdminHubTableShell>
          <table className="w-full min-w-[1120px] border-collapse bg-white">
            <thead className="bg-[#FAFAFA]">
              <tr className="border-b border-[#EFEFEF]">
                <th className={headClass}>{t("configuracion.countryFields.country")}</th>
                <th className={headClass}>{t("configuracion.countryFields.status")}</th>
                <th className={headClass}>
                  {t("configuracion.countryFields.nationalHourlyRate")}
                </th>
                <th className={headClass}>{t("configuracion.countryFields.workingDays")}</th>
                <th className={headClass}>{t("configuracion.countryFields.holidayRate")}</th>
                <th className={headClass}>{t("configuracion.countryFields.weekdayOvertime")}</th>
                <th className={headClass}>{t("configuracion.countryFields.saturdayOvertime")}</th>
                <th className={headClass}>{t("configuracion.countryFields.sundayOvertime")}</th>
                <th className="w-16 px-4 py-5" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="border-b border-[#EFEFEF]">
                    {Array.from({ length: 9 }).map((__, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-5">
                        <div className="h-4 animate-pulse rounded bg-[#EFEFEF]" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredCountries.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-[14px] text-[#858585]">
                    {t("configuracion.noCountries")}
                  </td>
                </tr>
              ) : (
                filteredCountries.map((country) => (
                  <tr key={country.codigo} className={ADMIN_HUB_TABLE_ROW}>
                    <td className="px-4 py-4">
                      <p className="text-[14px] font-semibold text-[#343434]">{country.nombre}</p>
                      <p className="text-[12px] uppercase tracking-wide text-[#858585]">
                        {country.codigo}
                      </p>
                    </td>
                    <td className={cellClass}>
                      <button
                        type="button"
                        onClick={() => setStatusCountry(country)}
                        className={`inline-flex rounded-full px-2.5 py-1 text-[12px] font-semibold ${
                          country.activo
                            ? "bg-[#E8F8EF] text-[#23824A]"
                            : "bg-[#F1F1F1] text-[#707070]"
                        }`}
                      >
                        {country.activo
                          ? t("configuracion.countryActive")
                          : t("configuracion.countryInactive")}
                      </button>
                    </td>
                    <td className={cellClass}>{country.tarifaHrNacional.toFixed(4)}</td>
                    <td className={cellClass}>{country.diasLaboralesMes}</td>
                    <td className={cellClass}>{country.tarifaFestivo.toFixed(4)}</td>
                    <td className={cellClass}>{country.tarifaOTDiaSemana.toFixed(4)}</td>
                    <td className={cellClass}>{country.tarifaOTSabado.toFixed(4)}</td>
                    <td className={cellClass}>{country.tarifaOTDomingo.toFixed(4)}</td>
                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => openEdit(country)}
                        aria-label={t("configuracion.editCountry")}
                        className="inline-flex size-9 items-center justify-center rounded-[8px] text-[#0097B2] transition-colors hover:bg-[#DFFAFF]"
                      >
                        <Pencil size={17} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </AdminHubTableShell>
      </section>

      {formOpen && (
        <div
          className="fixed inset-0 z-[250] flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="country-form-title"
        >
          <div className="max-h-[calc(100vh-2rem)] w-full max-w-[680px] overflow-y-auto rounded-[12px] bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 id="country-form-title" className="text-[20px] font-bold text-[#343434]">
                  {editingCountry
                    ? t("configuracion.editCountry")
                    : t("configuracion.addCountry")}
                </h2>
                <p className="mt-1 text-[13px] text-[#858585]">
                  {t("configuracion.countryFormHint")}
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                aria-label={t("common.close")}
                className="text-[#707070] hover:text-[#343434]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-[#525252]">
                  {t("configuracion.countryFields.code")}
                  <input
                    required
                    maxLength={3}
                    value={newCode}
                    disabled={Boolean(editingCountry)}
                    onChange={(event) => setNewCode(event.target.value.toUpperCase())}
                    className="h-10 rounded-[8px] border border-[#C8C8C8] px-3 text-[14px] font-normal uppercase outline-none focus:border-[#0097B2] disabled:bg-[#F3F3F3]"
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-[#525252]">
                  {t("configuracion.countryFields.name")}
                  <input
                    required
                    value={form.nombre}
                    onChange={(event) => setForm((current) => ({ ...current, nombre: event.target.value }))}
                    className="h-10 rounded-[8px] border border-[#C8C8C8] px-3 text-[14px] font-normal outline-none focus:border-[#0097B2]"
                  />
                </label>
                {NUMBER_FIELDS.map((field) => (
                  <label
                    key={field.key}
                    className="flex flex-col gap-1.5 text-[13px] font-semibold text-[#525252]"
                  >
                    {t(field.labelKey)}
                    <input
                      required
                      type="number"
                      inputMode="decimal"
                      step={field.step}
                      min={field.min}
                      max={field.max}
                      value={form[field.key]}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, [field.key]: event.target.value }))
                      }
                      className="h-10 rounded-[8px] border border-[#C8C8C8] px-3 text-[14px] font-normal outline-none focus:border-[#0097B2]"
                    />
                  </label>
                ))}
              </div>

              <div className="mt-7 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="h-11 rounded-[8px] border border-[#C8C8C8] px-5 text-[14px] font-semibold text-[#707070] hover:bg-[#F8F8F8] disabled:opacity-50"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="h-11 rounded-[8px] bg-[#0097B2] px-6 text-[14px] font-semibold text-white hover:bg-[#008099] disabled:opacity-50"
                >
                  {saving ? t("configuracion.savingCountry") : t("common.save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AdminHubConfirmModal
        open={Boolean(statusCountry)}
        title={
          statusCountry?.activo
            ? t("configuracion.deactivateCountryTitle")
            : t("configuracion.activateCountryTitle")
        }
        confirmLabel={
          statusCountry?.activo
            ? t("configuracion.deactivateCountry")
            : t("configuracion.activateCountry")
        }
        confirmLoading={changingStatus}
        onClose={() => {
          if (!changingStatus) setStatusCountry(null);
        }}
        onConfirm={() => void handleStatusChange()}
      >
        {statusCountry?.activo
          ? t("configuracion.deactivateCountryConfirm", { name: statusCountry?.nombre ?? "" })
          : t("configuracion.activateCountryConfirm", { name: statusCountry?.nombre ?? "" })}
      </AdminHubConfirmModal>
    </div>
  );
}
