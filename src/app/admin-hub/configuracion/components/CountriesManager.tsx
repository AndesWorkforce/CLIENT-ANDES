"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, Filter, Plus } from "lucide-react";
import { useNotificationStore } from "@/store/notifications.store";
import { includesSearchText, normalizeSearchText } from "../../lib/search-text";
import AdminHubBreadcrumbs from "../../components/AdminHubBreadcrumbs";
import {
  ADMIN_HUB_CLEAR_FILTERS_CLASS,
  ADMIN_HUB_FILTER_BUTTON_CLASS,
  ADMIN_HUB_FILTERS_ROW_CLASS,
} from "../../components/admin-hub-filter-styles";
import AdminHubSearchInput from "../../components/AdminHubSearchInput";
import AdminHubSelect from "../../components/AdminHubSelect";
import AdminHubConfirmModal from "../../nominas/components/AdminHubConfirmModal";
import { t } from "../../i18n";
import {
  getCountries,
  updateCountry,
  type CountryConfig,
} from "../actions/countries.actions";
import CountriesTable from "./CountriesTable";
import CountryFormDrawer from "./CountryFormDrawer";

export default function CountriesManager() {
  const { addNotification } = useNotificationStore();
  const [countries, setCountries] = useState<CountryConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [sectionOpen, setSectionOpen] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<CountryConfig | null>(null);
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
  }, [addNotification]);

  useEffect(() => {
    void loadCountries();
  }, [loadCountries]);

  const filteredCountries = useMemo(() => {
    const query = normalizeSearchText(search);
    return countries.filter((country) => {
      const matchesSearch =
        !query ||
        includesSearchText(country.nombre, query) ||
        includesSearchText(country.codigo, query);
      const matchesStatus =
        !statusFilter ||
        (statusFilter === "active" ? country.activo : !country.activo);
      return matchesSearch && matchesStatus;
    });
  }, [countries, search, statusFilter]);

  const hasActiveFilters = Boolean(statusFilter);

  function openCreate() {
    setEditingCountry(null);
    setFormOpen(true);
  }

  function openEdit(country: CountryConfig) {
    setEditingCountry(country);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingCountry(null);
  }

  async function handleStatusChange() {
    if (!statusCountry) return;
    setChangingStatus(true);
    try {
      const result = await updateCountry(statusCountry.codigo, {
        activo: !statusCountry.activo,
      });

      if (!result.success) {
        addNotification(result.message || t("configuracion.countryStatusError"), "error");
        return;
      }

      addNotification(
        statusCountry.activo
          ? t("configuracion.countryDeactivated")
          : t("configuracion.countryActivated"),
        "success",
        "compact",
      );
      setStatusCountry(null);
      await loadCountries();
    } catch {
      addNotification(t("configuracion.countryStatusError"), "error");
    } finally {
      setChangingStatus(false);
      setStatusCountry(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminHubBreadcrumbs />
      <h1 className="text-[32px] font-bold leading-[1.3] text-black">
        {t("configuracion.title")}
      </h1>

      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <AdminHubSearchInput value={search} onChange={setSearch} />

          <button
            type="button"
            onClick={() => setFiltersOpen((prev) => !prev)}
            aria-expanded={filtersOpen}
            className={`${ADMIN_HUB_FILTER_BUTTON_CLASS} ${
              filtersOpen
                ? "border-[#0097B2] text-[#0097B2]"
                : "border-[#C8C8C8] text-[#858585] hover:border-[#0097B2] hover:text-[#0097B2]"
            }`}
          >
            {t("common.filters")}
            <Filter size={18} />
          </button>
        </div>

        {filtersOpen && (
          <div className={ADMIN_HUB_FILTERS_ROW_CLASS}>
            <AdminHubSelect
              label={t("configuracion.filterStatus")}
              required={false}
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: "active", label: t("configuracion.countryFilters.active") },
                { value: "inactive", label: t("configuracion.countryFilters.inactive") },
              ]}
              placeholder={t("configuracion.countryFields.status")}
              variant="filter"
              labelBackground="#F8F8F8"
              clearable
              className="max-w-[259px] min-w-[200px] flex-1"
            />
            <button
              type="button"
              onClick={() => setStatusFilter("")}
              disabled={!hasActiveFilters}
              className={`${ADMIN_HUB_CLEAR_FILTERS_CLASS} ${
                hasActiveFilters
                  ? "cursor-pointer text-[#0097B2] hover:text-[#008099]"
                  : "cursor-default text-[#C8C8C8]"
              }`}
            >
              {t("common.clearFilters")}
            </button>
          </div>
        )}
      </div>

      <section className="w-full overflow-hidden rounded-[12px] border border-[#EFEFEF] bg-white">
        <div className={`flex w-full items-center ${sectionOpen ? "border-b border-[#EFEFEF]" : ""}`}>
          <button
            type="button"
            onClick={() => setSectionOpen((prev) => !prev)}
            aria-expanded={sectionOpen}
            className="flex h-16 w-[47px] shrink-0 items-center justify-center border-r border-[#EFEFEF]"
          >
            <ChevronDown
              size={21}
              className={`text-[#525252] transition-transform ${sectionOpen ? "" : "-rotate-90"}`}
            />
          </button>
          <div className="flex h-16 min-w-0 flex-1 items-center justify-between gap-4 px-3 pr-6">
            <p className="truncate text-[12px] font-bold leading-[18px] text-[#525252]">
              {t("configuracion.countriesTitle")}
            </p>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex h-9 shrink-0 items-center justify-center gap-2.5 rounded-[8px] bg-[#0097B2] px-[22px] text-[14px] font-medium leading-[1.2] text-white transition-colors hover:bg-[#008099]"
            >
              <Plus size={24} />
              {t("configuracion.addCountry")}
            </button>
          </div>
        </div>

        {sectionOpen && (
          <CountriesTable
            countries={filteredCountries}
            loading={loading}
            onEdit={openEdit}
            onToggleStatus={setStatusCountry}
          />
        )}
      </section>

      <CountryFormDrawer
        open={formOpen}
        existingCountries={countries}
        editingCountry={editingCountry}
        onClose={closeForm}
        onSaved={loadCountries}
      />

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
