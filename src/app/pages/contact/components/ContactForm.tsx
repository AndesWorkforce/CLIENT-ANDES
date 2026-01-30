"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Instagram, Facebook } from "lucide-react";

import {
  contactFormSchema,
  type ContactFormValues,
} from "../schema/contact-schema";
// import { submitContactForm } from "../actions/contact-actions";
import { submitContactFormMicrosoft } from "../actions/microsoft-email-actions";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formResponse, setFormResponse] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [countryCode, setCountryCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      smsConsent: false,
      service: undefined,
      message: "",
    },
    mode: "onChange",
  });

  // Cuando cambie cualquiera de los dos inputs, actualizar el valor en el formulario
  useEffect(() => {
    // Concatenar código de país y número
    setValue("phone", `${countryCode}${phoneNumber}` || "");
  }, [countryCode, phoneNumber, setValue]);

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setFormResponse(null);

    try {
      // Asegurar que phone y smsConsent nunca sean undefined
      const formData = {
        ...data,
        phone: data.phone || "",
        smsConsent: !!data.smsConsent,
      };

      // const response = await submitContactForm(formData);
      const response = await submitContactFormMicrosoft(formData);
      setFormResponse(response);

      if (response.success) {
        // Track Google Ads conversion event
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'ads_conversion_Contact_1', {});
        }
        
        reset();
        setCountryCode("");
        setPhoneNumber("");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormResponse({
        success: false,
        message: "An error occurred while sending the form. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-4xl">
      {/* Sección de título */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#08252A] mb-2">
          Get in Touch!
        </h1>
        <p className="text-[#08252A]">We are here for you! How can we help?</p>
      </div>

      {formResponse && (
        <div
          className={`p-4 mb-6 rounded ${
            formResponse.success
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {formResponse.message}
        </div>
      )}

      {/* Formulario de contacto */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6"
      >
        {/* Primera columna */}
        <div>
          <label
            htmlFor="firstName"
            className="block text-[#0097B2] font-medium mb-1"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            placeholder="Enter your first name"
            className={`w-full px-3 py-2 border-b ${
              errors.firstName ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:border-b-2 focus:border-[#0097B2]`}
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.firstName.message}
            </p>
          )}
        </div>

        {/* Segunda columna */}
        <div>
          <label
            htmlFor="lastName"
            className="block text-[#0097B2] font-medium mb-1"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            placeholder="Enter your last name"
            className={`w-full px-3 py-2 border-b ${
              errors.lastName ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:border-b-2 focus:border-[#0097B2]`}
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.lastName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-[#0097B2] font-medium mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            className={`w-full px-3 py-2 border-b ${
              errors.email ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:border-b-2 focus:border-[#0097B2]`}
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label
            htmlFor="phone"
            className="block text-[#0097B2] font-medium mb-1"
          >
            Phone Number
          </label>
          <div className="flex">
            <div className="flex-shrink-0">
              <input
                type="text"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                placeholder="+54"
                className="w-14 px-3 py-2 border-b border-gray-300 mr-2 focus:outline-none focus:border-b-2 focus:border-[#0097B2]"
              />
            </div>
            <input
              type="tel"
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              className={`flex-grow px-3 py-2 border-b ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:border-b-2 focus:border-[#0097B2]`}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
          <div className="mt-1">
            <label className="inline-flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-[#0097B2]"
                {...register("smsConsent")}
              />
              <span className="ml-2 text-[#B6B4B4]">
                Opt-in to receive sms messages
              </span>
            </label>
          </div>
        </div>

        {/* Selección de servicio - abarca dos columnas en móvil */}
        <div className="md:col-span-2">
          <p className="block text-[#0097B2] font-medium mb-2">
            Select a Service
          </p>
          <div className="space-y-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-[#0097B2]"
                value="talent"
                {...register("service")}
              />
              <span className="ml-2 text-[#B6B4B4]">
                I&apos;m looking for a talent/service
              </span>
            </label>
            <div>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-[#0097B2]"
                  value="job"
                  {...register("service")}
                />
                <span className="ml-2 text-[#B6B4B4]">
                  I&apos;m want to offer my services
                </span>
              </label>
            </div>
          </div>
          {errors.service && (
            <p className="mt-1 text-sm text-red-600">
              {errors.service.message}
            </p>
          )}
        </div>

        {/* Contenedor para mensaje e información de contacto - dos columnas */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Columna izquierda: Mensaje, botón y texto legal */}
          <div>
            {/* Mensaje */}
            <div>
              <label
                htmlFor="message"
                className="block text-[#0097B2] font-medium mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={6}
                placeholder="In a few words please explain your requirement"
                className={`w-full px-3 py-2 border ${
                  errors.message ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none focus:ring-2 focus:ring-[#0097B2] focus:border-transparent`}
                {...register("message")}
              ></textarea>
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Botón de envío - mismo ancho que textarea */}
            <div className="mt-4">
              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className={`w-full bg-[#0097B2] text-white py-3 rounded flex items-center justify-center shadow-sm hover:bg-opacity-90 transition-colors cursor-pointer ${
                  isSubmitting || !isValid
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <span className="mr-2 text-white">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 26 26"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 12.4211L24 2L13.5789 24L11.2632 14.7368L2 12.4211Z"
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>{" "}
                    Send Information
                  </>
                )}
              </button>
            </div>

            {/* Texto de consentimiento - mismo ancho que textarea */}
            <div className="text-sm text-gray-500 mt-4">
              <p className="mb-2">
                By providing a telephone number and submitting the form you are
                consenting to be contacted by SMS text message. Message & data
                rates may apply. Reply STOP to opt out of further messaging.
              </p>
              <p>
                No mobile information will be shared with third
                parties/affiliates for marketing/promotional purposes. All other
                categories exclude text messaging originator opt-in data and
                consent; this information will not be shared with any third
                parties.
              </p>
            </div>
          </div>

          {/* Columna derecha: Información de contacto */}
          <div className="flex flex-col justify-start mt-7 md:mt-4 items-center md:items-start space-y-6 md:ml-10">
            {/* Iconos de redes sociales */}
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/andesworkforce/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0097B2] text-white p-2 rounded-full hover:bg-opacity-90 transition-colors"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61553675729226&mibextid=LQQJ4d"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0097B2] text-white p-2 rounded-full hover:bg-opacity-90 transition-colors"
              >
                <Facebook size={24} />
              </a>
            </div>

            {/* Información de contacto */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[#08252A]">✉</span>
                <p className="text-[#08252A]">info@andes-workforce.com</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#08252A]">📞</span>
                <p className="text-[#08252A]">+1 7572373612</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
