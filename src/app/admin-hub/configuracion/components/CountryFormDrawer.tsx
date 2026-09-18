"use client";

import { useEffect, useMemo, useState } from "react";
import { useNotificationStore } from "@/store/notifications.store";
import { ALL_COUNTRIES } from "@/lib/countries";
import AdminHubDrawerFooter from "../../components/AdminHubDrawerFooter";
import AdminHubDrawerProgress from "../../components/AdminHubDrawerProgress";
import AdminHubFormField from "../../components/AdminHubFormField";
import AdminHubSideDrawer from "../../components/AdminHubSideDrawer";
import { t } from "../../i18n";
import {
  createCountry,
  updateCountry,
  type CountryConfig,
  type CountryConfigInput,
} from "../actions/countries.actions";
import {
  formatCountryRate,
  roundCountryRate,
  sanitizeCountryRateInput,
} from "../lib/format-country-rate";

type DrawerStep = 1 | 2;

type FormState = Record<keyof CountryConfigInput, string> & { codigo: string };

const EMPTY_FORM: FormState = {
  codigo: "",
  nombre: "",
  activo: "true",
  tarifaHrNacional: "",
  diasLaboralesMes: "20",
  tarifaFestivo: "1.5",
  tarifaOTDiaSemana: "1",
  tarifaOTSabado: "1.5",
  tarifaOTDomingo: "1.5",
};

const RATE_FIELDS: Array<{
  key: Exclude<keyof CountryConfigInput, "nombre" | "activo">;
  labelKey: string;
  placeholder: string;
}> = [
  {
    key: "tarifaHrNacional",
    labelKey: "configuracion.countryFields.nationalHourlyRate",
    placeholder: "0.00",
  },
  {
    key: "diasLaboralesMes",
    labelKey: "configuracion.countryFields.workingDays",
    placeholder: "20",
  },
  {
    key: "tarifaFestivo",
    labelKey: "configuracion.countryFields.holidayRate",
    placeholder: "1.5",
  },
  {
    key: "tarifaOTDiaSemana",
    labelKey: "configuracion.countryFields.weekdayOvertime",
    placeholder: "1",
  },
  {
    key: "tarifaOTSabado",
    labelKey: "configuracion.countryFields.saturdayOvertime",
    placeholder: "1.5",
  },
  {
    key: "tarifaOTDomingo",
    labelKey: "configuracion.countryFields.sundayOvertime",
    placeholder: "1.5",
  },
];

function countryToForm(country: CountryConfig): FormState {
  return {
    codigo: country.codigo,
    nombre: country.nombre,
    activo: String(country.activo),
    tarifaHrNacional: formatCountryRate(country.tarifaHrNacional),
    diasLaboralesMes: String(country.diasLaboralesMes),
    tarifaFestivo: formatCountryRate(country.tarifaFestivo),
    tarifaOTDiaSemana: formatCountryRate(country.tarifaOTDiaSemana),
    tarifaOTSabado: formatCountryRate(country.tarifaOTSabado),
    tarifaOTDomingo: formatCountryRate(country.tarifaOTDomingo),
  };
}

function formToInput(form: FormState): CountryConfigInput {
  return {
    nombre: form.nombre.trim(),
    activo: form.activo === "true",
    tarifaHrNacional: roundCountryRate(Number(form.tarifaHrNacional)),
    diasLaboralesMes: Number(form.diasLaboralesMes),
    tarifaFestivo: roundCountryRate(Number(form.tarifaFestivo)),
    tarifaOTDiaSemana: roundCountryRate(Number(form.tarifaOTDiaSemana)),
    tarifaOTSabado: roundCountryRate(Number(form.tarifaOTSabado)),
    tarifaOTDomingo: roundCountryRate(Number(form.tarifaOTDomingo)),
  };
}

function isFilledNumber(value: string): boolean {
  if (!value.trim()) return false;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0;
}

interface CountryFormDrawerProps {
  open: boolean;
  existingCountries: CountryConfig[];
  editingCountry: CountryConfig | null;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
}

export default function CountryFormDrawer({
  open,
  existingCountries,
  editingCountry,
  onClose,
  onSaved,
}: CountryFormDrawerProps) {
  const { addNotification } = useNotificationStore();
  const [step, setStep] = useState<DrawerStep>(1);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      setStep(1);
      setForm(EMPTY_FORM);
      setSaving(false);
      return;
    }

    setStep(1);
    setForm(editingCountry ? countryToForm(editingCountry) : EMPTY_FORM);
  }, [open, editingCountry]);

  const countryOptions = useMemo(() => {
    const takenCodes = new Set(
      existingCountries
        .map((country) => country.codigo.toUpperCase())
        .filter((code) => code !== editingCountry?.codigo.toUpperCase()),
    );

    const catalog = ALL_COUNTRIES.filter((country) => !takenCodes.has(country.code.toUpperCase())).map(
      (country) => ({ value: country.code, label: country.name }),
    );

    if (
      editingCountry &&
      !catalog.some((option) => option.value.toUpperCase() === editingCountry.codigo.toUpperCase())
    ) {
      catalog.unshift({ value: editingCountry.codigo, label: editingCountry.nombre });
    }

    return catalog.sort((a, b) => a.label.localeCompare(b.label, "en"));
  }, [editingCountry, existingCountries]);

  const statusOptions = [
    { value: "true", label: t("configuracion.countryActive") },
    { value: "false", label: t("configuracion.countryPending") },
  ];

  const selectedCountryValue =
    countryOptions.find(
      (option) =>
        option.value.toUpperCase() === form.codigo.toUpperCase() || option.label === form.nombre,
    )?.value ?? "";

  const step1Complete = Boolean(form.nombre.trim() && form.codigo.trim());
  const step2Complete = RATE_FIELDS.every((field) => isFilledNumber(form[field.key]));

  function patch(partial: Partial<FormState>) {
    setForm((current) => ({ ...current, ...partial }));
  }

  function handleCountryChange(code: string) {
    const selected = ALL_COUNTRIES.find((country) => country.code === code);
    const fallback = countryOptions.find((option) => option.value === code);
    patch({
      codigo: code.toUpperCase(),
      nombre: selected?.name ?? fallback?.label ?? form.nombre,
    });
  }

  function handleClose() {
    if (saving) return;
    onClose();
  }

  function handleNext() {
    if (step === 1) {
      if (!step1Complete) return;
      setStep(2);
      return;
    }

    void handleSubmit();
  }

  async function handleSubmit() {
    if (!step2Complete || saving) return;

    setSaving(true);
    try {
      const input = formToInput(form);
      const result = editingCountry
        ? await updateCountry(editingCountry.codigo, input)
        : await createCountry({ codigo: form.codigo, ...input });

      if (!result.success) {
        addNotification(result.message || t("configuracion.countrySaveError"), "error");
        return;
      }

      addNotification(
        editingCountry
          ? t("configuracion.countryUpdateSuccess")
          : t("configuracion.countryCreateSuccess"),
        "success",
        "compact",
      );
      await onSaved();
      onClose();
    } catch {
      addNotification(t("configuracion.countrySaveError"), "error");
    } finally {
      setSaving(false);
    }
  }

  const stepLabel = step === 1 ? t("configuracion.stepBasic") : t("configuracion.stepRates");

  return (
    <AdminHubSideDrawer
      open={open}
      onClose={handleClose}
      title={editingCountry ? t("configuracion.editCountry") : t("configuracion.addCountry")}
      titleId="country-form-title"
      headerExtra={
        <div className="mt-4">
          <AdminHubDrawerProgress currentStep={step} totalSteps={2} stepLabel={stepLabel} />
        </div>
      }
      footer={
        <AdminHubDrawerFooter
          onCancel={step === 2 && !saving ? () => setStep(1) : handleClose}
          cancelLabel={step === 2 ? t("common.back") : t("common.cancel")}
          cancelVariant={step === 2 ? "back" : "cancel"}
          primaryLabel={
            saving ? t("configuracion.savingCountry") : step === 1 ? t("common.next") : t("common.save")
          }
          onPrimary={handleNext}
          primaryDisabled={step === 1 ? !step1Complete : !step2Complete || saving}
        />
      }
    >
      <section className="w-full max-w-[636px] rounded-[8px] border border-[#EFEFEF] bg-white px-[30px] py-6">
        <div className="flex flex-col gap-2.5">
          <h3 className="text-[18px] font-bold leading-[1.3] text-black">{stepLabel}</h3>

          {step === 1 ? (
            <>
              <AdminHubFormField
                type="select"
                label={t("configuracion.countryFields.country")}
                value={selectedCountryValue}
                onChange={handleCountryChange}
                options={countryOptions}
                placeholder={t("configuracion.selectCountry")}
                searchable
                readOnly={Boolean(editingCountry)}
              />
              <AdminHubFormField
                type="input"
                label={t("configuracion.countryFields.code")}
                value={form.codigo}
                onChange={(codigo) => patch({ codigo: codigo.toUpperCase().slice(0, 3) })}
                placeholder="AR"
                readOnly={Boolean(editingCountry)}
              />
              <AdminHubFormField
                type="select"
                label={t("configuracion.countryFields.status")}
                value={form.activo}
                onChange={(activo) => patch({ activo })}
                options={statusOptions}
                placeholder={t("configuracion.countryActive")}
              />
            </>
          ) : (
            RATE_FIELDS.map((field) => (
              <AdminHubFormField
                key={field.key}
                type="input"
                label={t(field.labelKey)}
                value={form[field.key]}
                onChange={(value) =>
                  patch({
                    [field.key]:
                      field.key === "diasLaboralesMes"
                        ? value.replace(/\D/g, "").slice(0, 2)
                        : sanitizeCountryRateInput(value),
                  })
                }
                placeholder={field.placeholder}
                inputMode={field.key === "diasLaboralesMes" ? "numeric" : "decimal"}
              />
            ))
          )}
        </div>
      </section>
    </AdminHubSideDrawer>
  );
}
