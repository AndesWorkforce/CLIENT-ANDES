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
        // Pre-fill selectedCompany if any association exists to provide context
        if (res.data.responsibleCompany) {
          setSelectedCompany(res.data.responsibleCompany);
          setCompanyQuery(res.data.responsibleCompany.nombre);
        } else if (res.data.employeeCompany) {
          setSelectedCompany(res.data.employeeCompany.empresa);
          setCompanyQuery(res.data.employeeCompany.empresa.nombre);
        } else {
          setSelectedCompany(null);
          setCompanyQuery("");
        }
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

    // If EMPLEADO_EMPRESA is selected, require a company to be chosen
    const isCompanyEmployee = roles.includes("EMPLEADO_EMPRESA");
    if (isCompanyEmployee && !selectedCompany) {
      addNotification(
        "Select a company for the Company Employee role",
        "warning"
      );
      return;
    }

    // No cross-side restriction: any combination is allowed. Keep only minimum one role validation.
    const res = await updateUsuarioRoles(user.id, roles);
    if (res.success) {
      // If the user is set as company employee, link to selected company now
      if (isCompanyEmployee && selectedCompany) {
        const assign = await assignUsuarioToCompanyEmployee(
          user.id,
          selectedCompany.id,
          "employee"
        );
        if (!assign.success) {
          addNotification(
            assign.message || "Error assigning to company",
            "error"
          );
          return;
        }
      }

      // Assign/change responsible:
      if (selectedCompany) {
        const currentResp = companyAssociation?.responsibleCompany;
        if (currentResp && selectedCompany.id !== currentResp.id) {
          // Move in one server-side operation: clears previous and assigns new
          const moved = await moveCompanyResponsible(
            selectedCompany.id,
            user.id
          );
          if (!moved.success) {
            addNotification(
              moved.message || "Error moving company responsible",
              "error"
            );
            return;
          }
        } else {
          // No current responsible or same company: simple assign
          const resp = await setCompanyResponsible(selectedCompany.id, user.id);
          if (!resp.success) {
            addNotification(
              resp.message || "Error assigning as company responsible",
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
      // refresh list after save
      const refreshed = await searchUsuarios(debouncedQuery, 1, 20);
      if (refreshed.success && refreshed.data) setUsers(refreshed.data.items);
    } else {
      addNotification(res.message || "Error updating roles", "error");
    }
  };

  const onRemoveEmployeeFromCompany = async () => {
    if (!companyAssociation?.employeeCompany) return;
    const empleadoId = companyAssociation.employeeCompany.empleadoId;
    const res = await removeUsuarioCompanyEmployee(empleadoId);
    if (res.success) {
      addNotification("Employee unassigned from company", "success");
      setCompanyAssociation((prev) =>
        prev ? { ...prev, employeeCompany: null } : prev
      );
    } else {
      addNotification(
        res.message || "Error removing employee from company",
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
                            {companyAssociation.responsibleCompany && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E6F7FB] text-[#007B8E]">
                                <Building2 size={14} /> Responsible:{" "}
                                {companyAssociation.responsibleCompany.nombre}
                              </span>
                            )}
                            {companyAssociation.employeeCompany && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#17323A]">
                                <User size={14} /> Employee at:{" "}
                                {
                                  companyAssociation.employeeCompany.empresa
                                    .nombre
                                }
                                <button
                                  type="button"
                                  className="ml-2 text-[#B20000] hover:underline"
                                  onClick={onRemoveEmployeeFromCompany}
                                >
                                  Remove
                                </button>
                              </span>
                            )}
                            {!companyAssociation.responsibleCompany &&
                              !companyAssociation.employeeCompany && (
                                <span className="text-gray-500">
                                  No current company association
                                </span>
                              )}
                          </>
                        ) : null}
                      </div>

                      {/* Helper note */}
                      <div className="flex items-start gap-2 text-[11px] text-gray-500 mb-2">
                        <Info size={14} className="mt-[2px] text-gray-400" />
                        <span>
                          A user can be responsible for only one company. To
                          move responsibility, change the current company&apos;s
                          responsible in Companies admin first.
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
                    </div>
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
                    <div className="text-xs text-gray-600">
                      {u.responsibleCompany ? (
                        <span>
                          Responsible:{" "}
                          <span className="text-[#17323A]">
                            {u.responsibleCompany.nombre}
                          </span>
                        </span>
                      ) : u.employeeCompany ? (
                        <span>
                          Employee at:{" "}
                          <span className="text-[#17323A]">
                            {u.employeeCompany.empresa.nombre}
                          </span>
                        </span>
                      ) : null}
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
