"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { submitContactFormMicrosoft } from "@/app/pages/contact/actions/microsoft-email-actions";

interface Country {
  name: { common: string };
  flags: { png: string };
  cca3: string;
}

const offersContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  country: z.string().min(1, "Please select a country"),
});

type OffersContactValues = z.infer<typeof offersContactSchema>;

export default function ContactFormSection() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [formResponse, setFormResponse] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OffersContactValues>({
    resolver: zodResolver(offersContactSchema),
    defaultValues: { name: "", email: "", phone: "", country: "" },
  });

  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca3,flags"
        );
        if (!response.ok) throw new Error("Error fetching countries");
        const data = await response.json();
        const sorted = data.sort((a: Country, b: Country) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sorted);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  const onSubmit = async (data: OffersContactValues) => {
    setIsSubmitting(true);
    setFormResponse(null);

    // Split name into firstName / lastName for the shared action
    const parts = data.name.trim().split(/\s+/);
    const firstName = parts[0] ?? data.name;
    const lastName = parts.slice(1).join(" ") || firstName;

    try {
      const response = await submitContactFormMicrosoft({
        firstName,
        lastName,
        email: data.email,
        phone: data.phone || "",
        smsConsent: false,
        service: "talent",
        message: `Contact from Open Contracts page. Country: ${data.country}`,
      });

      setFormResponse(response);
      if (response.success) {
        reset();
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "ads_conversion_Contact_1", {});
        }
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
    <section
      id="contact-form"
      className="relative w-full h-[70vh] flex items-center"
    >
      {/* Left side - Image with gradient overlay */}
      <div className="relative w-1/2 h-full">
        <Image
          src="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/contactus_offers.jpg"
          alt="Office workspace"
          fill
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(0,151,178,0) 50%, #0097b2 100%)",
          }}
        />
      </div>

      {/* Right side - Form */}
      <div
        className="w-1/2 h-full flex items-center justify-center px-16"
        style={{
          background:
            "linear-gradient(90.31deg, rgb(0, 151, 178) 5.218%, rgb(0, 100, 118) 99.736%)",
        }}
      >
        <div className="w-full max-w-xl space-y-8">
          {/* Header */}
          <div className="text-white space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold">Contact Us</h2>
            <p className="text-sm">
              Fill out the form for a consultation. Our Andes Workforce team typically
              reaches out<br />within 24 hours.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {formResponse && (
              <div
                className={`p-3 rounded-lg text-sm font-medium ${
                  formResponse.success
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {formResponse.message}
              </div>
            )}

            {/* Name Field */}
            <div className="space-y-1">
              <label className="text-white text-base font-medium block">Full Name</label>
              <input
                type="text"
                placeholder="Ex: Alexander Hamilton"
                {...register("name")}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#0097b2]"
              />
              {errors.name && (
                <p className="text-red-200 text-xs">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-white text-base font-medium block">Email Address</label>
              <input
                type="email"
                placeholder="Ex: alexander@company.com"
                {...register("email")}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#0097b2]"
              />
              {errors.email && (
                <p className="text-red-200 text-xs">{errors.email.message}</p>
              )}
            </div>

            {/* Country and Phone Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Country Select */}
              <div className="space-y-1">
                <label className="text-white text-base font-medium block">Country</label>
                <div className="relative">
                  <select
                    {...register("country")}
                    className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#0097b2] cursor-pointer"
                    disabled={loadingCountries}
                  >
                    <option value="">Select option here...</option>
                    {countries.map((country) => (
                      <option key={country.cca3} value={country.name.common}>
                        {country.name.common}
                      </option>
                    ))}
                  </select>
                  {loadingCountries ? (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="animate-spin h-4 w-4 border-2 border-[#0097b2] border-t-transparent rounded-full" />
                    </div>
                  ) : (
                    <ChevronDown
                      size={16}
                      className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                    />
                  )}
                </div>
                {errors.country && (
                  <p className="text-red-200 text-xs">{errors.country.message}</p>
                )}
              </div>

              {/* Phone Field */}
              <div className="space-y-1">
                <label className="text-white text-base font-medium block">Phone (Optional)</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  {...register("phone")}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#0097b2]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#FFFFFF] hover:bg-gray-100 text-[#0097b2] px-8 py-3 rounded-2xl font-medium transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
