"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterFormValues,
} from "../schemas/register.schema";
import { registerAction } from "../actions/register.action";
import { useNotificationStore } from "@/store/notifications.store";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({
    password: false,
    confirmPassword: false,
  });
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  function togglePasswordVisibility(field: string): void {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  }

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsSubmitting(true);
      const result = await registerAction(data);

      if (result.success) {
        addNotification("Cuenta creada exitosamente", "success");
        reset();
        router.push("/auth/login");
      } else {
        addNotification(result.error || "Error al crear la cuenta", "error");
        reset();
      }
    } catch (error) {
      console.error("Error en el formulario:", error);
      addNotification("Error inesperado al crear la cuenta", "error");
      reset();
    } finally {
      setIsSubmitting(false);
      reset();
    }
  };

  return (
    <div className="flex-1 text-black h-full flex flex-col">
      {/* Título solo visible en móvil */}
      <h2 className="text-xl font-[600] text-[18px] mb-4 lg:hidden">
        Crear una cuenta nueva
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-8 mt-2"
      >
        {/* Nombre input */}
        <div>
          <label className="block text-sm mb-1 text-[#0097B2] text-[16px] font-[500]">
            Nombre
          </label>
          <input
            type="text"
            placeholder="Escribe tu nombre"
            className="bg-transparent text-black border-b border-gray-300 w-full px-3 py-1 focus:outline-none focus:border-andes-blue text-[12px]"
            {...register("nombre")}
          />
          {errors.nombre && (
            <span className="text-red-500 text-xs mt-1">
              {errors.nombre.message}
            </span>
          )}
        </div>

        {/* Apellido input */}
        <div>
          <label className="block text-sm mb-1 text-[#0097B2] text-[16px] font-[500]">
            Apellido
          </label>
          <input
            type="text"
            placeholder="Escribe tu apellido"
            className="bg-transparent text-black border-b border-gray-300 w-full px-3 py-1 focus:outline-none focus:border-andes-blue text-[12px]"
            {...register("apellido")}
          />
          {errors.apellido && (
            <span className="text-red-500 text-xs mt-1">
              {errors.apellido.message}
            </span>
          )}
        </div>

        {/* Email input */}
        <div>
          <label className="block text-sm mb-1 text-[#0097B2] text-[16px] font-[500]">
            Email
          </label>
          <input
            type="email"
            placeholder="Escribe tu email"
            className="bg-transparent text-black border-b border-gray-300 w-full px-3 py-1 focus:outline-none focus:border-andes-blue text-[12px]"
            {...register("correo")}
          />
          {errors.correo && (
            <span className="text-red-500 text-xs mt-1">
              {errors.correo.message}
            </span>
          )}
        </div>

        {/* Password input */}
        <div>
          <label className="block text-sm mb-1 text-[#0097B2] text-[16px] font-[500]">
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword.contrasena ? "text" : "password"}
              placeholder="Elige tu contraseña"
              className="bg-transparent text-black border-b border-gray-300 w-full px-3 py-1 focus:outline-none focus:border-andes-blue text-[12px]"
              {...register("contrasena")}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center text-gray-400"
              onClick={() => togglePasswordVisibility("contrasena")}
            >
              {showPassword.contrasena ? (
                <EyeOffIcon
                  size={20}
                  color="#0097B2"
                  className="cursor-pointer"
                />
              ) : (
                <EyeIcon size={20} color="#0097B2" className="cursor-pointer" />
              )}
            </button>
          </div>
          {errors.contrasena && (
            <span className="text-red-500 text-xs mt-1">
              {errors.contrasena.message}
            </span>
          )}
        </div>

        {/* Confirmar contraseña input */}
        <div>
          <label className="block text-sm mb-1 text-[#0097B2] text-[16px] font-[500]">
            Confirmar contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword.confirmContrasena ? "text" : "password"}
              placeholder="Confirma la contraseña"
              className="bg-transparent text-black border-b border-gray-300 w-full px-3 py-1 focus:outline-none focus:border-andes-blue text-[12px]"
              {...register("confirmContrasena")}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center text-gray-400"
              onClick={() => togglePasswordVisibility("confirmContrasena")}
            >
              {showPassword.confirmContrasena ? (
                <EyeOffIcon
                  size={20}
                  color="#0097B2"
                  className="cursor-pointer"
                />
              ) : (
                <EyeIcon size={20} color="#0097B2" className="cursor-pointer" />
              )}
            </button>
          </div>
          {errors.confirmContrasena && (
            <span className="text-red-500 text-xs mt-1">
              {errors.confirmContrasena.message}
            </span>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#0097B2] text-white w-full py-2 px-4 rounded-[5px] text-[15px] hover:underline disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
        </button>

        {/* Login link */}
        <div className="text-center">
          <p className="flex flex-col text-[14px] text-[#B6B4B4] m-0">
            ¿Ya tenés una cuenta?{" "}
            <Link
              href="/auth/login"
              className="text-[#0097B2] font-[600] text-[16px] hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
