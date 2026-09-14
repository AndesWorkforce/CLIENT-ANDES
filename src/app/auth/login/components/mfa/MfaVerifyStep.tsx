"use client";

import { useState } from "react";
import { ShieldCheck, KeyRound, Mail } from "lucide-react";
import MfaCodeInput from "./MfaCodeInput";
import {
  mfaVerifyAction,
  mfaRecoveryRequestAction,
} from "../../actions/mfa.actions";

interface MfaVerifyStepProps {
  challengeToken: string;
  correo: string;
  onSuccess: (data: any) => void;
  onError: (message: string) => void;
  onRecoveryStart: () => void;
}

export default function MfaVerifyStep({
  challengeToken,
  correo,
  onSuccess,
  onError,
  onRecoveryStart,
}: MfaVerifyStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBackupInput, setShowBackupInput] = useState(false);
  const [backupCode, setBackupCode] = useState("");
  const [sendingRecovery, setSendingRecovery] = useState(false);

  const handleCodeComplete = async (code: string) => {
    setIsSubmitting(true);
    const result = await mfaVerifyAction(challengeToken, code);
    setIsSubmitting(false);

    if (result.success) {
      onSuccess(result.data);
    } else {
      onError(result.error || "Invalid code");
    }
  };

  const handleBackupSubmit = async () => {
    if (!backupCode.trim()) return;
    setIsSubmitting(true);
    const result = await mfaVerifyAction(challengeToken, backupCode.trim());
    setIsSubmitting(false);

    if (result.success) {
      onSuccess(result.data);
    } else {
      onError(result.error || "Invalid backup code");
    }
  };

  const handleRecoveryRequest = async () => {
    setSendingRecovery(true);
    await mfaRecoveryRequestAction(correo);
    setSendingRecovery(false);
    onRecoveryStart();
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#0097B2]/10">
        <ShieldCheck size={32} className="text-[#0097B2]" />
      </div>

      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Two-Factor Authentication
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Enter the 6-digit code from your authenticator app
        </p>
      </div>

      {!showBackupInput ? (
        <>
          <MfaCodeInput onComplete={handleCodeComplete} disabled={isSubmitting} />

          {isSubmitting && (
            <p className="text-sm text-gray-500 animate-pulse">Verifying...</p>
          )}

          <div className="flex flex-col items-center gap-2 mt-4">
            <button
              type="button"
              onClick={() => setShowBackupInput(true)}
              className="flex items-center gap-1 text-sm text-[#0097B2] hover:underline cursor-pointer"
            >
              <KeyRound size={14} />
              Use a backup code
            </button>
            <button
              type="button"
              onClick={handleRecoveryRequest}
              disabled={sendingRecovery}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#0097B2] hover:underline cursor-pointer disabled:opacity-50"
            >
              <Mail size={14} />
              {sendingRecovery ? "Sending..." : "I lost access, send code by email"}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="w-full max-w-xs">
            <label className="block text-sm mb-1 text-gray-600">
              Backup code (format: XXXX-XXXX)
            </label>
            <input
              type="text"
              value={backupCode}
              onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
              placeholder="XXXX-XXXX"
              maxLength={9}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center text-lg font-mono
                         focus:border-[#0097B2] focus:outline-none focus:ring-1 focus:ring-[#0097B2]"
              autoFocus
            />
          </div>

          <button
            type="button"
            onClick={handleBackupSubmit}
            disabled={isSubmitting || !backupCode.trim()}
            className="bg-[#0097B2] text-white w-full max-w-xs py-2 px-4 rounded-lg
                       hover:bg-[#007a94] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? "Verifying..." : "Verify backup code"}
          </button>

          <button
            type="button"
            onClick={() => {
              setShowBackupInput(false);
              setBackupCode("");
            }}
            className="text-sm text-gray-500 hover:underline cursor-pointer"
          >
            Back to authenticator code
          </button>
        </>
      )}
    </div>
  );
}
