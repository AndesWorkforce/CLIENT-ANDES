"use client";

import { useEffect, useState } from "react";
import { User } from "../schemas/user.schema";
import { getUsersAdmin } from "../actions/user.actions";
import UsersTable from "../components/UsersTable";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUsers = async () => {
    try {
      const response = await getUsersAdmin();

      if (response.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error("[USERS ADMIN] Error al obtener usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-[#17323A]">Usuarios</h1>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#0097B2] border-t-transparent"></div>
            <p className="mt-4 text-[#17323A]">Cargando usuarios...</p>
          </div>
        ) : (
          <UsersTable users={users} onRefresh={fetchUsers} />
        )}
      </div>
    </div>
  );
}
