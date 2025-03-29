"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserSchema,
  type CreateUserFormData,
} from "../schemas/createUser.schema";
import { X } from "lucide-react";
import { createUserEmployeeAdmin } from "../actions/createUser.action";
import { updateUser } from "../actions/user.actions";
import { useNotificationStore } from "@/store/notifications.store";

interface Props {
  onClose?: () => void;
  initialData?: CreateUserFormData;
  userId?: string;
}

export default function CreateUserForm({
  onClose,
  initialData,
  userId,
}: Props) {
  const { addNotification } = useNotificationStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      if (userId && !data.contrasena) {
        delete data.contrasena;
      }

      if (!data.telefono) delete data.telefono;
      if (!data.residencia) delete data.residencia;

      let response;
      if (userId) {
        response = await updateUser(userId, data);
      } else {
        response = await createUserEmployeeAdmin(data);
      }

      if (response.success) {
        addNotification(
          userId ? "User updated successfully" : "User created successfully",
          "success"
        );
        reset();
        onClose?.();
      } else {
        addNotification(
          userId ? "Error updating user" : "Error creating user",
          "error"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      addNotification(
        userId ? "Error al actualizar usuario" : "Error al crear usuario",
        "error"
      );
    }
  };

  return (
    <div className="bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <X size={20} />
          </button>
        )}

        <h2 className="text-xl font-semibold text-[#17323A] mb-6">
          {userId ? "Edit User" : "Create User"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              {...register("nombre")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#0097B2] focus:outline-none focus:ring-1 focus:ring-[#0097B2]"
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-600">
                {errors.nombre.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              {...register("apellido")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#0097B2] focus:outline-none focus:ring-1 focus:ring-[#0097B2]"
            />
            {errors.apellido && (
              <p className="mt-1 text-sm text-red-600">
                {errors.apellido.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register("correo")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#0097B2] focus:outline-none focus:ring-1 focus:ring-[#0097B2]"
            />
            {errors.correo && (
              <p className="mt-1 text-sm text-red-600">
                {errors.correo.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password {userId && "(leave blank to keep the current password)"}
            </label>
            <input
              type="password"
              {...register("contrasena")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#0097B2] focus:outline-none focus:ring-1 focus:ring-[#0097B2]"
              placeholder={userId ? "••••••••" : ""}
            />
            {errors.contrasena && (
              <p className="mt-1 text-sm text-red-600">
                {errors.contrasena.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone (optional)
            </label>
            <input
              type="tel"
              {...register("telefono")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#0097B2] focus:outline-none focus:ring-1 focus:ring-[#0097B2]"
            />
            {errors.telefono && (
              <p className="mt-1 text-sm text-red-600">
                {errors.telefono.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Residence (optional)
            </label>
            <input
              type="text"
              {...register("residencia")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#0097B2] focus:outline-none focus:ring-1 focus:ring-[#0097B2]"
            />
            {errors.residencia && (
              <p className="mt-1 text-sm text-red-600">
                {errors.residencia.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="submit"
              className="w-full bg-[#0097B2] text-white py-2 px-4 rounded hover:bg-[#007B8E] transition-colors"
            >
              {userId ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => {
                reset();
                onClose?.();
              }}
              className="w-full text-[#0097B2] hover:text-[#007B8E] transition-colors"
            >
              Discard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
