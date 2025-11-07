"use client";

import { useEffect, useRef, useState } from "react";
import {
  searchUsuarios,
  updateUsuarioRoles,
  type Rol,
  type UsuarioListItem,
  searchCompanies,
  assignUsuarioToCompanyEmployee,
  setCompanyResponsible,
  type CompanyItem,
  getUsuarioCompanyAssociation,
  removeUsuarioCompanyEmployee,
  type CompanyAssociation,
  moveCompanyResponsible,
  clearCompanyResponsible,
} from "./actions/users-roles.actions";
import { useNotificationStore } from "@/store/notifications.store";
import { Search, Pencil, Shield, Building2, User, Info } from "lucide-react";

const ALL_ROLES: Rol[] = [
  "ADMIN",
  "EMPLEADO_ADMIN",
  "ADMIN_RECLUTAMIENTO",
  "EMPRESA",
  "EMPLEADO_EMPRESA",
  "CANDIDATO",
];

const REQUIRE_EMAIL = true; // restrict search to email address
const ROLE_LABELS: Record<Rol, string> = {
  ADMIN: "Administrator",
  EMPLEADO_ADMIN: "Admin Employee",
  ADMIN_RECLUTAMIENTO: "Recruitment Admin",
  EMPRESA: "Company",
  EMPLEADO_EMPRESA: "Company Employee",
  CANDIDATO: "Candidate",
};

export default function SuperAdminUsersRolesPage() {
  const addNotification = useNotificationStore((s) => s.addNotification);

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UsuarioListItem[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<Record<string, Set<Rol>>>(
    {}
  );

  // Company linking state for the row being edited
  const [companyQuery, setCompanyQuery] = useState("");
  const [companyResults, setCompanyResults] = useState<CompanyItem[]>([]);
  const [companyLoading, setCompanyLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyItem | null>(
    null
  );
  const companyInputRef = useRef<HTMLInputElement | null>(null);
  const [assocLoading, setAssocLoading] = useState(false);
  const [companyAssociation, setCompanyAssociation] =
    useState<CompanyAssociation | null>(null);
  // Pending multi-add lists
  const [pendingResponsible, setPendingResponsible] = useState<CompanyItem[]>(
    []
  );
  const [pendingEmployees, setPendingEmployees] = useState<CompanyItem[]>([]);

  const debouncedQuery = useDebounce(query, 300);
  const MIN_SEARCH_LEN = 3;

  const runSearch = async (q: string) => {
    const searchTerm = q.trim();
    if (!searchTerm) return; // do nothing on empty manual trigger
    setLoading(true);
    const res = await searchUsuarios(searchTerm, 1, 20);
    if (res.success && res.data) {
      setUsers(res.data.items);
      const init: Record<string, Set<Rol>> = {};
      res.data.items.forEach((u) => {
        init[u.id] = new Set((u.roles || []) as Rol[]);
      });
      setSelectedRoles(init);
    } else {
      setUsers([]);
      if (res.message) addNotification(res.message, "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    let active = true;
    (async () => {
      const q = debouncedQuery.trim();
      const looksLikeEmail = q.includes("@");
      if (REQUIRE_EMAIL && !looksLikeEmail) {
        setUsers([]);
        return;
      }
      setLoading(true);
      const res = await searchUsuarios(q, 1, 20);
      if (!active) return;
      if (res.success && res.data) {
        setUsers(res.data.items);
        const init: Record<string, Set<Rol>> = {};
        res.data.items.forEach((u) => {
          init[u.id] = new Set((u.roles || []) as Rol[]);
        });
        setSelectedRoles(init);
      } else {
        setUsers([]);
        if (res.message) addNotification(res.message, "error");
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  // Company search when editing and company-related role is selected
  const debouncedCompany = useDebounce(companyQuery, 300);
  useEffect(() => {
    (async () => {
      if (!editingUserId) return;
      const term = debouncedCompany.trim();
      if (!term || term.length < 2) {
        setCompanyResults([]);
        return;
      }
      setCompanyLoading(true);
      const res = await searchCompanies(term, 1, 10);
      if (res.success && res.data) setCompanyResults(res.data.items);
      else setCompanyResults([]);
      setCompanyLoading(false);
    })();
  }, [debouncedCompany, editingUserId]);

  // Fetch current company associations for the user when entering edit mode
  useEffect(() => {
    (async () => {
      if (!editingUserId) {
        setCompanyAssociation(null);
        return;
      }
      setAssocLoading(true);
      const res = await getUsuarioCompanyAssociation(editingUserId);
      if (res.success && res.data) {
        setCompanyAssociation(res.data as CompanyAssociation);
        // Do not auto-select a company; user can pick one to add/assign
        setSelectedCompany(null);
        setCompanyQuery("");
        setPendingResponsible([]);
        setPendingEmployees([]);
      } else {
        setCompanyAssociation(null);
      }
      setAssocLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingUserId]);

  const onToggleRole = (userId: string, role: Rol) => {
    setSelectedRoles((prev) => {
      const current = new Set(prev[userId] || []);
      if (current.has(role)) {
        // Enforce at least one role selected
        if (current.size === 1) {
          addNotification("A user must have at least one role", "info");
          return prev; // do not remove the last role
        }
        current.delete(role);
      } else {
        // Allow combining any roles freely; just add to the set
        current.add(role);
      }
      return { ...prev, [userId]: current };
    });
  };

  const onSave = async (user: UsuarioListItem) => {
    const roles = Array.from(selectedRoles[user.id] || []);
    if (roles.length === 0) {
      addNotification("Select at least one role", "warning");
      return;
    }

    const isCompanyEmployee = roles.includes("EMPLEADO_EMPRESA");
    const isCompanyResponsible = roles.includes("EMPRESA");

    // No cross-side restriction: any combination is allowed. Keep only minimum one role validation.
    const res = await updateUsuarioRoles(user.id, roles);
    if (res.success) {
      // If Company role was removed, automatically clear existing responsible associations
      if (
        !isCompanyResponsible &&
        companyAssociation?.responsibleCompanies?.length
      ) {
        for (const c of companyAssociation.responsibleCompanies) {
          const cleared = await clearCompanyResponsible(c.id, user.id);
          if (!cleared.success) {
            addNotification(
              cleared.message || `Error removing responsible from ${c.nombre}`,
              "error"
            );
            return;
          }
        }
      }
      // Add multiple employee associations
      if (isCompanyEmployee && pendingEmployees.length > 0) {
        const existingEmpIds = new Set(
          (companyAssociation?.employeeCompanies || []).map((e) => e.empresa.id)
        );
        for (const c of pendingEmployees) {
          if (existingEmpIds.has(c.id)) continue;
          const assign = await assignUsuarioToCompanyEmployee(
            user.id,
            c.id,
            "employee"
          );
          if (!assign.success) {
            addNotification(
              assign.message || `Error assigning ${c.nombre}`,
              "error"
            );
            return;
          }
        }
      }

      // Add multiple responsible associations
      if (pendingResponsible.length > 0) {
        const currentRespIds = new Set(
          companyAssociation?.responsibleCompanies?.map((c) => c.id) || []
        );
        for (const c of pendingResponsible) {
          if (currentRespIds.has(c.id)) continue;
          const resp = await setCompanyResponsible(c.id, user.id);
          if (!resp.success) {
            addNotification(
              resp.message || `Error assigning as responsible: ${c.nombre}`,
              "error"
            );
            return;
          }
        }
      }

      addNotification("Roles updated", "success");
      setEditingUserId(null);
      setCompanyQuery("");
      setCompanyResults([]);
      setSelectedCompany(null);
      setCompanyAssociation(null);
      setPendingResponsible([]);
      setPendingEmployees([]);
      // refresh list after save
      const refreshed = await searchUsuarios(debouncedQuery, 1, 20);
      if (refreshed.success && refreshed.data) setUsers(refreshed.data.items);
    } else {
      addNotification(res.message || "Error updating roles", "error");
    }
  };

  const onRemoveEmployeeFromCompany = async (empleadoId: string) => {
    const res = await removeUsuarioCompanyEmployee(empleadoId);
    if (res.success) {
      addNotification("Employee unassigned from company", "success");
      setCompanyAssociation((prev) =>
        prev
          ? {
              ...prev,
              employeeCompanies: prev.employeeCompanies.filter(
                (e) => e.empleadoId !== empleadoId
              ),
            }
          : prev
      );
    } else {
      addNotification(
        res.message || "Error removing employee from company",
        "error"
      );
    }
  };

  const onRemoveResponsibleFromCompany = async (
    companyId: string,
    userId: string
  ) => {
    const res = await clearCompanyResponsible(companyId, userId);
    if (res.success) {
      addNotification("Responsible removed from company", "success");
      setCompanyAssociation((prev) =>
        prev
          ? {
              ...prev,
              responsibleCompanies: prev.responsibleCompanies.filter(
                (c) => c.id !== companyId
              ),
            }
          : prev
      );
    } else {
      addNotification(
        res.message || "Error removing responsible from company",
        "error"
      );
    }
  };

  console.log("[USER]", users);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          <h1 className="text-2xl font-semibold text-[#17323A]">User Roles</h1>
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#0097B2] focus:border-[#0097B2] sm:text-sm"
              placeholder="Search by name or email... (min 3 chars)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  runSearch((e.target as HTMLInputElement).value);
                }
              }}
            />
          </div>
        </header>
        {/* Card list instead of table for better mobile UX */}
        <section className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              Loading...
            </div>
          ) : users.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              {debouncedQuery.trim().length > 0 &&
              debouncedQuery.trim().length < MIN_SEARCH_LEN
                ? `Type at least ${MIN_SEARCH_LEN} characters to search`
                : debouncedQuery.trim() && !debouncedQuery.includes("@")
                ? "Type a valid email (must include @)"
                : "No users found for this search"}
            </div>
          ) : (
            users.map((u) => (
              <div
                key={u.id}
                className="bg-white rounded-lg shadow p-4 sm:p-6 relative"
              >
                {/* Header with name/email */}
                <div className="flex items-start gap-3 sm:gap-4 mb-4">
                  <div className="h-10 w-10 rounded-full bg-[#EBFFF9] text-[#0097B2] flex items-center justify-center font-semibold shrink-0">
                    {getInitials(
                      (u.nombre || "").trim(),
                      (u.apellido || "").trim()
                    )}
                  </div>
                  <div>
                    <div className="text-base sm:text-lg text-[#17323A] font-semibold">
                      {(u.nombre || "").trim()} {(u.apellido || "").trim()}
                    </div>
                    <div className="text-sm text-gray-600 break-all">
                      {u.correo}
                    </div>
                  </div>
                </div>

                {/* Top-right actions */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  {editingUserId === u.id ? null : (
                    <button
                      aria-label="Edit roles"
                      onClick={() => setEditingUserId(u.id)}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-gray-200 text-[#0097B2] hover:text-[#007B8E] hover:bg-gray-50 cursor-pointer"
                    >
                      <Pencil size={16} />
                    </button>
                  )}
                </div>

                {/* Roles and company association */}
                {editingUserId === u.id ? (
                  <div className="flex flex-col gap-5">
                    {/* Roles */}
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                        Roles
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {ALL_ROLES.map((r) => {
                          const isChecked = !!selectedRoles[u.id]?.has(r);
                          return (
                            <div
                              key={r}
                              className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer transition-colors ${
                                isChecked
                                  ? "bg-[#EBFFF9] border-[#B9F4E7]"
                                  : "bg-white hover:bg-gray-50 border-gray-200"
                              }`}
                              onClick={() => onToggleRole(u.id, r)}
                            >
                              <input
                                id={`r-${u.id}-${r}`}
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-[#0097B2] focus:ring-[#0097B2]"
                                checked={isChecked}
                                onChange={() => onToggleRole(u.id, r)}
                              />
                              <span className="inline-flex items-center gap-2 text-[#17323A]">
                                <RoleIcon role={r} /> {ROLE_LABELS[r]}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gray-100" />

                    {/* Company association */}
                    {(() => {
                      const hasCompany = !!selectedRoles[u.id]?.has("EMPRESA");
                      const hasCompanyEmployee =
                        !!selectedRoles[u.id]?.has("EMPLEADO_EMPRESA");
                      if (!hasCompany && !hasCompanyEmployee) return null;
                      return (
                        <div className="w-full">
                          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                            Company association
                          </h3>

                          {/* Current association summary */}
                          <div className="text-xs text-gray-700 mb-2 flex flex-wrap gap-2">
                            {assocLoading ? (
                              <span>Loading current associations…</span>
                            ) : companyAssociation ? (
                              <>
                                {(
                                  companyAssociation.responsibleCompanies || []
                                ).map((c) => (
                                  <span
                                    key={`resp-${c.id}`}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E6F7FB] text-[#007B8E]"
                                  >
                                    <Building2 size={14} /> Responsible:{" "}
                                    {c.nombre}
                                    <button
                                      type="button"
                                      className="ml-2 text-[#B20000] hover:underline cursor-pointer"
                                      onClick={() =>
                                        onRemoveResponsibleFromCompany(
                                          c.id,
                                          editingUserId!
                                        )
                                      }
                                    >
                                      Remove
                                    </button>
                                  </span>
                                ))}
                                {(
                                  companyAssociation.employeeCompanies || []
                                ).map((e) => (
                                  <span
                                    key={`emp-${e.empleadoId}`}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#17323A]"
                                  >
                                    <User size={14} /> Employee at:{" "}
                                    {e.empresa.nombre}
                                    <button
                                      type="button"
                                      className="ml-2 text-[#B20000] hover:underline"
                                      onClick={() =>
                                        onRemoveEmployeeFromCompany(
                                          e.empleadoId
                                        )
                                      }
                                    >
                                      Remove
                                    </button>
                                  </span>
                                ))}
                                {(!companyAssociation.responsibleCompanies ||
                                  companyAssociation.responsibleCompanies
                                    .length === 0) &&
                                  (!companyAssociation.employeeCompanies ||
                                    companyAssociation.employeeCompanies
                                      .length === 0) && (
                                    <span className="text-gray-500">
                                      No current company association
                                    </span>
                                  )}
                              </>
                            ) : null}
                          </div>

                          {/* Helper note */}
                          <div className="flex items-start gap-2 text-[11px] text-gray-500 mb-2">
                            <Info
                              size={14}
                              className="mt-[2px] text-gray-400"
                            />
                            <span>
                              A user can be associated with multiple companies
                              as responsible and/or employee. Use the selector
                              below to add associations.
                            </span>
                          </div>

                          {/* Company search */}
                          <div className="relative max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Building2 size={16} className="text-gray-400" />
                            </div>
                            <input
                              className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#0097B2] focus:border-[#0097B2]"
                              placeholder="Search company by name..."
                              value={companyQuery}
                              onChange={(e) => setCompanyQuery(e.target.value)}
                              ref={companyInputRef}
                            />
                          </div>
                          {companyLoading ? (
                            <div className="text-xs text-gray-500 mt-1">
                              Searching companies...
                            </div>
                          ) : companyResults.length > 0 ? (
                            <div className="mt-1 border rounded-lg max-w-md bg-white shadow-sm max-h-40 overflow-auto">
                              {companyResults.map((c) => (
                                <button
                                  key={c.id}
                                  type="button"
                                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                                    selectedCompany?.id === c.id
                                      ? "bg-[#EBFFF9]"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    setSelectedCompany(c);
                                    setCompanyQuery(c.nombre);
                                    setCompanyResults([]);
                                    companyInputRef.current?.blur();
                                  }}
                                >
                                  {c.nombre}
                                </button>
                              ))}
                            </div>
                          ) : debouncedCompany && companyQuery.length >= 2 ? (
                            <div className="text-xs text-gray-500 mt-1">
                              No companies found
                            </div>
                          ) : null}
                          {selectedCompany && (
                            <div className="text-xs text-[#0097B2] mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EBFFF9]">
                              <Building2 size={14} /> Selected:{" "}
                              {selectedCompany.nombre}
                            </div>
                          )}

                          {/* Staging buttons for multi-add */}
                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              type="button"
                              disabled={!selectedCompany}
                              className="px-3 py-1 text-xs rounded bg-[#E6F7FB] text-[#007B8E] disabled:opacity-50 cursor-pointer"
                              onClick={() => {
                                if (!selectedCompany) return;
                                setPendingResponsible((prev) =>
                                  prev.find((c) => c.id === selectedCompany.id)
                                    ? prev
                                    : [...prev, selectedCompany]
                                );
                              }}
                            >
                              Add as Responsible
                            </button>
                            <button
                              type="button"
                              disabled={!selectedCompany}
                              className="px-3 py-1 text-xs rounded bg-[#EBFFF9] text-[#0097B2] disabled:opacity-50 cursor-pointer"
                              onClick={() => {
                                if (!selectedCompany) return;
                                setPendingEmployees((prev) =>
                                  prev.find((c) => c.id === selectedCompany.id)
                                    ? prev
                                    : [...prev, selectedCompany]
                                );
                              }}
                            >
                              Add as Employee
                            </button>
                          </div>

                          {/* Pending chips */}
                          {(pendingResponsible.length > 0 ||
                            pendingEmployees.length > 0) && (
                            <div className="mt-2 flex flex-wrap gap-2 text-xs">
                              {pendingResponsible.map((c) => (
                                <span
                                  key={`pr-${c.id}`}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E6F7FB] text-[#007B8E]"
                                >
                                  <Building2 size={14} /> To add (Responsible):{" "}
                                  {c.nombre}
                                  <button
                                    type="button"
                                    className="ml-2 text-[#B20000] hover:underline cursor-pointer"
                                    onClick={() =>
                                      setPendingResponsible((prev) =>
                                        prev.filter((x) => x.id !== c.id)
                                      )
                                    }
                                  >
                                    Remove
                                  </button>
                                </span>
                              ))}
                              {pendingEmployees.map((c) => (
                                <span
                                  key={`pe-${c.id}`}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#17323A]"
                                >
                                  <User size={14} /> To add (Employee):{" "}
                                  {c.nombre}
                                  <button
                                    type="button"
                                    className="ml-2 text-[#B20000] hover:underline cursor-pointer"
                                    onClick={() =>
                                      setPendingEmployees((prev) =>
                                        prev.filter((x) => x.id !== c.id)
                                      )
                                    }
                                  >
                                    Remove
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                    {/* Actions footer */}
                    <div className="mt-6">
                      <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
                        <button
                          onClick={() => onSave(u)}
                          className="w-full sm:w-auto bg-[#0097B2] text-white px-4 py-2 rounded-lg hover:bg-[#007B8E] cursor-pointer text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingUserId(null);
                            setCompanyQuery("");
                            setCompanyResults([]);
                            setSelectedCompany(null);
                            setCompanyAssociation(null);
                          }}
                          className="w-full sm:w-auto text-[#17323A] border border-gray-200 bg-white px-4 py-2 rounded-lg hover:bg-gray-50 cursor-pointer text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2">
                      {(u.roles && u.roles.length > 0
                        ? u.roles
                        : u.rol
                        ? [u.rol]
                        : []
                      ).map((r) => (
                        <span
                          key={r}
                          className="px-2 py-1 text-xs rounded-full bg-[#EBFFF9] text-[#0097B2]"
                        >
                          {ROLE_LABELS[r as Rol] || r}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-gray-600 flex flex-wrap gap-2">
                      {(u.responsibleCompanies || []).map((c) => (
                        <span
                          key={`r-${c.id}`}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E6F7FB] text-[#007B8E]"
                        >
                          <Building2 size={14} /> {c.nombre}
                          {editingUserId === u.id && (
                            <button
                              type="button"
                              className="ml-2 text-[#B20000] hover:underline cursor-pointer"
                              onClick={() =>
                                onRemoveResponsibleFromCompany(c.id, u.id)
                              }
                            >
                              Remove
                            </button>
                          )}
                        </span>
                      ))}
                      {(u.employeeCompanies || []).map((e) => (
                        <span
                          key={`e-${e.empleadoId}`}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#17323A]"
                        >
                          <User size={14} /> {e.empresa.nombre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}

function getInitials(name?: string, last?: string) {
  const a = (name || "").trim().charAt(0);
  const b = (last || "").trim().charAt(0);
  return (a + b || "U").toUpperCase();
}

function RoleIcon({ role }: { role: Rol }) {
  if (
    role === "ADMIN" ||
    role === "EMPLEADO_ADMIN" ||
    role === "ADMIN_RECLUTAMIENTO"
  ) {
    return <Shield size={16} className="text-[#0097B2]" />;
  }
  if (role === "EMPRESA" || role === "EMPLEADO_EMPRESA") {
    return <Building2 size={16} className="text-[#0097B2]" />;
  }
  return <User size={16} className="text-[#0097B2]" />;
}

function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
