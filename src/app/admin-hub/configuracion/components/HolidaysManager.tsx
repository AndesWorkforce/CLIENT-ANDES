"use client";

import React, { useEffect, useState } from "react";
import { useNotificationStore } from "@/store/notifications.store";
import { includesSearchText, normalizeSearchText } from "../../lib/search-text";
import {
  getHolidays,
  createHoliday,
  updateHoliday,
  deleteHoliday,
  previewSyncHolidays,
  syncHolidays,
  type Holiday,
  type CreateHolidayData,
  type HolidayPreview,
} from "../actions/holidays.actions";
import { PlusIcon, Search, Calendar, Edit, Trash2, X, RefreshCw, Sparkles } from "lucide-react";
import TableSkeleton from "../../dashboard/components/TableSkeleton";
import { t, ADMIN_HUB_DATE_LOCALE } from "../../i18n";

const COUNTRIES = [
  { name: "Colombia", code: "CO" },
  { name: "México", code: "MX" },
  { name: "Argentina", code: "AR" },
  { name: "Chile", code: "CL" },
  { name: "Perú", code: "PE" },
  { name: "Ecuador", code: "EC" },
  { name: "Venezuela", code: "VE" },
  { name: "Uruguay", code: "UY" },
  { name: "Paraguay", code: "PY" },
  { name: "Bolivia", code: "BO" },
];

export default function HolidaysManager() {
  const dateLocale = ADMIN_HUB_DATE_LOCALE;
  const { addNotification } = useNotificationStore();

  function monthName(month: number): string {
    return new Date(2000, month - 1).toLocaleDateString(dateLocale, {
      month: "long",
    });
  }
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [holidayToDelete, setHolidayToDelete] = useState<Holiday | null>(null);
  const [collapsedCountries, setCollapsedCountries] = useState<Set<string>>(new Set());
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(new Set(["Colombia"]));
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [previewData, setPreviewData] = useState<HolidayPreview[]>([]);
  const [syncCountry, setSyncCountry] = useState("CO");
  const [syncYear, setSyncYear] = useState(new Date().getFullYear());

  const [formData, setFormData] = useState<CreateHolidayData>({
    nombre: "",
    dia: 1,
    mes: 1,
    pais: "Colombia",
    codigoPais: "CO",
  });
  const [selectedDate, setSelectedDate] = useState<string>("");

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const response = await getHolidays(1, 1000); // Traer todos los holidays
      if (response.success && response.data) {
        const holidaysData = response.data.data || [];
        setHolidays(holidaysData);
        
        // Extraer países únicos
        const countries = Array.from(new Set(holidaysData.map(h => h.pais))).sort();
        setAvailableCountries(countries);
      }
    } catch (error) {
      console.error("Error fetching holidays:", error);
      addNotification(t("configuracion.loadError"), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const filteredHolidays = holidays.filter((holiday) => {
    const normalizedSearch = normalizeSearchText(search);
    const matchesSearch =
      includesSearchText(holiday.nombre, normalizedSearch) ||
      includesSearchText(holiday.pais, normalizedSearch) ||
      includesSearchText(holiday.dia, normalizedSearch) ||
      includesSearchText(holiday.mes, normalizedSearch);
    
    const matchesCountry = selectedCountries.size === 0 || selectedCountries.has(holiday.pais);
    
    return matchesSearch && matchesCountry;
  });

  // Agrupar holidays por país
  const groupedHolidays = filteredHolidays.reduce((acc, holiday) => {
    if (!acc[holiday.pais]) {
      acc[holiday.pais] = [];
    }
    acc[holiday.pais].push(holiday);
    return acc;
  }, {} as Record<string, Holiday[]>);

  // Ordenar países alfabéticamente
  const sortedCountries = Object.keys(groupedHolidays).sort();

  const toggleCountry = (country: string) => {
    const newCollapsed = new Set(collapsedCountries);
    if (newCollapsed.has(country)) {
      newCollapsed.delete(country);
    } else {
      newCollapsed.add(country);
    }
    setCollapsedCountries(newCollapsed);
  };

  const toggleCountryFilter = (country: string) => {
    const newSelected = new Set(selectedCountries);
    if (newSelected.has(country)) {
      newSelected.delete(country);
    } else {
      newSelected.add(country);
    }
    setSelectedCountries(newSelected);
  };

  const handleOpenModal = (holiday?: Holiday) => {
    if (holiday) {
      setEditingHoliday(holiday);
      setFormData({
        nombre: holiday.nombre,
        dia: holiday.dia,
        mes: holiday.mes,
        pais: holiday.pais,
        codigoPais: holiday.codigoPais,
      });
      // Set date in format YYYY-MM-DD for date input
      const year = new Date().getFullYear();
      const dateStr = `${year}-${String(holiday.mes).padStart(2, '0')}-${String(holiday.dia).padStart(2, '0')}`;
      setSelectedDate(dateStr);
    } else {
      setEditingHoliday(null);
      setFormData({
        nombre: "",
        dia: 1,
        mes: 1,
        pais: "Colombia",
        codigoPais: "CO",
      });
      setSelectedDate("");
    }
    setShowModal(true);
  };

  const handleDateChange = (dateString: string) => {
    setSelectedDate(dateString);
    if (dateString) {
      const date = new Date(dateString);
      setFormData({
        ...formData,
        dia: date.getDate(),
        mes: date.getMonth() + 1,
      });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingHoliday(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingHoliday) {
        const response = await updateHoliday(editingHoliday.id, formData);
        if (response.success) {
          addNotification(t("configuracion.updateSuccess"), "success");
          fetchHolidays();
          handleCloseModal();
        } else {
          addNotification(response.message || t("configuracion.saveError"), "error");
        }
      } else {
        const response = await createHoliday(formData);
        if (response.success) {
          addNotification(t("configuracion.createSuccess"), "success");
          fetchHolidays();
          handleCloseModal();
        } else {
          addNotification(response.message || t("configuracion.saveError"), "error");
        }
      }
    } catch (error) {
      console.error("Error submitting holiday:", error);
      addNotification(t("configuracion.saveError"), "error");
    }
  };

  const handleDelete = async () => {
    if (!holidayToDelete) return;

    try {
      const response = await deleteHoliday(holidayToDelete.id);
      if (response.success) {
        addNotification(t("configuracion.deleteSuccess"), "success");
        fetchHolidays();
        setShowDeleteModal(false);
        setHolidayToDelete(null);
      } else {
        addNotification(response.message || t("configuracion.deleteError"), "error");
      }
    } catch (error) {
      console.error("Error deleting holiday:", error);
      addNotification(t("configuracion.deleteError"), "error");
    }
  };

  const handleCountryChange = (countryName: string) => {
    const country = COUNTRIES.find((c) => c.name === countryName);
    if (country) {
      setFormData({
        ...formData,
        pais: country.name,
        codigoPais: country.code,
      });
    }
  };

  const handleOpenSyncModal = () => {
    setShowSyncModal(true);
    setPreviewData([]);
  };

  const handlePreviewSync = async () => {
    setSyncLoading(true);
    try {
      const response = await previewSyncHolidays({
        countryCode: syncCountry,
        year: syncYear,
      });

      if (response.success && response.data) {
        setPreviewData(response.data);
      } else {
        addNotification(response.message || t("configuracion.previewError"), "error");
      }
    } catch (error) {
      console.error("Error previewing sync:", error);
      addNotification(t("configuracion.previewError"), "error");
    } finally {
      setSyncLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncLoading(true);
    try {
      const response = await syncHolidays({
        countryCode: syncCountry,
        year: syncYear,
        overwrite: false,
      });

      if (response.success) {
        addNotification(
          response.data?.message || t("configuracion.syncSuccess"),
          "success"
        );
        fetchHolidays();
        setShowSyncModal(false);
        setPreviewData([]);
      } else {
        addNotification(response.message || t("configuracion.syncError"), "error");
      }
    } catch (error) {
      console.error("Error syncing holidays:", error);
      addNotification(t("configuracion.syncError"), "error");
    } finally {
      setSyncLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#17323A]">
            {t("configuracion.holidaysTitle")}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {t("configuracion.holidaysSubtitle")}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleOpenSyncModal}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors cursor-pointer text-sm font-medium shadow-sm"
          >
            <RefreshCw size={18} />
            <span>{t("configuracion.syncHolidays")}</span>
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-[#0097B2] text-white rounded-md hover:bg-[#007a94] transition-colors cursor-pointer text-sm font-medium shadow-sm"
          >
            <PlusIcon size={18} />
            <span>{t("configuracion.addHoliday")}</span>
          </button>
        </div>
      </div>

      {/* Filters y búsqueda */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Búsqueda */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t("configuracion.searchHolidays")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-[#0097B2] focus:border-[#0097B2]"
            />
          </div>

          {/* Filtros de país */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">{t("configuracion.countries")}:</span>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button
                onClick={() => setSelectedCountries(new Set())}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedCountries.size === 0
                    ? "bg-[#0097B2] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t("common.all")}
              </button>
              {availableCountries.map((country) => (
                <button
                  key={country}
                  onClick={() => toggleCountryFilter(country)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    selectedCountries.has(country)
                      ? "bg-[#0097B2] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {country}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full">
          <div className="overflow-x-auto max-h-[450px] overflow-y-auto">
            <table className="w-full min-w-[600px] divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("configuracion.holidayName")}
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("configuracion.day")}
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("configuracion.month")}
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("configuracion.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {sortedCountries.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 sm:px-6 py-8 text-center text-sm text-gray-500"
                    >
                      {t("configuracion.noHolidays")}
                    </td>
                  </tr>
                ) : (
                  sortedCountries.map((country) => (
                    <React.Fragment key={country}>
                      {/* Header del país */}
                      <tr className="bg-[#0097B2] hover:bg-[#007a94] cursor-pointer" onClick={() => toggleCountry(country)}>
                        <td colSpan={4} className="px-4 sm:px-6 py-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-white font-semibold text-lg">
                                {country}
                              </span>
                              <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                                {t("configuracion.holidaysCount", {
                                  count: groupedHolidays[country].length,
                                })}
                              </span>
                            </div>
                            <svg
                              className={`w-5 h-5 text-white transition-transform ${
                                collapsedCountries.has(country) ? "" : "rotate-180"
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </td>
                      </tr>
                      {/* Holidays del país */}
                      {!collapsedCountries.has(country) &&
                        groupedHolidays[country].map((holiday, index) => (
                          <tr
                            key={holiday.id}
                            className={`hover:bg-gray-50 ${
                              index === groupedHolidays[country].length - 1
                                ? "border-b-2 border-gray-300"
                                : "border-b border-gray-200"
                            }`}
                          >
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <Calendar
                                  size={16}
                                  className="text-[#0097B2]"
                                />
                                <span className="text-sm font-medium text-gray-900">
                                  {holiday.nombre}
                                </span>
                                {holiday.origen === 'AUTOMATICO' && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    <Sparkles size={12} />
                                    {t("configuracion.auto")}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {holiday.dia}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {monthName(holiday.mes)}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleOpenModal(holiday)}
                                  className="text-[#0097B2] hover:text-[#007a94] cursor-pointer"
                                >
                                  <Edit size={18} />
                                </button>
                                <button
                                  onClick={() => {
                                    setHolidayToDelete(holiday);
                                    setShowDeleteModal(true);
                                  }}
                                  className="text-red-600 hover:text-red-800 cursor-pointer"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de creación/edición */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#17323A]">
                  {editingHoliday
                    ? t("configuracion.editHoliday")
                    : t("configuracion.addNewHoliday")}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("configuracion.holidayName")}
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#0097B2] focus:border-[#0097B2]"
                    placeholder={t("configuracion.holidayNamePlaceholder")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("configuracion.holidayDate")}
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => handleDateChange(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#0097B2] focus:border-[#0097B2] cursor-pointer"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Calendar size={18} className="text-gray-400" />
                    </div>
                  </div>
                  {selectedDate && (
                    <p className="mt-2 text-sm text-gray-600">
                      {t("configuracion.dayOf", {
                        day: formData.dia,
                        month: monthName(formData.mes),
                      })}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("configuracion.country")}
                  </label>
                  <select
                    value={formData.pais}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#0097B2] focus:border-[#0097B2]"
                  >
                    {COUNTRIES.map((country) => (
                      <option key={country.code} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    {t("common.cancel")}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#0097B2] text-white rounded-md hover:bg-[#007a94] cursor-pointer"
                  >
                    {editingHoliday ? t("configuracion.update") : t("common.create")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && holidayToDelete && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t("configuracion.deleteHoliday")}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {t("configuracion.deleteHolidayConfirm", {
                name: holidayToDelete.nombre,
              })}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setHolidayToDelete(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 cursor-pointer"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
              >
                {t("common.delete")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de sincronización */}
      {showSyncModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-[#17323A]">
                    {t("configuracion.syncHolidaysAuto")}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {t("configuracion.syncHolidaysHint")}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowSyncModal(false);
                    setPreviewData([]);
                  }}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("configuracion.country")}
                    </label>
                    <select
                      value={syncCountry}
                      onChange={(e) => setSyncCountry(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-600 focus:border-purple-600"
                    >
                      {COUNTRIES.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("configuracion.year")}
                    </label>
                    <select
                      value={syncYear}
                      onChange={(e) => setSyncYear(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-600 focus:border-purple-600"
                    >
                      {[2024, 2025, 2026, 2027, 2028].map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handlePreviewSync}
                  disabled={syncLoading}
                  className="w-full px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {syncLoading
                    ? t("common.loading")
                    : t("configuracion.previewHolidays")}
                </button>

                {previewData.length > 0 && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-700">
                        {t("configuracion.foundHolidays", {
                          count: previewData.length,
                        })}
                      </p>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                              {t("configuracion.holiday")}
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                              {t("configuracion.date")}
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                              {t("configuracion.status")}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {previewData.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-2 text-sm text-gray-900">
                                {item.nombre}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-500">
                                {item.dia}/{item.mes}/{syncYear}
                              </td>
                              <td className="px-4 py-2">
                                {item.exists ? (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    {item.origen === "MANUAL"
                                      ? t("configuracion.existsManual")
                                      : t("configuracion.existsAuto")}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {t("configuracion.new")}
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {previewData.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-800">
                      {t("configuracion.syncNote")}
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSyncModal(false);
                      setPreviewData([]);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    {t("common.cancel")}
                  </button>
                  <button
                    onClick={handleSync}
                    disabled={syncLoading || previewData.length === 0}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {syncLoading
                      ? t("configuracion.syncing")
                      : t("configuracion.syncNow")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}