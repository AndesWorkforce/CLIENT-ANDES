"use client";

import { useEffect, useState } from "react";
import { User } from "../schemas/user.schema";
import { getUsersAdmin } from "../actions/user.actions";
import UsersTable from "../components/UsersTable";
import CreateUserForm from "../components/CreateUserForm";
import { PlusIcon, Search } from "lucide-react";
import TableSkeleton from "../../dashboard/components/TableSkeleton";

// Tipos de roles de empleados
type EmployeeRole = "ADMIN" | "EMPLEADO_ADMIN" | "ADMIN_RECLUTADOR";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateUserModal, setShowCreateUserModal] =
    useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const fetchUsers = async (searchValue = "") => {
    setLoading(true);
    try {
      const response = await getUsersAdmin(searchValue);

      if (response.success) {
        setUsers(
          response.data.data.map((user) => ({
            ...user,
            usuarioId: user.usuario.id,
            activo: user.activo,
            rol: user.rol as EmployeeRole,
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString(),
            actualizadoPorId: "",
            usuario: {
              ...user.usuario,
              telefono: user.usuario.telefono || "",
              residencia: user.usuario.residencia || "",
            },
          }))
        );
      }
    } catch (error) {
      console.error("[USERS ADMIN] Error al obtener usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log("VERRRR", users);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(search);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      fetchUsers(search);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-semibold text-[#17323A]">Users</h1>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#0097B2] focus:border-[#0097B2] sm:text-sm"
              />
            </div>
            <button
              onClick={() => setShowCreateUserModal(true)}
              className="bg-[#0097B2] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#007B8E] transition-colors cursor-pointer whitespace-nowrap"
            >
              <PlusIcon size={18} />
              <span>Create User</span>
            </button>
          </div>
        </div>

        {loading ? (
          <TableSkeleton />
        ) : users.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-500">
              No users found{search ? " for this search" : ""}
            </p>
          </div>
        ) : (
          <UsersTable users={users} onRefresh={() => fetchUsers(search)} />
        )}
      </div>

      {showCreateUserModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50 flex items-center justify-center z-50">
          <CreateUserForm
            onClose={() => {
              setShowCreateUserModal(false);
              fetchUsers(search);
            }}
          />
        </div>
      )}
    </div>
  );
}
