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
            {/* Name and Email/Phone Grid - 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="relative">
                <input
                  type="text"
                  id="firstName"
                  placeholder="Name"
                  className="w-full px-4 py-4 bg-white/25 backdrop-blur-sm border border-[#c8c8c8] rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#0097B2] focus:border-transparent"
                  {...register("firstName")}
                />
                <label
                  htmlFor="firstName"
                  className="absolute -top-2 left-3 bg-[#044e5c] px-1 text-white text-sm font-medium"
                >
                  First Name*
                </label>
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-300">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="relative">
                <input
                  type="text"
                  id="lastName"
                  placeholder="Hario"
                  className="w-full px-4 py-4 bg-white/25 backdrop-blur-sm border border-[#c8c8c8] rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#0097B2] focus:border-transparent"
                  {...register("lastName")}
                />
                <label
                  htmlFor="lastName"
                  className="absolute -top-2 left-3 bg-[#044e5c] px-1 text-white text-sm font-medium"
                >
                  Last Name*
                </label>
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-300">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              {/* Work Mail */}
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  placeholder="username@dados.com"
                  className="w-full px-4 py-4 bg-white/25 backdrop-blur-sm border border-[#c8c8c8] rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#0097B2] focus:border-transparent"
                  {...register("email")}
                />
                <label
                  htmlFor="email"
                  className="absolute -top-2 left-3 bg-[#044e5c] px-1 text-white text-sm font-medium"
                >
                  Work Mail*
                </label>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-300">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="relative">
                <input
                  type="tel"
                  id="phone"
                  placeholder="+34 6 223 541 4853"
                  className="w-full px-4 py-4 bg-white/25 backdrop-blur-sm border border-[#c8c8c8] rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#0097B2] focus:border-transparent"
                  {...register("phone")}
                />
                <label
                  htmlFor="phone"
                  className="absolute -top-2 left-3 bg-[#044e5c] px-1 text-white text-sm font-medium"
                >
                  Phone Number*
                </label>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-300">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Company Name - Full width */}
            <div className="relative">
              <input
                type="text"
                id="companyName"
                placeholder="Dados"
                className="w-full px-4 py-4 bg-white/25 backdrop-blur-sm border border-[#c8c8c8] rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#0097B2] focus:border-transparent"
                {...register("companyName")}
              />
              <label
                htmlFor="companyName"
                className="absolute -top-2 left-3 bg-[#044e5c] px-1 text-white text-sm font-medium"
              >
                Company Name*
              </label>
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-300">
                  {errors.companyName.message}
                </p>
              )}
            </div>

            {/* Support Types and Team Size - 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Support Types */}
              <div>
                <label className="block text-white font-medium mb-4 text-xl">
                  What type of support are you looking for? *
                </label>
                <div className="space-y-3">
                  {supportOptions.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center text-white cursor-pointer hover:text-white/80 transition-colors group"
                    >
                      <input
                        type="checkbox"
                        value={option.id}
                        className="w-4 h-4 text-[#0097B2] bg-white border-[#efefef] rounded-sm focus:ring-[#0097B2] focus:ring-2 checked:bg-[#0097B2] checked:border-[#0097B2]"
                        {...register("supportTypes")}
                      />
                      <span className="ml-3 text-base font-medium">{option.label}</span>
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
                <label className="block text-white font-medium mb-4 text-xl">
                  How many team members are you looking to hire?
                </label>
                <div className="space-y-3">
                  {teamSizeOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center text-white cursor-pointer hover:text-white/80 transition-colors group"
                    >
                      <input
                        type="radio"
                        value={option.value}
                        className="w-4 h-4 text-[#0097B2] bg-white border-[#efefef] focus:ring-[#0097B2] focus:ring-2 checked:bg-[#0097B2]"
                        {...register("teamSize")}
                      />
                      <span className="ml-3 text-base font-medium">{option.label}</span>
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
            <div className="relative">
              <textarea
                id="message"
                rows={4}
                placeholder="Hello! My name is..."
                className="w-full px-4 py-4 bg-white/25 backdrop-blur-sm border border-[#c8c8c8] rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#0097B2] focus:border-transparent resize-none"
                {...register("message")}
              ></textarea>
              <label
                htmlFor="message"
                className="absolute -top-2 left-3 bg-[#044e5c] px-1 text-white text-sm font-medium"
              >
                Message*
              </label>
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
                className={`px-8 py-3 bg-white text-[#044e5c] font-semibold rounded-[20px] shadow-[0px_4px_2px_rgba(255,255,255,0.15)] hover:bg-gray-100 transition-all text-xl ${
                  isSubmitting || !isValid
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:shadow-xl"
                }`}
              >
                {isSubmitting ? "Sending..." : "Let's Talk"}
              </button>
            </div>
          </form>
        </div>
      </div>

        {/* Opportunities Section - Same container, no separate background */}
        <div className="container mx-auto px-4 md:px-20 pb-16 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="w-full bg-white/40 backdrop-blur-md rounded-3xl p-8 md:p-14 shadow-[0px_4px_4px_0px_#003d49]">
              <h3 
                className="text-3xl md:text-[32px] font-bold text-white mb-3 leading-tight"
              >
                Looking for opportunities?
              </h3>
              <p className="text-white text-lg md:text-[22px] font-medium mb-8 md:mb-11 leading-relaxed">
                To explore available opportunities and view open positions,
                please create an account or sign in to our talent portal.
              </p>
              <div className="flex flex-col md:flex-row gap-3 md:gap-3">
                <a
                  href="/auth/register"
                  className="w-full md:w-auto px-6 py-3 bg-white text-[#044e5c] font-semibold text-xl rounded-[20px] hover:bg-gray-100 transition-colors text-center shadow-[0px_4px_2px_rgba(255,255,255,0.15)]"
                >
                  Create Account
                </a>
                <a
                  href="/auth/login"
                  className="w-full md:w-auto px-6 py-3 bg-transparent border-2 border-white text-white font-semibold text-xl rounded-[20px] hover:bg-white/10 transition-colors text-center shadow-[0px_4px_4px_0px_rgba(255,255,255,0.15)]"
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
