"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import Logo from "@/components/ui/Logo";
import { forgotPasswordAction } from "./actions/fargot-password.action";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (data: { email: string }) => {
    setIsSubmitting(true);
    setMessage(null);
    try {
      const response = await forgotPasswordAction({ email: data.email });

      console.log("[FORGOT PASSWORD] Response", response);

      setMessage(
        "If the email exists, you will receive a message to reset your password."
      );
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch {
      setMessage("There was an error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 text-black h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-sm flex flex-col items-center gap-8">
        <Logo />
        <h2 className="text-xl font-[600] text-[18px] mb-4 text-[#0097B2]">
          Forgot Password
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-8 w-full"
        >
          {message ? (
            <div className="text-center text-[#0097B2] mt-2">{message}</div>
          ) : (
            <>
              <div>
                <label className="block text-sm mb-1 text-[#0097B2] text-[16px] font-[500]">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-transparent text-black border-b border-gray-300 w-full px-3 py-1 focus:outline-none focus:border-andes-blue text-[12px]"
                  {...register("email", {
                    required: "Email is required",
                  })}
                />
                {errors.email && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#0097B2] text-white w-full py-2 px-4 rounded-[5px] mt-4 text-[15px] hover:bg-[#0097B2]/80 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? "Sending..." : "Send reset link"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
