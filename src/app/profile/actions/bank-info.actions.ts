"use server";

import { createServerAxios } from "@/services/axios.server";
import { revalidatePath } from "next/cache";

export interface BankInfo {
  usaDollarApp?: boolean;
  dollarTag?: string;
  bancoNombre?: string;
  bancoPais?: string;
  numeroCuentaBancaria?: string;
  direccionBanco?: string;
  nombreTitularCuenta?: string;
  numeroRutaBancaria?: string;
}

export async function updateBankInfo(userId: string, data: BankInfo) {
  const axios = await createServerAxios();
  try {
    const response = await axios.patch(`users/${userId}/bank-info`, data);
    if (response.status !== 200) {
      return { success: false, message: response.data?.message || "Error" };
    }
    revalidatePath("/profile");
    return { success: true };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, message: error?.message || String(error) };
  }
}
