import React from "react";

interface RecipientProgressBarProps {
  recipients: { id: string; orden: number; estado: string; email: string }[];
}

export const RecipientProgressBar: React.FC<RecipientProgressBarProps> = ({
  recipients,
}) => {
  const total = recipients.length;
  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium">Progreso de firmas</div>
      <div className="flex flex-col gap-1">
        {recipients
          .sort((a, b) => a.orden - b.orden)
          .map((r) => (
            <div key={r.id} className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  r.estado === "SIGNED"
                    ? "bg-green-600"
                    : r.estado === "VIEWED"
                    ? "bg-yellow-500"
                    : "bg-gray-400"
                }`}
              />
              <span className="text-xs">
                #{r.orden} {r.email}
              </span>
              <span className="text-xs ml-auto">{r.estado}</span>
            </div>
          ))}
      </div>
      <div className="text-xs text-gray-500">
        {recipients.filter((r) => r.estado === "SIGNED").length}/{total}{" "}
        firmados
      </div>
    </div>
  );
};
