"use client";

import { useForm } from "react-hook-form";
import { Suspense, useState } from "react";
import Logo from "@/components/ui/Logo";
import { resetPasswordAction } from "./actions/reset-password.action";
import { useSearchParams, useRouter } from "next/navigation";

function ResetPasswordComponents() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ password: string; confirmPassword: string }>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (data: {
    password: string;
    confirmPassword: string;
  }) => {
    setIsSubmitting(true);
    setMessage(null);
    try {
      if (!token) {
        setMessage("Invalid or missing token.");
        return;
      }
      if (data.password !== data.confirmPassword) {
        setMessage("Passwords do not match.");
        return;
      }
      const response = await resetPasswordAction({
        password: data.password,
        token: token as string,
      });

      if (response?.success) {
        setMessage(
          "Your password has been reset successfully. Redirecting to login..."
        );
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      } else {
        setMessage(
          response?.message || "There was an error. Please try again."
        );
      }
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
          Reset Password
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
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your new password"
                  className="bg-transparent text-black border-b border-gray-300 w-full px-3 py-1 focus:outline-none focus:border-andes-blue text-[12px]"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                {errors.password && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </span>
                )}
              </div>
              <div>
                <label className="block text-sm mb-1 text-[#0097B2] text-[16px] font-[500]">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm your new password"
                  className="bg-transparent text-black border-b border-gray-300 w-full px-3 py-1 focus:outline-none focus:border-andes-blue text-[12px]"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                />
                {errors.confirmPassword && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#0097B2] text-white w-full py-2 px-4 rounded-[5px] mt-4 text-[15px] hover:bg-[#0097B2]/80 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordComponents />
    </Suspense>
  );
}
