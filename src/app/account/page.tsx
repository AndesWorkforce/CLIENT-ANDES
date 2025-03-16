"use client";

import { useState } from "react";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Logo from "@/app/components/Logo";

export default function AccountPage() {
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [currentEmail, setCurrentEmail] = useState("mailusuario@gmail.com");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  const handleVisibilityChange = (value: "public" | "private") => {
    setVisibility(value);
  };

  const handleEmailChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmail) {
      setCurrentEmail(newEmail);
      setNewEmail("");
      // Aquí iría la llamada a la API para actualizar el email
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPassword && newPassword) {
      setCurrentPassword("");
      setNewPassword("");
      // Aquí iría la llamada a la API para actualizar la contraseña
    }
  };

  const handleDeleteAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (deletePassword) {
      // Aquí iría la llamada a la API para eliminar la cuenta
      setDeletePassword("");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link href="/" className="text-gray-700">
              <ChevronLeft size={20} color="#0097B2" />
            </Link>
            <h1 className="text-xl font-medium">Mi Cuenta</h1>
          </div>
          <div>
            <Logo />
          </div>
        </div>
      </header>

      {/* Contenido */}
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="space-y-8">
          {/* Visibilidad de perfil */}
          <section>
            <h2 className="text-[#0097B2] font-medium mb-4">
              Visibilidad de mi perfil
            </h2>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="visibility"
                  checked={visibility === "public"}
                  onChange={() => handleVisibilityChange("public")}
                  className="mr-2 accent-[#0097B2]"
                />
                <span>Público</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="visibility"
                  checked={visibility === "private"}
                  onChange={() => handleVisibilityChange("private")}
                  className="mr-2 accent-[#0097B2]"
                />
                <span>Privado</span>
              </label>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              <p className="mb-1">
                <strong>Público:</strong> Tu perfil solo es visible a las
                ofertas en las que has participado.
              </p>
              <p>
                <strong>Privado:</strong> Tu perfil no será visible para ninguna
                empresa o tus datos no serán compartidos en busquedas con
                empresas.
              </p>
            </div>
          </section>

          {/* Cambiar email */}
          <section>
            <h2 className="text-[#0097B2] font-medium mb-4">
              Cambiar mi email
            </h2>
            <form onSubmit={handleEmailChange}>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Email actual
                  </label>
                  <input
                    type="email"
                    value={currentEmail}
                    disabled
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Nuevo email
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="mailnuevo@gmail.com"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md text-sm"
                  >
                    Cambiar email
                  </button>
                </div>
              </div>
            </form>
          </section>

          {/* Cambiar contraseña */}
          <section>
            <h2 className="text-[#0097B2] font-medium mb-4">
              Cambiar contraseña
            </h2>
            <form onSubmit={handlePasswordChange}>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Contraseña actual
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Nueva contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md text-sm"
                  >
                    Cambiar contraseña
                  </button>
                </div>
              </div>
            </form>
          </section>

          {/* Eliminar cuenta */}
          <section>
            <h2 className="text-[#0097B2] font-medium mb-4">Eliminar cuenta</h2>
            <form onSubmit={handleDeleteAccount}>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showDeletePassword ? "text" : "password"}
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowDeletePassword(!showDeletePassword)}
                    >
                      {showDeletePassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  <p className="text-red-500 text-xs mt-1">
                    Esta acción no se puede deshacer
                  </p>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md text-sm"
                  >
                    Eliminar cuenta
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
