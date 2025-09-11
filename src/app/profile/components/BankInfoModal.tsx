"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationStore } from "@/store/notifications.store";
import { updateBankInfo, BankInfo } from "../actions/bank-info.actions";
import { useProfileContext } from "../context/ProfileContext";

const bankInfoSchema = z
  .object({
    usaDollarApp: z.boolean().optional(),
    dollarTag: z.string().trim().optional().nullable(),
    bancoNombre: z.string().trim().optional().nullable(),
    bancoPais: z.string().trim().optional().nullable(),
    numeroCuentaBancaria: z.string().trim().optional().nullable(),
    direccionBanco: z.string().trim().optional().nullable(),
    nombreTitularCuenta: z.string().trim().optional().nullable(),
    numeroRutaBancaria: z.string().trim().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.usaDollarApp) {
        return !!(data.dollarTag && data.dollarTag.length > 0);
      }
      return true;
    },
    {
      path: ["dollarTag"],
      message: "Dollar tag is required when DollarApp is used",
    }
  );

type BankInfoForm = z.infer<typeof bankInfoSchema>;

export default function BankInfoModal({
  isOpen,
  onClose,
  targetUserId, // when provided (admin context) we edit another user's bank info
}: {
  isOpen: boolean;
  onClose: () => void;
  targetUserId?: string;
}) {
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const { profile } = useProfileContext();

  const defaultValues: BankInfoForm = useMemo(
    () => ({
      usaDollarApp: profile.bankInfo?.usaDollarApp ?? undefined,
      dollarTag: profile.bankInfo?.dollarTag ?? "",
      bancoNombre: profile.bankInfo?.bancoNombre ?? "",
      bancoPais: profile.bankInfo?.bancoPais ?? "",
      numeroCuentaBancaria: profile.bankInfo?.numeroCuentaBancaria ?? "",
      direccionBanco: profile.bankInfo?.direccionBanco ?? "",
      nombreTitularCuenta: profile.bankInfo?.nombreTitularCuenta ?? "",
      numeroRutaBancaria: profile.bankInfo?.numeroRutaBancaria ?? "",
    }),
    [profile.bankInfo]
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BankInfoForm>({
    resolver: zodResolver(bankInfoSchema),
    defaultValues,
  });

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues);
    }
  }, [isOpen, defaultValues, reset]);

  const usaDollarApp = watch("usaDollarApp");

  const onSubmit = async (values: BankInfoForm) => {
    // Decide which userId to use: admin override (targetUserId) or current user
    const effectiveUserId = targetUserId || user?.id;
    if (!effectiveUserId) {
      addNotification("User not authenticated", "error");
      return;
    }
    const payload: BankInfo = {
      ...values,
      // Normalize empty strings to undefined to keep fields optional
      dollarTag: values.dollarTag || undefined,
      bancoNombre: values.bancoNombre || undefined,
      bancoPais: values.bancoPais || undefined,
      numeroCuentaBancaria: values.numeroCuentaBancaria || undefined,
      direccionBanco: values.direccionBanco || undefined,
      nombreTitularCuenta: values.nombreTitularCuenta || undefined,
      numeroRutaBancaria: values.numeroRutaBancaria || undefined,
    };
    const res = await updateBankInfo(effectiveUserId, payload);
    if (res.success) {
      addNotification("Bank information saved", "success");
      onClose();
    } else {
      addNotification(res.message || "Error saving bank information", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Bank Information</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                id="usaDollarApp"
                type="checkbox"
                {...register("usaDollarApp")}
              />
              <label htmlFor="usaDollarApp" className="text-sm text-gray-700">
                I use DollarApp
              </label>
            </div>

            {usaDollarApp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dollar tag
                </label>
                <input
                  type="text"
                  {...register("dollarTag")}
                  className={`w-full p-2 border rounded-md ${
                    errors.dollarTag ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="@yourtag"
                />
                {errors.dollarTag && (
                  <p className="text-xs text-red-500">
                    {errors.dollarTag.message as string}
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank name
                </label>
                <input
                  type="text"
                  {...register("bancoNombre")}
                  className="w-full p-2 border rounded-md border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank country
                </label>
                <input
                  type="text"
                  {...register("bancoPais")}
                  className="w-full p-2 border rounded-md border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account number
                </label>
                <input
                  type="text"
                  {...register("numeroCuentaBancaria")}
                  className="w-full p-2 border rounded-md border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your full name as registered with the bank
                </label>
                <input
                  type="text"
                  {...register("nombreTitularCuenta")}
                  className="w-full p-2 border rounded-md border-gray-300"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address you have registered with the bank:
                </label>
                <input
                  type="text"
                  {...register("direccionBanco")}
                  className="w-full p-2 border rounded-md border-gray-300"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank routing number (if applicable)
                </label>
                <input
                  type="text"
                  {...register("numeroRutaBancaria")}
                  className="w-full p-2 border rounded-md border-gray-300"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded border border-gray-300 text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded bg-[#0097B2] text-white disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
