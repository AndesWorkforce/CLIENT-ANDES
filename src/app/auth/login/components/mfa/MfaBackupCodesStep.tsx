"use client";

import { useState } from "react";
import { ShieldAlert, Copy, Check, Download } from "lucide-react";

interface MfaBackupCodesStepProps {
  backupCodes: string[];
  onConfirm: () => void;
}

export default function MfaBackupCodesStep({
  backupCodes,
  onConfirm,
}: MfaBackupCodesStepProps) {
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const codesText = backupCodes.join("\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codesText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available */
    }
  };

  const handleDownload = () => {
    const blob = new Blob(
      [`Andes Admin Hub - MFA Backup Codes\n${"=".repeat(40)}\n\n${codesText}\n\nKeep these codes in a safe place.\nEach code can only be used once.\n`],
      { type: "text/plain" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "andes-mfa-backup-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center space-y-5">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-50">
        <ShieldAlert size={32} className="text-amber-500" />
      </div>

      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Save Your Backup Codes
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Store these codes in a safe place. Each code can only be used once.
        </p>
      </div>

      {/* Backup codes grid */}
      <div className="w-full max-w-sm bg-gray-50 rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-2 gap-2">
          {backupCodes.map((code, i) => (
            <div
              key={i}
              className="text-center font-mono text-sm text-gray-700 bg-white rounded-md py-1.5 px-2 border border-gray-100"
            >
              {code}
            </div>
          ))}
        </div>
      </div>

      {/* Copy / Download buttons */}
      <div className="flex gap-3 w-full max-w-sm">
        <button
          type="button"
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm
                     border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
        >
          {copied ? (
            <>
              <Check size={16} className="text-green-500" /> Copied
            </>
          ) : (
            <>
              <Copy size={16} /> Copy all
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm
                     border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
        >
          <Download size={16} /> Download
        </button>
      </div>

      {/* Confirmation checkbox */}
      <label className="flex items-start gap-2 w-full max-w-sm cursor-pointer">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-0.5 h-4 w-4 text-[#0097B2] accent-[#0097B2]"
        />
        <span className="text-sm text-gray-600">
          I have saved these backup codes in a safe place
        </span>
      </label>

      <button
        type="button"
        onClick={onConfirm}
        disabled={!confirmed}
        className="bg-[#0097B2] text-white w-full max-w-sm py-2.5 px-4 rounded-lg text-sm
                   hover:bg-[#007a94] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        Continue to login
      </button>
    </div>
  );
}
