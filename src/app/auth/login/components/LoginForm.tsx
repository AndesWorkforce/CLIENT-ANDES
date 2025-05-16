"use client";

import { useState, useEffect } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "../schemas/login.schema";
import { loginAction } from "../actions/login.action";
import { useNotificationStore } from "@/store/notifications.store";
import { useAuthStore } from "@/store/auth.store";
import CryptoJS from "crypto-js";

const REMEMBER_KEY = "andes_remembered_email";
const SECRET = process.env.NEXT_PUBLIC_CRYPTO_KEY!; // Puedes mover esto a un env si lo deseas

export default function LoginForm() {
  const { setUser, setAuthenticated, setToken } = useAuthStore();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const encrypted = localStorage.getItem(REMEMBER_KEY);
    if (encrypted) {
      try {
        const bytes = CryptoJS.AES.decrypt(encrypted, SECRET);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        if (decrypted) {
          setEmail(decrypted);
          setValue("correo", decrypted);
          setRememberMe(true);
        }
      } catch (error) {
        console.error("Error al desencriptar email recordado:", error);
        localStorage.removeItem(REMEMBER_KEY);
      }
    }
  }, [setValue]);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      const result = await loginAction(data);

      if (result.success) {
        if (result.data?.redirectError) {
          console.log(result.data?.redirectMessage);
          addNotification("Successfully logged in", "success");

          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
          return;
        }

        addNotification("Successfully logged in", "success");
        setUser(result.data?.usuario);
        setAuthenticated(true);
        setToken(result.data?.accessToken);

        if (rememberMe) {
          const encrypted = CryptoJS.AES.encrypt(
            data.correo,
            SECRET
          ).toString();
          localStorage.setItem(REMEMBER_KEY, encrypted);
        } else {
          localStorage.removeItem(REMEMBER_KEY);
        }

        setTimeout(() => {
          if (result.data?.usuario?.perfilCompleto === "INCOMPLETO") {
            window.location.href = "/profile";
          } else {
            window.location.href = "/pages/offers";
          }
        }, 100);
      } else {
        addNotification(result.error || "Error logging in", "error");
        console.error("Error durante el inicio de sesión:", result.error);
      }
    } catch (error) {
      console.error("Error in the form:", error);
      addNotification("Unexpected error logging in", "error");
    } finally {
      setIsSubmitting(false);
      reset();
    }
  };

  return (
    <div className="flex-1 text-black h-full flex flex-col">
      {/* Título solo visible en móvil */}
      <h2 className="text-xl font-[600] text-[18px] mb-4 lg:hidden">Log in</h2>

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
            placeholder="Write your email"
            className="bg-transparent text-black border-b border-gray-300 w-full px-3 py-1 focus:outline-none focus:border-andes-blue text-[12px]"
            {...register("correo")}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setValue("correo", e.target.value);
            }}
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
              type={showPassword ? "text" : "password"}
              placeholder="Write your password"
              className="bg-transparent text-black border-b border-gray-300 w-full px-3 py-1 focus:outline-none focus:border-andes-blue text-[12px]"
              {...register("contrasena")}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setValue("contrasena", e.target.value); // sincroniza con RHF
              }}
              onInput={(e) => {
                const value = (e.target as HTMLInputElement).value;
                setPassword(value);
                setValue("contrasena", value); // asegura sincronización en autocompletar/pegar
              }}
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
        </div>

        {/* Remember me checkbox */}
        <div className="flex items-center mb-4">
          <input
            id="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="rememberMe" className="text-sm text-gray-700 ml-2">
            Remember me
          </label>
        </div>

        {/* Login button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#0097B2] text-white w-full py-2 px-4 rounded-[5px] mt-8 text-[15px] hover:underline disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>

        {/* Register link */}
        <div className="text-center mt-2">
          <p className="flex flex-col text-[14px] text-[#B6B4B4] m-0">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-[#0097B2] font-[600] text-[16px] hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
