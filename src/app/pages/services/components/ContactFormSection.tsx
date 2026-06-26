"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronDown } from "lucide-react";
import { submitContactFormMicrosoft } from "@/app/pages/contact/actions/microsoft-email-actions";

interface Country {
  country: string;
  iso2: string;
  iso3: string;
}

interface CountriesAPIResponse {
  error: boolean;
  msg: string;
  data: Country[];
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
          "https://countriesnow.space/api/v0.1/countries"
        );
        if (!response.ok) throw new Error("Error fetching countries");
        const result: CountriesAPIResponse = await response.json();
        
        if (result.error) {
          throw new Error(result.msg);
        }
        
        // Ordenar alfabéticamente primero
        const sorted = result.data.sort((a, b) =>
          a.country.localeCompare(b.country)
        );

        // Países prioritarios al inicio
        const priorityCountries = ["United States", "Colombia", "Canada"];
        
        // Países latinoamericanos
        const latinCountries = [
          "Argentina", "Bolivia", "Brazil", "Chile", "Costa Rica", "Cuba",
          "Dominican Republic", "Ecuador", "El Salvador", "Guatemala", 
          "Honduras", "Mexico", "Nicaragua", "Panama", "Paraguay", 
          "Peru", "Uruguay", "Venezuela"
        ];

        // Separar países prioritarios
        const priority = sorted.filter(c => priorityCountries.includes(c.country));
        
        // Separar países latinoamericanos (excluyendo Colombia que ya está en prioritarios)
        const latin = sorted.filter(c => 
          latinCountries.includes(c.country) && !priorityCountries.includes(c.country)
        );
        
        // Resto de países
        const rest = sorted.filter(c => 
          !priorityCountries.includes(c.country) && !latinCountries.includes(c.country)
        );

        // Reordenar: prioritarios en orden específico
        const orderedPriority = priorityCountries
          .map(name => priority.find(c => c.country === name))
          .filter((c): c is Country => c !== undefined);

        // Combinar en el orden deseado
        const finalList = [...orderedPriority, ...latin, ...rest];
        
        setCountries(finalList);
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
        // Track Google Ads conversion event - offers page form submit
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "ads_conversion_Form_OffersPage", {});
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
    <section id="contact-form" className="relative w-full h-auto md:h-[749px] flex flex-col md:flex-row">
      {/* Left side - Image with content overlay */}
      <div className="relative flex flex-1 h-[280px] md:h-full">
        {/* Background Image */}
        <img
          src="https://www.figma.com/api/mcp/asset/55ddcadb-79d4-4350-886f-20aaaecb688c"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay */}
        <img
          src="https://www.figma.com/api/mcp/asset/8ffe2980-2010-459f-944d-3080c0ccd5c0"
          alt="Overlay"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Content */}
        <div className="relative z-10 px-[20px] md:px-[79px] py-[40px] md:py-[169px] h-full flex items-center">
          <div className="flex flex-col gap-[12px] md:gap-[20px] max-w-[574px]">
            {/* Available Now Badge */}
            <div className="inline-flex items-center gap-[7px] bg-[rgba(255,255,255,0.22)] border border-white rounded-[20px] px-[14px] py-[7px] self-start">
              <img
                src="https://www.figma.com/api/mcp/asset/5b263ebc-a748-48bb-a0c0-5e51484568c1"
                alt="Available"
                className="w-[25px] h-[25px]"
              />
              <span className="text-white font-semibold text-[12px] md:text-[16px] leading-[1.3]">
                Available now
              </span>
            </div>

            {/* Title */}
            <h2 className="text-white font-bold text-[20px] md:text-[48px] leading-[1.3] max-w-[574px]">
              Let's build your team-together
            </h2>

            {/* Description */}
            <p className="text-white font-medium text-[14px] md:text-[20px] leading-[1.2] max-w-[574px]">
              Our team typically replies within 24 hours with role-mathed candidates and
              pricing
            </p>

            {/* Stats Section */}
            <div className="flex flex-col gap-[16px] md:gap-[29px] max-w-[574px]">
              {/* Horizontal line */}
              <div className="w-full h-[1px] bg-white opacity-30" />

              <div className="flex gap-[20px] md:gap-[32px]">
                {/* +300 Contractors */}
                <div className="flex flex-col gap-[3px] w-auto md:w-[145px]">
                  <p className="text-white font-bold text-[18px] md:text-[24px] leading-[1.3]">+300</p>
                  <p className="text-white font-semibold text-[12px] md:text-[18px] leading-[1.3]">
                    Contractors
                  </p>
                </div>

                {/* Vertical separator */}
                <div className="w-[1px] h-[50px] md:h-[78px] bg-white opacity-30" />

                {/* +15 US-based clients */}
                <div className="flex flex-col gap-[3px] w-auto md:w-[145px]">
                  <p className="text-white font-bold text-[18px] md:text-[24px] leading-[1.3]">+15</p>
                  <p className="text-white font-semibold text-[12px] md:text-[18px] leading-[1.3]">
                    US-based clients
                  </p>
                </div>

                {/* Vertical separator */}
                <div className="w-[1px] h-[50px] md:h-[78px] bg-white opacity-30" />

                {/* 24h Response */}
                <div className="flex flex-col gap-[3px] w-auto md:w-[145px]">
                  <p className="text-white font-bold text-[18px] md:text-[24px] leading-[1.3]">24 h</p>
                  <p className="text-white font-semibold text-[12px] md:text-[18px] leading-[1.3]">
                    Response
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 h-full bg-[#F6FBFC] flex items-center justify-center px-[19px] md:px-[77px] py-[44px] md:py-[48px]">
        <div className="bg-white rounded-[24px] shadow-[7px_10px_10px_rgba(195,195,195,0.5)] w-full max-w-[355px] md:max-w-[652px] px-[22px] md:px-[36px] pt-[33px] md:pt-[66px] pb-[22px] md:pb-[50px]">
          {/* Header */}
          <div className="mb-[22px] md:mb-[66px]">
            <h3 className="text-black font-bold text-[24px] md:text-[32px] leading-[1.3] mb-[11px]">
              Contact Us
            </h3>
            <p className="text-black font-medium text-[14px] md:text-[16px] leading-[1.2]">
              Fill out for a consultation. Our Andes Workforce team typically reaches out
              within 24 hours.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[7px] md:gap-[11px]">
            {formResponse && (
              <div
                className={`p-3 rounded-lg text-sm font-medium mb-[11px] ${
                  formResponse.success
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {formResponse.message}
              </div>
            )}

            {/* Name Field */}
            <div className="relative h-[59px]">
              <input
                type="text"
                placeholder="First Last"
                {...register("name")}
                className="absolute top-[9px] w-full h-[50px] bg-white border border-[#EFEFEF] md:border-[#C8C8C8] rounded-[8px] px-[16px] py-[17px] text-[#343434] text-[14px] tracking-[0.28px] leading-[1.3] focus:outline-none focus:border-[#0097B2]"
              />
              <label className="absolute top-0 left-[13px] bg-white px-[4px] h-[15px] text-[#525252] text-[14px] tracking-[0.28px] leading-[1.3]">
                Full Name*
              </label>
              {errors.name && (
                <p className="absolute -bottom-5 left-0 text-red-500 text-xs">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="relative h-[59px]">
              <input
                type="email"
                placeholder="name@adds.com"
                {...register("email")}
                className="absolute top-[9px] w-full h-[50px] bg-white border border-[#EFEFEF] md:border-[#C8C8C8] rounded-[8px] px-[16px] py-[17px] text-[#343434] text-[14px] tracking-[0.28px] leading-[1.3] focus:outline-none focus:border-[#0097B2]"
              />
              <label className="absolute top-0 left-[13px] bg-white px-[4px] h-[15px] text-[#525252] text-[14px] tracking-[0.28px] leading-[1.3]">
                Email Address*
              </label>
              {errors.email && (
                <p className="absolute -bottom-5 left-0 text-red-500 text-xs">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Country Field */}
            <div className="relative h-[59px]">
              <div className="absolute top-[9px] w-full h-[50px]">
                <select
                  {...register("country")}
                  className="w-full h-full appearance-none bg-white border border-[#EFEFEF] md:border-[#C8C8C8] rounded-[8px] px-[16px] py-[17px] pr-[40px] text-[#343434] text-[14px] tracking-[0.28px] leading-[1.3] focus:outline-none focus:border-[#0097B2] cursor-pointer"
                  disabled={loadingCountries}
                >
                  <option value="">Select your country...</option>
                  {countries.map((country) => (
                    <option key={country.iso3} value={country.country}>
                      {country.country}
                    </option>
                  ))}
                </select>
                {loadingCountries ? (
                  <div className="absolute right-[16px] top-1/2 -translate-y-1/2">
                    <div className="animate-spin h-4 w-4 border-2 border-[#0097b2] border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <ChevronDown
                    size={18}
                    className="absolute right-[16px] top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                  />
                )}
              </div>
              <label className="absolute top-0 left-[13px] bg-white px-[4px] h-[15px] text-[#525252] text-[14px] tracking-[0.28px] leading-[1.3]">
                Country
              </label>
              {errors.country && (
                <p className="absolute -bottom-5 left-0 text-red-500 text-xs">
                  {errors.country.message}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div className="relative h-[59px]">
              <input
                type="tel"
                placeholder="+1 234 567 890"
                {...register("phone")}
                className="absolute top-[9px] w-full h-[50px] bg-white border border-[#EFEFEF] md:border-[#C8C8C8] rounded-[8px] px-[16px] py-[17px] text-[#343434] text-[14px] tracking-[0.28px] leading-[1.3] focus:outline-none focus:border-[#0097B2]"
              />
              <label className="absolute top-0 left-[13px] bg-white px-[4px] h-[15px] text-[#525252] text-[14px] tracking-[0.28px] leading-[1.3]">
                Phone
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[48px] bg-[#0097B2] hover:bg-[#007A8F] text-white font-semibold text-[14px] leading-[1.3] rounded-[8px] mt-[22px] md:mt-[55px] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Submit Request"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
