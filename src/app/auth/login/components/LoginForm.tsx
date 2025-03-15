"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "../schemas/login.schema";
import { loginAction } from "../actions/login.action";
import { useNotificationStore } from "@/store/notifications.store";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function LoginForm() {
  const router = useRouter();
  const { setUser, setAuthenticated } = useAuthStore();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      const result = await loginAction(data);

      if (result.success) {
        addNotification("Inicio de sesión exitoso", "success");
        setUser(result.data?.user);
        setAuthenticated(true);
        reset();
        router.push("/pages/offers");
      } else {
        addNotification(result.error || "Error al iniciar sesión", "error");
        reset();
      }
    } catch (error) {
      console.error("Error en el formulario:", error);
      addNotification("Error inesperado al iniciar sesión", "error");
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
        Iniciar sesión
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-8 mt-4"
      >
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
              type={showPassword ? "text" : "password"}
              placeholder="Escribe tu contraseña"
              className="bg-transparent text-black border-b border-gray-300 w-full px-3 py-1 focus:outline-none focus:border-andes-blue text-[12px]"
              {...register("contrasena")}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
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
          <div className="text-right mt-1">
            <Link
              href="/auth/forgot-password"
              className="text-[#0097B2] w-full py-2 px-4 rounded-sm mt-4 first-letter:text-andes-blue text-[15px] hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        {/* Login button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#0097B2] text-white w-full py-2 px-4 rounded-[5px] mt-8 text-[15px] hover:underline disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>

        {/* Register link */}
        <div className="text-center mt-2">
          <p className="flex flex-col text-[14px] text-[#B6B4B4] m-0">
            ¿No tenés una cuenta?{" "}
            <Link
              href="/auth/register"
              className="text-[#0097B2] font-[600] text-[16px] hover:underline"
            >
              Crear cuenta
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
