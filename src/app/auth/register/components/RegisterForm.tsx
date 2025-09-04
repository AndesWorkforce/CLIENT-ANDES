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
        addNotification("Account created successfully", "success");
        reset();
        router.push("/auth/login");
      } else {
        addNotification(result.error || "Error creating account", "error");
        reset();
      }
    } catch (error) {
      console.error("Error in the form:", error);
      addNotification("Unexpected error creating account", "error");
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
        Register
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-8 mt-2"
      >
        {/* Nombre input */}
        <div>
          <label className="block text-sm mb-1 text-[#0097B2] text-[16px] font-[500]">
            Name
          </label>
          <input
            type="text"
            placeholder="Write your name"
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
            Last name
          </label>
          <input
            type="text"
            placeholder="Write your last name"
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
            placeholder="Write your email"
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
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword.contrasena ? "text" : "password"}
              placeholder="Write your password"
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
          <div className="text-gray-500 text-xs mt-1">
            Example: Password123! (min. 8 characters, uppercase, lowercase, number)
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
            Confirm password
          </label>
          <div className="relative">
            <input
              type={showPassword.confirmContrasena ? "text" : "password"}
              placeholder="Confirm your password"
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
          className="bg-[#0097B2] text-white w-full py-2 px-4 rounded-[5px] text-[15px] hover:underline disabled:opacity-50 disabled:cursor-not-allowed mb-2 cursor-pointer"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>

        {/* Login link */}
        <div className="text-center">
          <p className="flex flex-col text-[14px] text-[#B6B4B4] m-0">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-[#0097B2] font-[600] text-[16px] hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
