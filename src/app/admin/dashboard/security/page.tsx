"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ShieldCheck,
  ShieldOff,
  ShieldAlert,
  KeyRound,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  Check,
  Download,
  Smartphone,
  Lock,
} from "lucide-react";
import Link from "next/link";
import Logo from "@/app/components/Logo";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationStore } from "@/store/notifications.store";
import MfaCodeInput from "@/app/auth/login/components/mfa/MfaCodeInput";
import {
  getMfaStatusAction,
  disableMfaAction,
  regenerateBackupCodesAction,
  setupMfaAction,
  enableMfaAction,
  verifyPasswordAction,
} from "./actions/mfa-settings.actions";

type View =
  | "status"
  | "disable"
  | "regen"
  | "regen-result"
  | "setup"
  | "setup-confirm"
  | "setup-backup";

interface MfaStatus {
  mfaEnabled: boolean;
  mfaEnabledAt?: string;
  backupCodesRemaining?: number;
}

export default function SecurityPage() {
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();

  // Password gate state
  const [authenticated, setAuthenticated] = useState(false);
  const [gatePassword, setGatePassword] = useState("");
  const [gateShowPassword, setGateShowPassword] = useState(false);
  const [gateSubmitting, setGateSubmitting] = useState(false);
  const [gateError, setGateError] = useState("");

  const [loading, setLoading] = useState(false);
  const [mfaStatus, setMfaStatus] = useState<MfaStatus | null>(null);
  const [view, setView] = useState<View>("status");

  // Disable MFA state
  const [disableCode, setDisableCode] = useState("");
  const [disablePassword, setDisablePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Regen state
  const [newBackupCodes, setNewBackupCodes] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // Setup state
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [setupToken, setSetupToken] = useState("");
  const [setupBackupCodes, setSetupBackupCodes] = useState<string[]>([]);
  const [setupConfirmed, setSetupConfirmed] = useState(false);

  const handleGateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gatePassword) return;
    setGateSubmitting(true);
    setGateError("");

    const result = await verifyPasswordAction(gatePassword);
    setGateSubmitting(false);

    if (result.success && result.verified) {
      setAuthenticated(true);
      setGatePassword("");
    } else {
      setGateError(result.error || "Invalid password");
    }
  };

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    const result = await getMfaStatusAction();
    if (result.success) {
      setMfaStatus(result.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchStatus();
    }
  }, [authenticated, fetchStatus]);

  const handleDisableMfa = async () => {
    if (!disableCode || !disablePassword) return;
    setSubmitting(true);
    const result = await disableMfaAction(disableCode, disablePassword);
    setSubmitting(false);

    if (result.success) {
      addNotification("MFA disabled successfully", "success");
      setView("status");
      setDisableCode("");
      setDisablePassword("");
      fetchStatus();
    } else {
      addNotification(result.error || "Error disabling MFA", "error");
    }
  };

  const handleRegenCodes = async (code: string) => {
    setSubmitting(true);
    const result = await regenerateBackupCodesAction(code);
    setSubmitting(false);

    if (result.success && result.data?.backupCodes) {
      setNewBackupCodes(result.data.backupCodes);
      setView("regen-result");
      fetchStatus();
    } else {
      addNotification(result.error || "Error regenerating codes", "error");
    }
  };

  const handleStartSetup = async () => {
    setSubmitting(true);
    const result = await setupMfaAction();
    setSubmitting(false);

    if (result.success && result.data) {
      setQrDataUrl(result.data.qrCodeDataUrl);
      setSecret(result.data.secret);
      setSetupToken(result.data.setupToken || "");
      setView("setup");
    } else {
      addNotification(result.error || "Error starting MFA setup", "error");
    }
  };

  const handleConfirmSetup = async (code: string) => {
    setSubmitting(true);
    const result = await enableMfaAction(setupToken, code);
    setSubmitting(false);

    if (result.success && result.data?.backupCodes) {
      setSetupBackupCodes(result.data.backupCodes);
      setView("setup-backup");
      fetchStatus();
    } else {
      addNotification(result.error || "Invalid code", "error");
    }
  };

  const handleCopyCodes = async (codes: string[]) => {
    try {
      await navigator.clipboard.writeText(codes.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available */
    }
  };

  const handleDownloadCodes = (codes: string[]) => {
    const blob = new Blob(
      [
        `Andes Admin Hub - MFA Backup Codes\n${"=".repeat(40)}\n\n${codes.join(
          "\n"
        )}\n\nKeep these codes in a safe place.\nEach code can only be used once.\n`,
      ],
      { type: "text/plain" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "andes-mfa-backup-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#F7F7F7]">
        <header className="bg-white">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Link href="/admin/dashboard" className="text-gray-700">
                <ChevronLeft size={20} color="#0097B2" />
              </Link>
              <h1 className="text-xl font-medium">Privacy Settings</h1>
            </div>
            <Logo />
          </div>
        </header>

        <div className="container mx-auto px-4 py-6 max-w-md">
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="text-center mb-6">
              <Lock size={40} className="mx-auto text-[#0097B2] mb-3" />
              <h2 className="text-lg font-semibold text-gray-900">
                Verify Your Identity
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Enter your password to access privacy settings
              </p>
            </div>

            <form onSubmit={handleGateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={gateShowPassword ? "text" : "password"}
                    value={gatePassword}
                    onChange={(e) => {
                      setGatePassword(e.target.value);
                      setGateError("");
                    }}
                    placeholder="Enter your current password"
                    autoFocus
                    className="w-full p-2.5 border border-gray-300 rounded-lg pr-10
                               focus:outline-none focus:ring-2 focus:ring-[#0097B2] focus:border-transparent"
                  />
                  <button
                    type="button"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                    onClick={() => setGateShowPassword(!gateShowPassword)}
                  >
                    {gateShowPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {gateError && (
                  <p className="text-red-500 text-sm mt-1.5">{gateError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={gateSubmitting || !gatePassword}
                className="w-full py-2.5 bg-[#0097B2] text-white rounded-lg hover:bg-[#007a94]
                           disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm font-medium"
              >
                {gateSubmitting ? "Verifying..." : "Continue"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-[#0097B2] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Header */}
      <header className="bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link href="/admin/dashboard" className="text-gray-700">
              <ChevronLeft size={20} color="#0097B2" />
            </Link>
            <h1 className="text-xl font-medium">Privacy Settings</h1>
          </div>
          <Logo />
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          {/* Status view */}
          {view === "status" && (
            <>
              <div className="flex items-center gap-3 mb-6">
                {mfaStatus?.mfaEnabled ? (
                  <ShieldCheck size={28} className="text-green-600" />
                ) : (
                  <ShieldOff size={28} className="text-orange-500" />
                )}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Two-Factor Authentication
                  </h2>
                  <p className="text-sm text-gray-500">
                    {mfaStatus?.mfaEnabled
                      ? `Active since ${new Date(
                          mfaStatus.mfaEnabledAt!
                        ).toLocaleDateString()}`
                      : "Not configured"}
                  </p>
                </div>
              </div>

              {mfaStatus?.mfaEnabled ? (
                <>
                  {/* Backup codes remaining */}
                  <div className="flex items-center gap-2 mb-6 p-3 bg-gray-50 rounded-lg">
                    <KeyRound size={18} className="text-gray-500" />
                    <span className="text-sm text-gray-700">
                      Backup codes remaining:{" "}
                      <span className="font-semibold">
                        {mfaStatus.backupCodesRemaining ?? "N/A"}
                      </span>
                    </span>
                    {(mfaStatus.backupCodesRemaining ?? 0) <= 2 && (
                      <span className="text-xs text-orange-600 ml-auto">
                        Low - consider regenerating
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => setView("regen")}
                      className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg
                                 hover:bg-gray-50 text-left cursor-pointer"
                    >
                      <RefreshCw size={18} className="text-[#0097B2]" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Regenerate backup codes
                        </p>
                        <p className="text-xs text-gray-500">
                          Invalidates existing codes and generates new ones
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => setView("disable")}
                      className="w-full flex items-center gap-3 px-4 py-3 border border-red-200 rounded-lg
                                 hover:bg-red-50 text-left cursor-pointer"
                    >
                      <ShieldOff size={18} className="text-red-500" />
                      <div>
                        <p className="text-sm font-medium text-red-700">
                          Disable MFA
                        </p>
                        <p className="text-xs text-gray-500">
                          Requires TOTP code and password
                        </p>
                      </div>
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <ShieldAlert
                    size={48}
                    className="mx-auto text-orange-400 mb-3"
                  />
                  <p className="text-sm text-gray-600 mb-4">
                    MFA is not enabled on your account. Enable it for extra
                    security.
                  </p>
                  <button
                    onClick={handleStartSetup}
                    disabled={submitting}
                    className="bg-[#0097B2] text-white px-6 py-2.5 rounded-lg hover:bg-[#007a94]
                               cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? "Loading..." : "Enable MFA"}
                  </button>
                </div>
              )}
            </>
          )}

          {/* Disable view */}
          {view === "disable" && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Disable MFA
              </h2>
              <p className="text-sm text-gray-500">
                Enter your current TOTP code and password to disable MFA.
              </p>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  TOTP Code
                </label>
                <MfaCodeInput
                  onComplete={(code) => setDisableCode(code)}
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={disablePassword}
                    onChange={(e) => setDisablePassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setView("status");
                    setDisableCode("");
                    setDisablePassword("");
                  }}
                  className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDisableMfa}
                  disabled={
                    submitting ||
                    disableCode.length < 6 ||
                    !disablePassword
                  }
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700
                             disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
                >
                  {submitting ? "Disabling..." : "Confirm disable"}
                </button>
              </div>
            </div>
          )}

          {/* Regen view */}
          {view === "regen" && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Regenerate Backup Codes
              </h2>
              <p className="text-sm text-gray-500">
                Enter your current TOTP code to generate new backup codes. All
                existing codes will be invalidated.
              </p>

              <MfaCodeInput
                onComplete={handleRegenCodes}
                disabled={submitting}
              />
              {submitting && (
                <p className="text-sm text-gray-500 text-center animate-pulse">
                  Generating...
                </p>
              )}

              <button
                onClick={() => setView("status")}
                className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer text-sm"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Regen result */}
          {view === "regen-result" && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-gray-900">
                New Backup Codes
              </h2>
              <p className="text-sm text-gray-500">
                Save these new codes. Previous codes are no longer valid.
              </p>

              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                <div className="grid grid-cols-2 gap-2">
                  {newBackupCodes.map((code, i) => (
                    <div
                      key={i}
                      className="text-center font-mono text-sm text-gray-700 bg-white rounded-md py-1.5 px-2 border border-gray-100"
                    >
                      {code}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleCopyCodes(newBackupCodes)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg
                             hover:bg-gray-50 cursor-pointer text-sm"
                >
                  {copied ? (
                    <>
                      <Check size={16} className="text-green-500" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={16} /> Copy
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDownloadCodes(newBackupCodes)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg
                             hover:bg-gray-50 cursor-pointer text-sm"
                >
                  <Download size={16} /> Download
                </button>
              </div>

              <button
                onClick={() => {
                  setView("status");
                  setNewBackupCodes([]);
                }}
                className="w-full py-2 bg-[#0097B2] text-white rounded-lg hover:bg-[#007a94] cursor-pointer text-sm"
              >
                Done
              </button>
            </div>
          )}

          {/* Setup view - QR */}
          {view === "setup" && (
            <div className="space-y-5 text-center">
              <Smartphone size={32} className="mx-auto text-[#0097B2]" />
              <h2 className="text-lg font-semibold text-gray-900">
                Set Up Authenticator
              </h2>
              <p className="text-sm text-gray-500">
                Scan the QR code with your authenticator app
              </p>

              <div className="inline-block bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrDataUrl}
                  alt="MFA QR Code"
                  width={180}
                  height={180}
                />
              </div>

              <div className="max-w-xs mx-auto">
                <p className="text-xs text-gray-400 mb-1">
                  Or enter this key manually:
                </p>
                <code className="text-xs font-mono text-gray-700 bg-gray-50 rounded-lg px-3 py-2 block break-all select-all border border-gray-200">
                  {secret}
                </code>
              </div>

              <button
                onClick={() => setView("setup-confirm")}
                className="bg-[#0097B2] text-white px-6 py-2.5 rounded-lg hover:bg-[#007a94] cursor-pointer text-sm"
              >
                I&apos;ve scanned the code
              </button>

              <button
                onClick={() => setView("status")}
                className="block mx-auto text-sm text-gray-500 hover:underline cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Setup confirm */}
          {view === "setup-confirm" && (
            <div className="space-y-5 text-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Confirm Setup
              </h2>
              <p className="text-sm text-gray-500">
                Enter the 6-digit code from your authenticator app
              </p>

              <MfaCodeInput
                onComplete={handleConfirmSetup}
                disabled={submitting}
              />
              {submitting && (
                <p className="text-sm text-gray-500 animate-pulse">
                  Activating...
                </p>
              )}

              <button
                onClick={() => setView("setup")}
                className="text-sm text-gray-500 hover:underline cursor-pointer"
              >
                Back to QR code
              </button>
            </div>
          )}

          {/* Setup backup codes */}
          {view === "setup-backup" && (
            <div className="space-y-5">
              <div className="text-center">
                <ShieldAlert
                  size={32}
                  className="mx-auto text-amber-500 mb-2"
                />
                <h2 className="text-lg font-semibold text-gray-900">
                  Save Your Backup Codes
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  MFA is now active. Save these backup codes securely.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                <div className="grid grid-cols-2 gap-2">
                  {setupBackupCodes.map((code, i) => (
                    <div
                      key={i}
                      className="text-center font-mono text-sm text-gray-700 bg-white rounded-md py-1.5 px-2 border border-gray-100"
                    >
                      {code}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleCopyCodes(setupBackupCodes)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg
                             hover:bg-gray-50 cursor-pointer text-sm"
                >
                  {copied ? (
                    <>
                      <Check size={16} className="text-green-500" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={16} /> Copy
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDownloadCodes(setupBackupCodes)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg
                             hover:bg-gray-50 cursor-pointer text-sm"
                >
                  <Download size={16} /> Download
                </button>
              </div>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={setupConfirmed}
                  onChange={(e) => setSetupConfirmed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#0097B2]"
                />
                <span className="text-sm text-gray-600">
                  I have saved these backup codes in a safe place
                </span>
              </label>

              <button
                onClick={() => {
                  setView("status");
                  setSetupBackupCodes([]);
                  setSetupConfirmed(false);
                  addNotification("MFA enabled successfully!", "success");
                }}
                disabled={!setupConfirmed}
                className="w-full py-2.5 bg-[#0097B2] text-white rounded-lg hover:bg-[#007a94]
                           disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
