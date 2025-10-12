"use client";

import { useRef, useState, useEffect } from "react";
import { X } from "lucide-react";
import { guardarDatosFormulario } from "../actions/formulario.actions";
import { useAuthStore } from "@/store/auth.store";

interface FormularioModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  datosFormulario?: Record<string, any> | null;
  readOnly?: boolean;
  candidateId?: string;
}

// Claves canónicas para preguntas con variantes
const Q_UNIQUE_QUALITIES =
  "What unique qualities make your services stand out?";
const Q_ENGLISH_CALLS =
  "On a scale of 1-10, how comfortable are you with making and/or taking calls with native English speakers? Please explain your answer.";

export default function FormularioModal({
  isOpen,
  onClose,
  datosFormulario = null,
  readOnly = false,
  candidateId,
}: FormularioModalProps) {
  const { user } = useAuthStore();
  const modalRef = useRef<HTMLDivElement>(null);
  const [computerType, setComputerType] = useState<string>("");
  const [otherComputerText, setOtherComputerText] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [wiredConnection, setWiredConnection] = useState<string>("");
  const [hasReferrer, setHasReferrer] = useState<string>("");
  const [referrerName, setReferrerName] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [missingFieldsCount, setMissingFieldsCount] = useState<number>(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<Record<string, any>>({});

  const validateForm = () => {
    const requiredQuestions = [
      "What is your preferred first and last name?",
      "What phone number do you use for WhatsApp?",
      "In which city and country do you live?",
      "Have you been referred by someone?",
      "If you have a Gmail email address, what is it? (Some training documents are most easily shared with google accounts.)",
      "What 3 words best describe you and why?",
      Q_UNIQUE_QUALITIES,
      "Please write a few sentences about any previous experiences you have had doing services like Customer Service, Call Center, or Administrative Assistance",
      Q_ENGLISH_CALLS,
      "What type of computer do you use?",
      "How much RAM is available on your computer?",
      "How many monitors do you currently have/use for work?",
      "What type of headset do you currently have? How does it connect with your computer?",
      "What Internet provider do you use?",
      "What is the URL for their website?",
      "Do you use a wired internet connection?",
    ];

    // Lista para guardar campos incompletos
    const missingFields: string[] = [];

    // Verificar que todos los campos tengan valor
    const allFieldsValid = requiredQuestions.every((question) => {
      // Casos especiales
      if (question === "What type of computer do you use?") {
        const isValid =
          computerType !== "" &&
          (computerType !== "other" || otherComputerText.trim() !== "");
        if (!isValid) missingFields.push(question);
        return isValid;
      }
      if (question === "Do you use a wired internet connection?") {
        const isValid = wiredConnection !== "";
        if (!isValid) missingFields.push(question);
        return isValid;
      }
      if (question === "Have you been referred by someone?") {
        const isValid = hasReferrer !== "";
        if (!isValid) missingFields.push(question);
        return isValid;
      }

      // Resto de campos
      const isValid = formData[question] && formData[question].trim() !== "";
      if (!isValid) missingFields.push(question);
      return isValid;
    });

    if (missingFields.length > 0) {
      console.log("Missing fields:", missingFields);
      setMissingFieldsCount(missingFields.length);
    } else {
      setMissingFieldsCount(0);
    }

    setIsFormValid(allFieldsValid);
  };

  useEffect(() => {
    if (datosFormulario) {
      // Crear una versión limpia de los datos para asegurar que coincidan con las claves exactas
      const formDataCleaned = { ...formData };

      // Mapear los nombres antiguos de campos a los nuevos si es necesario
      // 1) Algunas cuentas antiguas tenían esta pregunta mal mapeada al texto de "headset want"
      const legacyQualitiesKey =
        "What type of headset do you currently want? How does it connect with your computer?";
      if (datosFormulario[legacyQualitiesKey]) {
        formDataCleaned[Q_UNIQUE_QUALITIES] =
          datosFormulario[legacyQualitiesKey];
      }
      // 2) Variantes con doble espacio antes de "Please" u otras pequeñas diferencias
      const englishScaleVariant =
        "On a scale of 1-10, how comfortable are you with making and/or taking calls with native English speakers?  Please explain your answer."; // doble espacio
      if (
        datosFormulario[englishScaleVariant] &&
        !datosFormulario[Q_ENGLISH_CALLS]
      ) {
        formDataCleaned[Q_ENGLISH_CALLS] = datosFormulario[englishScaleVariant];
      }

      // Combinar con el resto de datos existentes
      setFormData({
        ...datosFormulario,
        ...formDataCleaned,
      });

      // Establecer valores específicos para campos con lógica adicional
      if (datosFormulario["What type of computer do you use?"]) {
        const computerValue =
          datosFormulario["What type of computer do you use?"];
        if (computerValue.startsWith("Other:")) {
          setComputerType("other");
          setOtherComputerText(computerValue.replace("Other:", "").trim());
        } else {
          setComputerType(computerValue);
        }
      }

      if (datosFormulario["Do you use a wired internet connection?"]) {
        setWiredConnection(
          datosFormulario["Do you use a wired internet connection?"]
        );
      }

      if (datosFormulario["Have you been referred by someone?"]) {
        setHasReferrer(datosFormulario["Have you been referred by someone?"]);
      }

      if (datosFormulario["Referrer Name"]) {
        setReferrerName(datosFormulario["Referrer Name"]);
      }
    }

    // Validar el formulario después de cargar datos
    setTimeout(validateForm, 100);
  }, [datosFormulario]);

  const handleInputChange = (question: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [question]: value,
    }));

    setTimeout(validateForm, 0);
  };

  useEffect(() => {
    validateForm();
  }, [
    computerType,
    otherComputerText,
    wiredConnection,
    hasReferrer,
    referrerName,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (readOnly) return;

    try {
      setIsSubmitting(true);

      const formFields = e.target as HTMLFormElement;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const completeFormData: Record<string, any> = {};

      const inputElements = formFields.querySelectorAll(
        'input:not([type="radio"]), textarea'
      );
      inputElements.forEach((el: Element) => {
        const element = el as HTMLInputElement | HTMLTextAreaElement;
        const labelElement = element
          .closest("div.space-y-2")
          ?.querySelector("label");

        if (labelElement) {
          const question =
            labelElement.textContent?.replace(/\*$/, "").trim() || "";
          if (question && element.value) {
            completeFormData[question] = element.value;
          }
        }
      });

      // Capturar el tipo de computadora
      if (computerType) {
        const question = "What type of computer do you use?";
        completeFormData[question] =
          computerType === "other"
            ? `Other: ${otherComputerText}`
            : computerType;
      }

      // Capturar la conexión por cable
      if (wiredConnection) {
        completeFormData["Do you use a wired internet connection?"] =
          wiredConnection;
      }

      // Capturar la información de referidos
      if (hasReferrer) {
        completeFormData["Have you been referred by someone?"] = hasReferrer;
        if (hasReferrer === "Yes" && referrerName) {
          completeFormData["Referrer Name"] = referrerName;
        }
      }

      // Llamar a la acción del servidor
      const result = await guardarDatosFormulario(
        candidateId || user?.id || "",
        completeFormData
      );
      if (result.success) {
        // Llamar a onSave para actualizar la UI
        onClose();
      } else {
        throw new Error(
          result.error || "Error desconocido al guardar el formulario"
        );
      }
    } catch (error) {
      console.error("Error al guardar el formulario:", error);
      alert(
        "Ocurrió un error al guardar el formulario. Por favor, intenta de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log(
    "\n\n [FormularioModal] datosFormulario",
    datosFormulario,
    "\n\n"
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#08252A33] z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg shadow-lg custom-scrollbar"
      >
        <div className="flex items-center p-4 relative">
          <h2 className="text-lg font-medium w-full text-center">Form</h2>
          <button onClick={onClose} className="absolute right-4 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Nombre */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              What is your preferred first and last name?
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={readOnly}
              value={
                formData["What is your preferred first and last name?"] || ""
              }
              onChange={(e) =>
                handleInputChange(
                  "What is your preferred first and last name?",
                  e.target.value
                )
              }
            />
          </div>

          {/* WhatsApp */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              What phone number do you use for WhatsApp?
              <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={readOnly}
              value={
                formData["What phone number do you use for WhatsApp?"] || ""
              }
              onChange={(e) =>
                handleInputChange(
                  "What phone number do you use for WhatsApp?",
                  e.target.value
                )
              }
            />
          </div>

          {/* Ciudad y País */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              In which city and country do you live?
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={readOnly}
              value={formData["In which city and country do you live?"] || ""}
              onChange={(e) =>
                handleInputChange(
                  "In which city and country do you live?",
                  e.target.value
                )
              }
            />
          </div>

          {/* Pregunta de referidos */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Have you been referred by someone?
              <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="yes-referrer"
                  name="has-referrer"
                  className="mr-2"
                  required
                  value="Yes"
                  checked={hasReferrer === "Yes"}
                  onChange={() => setHasReferrer("Yes")}
                  disabled={readOnly}
                />
                <label htmlFor="yes-referrer">Yes</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="no-referrer"
                  name="has-referrer"
                  className="mr-2"
                  value="No"
                  checked={hasReferrer === "No"}
                  onChange={() => setHasReferrer("No")}
                  disabled={readOnly}
                />
                <label htmlFor="no-referrer">No</label>
              </div>
            </div>

            {/* Campo de nombre del referido (solo si es Yes) */}
            {hasReferrer === "Yes" && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-600">
                  Name of the person who referred you:
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md mt-1"
                  placeholder="Enter the referrer's name"
                  disabled={readOnly}
                  value={referrerName}
                  onChange={(e) => setReferrerName(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Gmail */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              If you have a Gmail email address, what is it? <br />
              (Some training documents are most easily shared with google
              accounts.)
              <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={readOnly}
              value={
                formData[
                  "If you have a Gmail email address, what is it? (Some training documents are most easily shared with google accounts.)"
                ] || ""
              }
              onChange={(e) =>
                handleInputChange(
                  "If you have a Gmail email address, what is it? (Some training documents are most easily shared with google accounts.)",
                  e.target.value
                )
              }
            />
          </div>

          {/* 3 palabras */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              What 3 words best describe you and why?
              <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
              required
              disabled={readOnly}
              value={formData["What 3 words best describe you and why?"] || ""}
              onChange={(e) =>
                handleInputChange(
                  "What 3 words best describe you and why?",
                  e.target.value
                )
              }
            ></textarea>
          </div>

          {/* Cualidades únicas */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {Q_UNIQUE_QUALITIES}
              <span className="text-red-500">*</span>
              <br />
              <span className="text-gray-400">
                Example: punctuality, quality control, proactivity, excellent
                customer service.
              </span>
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={2}
              required
              disabled={readOnly}
              value={formData[Q_UNIQUE_QUALITIES] || ""}
              onChange={(e) =>
                handleInputChange(Q_UNIQUE_QUALITIES, e.target.value)
              }
            ></textarea>
          </div>

          {/* Experiencia previa */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Please write a few sentences about any previous experiences you
              have had doing services like Customer Service, Call Center, or
              Administrative Assistance
              <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
              required
              disabled={readOnly}
              value={
                formData[
                  "Please write a few sentences about any previous experiences you have had doing services like Customer Service, Call Center, or Administrative Assistance"
                ] || ""
              }
              onChange={(e) =>
                handleInputChange(
                  "Please write a few sentences about any previous experiences you have had doing services like Customer Service, Call Center, or Administrative Assistance",
                  e.target.value
                )
              }
            ></textarea>
          </div>

          {/* Nivel de inglés */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {Q_ENGLISH_CALLS}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
              required
              disabled={readOnly}
              value={formData[Q_ENGLISH_CALLS] || ""}
              onChange={(e) =>
                handleInputChange(Q_ENGLISH_CALLS, e.target.value)
              }
            ></textarea>
          </div>

          {/* Tipo de computadora */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              What type of computer do you use?
              <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="pc-laptop"
                  name="computer-type"
                  className="mr-2"
                  required
                  value="pc-laptop"
                  onChange={() => setComputerType("pc-laptop")}
                  checked={computerType === "pc-laptop"}
                  disabled={readOnly}
                />
                <label htmlFor="pc-laptop">PC Laptop</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="pc-desktop"
                  name="computer-type"
                  className="mr-2"
                  value="pc-desktop"
                  onChange={() => setComputerType("pc-desktop")}
                  checked={computerType === "pc-desktop"}
                  disabled={readOnly}
                />
                <label htmlFor="pc-desktop">PC Desktop</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="mac-laptop"
                  name="computer-type"
                  className="mr-2"
                  value="mac-laptop"
                  onChange={() => setComputerType("mac-laptop")}
                  checked={computerType === "mac-laptop"}
                  disabled={readOnly}
                />
                <label htmlFor="mac-laptop">Mac Laptop</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="mac-desktop"
                  name="computer-type"
                  className="mr-2"
                  value="mac-desktop"
                  onChange={() => setComputerType("mac-desktop")}
                  checked={computerType === "mac-desktop"}
                  disabled={readOnly}
                />
                <label htmlFor="mac-desktop">Mac Desktop</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="other-computer"
                  name="computer-type"
                  className="mr-2"
                  value="other"
                  onChange={() => setComputerType("other")}
                  checked={computerType === "other"}
                  disabled={readOnly}
                />
                <label htmlFor="other-computer">Other:</label>
                <input
                  type="text"
                  className="ml-2 p-1 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                  disabled={computerType !== "other" || readOnly}
                  value={otherComputerText}
                  onChange={(e) => setOtherComputerText(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* RAM */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              How much RAM is available on your computer?
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={readOnly}
              value={
                formData["How much RAM is available on your computer?"] || ""
              }
              onChange={(e) =>
                handleInputChange(
                  "How much RAM is available on your computer?",
                  e.target.value
                )
              }
            />
          </div>

          {/* Monitores */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              How many monitors do you currently have/use for work?
              <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={readOnly}
              value={
                formData[
                  "How many monitors do you currently have/use for work?"
                ] || ""
              }
              onChange={(e) =>
                handleInputChange(
                  "How many monitors do you currently have/use for work?",
                  e.target.value
                )
              }
            />
          </div>

          {/* Headset */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              What type of headset do you currently have? How does it connect
              with your computer?
              <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={2}
              required
              disabled={readOnly}
              value={
                formData[
                  "What type of headset do you currently have? How does it connect with your computer?"
                ] || ""
              }
              onChange={(e) =>
                handleInputChange(
                  "What type of headset do you currently have? How does it connect with your computer?",
                  e.target.value
                )
              }
            ></textarea>
          </div>

          {/* Proveedor de Internet */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              What Internet provider do you use?
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={readOnly}
              value={formData["What Internet provider do you use?"] || ""}
              onChange={(e) =>
                handleInputChange(
                  "What Internet provider do you use?",
                  e.target.value
                )
              }
            />
          </div>

          {/* URL del proveedor */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              What is the URL for their website?
              <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={readOnly}
              value={formData["What is the URL for their website?"] || ""}
              onChange={(e) =>
                handleInputChange(
                  "What is the URL for their website?",
                  e.target.value
                )
              }
            />
          </div>

          {/* Conexión por cable */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Do you use a wired internet connection?
              <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="yes-wired"
                  name="wired-connection"
                  className="mr-2"
                  required
                  value="Yes"
                  checked={wiredConnection === "Yes"}
                  onChange={() => setWiredConnection("Yes")}
                  disabled={readOnly}
                />
                <label htmlFor="yes-wired">Yes</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="no-wired"
                  name="wired-connection"
                  className="mr-2"
                  value="No"
                  checked={wiredConnection === "No"}
                  onChange={() => setWiredConnection("No")}
                  disabled={readOnly}
                />
                <label htmlFor="no-wired">No</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="sometimes-wired"
                  name="wired-connection"
                  className="mr-2"
                  value="Sometimes"
                  checked={wiredConnection === "Sometimes"}
                  onChange={() => setWiredConnection("Sometimes")}
                  disabled={readOnly}
                />
                <label htmlFor="sometimes-wired">Sometimes</label>
              </div>
            </div>
          </div>

          {!readOnly && (
            <div className="pt-4 flex flex-col items-center space-y-3">
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`w-full py-3 px-6 rounded-md transition-colors font-medium cursor-pointer ${
                  !isFormValid || isSubmitting
                    ? "bg-gray-300 text-gray-700 opacity-70"
                    : "bg-[#0097B2] text-white hover:bg-[#007d91]"
                }`}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>

              {!isFormValid && (
                <p className="text-sm text-amber-600 text-center">
                  Please complete all required fields to enable the save button.
                  {missingFieldsCount > 0 &&
                    ` Missing ${missingFieldsCount} fields.`}
                </p>
              )}

              <button
                type="button"
                onClick={onClose}
                className="text-[#0097B2] py-2 hover:underline cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}

          {readOnly && (
            <div className="pt-4 flex flex-col items-center">
              <button
                type="button"
                onClick={onClose}
                className="text-[#0097B2] py-2 hover:underline cursor-pointer"
              >
                Close
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
