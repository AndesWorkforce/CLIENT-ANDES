"use client";

import { useState } from "react";
import type { User } from "../schemas/user.schema";
import { toggleUserStatus, deleteUser } from "../actions/user.actions";
import CreateUserForm from "./CreateUserForm";
import ConfirmStatusModal from "./ConfirmStatusModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { useNotificationStore } from "@/store/notifications.store";

interface Props {
  users: User[];
  onRefresh: () => void;
}

export default function UsersTable({ users, onRefresh }: Props) {
  const { addNotification } = useNotificationStore();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleStatusChange = async () => {
    if (!selectedUser || isUpdatingStatus) return;

    setIsUpdatingStatus(true);
    try {
      const response = await toggleUserStatus(
        selectedUser.id,
        !selectedUser.activo
      );
      if (response.success) {
        addNotification(response.message, "success");
        onRefresh();
      } else {
        addNotification(response.message, "error");
      }
    } catch (error) {
      console.error("Error al cambiar el estado:", error);
      addNotification("Error changing user status", "error");
    } finally {
      setIsUpdatingStatus(false);
      setShowStatusModal(false);
      setSelectedUser(null);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser || isDeleting) return;

    setIsDeleting(true);
    try {
      const response = await deleteUser(selectedUser.id);
      if (response.success) {
        addNotification(response.message, "success");
        onRefresh();
      } else {
        addNotification(response.message, "error");
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      addNotification("Error al eliminar el usuario", "error");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setSelectedUser(null);
    }
  };

  return (
    <>
      <div className="overflow-x-auto bg-white rounded-lg custom-scrollbar">
        <table className="min-w-full">
          <thead className="bg-white border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#17323A] uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#17323A] uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#17323A] uppercase">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#17323A] uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#17323A] uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#17323A]">
                      {user.usuario.nombre} {user.usuario.apellido}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#17323A]">
                      {user.usuario.correo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#17323A]">
                      {user.rol.toUpperCase()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowStatusModal(true);
                      }}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors cursor-pointer ${
                        user.activo
                          ? "bg-[#EBFFF9] text-[#0097B2] hover:bg-[#D7F5EE]"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }`}
                    >
                      {user.activo ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditModal(true);
                        }}
                        className="text-[#0097B2] hover:text-[#007B8E] cursor-pointer"
                      >
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_931_15229)">
                            <path
                              d="M10.084 3.66666H3.66732C3.18109 3.66666 2.71477 3.85981 2.37096 4.20363C2.02714 4.54744 1.83398 5.01376 1.83398 5.49999V18.3333C1.83398 18.8196 2.02714 19.2859 2.37096 19.6297C2.71477 19.9735 3.18109 20.1667 3.66732 20.1667H16.5007C16.9869 20.1667 17.4532 19.9735 17.797 19.6297C18.1408 19.2859 18.334 18.8196 18.334 18.3333V11.9167"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M16.959 2.29168C17.3237 1.92701 17.8183 1.72214 18.334 1.72214C18.8497 1.72214 19.3443 1.92701 19.709 2.29168C20.0737 2.65635 20.2785 3.15096 20.2785 3.66668C20.2785 4.18241 20.0737 4.67701 19.709 5.04168L11.0007 13.75L7.33398 14.6667L8.25065 11L16.959 2.29168Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_931_15229">
                              <rect width="22" height="22" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteModal(true);
                        }}
                        className="text-[#0097B2] hover:text-[#007B8E] cursor-pointer"
                      >
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2.75 5.5H4.58333H19.25"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M7.33398 5.50001V3.66668C7.33398 3.18045 7.52714 2.71413 7.87096 2.37031C8.21477 2.0265 8.68109 1.83334 9.16732 1.83334H12.834C13.3202 1.83334 13.7865 2.0265 14.1303 2.37031C14.4742 2.71413 14.6673 3.18045 14.6673 3.66668V5.50001M17.4173 5.50001V18.3333C17.4173 18.8196 17.2242 19.2859 16.8803 19.6297C16.5365 19.9735 16.0702 20.1667 15.584 20.1667H6.41732C5.93109 20.1667 5.46477 19.9735 5.12096 19.6297C4.77714 19.2859 4.58398 18.8196 4.58398 18.3333V5.50001H17.4173Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9.16602 10.0833V15.5833"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12.834 10.0833V15.5833"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-4 text-center text-sm text-[#17323A]"
                >
                  No users registered
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50 flex items-center justify-center z-50">
          <CreateUserForm
            initialData={{
              nombre: selectedUser.usuario.nombre,
              apellido: selectedUser.usuario.apellido,
              correo: selectedUser.usuario.correo,
              contrasena: "",
              telefono: selectedUser.usuario.telefono,
              residencia: selectedUser.usuario.residencia,
            }}
            userId={selectedUser.id}
            onClose={() => {
              setShowEditModal(false);
              setSelectedUser(null);
              onRefresh();
            }}
          />
        </div>
      )}

      {showStatusModal && selectedUser && (
        <ConfirmStatusModal
          isOpen={showStatusModal}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedUser(null);
          }}
          onConfirm={handleStatusChange}
          userName={`${selectedUser.usuario.nombre} ${selectedUser.usuario.apellido}`}
          currentStatus={selectedUser.activo}
        />
      )}

      {showDeleteModal && selectedUser && (
        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedUser(null);
          }}
          onConfirm={handleDelete}
          userName={`${selectedUser.usuario.nombre} ${selectedUser.usuario.apellido}`}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
}
