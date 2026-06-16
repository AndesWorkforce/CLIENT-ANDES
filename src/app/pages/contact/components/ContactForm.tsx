"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  contactFormSchema,
  type ContactFormValues,
} from "../schema/contact-schema";
import { submitContactFormMicrosoft } from "../actions/microsoft-email-actions";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formResponse, setFormResponse] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      companyName: "",
      supportTypes: [],
      teamSize: undefined,
      message: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setFormResponse(null);

    try {
      // Adaptar los datos al formato que espera la función de envío
      const adaptedData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        smsConsent: false,
        service: "talent" as const,
        message: `Company: ${data.companyName}\n\nSupport Types: ${data.supportTypes.join(", ")}\n\nTeam Size: ${data.teamSize}\n\n${data.message}`,
      };

      const response = await submitContactFormMicrosoft(adaptedData);
      setFormResponse(response);

      if (response.success) {
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "ads_conversion_Form_ContactPage", {});
        }
        reset();
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

  const supportOptions = [
    { id: "administrative", label: "Administrative Support" },
    { id: "customer", label: "Customer Service" },
    { id: "legal", label: "Legal Support" },
    { id: "data", label: "Data & Operations" },
    { id: "virtual", label: "Virtual Assistance" },
    { id: "other", label: "Other" },
  ];

  const teamSizeOptions = [
    { value: "1", label: "1" },
    { value: "2-5", label: "2-5" },
    { value: "6-10", label: "6-10" },
    { value: "+10", label: "+10" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Banner Image */}
      <div className="relative h-[505px] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/contact_us/contact_us_banner.png')",
          }}
        >
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#2A5F6F]/90 to-[#1A4F5F]/70"></div>
        </div>

        <div className="container mx-auto px-4 md:px-20 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Let's build your remote team
            </h1>
            <p className="text-lg text-white/90 drop-shadow">
              Tell us about your business needs and we'll help you find the
              right talent.
            </p>
          </div>
        </div>
      </div>

      {/* Combined Form and Opportunities Section with Single Background */}
      <div className="relative">
        {/* Background Pattern - Single instance covering all content */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/contact_us/Fondo+Contact+US.png')",
          }}
        ></div>

        {/* Solid Color Overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "rgba(4, 78, 92, 0.9)",
          }}
        ></div>

        {/* Decorative Blur Circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* First blur circle */}
          <div
            className="absolute rounded-full"
            style={{
              width: "948px",
              height: "950px",
              left: "-300px",
              top: "800px",
              backgroundColor: "rgba(34, 188, 216, 0.18)",
              filter: "blur(300px)",
            }}
          ></div>
          {/* Second blur circle */}
          <div
            className="absolute rounded-full"
            style={{
              width: "504px",
              height: "517px",
              left: "-800px",
              top: "-300px",
              backgroundColor: "rgba(34, 188, 216, 0.13)",
              filter: "blur(300px)",
            }}
          ></div>
        </div>

        {/* Form Section */}
        <div className="container mx-auto px-4 md:px-20 py-16 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-3">
              Tell us what you need
            </h2>
            <p className="text-white/80 text-sm">
              Share a few details about your business needs and our team will
              help you find the right support for your company.
            </p>
            <p className="text-white/60 text-xs mt-2">
              *No commitment required. We'll review your request and get in
              touch to better understand your needs and discuss possible
              solutions.
            </p>
          </div>

          {formResponse && (
            <div
              className={`p-4 mb-6 rounded ${
                formResponse.success
                  ? "bg-green-500/20 border border-green-500 text-green-100"
                  : "bg-red-500/20 border border-red-500 text-red-100"
              }`}
            >
              {formResponse.message}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-white font-medium mb-2 text-sm"
                >
                  First Name*
                </label>
                <input
                  type="text"
                  id="firstName"
                  placeholder="Name"
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0097B2] focus:border-transparent"
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-300">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-white font-medium mb-2 text-sm"
                >
                  Last Name*
                </label>
                <input
                  type="text"
                  id="lastName"
                  placeholder="Hario"
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0097B2] focus:border-transparent"
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-300">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-white font-medium mb-2 text-sm"
                >
                  Work Mail*
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="username@dados.com"
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0097B2] focus:border-transparent"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-300">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-white font-medium mb-2 text-sm"
                >
                  Phone Number*
                </label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="+34 6 223 541 4853"
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0097B2] focus:border-transparent"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-300">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Company Name */}
            <div>
              <label
                htmlFor="companyName"
                className="block text-white font-medium mb-2 text-sm"
              >
                Company Name*
              </label>
              <input
                type="text"
                id="companyName"
                placeholder="Dados"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0097B2] focus:border-transparent"
                {...register("companyName")}
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-300">
                  {errors.companyName.message}
                </p>
              )}
            </div>

            {/* Support Types and Team Size */}
            <div className="grid grid-cols-1 gap-8">
              {/* Support Types */}
              <div>
                <label className="block text-white font-medium mb-3 text-sm">
                  What type of support are you looking for? *
                </label>
                <div className="space-y-2">
                  {supportOptions.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center text-white/90 cursor-pointer hover:text-white transition-colors"
                    >
                      <input
                        type="checkbox"
                        value={option.id}
                        className="w-4 h-4 text-[#0097B2] bg-white/10 border-white/30 rounded focus:ring-[#0097B2] focus:ring-2"
                        {...register("supportTypes")}
                      />
                      <span className="ml-2 text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
                {errors.supportTypes && (
                  <p className="mt-2 text-sm text-red-300">
                    {errors.supportTypes.message}
                  </p>
                )}
              </div>

              {/* Team Size */}
              <div>
                <label className="block text-white font-medium mb-3 text-sm">
                  How many team members are you looking to hire?
                </label>
                <div className="space-y-2">
                  {teamSizeOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center text-white/90 cursor-pointer hover:text-white transition-colors"
                    >
                      <input
                        type="radio"
                        value={option.value}
                        className="w-4 h-4 text-[#0097B2] bg-white/10 border-white/30 focus:ring-[#0097B2] focus:ring-2"
                        {...register("teamSize")}
                      />
                      <span className="ml-2 text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
                {errors.teamSize && (
                  <p className="mt-2 text-sm text-red-300">
                    {errors.teamSize.message}
                  </p>
                )}
              </div>
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-white font-medium mb-2 text-sm"
              >
                Message*
              </label>
              <textarea
                id="message"
                rows={5}
                placeholder="Hello! My name is..."
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0097B2] focus:border-transparent resize-none"
                {...register("message")}
              ></textarea>
              {errors.message && (
                <p className="mt-1 text-sm text-red-300">
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className={`px-8 py-3 bg-white text-[#2A5F6F] font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-all ${
                  isSubmitting || !isValid
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:shadow-xl"
                }`}
              >
                {isSubmitting ? "Sending..." : "Contact Us"}
              </button>
            </div>
          </form>
        </div>
      </div>

        {/* Opportunities Section - Same container, no separate background */}
        <div className="container mx-auto md:px-20 pb-full relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="w-full bg-white/10 backdrop-blur-md md:rounded-3xl p-8 md:p-12 border border-white/20">
              <h3 
                className="text-2xl md:text-3xl font-bold text-white mb-4"
                style={{
                  textShadow: "0px 4px 4px rgba(17, 17, 17, 0.25)",
                }}
              >
                {/* Mobile: sin "?" | Desktop: con "?" */}
                <span className="md:hidden">Looking for opportunities</span>
                <span className="hidden md:inline">Looking for opportunities?</span>
              </h3>
              <p className="text-white/90 text-base mb-6 font-medium">
                To explore available opportunities and view open positions,
                please create an account or sign in to our talent portal.
              </p>
              {/* Mobile: vertical | Desktop: horizontal */}
              <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                <a
                  href="/auth/register"
                  className="w-full md:w-auto px-8 py-3.5 bg-white text-[#2A5F6F] font-semibold rounded-full hover:bg-gray-100 transition-colors text-center shadow-sm"
                >
                  Create Account
                </a>
                <a
                  href="/auth/login"
                  className="w-full md:w-auto px-8 py-3.5 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors text-center"
                >
                  Sign In
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
