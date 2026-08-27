"use client";

import { useState, useEffect } from "react";
import { Smartphone, Copy, Check } from "lucide-react";
import MfaCodeInput from "./MfaCodeInput";
import { mfaSetupAction, mfaEnableAction } from "../../actions/mfa.actions";

interface MfaSetupStepProps {
  setupToken: string;
  onComplete: (backupCodes: string[]) => void;
  onError: (message: string) => void;
}

type SetupPhase = "loading" | "scan" | "confirm";

export default function MfaSetupStep({
  setupToken,
  onComplete,
  onError,
}: MfaSetupStepProps) {
  const [phase, setPhase] = useState<SetupPhase>("loading");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const result = await mfaSetupAction(setupToken);
      if (result.success && result.data) {
        setQrCodeDataUrl(result.data.qrCodeDataUrl);
        setSecret(result.data.secret);
        setPhase("scan");
      } else {
        onError(result.error || "Error generating QR code");
      }
    })();
  }, [setupToken, onError]);

  const handleCopySecret = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available */
    }
  };

  const handleCodeComplete = async (code: string) => {
    setIsSubmitting(true);
    const result = await mfaEnableAction(setupToken, code);
    setIsSubmitting(false);

    if (result.success && result.data?.backupCodes) {
      onComplete(result.data.backupCodes);
    } else {
      onError(result.error || "Invalid code");
    }
  };

  if (phase === "loading") {
    return (
      <div className="flex flex-col items-center space-y-4 py-8">
        <div className="w-10 h-10 border-3 border-[#0097B2] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Setting up authenticator...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-5">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#0097B2]/10">
        <Smartphone size={32} className="text-[#0097B2]" />
      </div>

      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Set Up Authenticator
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Scan the QR code with your authenticator app
        </p>
      </div>

      {phase === "scan" && (
        <>
          {/* QR code */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrCodeDataUrl}
              alt="MFA QR Code"
              width={200}
              height={200}
              className="mx-auto"
            />
          </div>

          {/* Manual secret */}
          <div className="w-full max-w-xs">
            <p className="text-xs text-gray-400 text-center mb-1">
              Or enter this key manually:
            </p>
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
              <code className="text-xs font-mono text-gray-700 flex-1 break-all select-all">
                {secret}
              </code>
              <button
                type="button"
                onClick={handleCopySecret}
                className="text-gray-400 hover:text-[#0097B2] cursor-pointer flex-shrink-0"
                title="Copy"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPhase("confirm")}
            className="bg-[#0097B2] text-white w-full max-w-xs py-2 px-4 rounded-lg
                       hover:bg-[#007a94] cursor-pointer text-sm"
          >
            I&apos;ve scanned the QR code
          </button>
        </>
      )}

      {phase === "confirm" && (
        <>
          <p className="text-sm text-gray-600 text-center">
            Enter the 6-digit code shown in your authenticator app to confirm:
          </p>

          <MfaCodeInput onComplete={handleCodeComplete} disabled={isSubmitting} />

          {isSubmitting && (
            <p className="text-sm text-gray-500 animate-pulse">Activating MFA...</p>
          )}

          <button
            type="button"
            onClick={() => setPhase("scan")}
            className="text-sm text-gray-500 hover:underline cursor-pointer"
          >
            Go back to QR code
          </button>
        </>
      )}
    </div>
  );
}
