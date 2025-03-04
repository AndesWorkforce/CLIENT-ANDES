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

export default function RegisterForm() {
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
        // Aquí puedes redirigir al usuario o hacer lo que necesites
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
            {...register("firstName")}
          />
          {errors.firstName && (
            <span className="text-red-500 text-xs mt-1">
              {errors.firstName.message}
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
            {...register("lastName")}
          />
          {errors.lastName && (
            <span className="text-red-500 text-xs mt-1">
              {errors.lastName.message}
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
            {...register("email")}
          />
          {errors.email && (
            <span className="text-red-500 text-xs mt-1">
              {errors.email.message}
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
              type={showPassword.password ? "text" : "password"}
              placeholder="Elige tu contraseña"
              className="bg-transparent text-black border-b border-gray-300 w-full px-3 py-1 focus:outline-none focus:border-andes-blue text-[12px]"
              {...register("password")}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center text-gray-400"
              onClick={() => togglePasswordVisibility("password")}
            >
              {showPassword.password ? (
                <EyeOffIcon size={20} color="#0097B2" />
              ) : (
                <EyeIcon size={20} color="#0097B2" />
              )}
            </button>
          </div>
          {errors.password && (
            <span className="text-red-500 text-xs mt-1">
              {errors.password.message}
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
              type={showPassword.confirmPassword ? "text" : "password"}
              placeholder="Confirma la contraseña"
              className="bg-transparent text-black border-b border-gray-300 w-full px-3 py-1 focus:outline-none focus:border-andes-blue text-[12px]"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center text-gray-400"
              onClick={() => togglePasswordVisibility("confirmPassword")}
            >
              {showPassword.confirmPassword ? (
                <EyeOffIcon size={20} color="#0097B2" />
              ) : (
                <EyeIcon size={20} color="#0097B2" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="text-red-500 text-xs mt-1">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#0097B2] text-white w-full py-2 px-4 rounded-[5px] text-[15px] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
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
