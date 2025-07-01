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

  // Orden específico de las preguntas
  const ordenPreguntas = [
    "What is your preferred first and last name?",
    "What phone number do you use for WhatsApp?",
    "In what city and country do you reside?",
    "If you have a Gmail email address, what is it? (Some training documents are most easily shared with google accounts.)",
    "What 3 words best describe you and why?",
    "What unique qualities make your services stand out?*Example: punctuality, quality control, proactivity, excellent customer service.",
    "Please write a few sentences about any previous experiences you have had doing services like Customer Service, Call Center, or Administrative Assistance",
    "On a scale of 1-10, how comfortable are you with making and/or taking calls with native English speakers? Please explain your answer.",
    "What type of computer do you use?",
    "How much RAM is available on your computer?",
    "How many monitors do you currently have/use for work?",
    "What type of headset do you currently have? How does it connect with your computer?",
    "What Internet provider do you use?",
    "What is the URL for their website?",
    "Do you use a wired internet connection?",
  ];

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
          {ordenPreguntas.map((pregunta, index) => (
            <div
              key={index}
              className="space-y-2 pb-4 border-b border-gray-100 last:border-0"
            >
              <h3 className="text-sm font-medium text-gray-900">{pregunta}</h3>
              <div className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 whitespace-pre-wrap">
                {datosFormulario[pregunta] || "Not answered"}
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
