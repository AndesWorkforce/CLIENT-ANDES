"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import MfaCodeInput from "./MfaCodeInput";
import { mfaRecoveryVerifyAction } from "../../actions/mfa.actions";

interface MfaRecoveryStepProps {
  correo: string;
  onSetupToken: (setupToken: string) => void;
  onError: (message: string) => void;
  onBack: () => void;
}

export default function MfaRecoveryStep({
  correo,
  onSetupToken,
  onError,
  onBack,
}: MfaRecoveryStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCodeComplete = async (code: string) => {
    setIsSubmitting(true);
    const result = await mfaRecoveryVerifyAction(correo, code);
    setIsSubmitting(false);

    if (result.success && result.data?.setupToken) {
      onSetupToken(result.data.setupToken);
    } else {
      onError(result.error || "Invalid recovery code");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-50">
        <Mail size={32} className="text-orange-500" />
      </div>

      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Email Recovery
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          A recovery code has been sent to{" "}
          <span className="font-medium text-gray-700">{correo}</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          The code expires in 15 minutes
        </p>
      </div>

      <MfaCodeInput onComplete={handleCodeComplete} disabled={isSubmitting} />

      {isSubmitting && (
        <p className="text-sm text-gray-500 animate-pulse">Verifying...</p>
      )}

      <button
        type="button"
        onClick={onBack}
        className="text-sm text-gray-500 hover:underline cursor-pointer mt-4"
      >
        Back to authenticator code
      </button>
    </div>
  );
}
