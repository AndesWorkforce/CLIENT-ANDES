"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronDown, CircleCheck } from "lucide-react";
import { submitContactFormMicrosoft } from "@/app/pages/contact/actions/microsoft-email-actions";
import { servicesAssets } from "../services-assets";

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

const inputClassName =
  "w-full h-[50px] bg-white border border-[#C8C8C8] rounded-[8px] px-[16px] text-[#343434] text-[14px] tracking-[0.28px] leading-[1.3] focus:outline-none focus:border-[#0097B2]";

const labelClassName =
  "absolute top-0 left-[13px] bg-white px-[4px] h-[15px] text-[#525252] text-[14px] tracking-[0.28px] leading-[1.3]";

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
          "https://countriesnow.space/api/v0.1/countries",
        );
        if (!response.ok) throw new Error("Error fetching countries");
        const result: CountriesAPIResponse = await response.json();

        if (result.error) {
          throw new Error(result.msg);
        }

        const sorted = result.data.sort((a, b) =>
          a.country.localeCompare(b.country),
        );

        const priorityCountries = ["United States", "Colombia", "Canada"];
        const latinCountries = [
          "Argentina",
          "Bolivia",
          "Brazil",
          "Chile",
          "Costa Rica",
          "Cuba",
          "Dominican Republic",
          "Ecuador",
          "El Salvador",
          "Guatemala",
          "Honduras",
          "Mexico",
          "Nicaragua",
          "Panama",
          "Paraguay",
          "Peru",
          "Uruguay",
          "Venezuela",
        ];

        const priority = sorted.filter((c) =>
          priorityCountries.includes(c.country),
        );
        const latin = sorted.filter(
          (c) =>
            latinCountries.includes(c.country) &&
            !priorityCountries.includes(c.country),
        );
        const rest = sorted.filter(
          (c) =>
            !priorityCountries.includes(c.country) &&
            !latinCountries.includes(c.country),
        );

        const orderedPriority = priorityCountries
          .map((name) => priority.find((c) => c.country === name))
          .filter((c): c is Country => c !== undefined);

        setCountries([...orderedPriority, ...latin, ...rest]);
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
        message: `Contact from Services page. Country: ${data.country}`,
      });

      setFormResponse(response);
      if (response.success) {
        reset();
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
    <section
      id="contact-form"
      className="flex w-full flex-col lg:flex-row lg:h-[749px]"
    >
      {/* Left panel — hero */}
      <div className="relative min-h-[420px] w-full lg:h-[749px] lg:w-[52%] lg:shrink-0">
        <img
          src={servicesAssets.contactHeroBg}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            background:
              "linear-gradient(90deg, rgba(4,78,92,0.82) 18%, rgba(5,100,117,0.72) 52%, rgba(8,166,194,0.35) 78%)",
          }}
        />

        <div className="relative z-10 flex h-full items-center px-6 py-12 md:px-[79px] md:py-[169px]">
          <div className="flex max-w-[574px] flex-col gap-5">
            <div className="inline-flex w-fit items-center gap-[7px] rounded-[20px] border border-white bg-[rgba(255,255,255,0.22)] px-[14px] py-[7px]">
              <CircleCheck
                className="h-[25px] w-[25px] text-[#4ADE80]"
                strokeWidth={2.5}
                aria-hidden
              />
              <span className="text-[16px] font-semibold leading-[1.3] text-white">
                Available now
              </span>
            </div>

            <h2 className="text-[32px] font-bold leading-[1.3] text-white md:text-[48px]">
              Let&apos;s build your team-together
            </h2>

            <p className="text-[16px] font-medium leading-[1.2] text-white md:text-[20px]">
              Our team typically replies within 24 hours with role-matched
              candidates and pricing
            </p>

            <div className="flex max-w-[574px] flex-col gap-[29px]">
              <div className="h-px w-full bg-white/30" />

              <div className="flex flex-wrap items-start gap-x-8 gap-y-4 md:flex-nowrap">
                <div className="flex w-[145px] flex-col gap-[3px]">
                  <p className="text-[24px] font-bold leading-[1.3] text-white">
                    +300
                  </p>
                  <p className="text-[18px] font-semibold leading-[1.3] text-white">
                    Contractors
                  </p>
                </div>

                <div className="h-[78px] w-px bg-white/30" />

                <div className="flex w-[145px] flex-col gap-[3px]">
                  <p className="text-[24px] font-bold leading-[1.3] text-white">
                    +15
                  </p>
                  <p className="text-[18px] font-semibold leading-[1.3] text-white">
                    US-based clients
                  </p>
                </div>

                <div className="h-[78px] w-px bg-white/30" />

                <div className="flex w-[145px] flex-col gap-[3px]">
                  <p className="text-[24px] font-bold leading-[1.3] text-white">
                    24 h
                  </p>
                  <p className="text-[18px] font-semibold leading-[1.3] text-white">
                    Response
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full items-start justify-center bg-[#F6FBFC] px-6 py-12 lg:h-[749px] lg:w-[48%] lg:shrink-0 lg:px-[77px] lg:py-[48px]">
        <div className="w-full max-w-[552px] rounded-[24px] bg-white px-6 py-10 shadow-[7px_10px_10px_rgba(195,195,195,0.5)] md:px-[36px] md:py-[66px]">
          <div className="flex flex-col gap-[66px]">
            <div className="flex flex-col gap-[11px]">
              <h3 className="text-[32px] font-bold leading-[1.3] text-black">
                Contact Us
              </h3>
              <p className="text-[16px] font-medium leading-[1.2] text-black">
                Fill out for a consultation. Our Andes Workforce team typically
                reaches out within 24 hours.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-[66px]"
            >
              <div className="flex flex-col gap-[11px]">
              {formResponse && (
                <div
                  className={`mb-2 rounded-lg p-3 text-sm font-medium ${
                    formResponse.success
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {formResponse.message}
                </div>
              )}

              <div className="relative h-[59px]">
                <input
                  type="text"
                  placeholder="First Last"
                  {...register("name")}
                  className={`absolute top-[9px] ${inputClassName}`}
                />
                <label className={labelClassName}>Full Name*</label>
                {errors.name && (
                  <p className="absolute -bottom-5 left-0 text-xs text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="relative h-[59px]">
                <input
                  type="email"
                  placeholder="name@adds.com"
                  {...register("email")}
                  className={`absolute top-[9px] ${inputClassName}`}
                />
                <label className={labelClassName}>Email Address*</label>
                {errors.email && (
                  <p className="absolute -bottom-5 left-0 text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="relative h-[59px]">
                <div className="absolute top-[9px] h-[50px] w-full">
                  <select
                    {...register("country")}
                    className={`${inputClassName} cursor-pointer appearance-none pr-[40px]`}
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
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0097B2] border-t-transparent" />
                    </div>
                  ) : (
                    <ChevronDown
                      size={18}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  )}
                </div>
                <label className={labelClassName}>Country</label>
                {errors.country && (
                  <p className="absolute -bottom-5 left-0 text-xs text-red-500">
                    {errors.country.message}
                  </p>
                )}
              </div>

              <div className="relative h-[59px]">
                <input
                  type="tel"
                  placeholder="+1 234 567 890"
                  {...register("phone")}
                  className={`absolute top-[9px] ${inputClassName}`}
                />
                <label className={labelClassName}>Phone</label>
              </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="h-[48px] w-full rounded-[8px] bg-[#0097B2] text-[14px] font-semibold leading-[1.3] text-white transition-colors hover:bg-[#007A8F] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Sending..." : "Submit Request"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
