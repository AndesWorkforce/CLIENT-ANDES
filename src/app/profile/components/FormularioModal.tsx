"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";

interface FormularioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function FormularioModal({
  isOpen,
  onClose,
  onSave,
}: FormularioModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [computerType, setComputerType] = useState<string>("");
  const [otherComputerText, setOtherComputerText] = useState<string>("");

  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Si el tipo de computadora es "other", incluir el texto en los datos del formulario
    // Aquí podríamos agregar lógica para capturar todos los datos del formulario
    onSave();
    onClose();
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
          <h2 className="text-lg font-medium w-full text-center">Formulario</h2>
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
                />
                <label htmlFor="other-computer">Other:</label>
                <input
                  type="text"
                  className="ml-2 p-1 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                  disabled={computerType !== "other"}
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
                />
                <label htmlFor="yes-wired">Yes</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="no-wired"
                  name="wired-connection"
                  className="mr-2"
                />
                <label htmlFor="no-wired">No</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="sometimes-wired"
                  name="wired-connection"
                  className="mr-2"
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
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              What type of headset do you currently want? How does it connect
              with your computer?
              <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={2}
              required
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              What makes you the best candidate for this position?
              <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
              required
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              What 3 words best describe you and why?
              <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
              required
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Please write a few sentences about any previous experience you
              have had with making and/or taking calls.
              <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
              required
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              On a scale of 1-10, how comfortable are you with making calls with
              native English speakers? Please explain your rating.
              <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
              required
            ></textarea>
          </div>

          <div className="pt-4 flex flex-col items-center space-y-3">
            <button
              type="submit"
              className="w-full bg-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-400 transition-colors font-medium cursor-pointer"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-[#0097B2] py-2 hover:underline cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
