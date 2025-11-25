import { axiosBase } from "@/services/axios.instance";

export async function confirmInterviewDateClient(
  postulationId: string,
  optionIndex: number
) {
  if (!postulationId || !optionIndex) {
    return { success: false, message: "Missing postulationId or optionIndex" };
  }
  try {
    const res = await axiosBase.patch(
      `applications/${postulationId}/interview-confirmation`,
      { optionIndex }
    );
    if (res.status === 200) {
      return { success: true, data: res.data };
    }
    return {
      success: false,
      message: res.data?.message || "Error confirming interview date",
    };
  } catch (err: any) {
    console.error("[confirmInterviewDateClient] Error", err?.response || err);
    return {
      success: false,
      message:
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Unknown error",
    };
  }
}
