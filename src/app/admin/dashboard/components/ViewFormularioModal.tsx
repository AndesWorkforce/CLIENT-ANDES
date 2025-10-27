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

  // Claves canónicas (deben coincidir con cómo el formulario guarda las respuestas)
  const Q_NAME = "What is your preferred first and last name?";
  const Q_WHATSAPP = "What phone number do you use for WhatsApp?";
  const Q_CITY_COUNTRY = "In which city and country do you live?";
  const Q_REFERRED = "Have you been referred by someone?";
  const Q_REFERRER_NAME = "Referrer Name";
  const Q_GMAIL =
    "If you have a Gmail email address, what is it? (Some training documents are most easily shared with google accounts.)";
  const Q_THREE_WORDS = "What 3 words best describe you and why?";
  const Q_UNIQUE_QUALITIES =
    "What unique qualities make your services stand out?";
  const Q_PREV_EXPERIENCE =
    "Please write a few sentences about any previous experiences you have had doing services like Customer Service, Call Center, or Administrative Assistance";
  const Q_ENGLISH_CALLS =
    "On a scale of 1-10, how comfortable are you with making and/or taking calls with native English speakers? Please explain your answer.";
  const Q_COMPUTER_TYPE = "What type of computer do you use?";
  const Q_RAM = "How much RAM is available on your computer?";
  const Q_MONITORS = "How many monitors do you currently have/use for work?";
  const Q_HEADSET_HAVE =
    "What type of headset do you currently have? How does it connect with your computer?";
  const Q_ISP = "What Internet provider do you use?";
  const Q_PROVIDER_URL = "What is the URL for their website?";
  const Q_WIRED = "Do you use a wired internet connection?";

  // Lista de preguntas mostrando el label para UI y usando la clave canónica para leer datos
  const ordenPreguntas: Array<{ label: string; key: string }> = [
    { label: Q_NAME, key: Q_NAME },
    { label: Q_WHATSAPP, key: Q_WHATSAPP },
    { label: Q_CITY_COUNTRY, key: Q_CITY_COUNTRY },
    { label: Q_REFERRED, key: Q_REFERRED },
    { label: Q_GMAIL, key: Q_GMAIL },
    { label: Q_THREE_WORDS, key: Q_THREE_WORDS },
    {
      // Mantenemos el ejemplo SOLO como label visible
      label:
        "What unique qualities make your services stand out?*Example: punctuality, quality control, proactivity, excellent customer service.",
      key: Q_UNIQUE_QUALITIES,
    },
    { label: Q_PREV_EXPERIENCE, key: Q_PREV_EXPERIENCE },
    { label: Q_ENGLISH_CALLS, key: Q_ENGLISH_CALLS },
    { label: Q_COMPUTER_TYPE, key: Q_COMPUTER_TYPE },
    { label: Q_RAM, key: Q_RAM },
    { label: Q_MONITORS, key: Q_MONITORS },
    { label: Q_HEADSET_HAVE, key: Q_HEADSET_HAVE },
    { label: Q_ISP, key: Q_ISP },
    { label: Q_PROVIDER_URL, key: Q_PROVIDER_URL },
    { label: Q_WIRED, key: Q_WIRED },
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
          {ordenPreguntas.map(({ label, key }, index) => {
            // Manejo especial para la pregunta de referidos
            if (key === Q_REFERRED) {
              const wasReferred =
                datosFormulario[key] === "Yes" || datosFormulario[key] === true;
              const referrerName = datosFormulario[Q_REFERRER_NAME] || "";

              return (
                <div
                  key={index}
                  className="space-y-2 pb-4 border-b border-gray-100 last:border-0"
                >
                  <h3 className="text-sm font-medium text-gray-900">{label}</h3>
                  <div className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700">
                    {wasReferred ? "Yes" : "No"}
                    {wasReferred && referrerName && (
                      <div className="mt-2 text-sm">
                        <strong>Referred by:</strong> {referrerName}
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            // Renderizado normal para otras preguntas
            return (
              <div
                key={index}
                className="space-y-2 pb-4 border-b border-gray-100 last:border-0"
              >
                <h3 className="text-sm font-medium text-gray-900">{label}</h3>
                <div className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 whitespace-pre-wrap">
                  {datosFormulario[key] || "Not answered"}
                </div>
              </div>
            );
          })}
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
