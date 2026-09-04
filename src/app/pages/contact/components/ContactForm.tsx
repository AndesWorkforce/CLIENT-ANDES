"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { submitContactFormMicrosoft } from "../actions/microsoft-email-actions";
import {
  contactFormSchema,
  type ContactFormValues,
} from "../schema/contact-schema";
import { FadeIn, SlideIn } from "../../about/components/Reveal";

const SUPPORT_TYPES = [
  "Administrative Support",
  "Customer Service",
  "Legal Support",
  "Data & Operations",
  "Virtual Assistance",
  "Other",
] as const;

const TEAM_SIZES = ["1", "2-5", "6-10", "+10"] as const;

const inputClassName =
  "mt-[9px] h-[50px] w-full rounded-[8px] border border-[#C8C8C8] bg-white px-4 text-[14px] leading-[1.3] tracking-[0.28px] text-[#343434] placeholder:text-[#525252] focus:border-[#0097B2] focus:outline-none";

const labelClassName =
  "absolute left-[13px] top-0 z-10 h-[15px] bg-white px-1 text-[14px] leading-[1.3] tracking-[0.28px] text-[#525252]";

function FloatingField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full">
      {children}
      <label className={labelClassName}>{label}</label>
      {error ? (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      ) : null}
    </div>
  );
}

export default function ContactForm() {
  const [formResponse, setFormResponse] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      companyName: "",
      supportTypes: [],
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setFormResponse(null);

    const composedMessage = [
      data.message,
      "",
      `Company: ${data.companyName}`,
      `Support types: ${data.supportTypes.join(", ")}`,
      `Team size: ${data.teamSize}`,
    ].join("\n");

    try {
      const response = await submitContactFormMicrosoft({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        smsConsent: false,
        service: "talent",
        message: composedMessage,
      });

      setFormResponse(response);
      if (response.success) {
        reset();
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "ads_conversion_Form_ContactPage", {});
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
      className="relative w-full bg-[rgba(236,249,252,0.12)]"
    >
      <div className="flex items-center justify-center bg-[rgba(137,233,250,0.05)] px-[18px] py-16 sm:px-[30px] sm:py-20">
        <div className="mx-auto flex w-full max-w-[1282px] flex-col items-start gap-12 lg:flex-row lg:gap-[66px]">
          <SlideIn
            from="left"
            offset={80}
            className="w-full shrink-0 lg:w-[552px]"
          >
            <div className="flex flex-col gap-[11px]">
              <div className="flex flex-col gap-[22px]">
                <div className="flex flex-col gap-[11px]">
                  <p className="text-[14px] font-semibold leading-[1.3] text-[#0097b2]">
                    CONTACT US
                  </p>
                  <h2 className="max-w-[400px] text-[32px] font-bold leading-[1.3] text-[#343434] sm:text-[52px]">
                    Tell us what you need
                  </h2>
                </div>
                <p className="text-[16px] font-medium leading-[1.5] text-[#343434] sm:text-[20px]">
                  Share a few details about your business needs and our team
                  will help you{" "}
                  <span className="font-extrabold">find the right support</span>{" "}
                  for your company.
                </p>
              </div>
              <p className="text-[16px] font-medium leading-[1.5] text-[#343434]">
                *No commitment required. We&apos;ll review your request and get
                in touch to better understand your needs and discuss possible
                solutions.*
              </p>
            </div>
          </SlideIn>

          <FadeIn className="w-full min-w-0 flex-1" delay={0.1}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex w-full flex-col rounded-[25px] bg-white p-6 shadow-[0px_4px_5px_rgba(209,209,209,0.25)] sm:p-12"
              noValidate
            >
              <div className="flex flex-col gap-11">
                <div className="flex flex-col gap-[22px]">
                  {formResponse ? (
                    <div
                      className={`rounded-lg p-3 text-sm font-medium ${
                        formResponse.success
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {formResponse.message}
                    </div>
                  ) : null}

                  <FloatingField
                    label="First name*"
                    error={errors.firstName?.message}
                  >
                    <input
                      type="text"
                      autoComplete="given-name"
                      placeholder="First name"
                      {...register("firstName")}
                      className={inputClassName}
                    />
                  </FloatingField>

                  <FloatingField
                    label="Last name*"
                    error={errors.lastName?.message}
                  >
                    <input
                      type="text"
                      autoComplete="family-name"
                      placeholder="Last name"
                      {...register("lastName")}
                      className={inputClassName}
                    />
                  </FloatingField>

                  <FloatingField
                    label="Work email*"
                    error={errors.email?.message}
                  >
                    <input
                      type="email"
                      autoComplete="email"
                      placeholder="name@company.com"
                      {...register("email")}
                      className={inputClassName}
                    />
                  </FloatingField>

                  <FloatingField
                    label="Phone number*"
                    error={errors.phone?.message}
                  >
                    <input
                      type="tel"
                      autoComplete="tel"
                      placeholder="+1 (555) 123-4567"
                      {...register("phone")}
                      className={inputClassName}
                    />
                  </FloatingField>

                  <FloatingField
                    label="Company name*"
                    error={errors.companyName?.message}
                  >
                    <input
                      type="text"
                      autoComplete="organization"
                      placeholder="Company name"
                      {...register("companyName")}
                      className={inputClassName}
                    />
                  </FloatingField>
                </div>

                <fieldset className="flex flex-col border-0 p-0">
                  <legend className="float-none mb-[22px] w-full p-0 text-[20px] font-medium leading-[1.2] text-[#343434]">
                    What type of support are you looking for? *
                  </legend>
                  <Controller
                    name="supportTypes"
                    control={control}
                    render={({ field }) => (
                      <div className="flex flex-col gap-[11px]">
                        {SUPPORT_TYPES.map((type) => {
                          const checked = field.value.includes(type);
                          return (
                            <label
                              key={type}
                              className="flex cursor-pointer items-center gap-[11px] text-[16px] font-medium leading-[1.2] text-[#343434]"
                            >
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={checked}
                                onChange={() => {
                                  field.onChange(
                                    checked
                                      ? field.value.filter(
                                          (value) => value !== type,
                                        )
                                      : [...field.value, type],
                                  );
                                }}
                              />
                              <span
                                className={`flex size-4 shrink-0 items-center justify-center rounded-[4px] ${
                                  checked
                                    ? "bg-[#0097b2]"
                                    : "border border-[#EFEFEF] bg-white"
                                }`}
                                aria-hidden
                              >
                                {checked ? (
                                  <Check
                                    className="size-3 text-white"
                                    strokeWidth={3}
                                  />
                                ) : null}
                              </span>
                              {type}
                            </label>
                          );
                        })}
                      </div>
                    )}
                  />
                  {errors.supportTypes ? (
                    <p className="text-xs text-red-500">
                      {errors.supportTypes.message}
                    </p>
                  ) : null}
                </fieldset>

                <fieldset className="flex flex-col border-0 p-0">
                  <legend className="float-none mb-[22px] w-full p-0 text-[20px] font-medium leading-[1.2] text-[#343434]">
                    How many team members are you looking to hire?
                  </legend>
                  <Controller
                    name="teamSize"
                    control={control}
                    render={({ field }) => (
                      <div className="flex flex-col gap-[11px]">
                        {TEAM_SIZES.map((size) => {
                          const selected = field.value === size;
                          return (
                            <label
                              key={size}
                              className="flex cursor-pointer items-center gap-[11px] text-[16px] font-medium leading-[1.2] text-[#343434]"
                            >
                              <input
                                type="radio"
                                className="sr-only"
                                value={size}
                                checked={selected}
                                onChange={() => field.onChange(size)}
                              />
                              <span
                                className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${
                                  selected
                                    ? "border-[#0097b2]"
                                    : "border-[#C8C8C8]"
                                }`}
                                aria-hidden
                              >
                                {selected ? (
                                  <span className="size-2 rounded-full bg-[#0097b2]" />
                                ) : null}
                              </span>
                              {size}
                            </label>
                          );
                        })}
                      </div>
                    )}
                  />
                  {errors.teamSize ? (
                    <p className="text-xs text-red-500">
                      {errors.teamSize.message}
                    </p>
                  ) : null}
                </fieldset>

                <FloatingField
                  label="Message*"
                  error={errors.message?.message}
                >
                  <textarea
                    rows={4}
                    placeholder="Hello! My name is..."
                    {...register("message")}
                    className="mt-[9px] min-h-[100px] w-full resize-y rounded-[8px] border border-[#C8C8C8] bg-white px-4 py-[17px] text-[14px] leading-[1.3] tracking-[0.28px] text-[#343434] placeholder:text-[#343434] focus:border-[#0097B2] focus:outline-none"
                  />
                </FloatingField>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-[43px] w-fit items-center justify-center rounded-[20px] bg-[#0097B2] px-[25px] py-3 text-[16px] font-medium leading-[1.2] text-white transition-colors hover:bg-[#007A8F] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Sending..." : "Let's Talk"}
                </button>
              </div>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
