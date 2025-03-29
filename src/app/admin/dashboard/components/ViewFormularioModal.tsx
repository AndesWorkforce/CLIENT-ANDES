import { X } from "lucide-react";

interface ViewFormularioModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  datosFormulario: Record<string, any>;
  name: string;
}

export default function ViewFormularioModal({
  isOpen,
  onClose,
  datosFormulario,
  name,
}: ViewFormularioModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#08252A33]">
      <div className="bg-white w-full max-w-3xl mx-auto max-h-[90vh] overflow-y-auto rounded-lg shadow-lg custom-scrollbar">
        <div className="flex items-center p-4 relative">
          <h2 className="text-lg text-[#0097B2] font-medium w-full text-left">{`Form ${name}`}</h2>
          <button onClick={onClose} className="absolute right-4 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {Object.entries(datosFormulario).map(([question, answer], index) => (
            <div
              key={index}
              className="space-y-2 pb-4 border-b border-gray-100 last:border-0"
            >
              <h3 className="text-sm font-medium text-gray-900">{question}</h3>
              <div className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 whitespace-pre-wrap">
                {answer}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 flex justify-center">
          <button
            onClick={onClose}
            className="text-[#0097B2] hover:text-[#0097B2] py-2 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
