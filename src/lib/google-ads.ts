declare const process: { env: Record<string, string | undefined> };

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-11VQNRYDS8";

export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "";

export const GOOGLE_ADS_CONVERSION_SEND_TO =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_SEND_TO ?? "";

export function trackContactFormConversion() {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  if (!GOOGLE_ADS_CONVERSION_SEND_TO) {
    return;
  }

  window.gtag("event", "conversion", {
    send_to: GOOGLE_ADS_CONVERSION_SEND_TO,
    value: 1.0,
    currency: "USD",
  });
}
