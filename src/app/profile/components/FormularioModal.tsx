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
}

export default function FormularioModal({
  isOpen,
  onClose,
  datosFormulario = null,
  readOnly = false,
}: FormularioModalProps) {
  const { user } = useAuthStore();
  const modalRef = useRef<HTMLDivElement>(null);
  const [computerType, setComputerType] = useState<string>("");
  const [otherComputerText, setOtherComputerText] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [wiredConnection, setWiredConnection] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [missingFieldsCount, setMissingFieldsCount] = useState<number>(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<Record<string, any>>({});

  const validateForm = () => {
    const requiredQuestions = [
      "What is your preferred first and last name?",
      "If you have a Gmail email address, what is it? (Some training documents are most easily shared with google accounts.)",
      "What phone number do you use for WhatsApp?",
      "In what city and country do you reside?",
      "What type of computer do you use?",
      "What Internet provider do you use?",
      "What is the URL for their website?",
      "Do you use a wired internet connection?",
      "Please run a speed test on your computer: what is the current upload speed?",
      "Please run a speed test on your computer: what is the current download speed?",
      "How much RAM is available on your computer?",
      "How many monitors do you currently have/use for work?",
      "What type of headset do you currently have? How does it connect with your computer?",
      "What unique qualities make your service stand out?",
      "What 3 words best describe you and why?",
      "Please write a few sentences about any previous experiences you have had doing services like Customer Service, Call Center, or Administrative Assistance",
      "On a scale of 1-10, how comfortable are you with making and/or taking calls with native English speakers?  Please explain your answer.",
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

      // Resto de campos
      const isValid = formData[question] && formData[question].trim() !== "";
      if (!isValid) missingFields.push(question);
      return isValid;
    });

    // Para ayudar en la depuración, mostrar campos faltantes en la consola
    if (missingFields.length > 0) {
      console.log("Missing fields:", missingFields);
      // Actualizamos el contador de campos faltantes
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
      if (
        datosFormulario[
          "What type of headset do you currently want? How does it connect with your computer?"
        ]
      ) {
        formDataCleaned["What unique qualities make your service stand out?"] =
          datosFormulario[
            "What type of headset do you currently want? How does it connect with your computer?"
          ];
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
    }

    // Validar el formulario después de cargar datos
    setTimeout(validateForm, 100);
  }, [datosFormulario]);

  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleInputChange = (question: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [question]: value,
    }));

    setTimeout(validateForm, 0);
  };

  useEffect(() => {
    validateForm();
  }, [computerType, otherComputerText, wiredConnection]);

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

      // Llamar a la acción del servidor
      const result = await guardarDatosFormulario(
        user?.id || "",
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-[#08252A33] z-50 flex items-center justify-center p-4"
      onClick={handleClickOutside}
    >
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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              In what city and country do you reside?
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={readOnly}
              value={formData["In what city and country do you reside?"] || ""}
              onChange={(e) =>
                handleInputChange(
                  "In what city and country do you reside?",
                  e.target.value
                )
              }
            />
          </div>

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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Please run a speed test on your computer: what is the current
              upload speed?
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={readOnly}
              value={
                formData[
                  "Please run a speed test on your computer: what is the current upload speed?"
                ] || ""
              }
              onChange={(e) =>
                handleInputChange(
                  "Please run a speed test on your computer: what is the current upload speed?",
                  e.target.value
                )
              }
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Please run a speed test on your computer: what is the current
              download speed?
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={readOnly}
              value={
                formData[
                  "Please run a speed test on your computer: what is the current download speed?"
                ] || ""
              }
              onChange={(e) =>
                handleInputChange(
                  "Please run a speed test on your computer: what is the current download speed?",
                  e.target.value
                )
              }
            />
          </div>

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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              What unique qualities make your service stand out?
              <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={2}
              required
              disabled={readOnly}
              value={
                formData[
                  "What unique qualities make your service stand out?"
                ] || ""
              }
              onChange={(e) =>
                handleInputChange(
                  "What unique qualities make your service stand out?",
                  e.target.value
                )
              }
            ></textarea>
          </div>

          {/* <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              What makes you the best candidate for this position?
              <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
              required
              disabled={readOnly}
              value={
                formData[
                  "What makes you the best candidate for this position?"
                ] || ""
              }
              onChange={(e) =>
                handleInputChange(
                  "What makes you the best candidate for this position?",
                  e.target.value
                )
              }
            ></textarea>
          </div> */}

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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              On a scale of 1-10, how comfortable are you with making and/or
              taking calls with native English speakers? Please explain your
              answer.
              <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
              required
              disabled={readOnly}
              value={
                formData[
                  "On a scale of 1-10, how comfortable are you with making and/or taking calls with native English speakers?  Please explain your answer."
                ] || ""
              }
              onChange={(e) =>
                handleInputChange(
                  "On a scale of 1-10, how comfortable are you with making and/or taking calls with native English speakers?  Please explain your answer.",
                  e.target.value
                )
              }
            ></textarea>
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
