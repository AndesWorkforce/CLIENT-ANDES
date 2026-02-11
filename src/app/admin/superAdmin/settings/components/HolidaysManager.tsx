"use client";

import React, { useEffect, useState } from "react";
import { useNotificationStore } from "@/store/notifications.store";
import {
  getHolidays,
  createHoliday,
  updateHoliday,
  deleteHoliday,
  type Holiday,
  type CreateHolidayData,
} from "../actions/holidays.actions";
import { PlusIcon, Search, Calendar, Edit, Trash2, X } from "lucide-react";
import TableSkeleton from "../../../dashboard/components/TableSkeleton";

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
  const { addNotification } = useNotificationStore();
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

  const [formData, setFormData] = useState<CreateHolidayData>({
    nombre: "",
    dia: 1,
    mes: 1,
    pais: "Colombia",
    codigoPais: "CO",
  });

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
      addNotification("Error loading holidays", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const filteredHolidays = holidays.filter((holiday) => {
    const searchLower = search.toLowerCase();
    const matchesSearch = 
      holiday.nombre.toLowerCase().includes(searchLower) ||
      holiday.pais.toLowerCase().includes(searchLower) ||
      holiday.dia.toString().includes(searchLower) ||
      holiday.mes.toString().includes(searchLower);
    
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
    } else {
      setEditingHoliday(null);
      setFormData({
        nombre: "",
        dia: 1,
        mes: 1,
        pais: "Colombia",
        codigoPais: "CO",
      });
    }
    setShowModal(true);
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
          addNotification("Holiday updated successfully", "success");
          fetchHolidays();
          handleCloseModal();
        } else {
          addNotification(response.message || "Error updating holiday", "error");
        }
      } else {
        const response = await createHoliday(formData);
        if (response.success) {
          addNotification("Holiday created successfully", "success");
          fetchHolidays();
          handleCloseModal();
        } else {
          addNotification(response.message || "Error creating holiday", "error");
        }
      }
    } catch (error) {
      console.error("Error submitting holiday:", error);
      addNotification("Error submitting holiday", "error");
    }
  };

  const handleDelete = async () => {
    if (!holidayToDelete) return;

    try {
      const response = await deleteHoliday(holidayToDelete.id);
      if (response.success) {
        addNotification("Holiday deleted successfully", "success");
        fetchHolidays();
        setShowDeleteModal(false);
        setHolidayToDelete(null);
      } else {
        addNotification(response.message || "Error deleting holiday", "error");
      }
    } catch (error) {
      console.error("Error deleting holiday:", error);
      addNotification("Error deleting holiday", "error");
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

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#17323A]">
            Holidays Calendar
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Manage holidays for different countries
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-[#0097B2] text-white rounded-md hover:bg-[#007a94] transition-colors cursor-pointer text-sm font-medium shadow-sm"
        >
          <PlusIcon size={18} />
          <span>Add Holiday</span>
        </button>
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
              placeholder="Search holidays..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-[#0097B2] focus:border-[#0097B2]"
            />
          </div>

          {/* Filtros de país */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Countries:</span>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button
                onClick={() => setSelectedCountries(new Set())}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedCountries.size === 0
                    ? "bg-[#0097B2] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
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
                    Holiday Name
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Day
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
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
                      No holidays found
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
                                {groupedHolidays[country].length} holidays
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
                              <div className="flex items-center">
                                <Calendar
                                  size={16}
                                  className="text-[#0097B2] mr-2"
                                />
                                <span className="text-sm font-medium text-gray-900">
                                  {holiday.nombre}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {holiday.dia}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(2000, holiday.mes - 1).toLocaleDateString("en-US", {
                                month: "long",
                              })}
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
                  {editingHoliday ? "Edit Holiday" : "Add New Holiday"}
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
                    Holiday Name
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#0097B2] focus:border-[#0097B2]"
                    placeholder="e.g., Independence Day"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Day
                    </label>
                    <select
                      value={formData.dia}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dia: parseInt(e.target.value),
                        })
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#0097B2] focus:border-[#0097B2]"
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Month
                    </label>
                    <select
                      value={formData.mes}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mes: parseInt(e.target.value),
                        })
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#0097B2] focus:border-[#0097B2]"
                    >
                      {[
                        { value: 1, label: "January" },
                        { value: 2, label: "February" },
                        { value: 3, label: "March" },
                        { value: 4, label: "April" },
                        { value: 5, label: "May" },
                        { value: 6, label: "June" },
                        { value: 7, label: "July" },
                        { value: 8, label: "August" },
                        { value: 9, label: "September" },
                        { value: 10, label: "October" },
                        { value: 11, label: "November" },
                        { value: 12, label: "December" },
                      ].map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
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
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#0097B2] text-white rounded-md hover:bg-[#007a94] cursor-pointer"
                  >
                    {editingHoliday ? "Update" : "Create"}
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
              Delete Holiday
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete "{holidayToDelete.nombre}"? This
              action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setHolidayToDelete(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}