"use client";

import { useState } from "react";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Logo from "@/app/components/Logo";
import { changeEmail, changePassword } from "./actions/account.actions";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationStore } from "@/store/notifications.store";

export default function AccountPage() {
  const { user, logout } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const [currentEmail, setCurrentEmail] = useState(user?.correo || "");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] =
    useState<boolean>(false);
  const [showEmailPassword, setShowEmailPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showDeletePassword, setShowDeletePassword] = useState<boolean>(false);

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("current_email", currentEmail);
    formData.append("new_email", newEmail);
    formData.append("password", emailPassword);
    if (currentEmail && newEmail && emailPassword) {
      const result = await changeEmail(user?.id || "", formData);
      if (result.success) {
        setCurrentEmail("");
        setNewEmail("");
        setEmailPassword("");
        addNotification("Email changed successfully", "success");

        setTimeout(() => {
          logout();
        }, 2000);
      } else {
        console.error("[Account] Error al cambiar el email:", result.message);
        addNotification("Error changing email", "error");
      }
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("current_password", currentPassword);
    formData.append("new_password", newPassword);
    if (currentPassword && newPassword) {
      const result = await changePassword(user?.id || "", formData);
      if (result.success) {
        setCurrentPassword("");
        setNewPassword("");
        addNotification("Password changed successfully", "success");

        setTimeout(() => {
          logout();
        }, 2000);
      } else {
        console.error(
          "[Account] Error al cambiar la contraseña:",
          result.message
        );
        addNotification("Error changing password", "error");
      }
    }
  };

  const handleDeleteAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (deletePassword) {
      // Here would be the API call to delete the account
      setDeletePassword("");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Header */}
      <header className="bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link href="/" className="text-gray-700">
              <ChevronLeft size={20} color="#0097B2" />
            </Link>
            <h1 className="text-xl font-medium">My Account</h1>
          </div>
          <div>
            <Logo />
          </div>
        </div>
      </header>

      {/* Vista mobile */}
      <div className="md:hidden container mx-auto px-4 py-6 max-w-md">
        <div className="space-y-8">
          {/* Profile visibility */}
          <section>
            <h2 className="text-[#0097B2] font-medium mb-4">
              Profile Visibility
            </h2>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="visibility"
                  checked={true}
                  onChange={() => console.log("public")}
                  className="mr-2 accent-[#0097B2]"
                />
                <span>Public</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="visibility"
                  checked={true}
                  onChange={() => console.log("private")}
                  className="mr-2 accent-[#0097B2]"
                />
                <span>Private</span>
              </label>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              <p className="mb-1">
                <strong>Public:</strong> Your profile is only visible to offers
                you&apos;ve participated in.
              </p>
              <p>
                <strong>Private:</strong> Your profile won&apos;t be visible to
                company or your data won&apos;t be shared in searches with
                companies.
              </p>
            </div>
          </section>

          {/* Change email */}
          <section>
            <h2 className="text-[#0097B2] font-medium mb-4">Change my email</h2>
            <form onSubmit={handleEmailChange}>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Current email
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
                    New email
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="newemail@gmail.com"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showEmailPassword ? "text" : "password"}
                      value={emailPassword}
                      onChange={(e) => setEmailPassword(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowEmailPassword(!showEmailPassword)}
                    >
                      {showEmailPassword ? (
                        <EyeOff size={18} className="cursor-pointer" />
                      ) : (
                        <Eye size={18} className="cursor-pointer" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!currentEmail || !newEmail || !emailPassword}
                    className={`px-4 py-2 bg-[#0097B2] hover:bg-[#0097B2]/80 text-white rounded-md text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      !currentEmail || !newEmail || !emailPassword
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    Change email
                  </button>
                </div>
              </div>
            </form>
          </section>

          {/* Change password */}
          <section>
            <h2 className="text-[#0097B2] font-medium mb-4">Change password</h2>
            <form onSubmit={handlePasswordChange}>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Current password
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
                        <EyeOff size={18} className="cursor-pointer" />
                      ) : (
                        <Eye size={18} className="cursor-pointer" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    New password
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
                        <EyeOff size={18} className="cursor-pointer" />
                      ) : (
                        <Eye size={18} className="cursor-pointer" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!currentPassword || !newPassword}
                    className="px-4 py-2 bg-[#0097B2] hover:bg-[#0097B2]/80 text-white rounded-md text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Change password
                  </button>
                </div>
              </div>
            </form>
          </section>

          {/* Delete account */}
          <section>
            <h2 className="text-[#0097B2] font-medium mb-4">Delete account</h2>
            <form onSubmit={handleDeleteAccount}>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Password
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
                    This action cannot be undone
                  </p>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md text-sm"
                  >
                    Delete account
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>
      </div>

      {/* Vista desktop - rediseñada según la imagen del diseño */}
      <div className="hidden md:block container mx-auto px-4 py-6 max-w-5xl">
        <div className="space-y-8">
          {/* Primera sección: Email y Password */}
          <div className="bg-[#FCFEFF] rounded-lg p-8 shadow-[0px_4px_4px_0px_#00000040]">
            <div className="grid grid-cols-2 gap-x-16">
              {/* Change Email */}
              <div>
                <h2 className="text-[#0097B2] font-medium mb-4 pb-2 border-b border-[#6D6D6D]">
                  Change my email
                </h2>
                <form onSubmit={handleEmailChange} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Current email
                    </label>
                    <input
                      type="email"
                      value={currentEmail}
                      disabled
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      New email
                    </label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="newemail@gmail.com"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showEmailPassword ? "text" : "password"}
                        value={emailPassword}
                        onChange={(e) => setEmailPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowEmailPassword(!showEmailPassword)}
                      >
                        {showEmailPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-center mt-4">
                    <button
                      type="submit"
                      disabled={!currentEmail || !newEmail || !emailPassword}
                      className="px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md"
                    >
                      Change email
                    </button>
                  </div>
                </form>
              </div>

              {/* Change Password */}
              <div>
                <h2 className="text-[#0097B2] font-medium mb-4 pb-2 border-b border-[#6D6D6D]">
                  Change my password
                </h2>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Current password
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
                    <label className="block text-sm text-gray-700 mb-2">
                      New password
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
                  <div className="flex justify-center mt-10">
                    <button
                      type="submit"
                      disabled={!currentPassword || !newPassword}
                      className="px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md"
                    >
                      Change password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Segunda sección: Privacy y Delete Account */}
          <div className="bg-[#FCFEFF] rounded-lg p-8 shadow-[0px_4px_4px_0px_#00000040]">
            <div className="grid grid-cols-2 gap-x-16">
              {/* Privacy */}
              <div>
                <h2 className="text-[#0097B2] font-medium mb-4 pb-2 border-b-2 border-[#6D6D6D]">
                  Privacy
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="visibility_desktop"
                      checked={true}
                      onChange={() => console.log("public")}
                      className="mr-2 accent-[#0097B2]"
                    />
                    <span>Public</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="visibility_desktop"
                      checked={false}
                      onChange={() => console.log("private")}
                      className="mr-2 accent-[#0097B2]"
                    />
                    <span>Private</span>
                  </label>
                  <div className="mt-2 text-sm text-gray-600">
                    <p className="mb-1">
                      <strong>Public:</strong> Your profile is visible to the
                      offers you have applied for, as well as to other searches
                      conducted by companies.
                    </p>
                    <p>
                      <strong>Private:</strong> Your profile is only visible to
                      the offers you have applied for.
                    </p>
                  </div>
                </div>
              </div>

              {/* Delete account */}
              <div>
                <h2 className="text-[#0097B2] font-medium mb-4 pb-2 border-b-2 border-[#6D6D6D]">
                  Delete my account
                </h2>
                <form onSubmit={handleDeleteAccount} className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Password
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
                        onClick={() =>
                          setShowDeletePassword(!showDeletePassword)
                        }
                      >
                        {showDeletePassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    <p className="text-red-500 text-xs mt-1">
                      This action cannot be undone
                    </p>
                  </div>
                  <div className="flex justify-center mt-6">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md"
                    >
                      Delete account
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
