/**
 * Convierte URLs canónicas de S3 (bucket privado → Access Denied en el navegador)
 * en URLs servidas por la API con credenciales / redirect firmado.
 *
 * Las URLs en BD siguen siendo:
 *   https://{bucket}.s3.{region}.amazonaws.com/{key}
 * El navegador debe usar:
 *   {API}/files/content?url=...
 */

const S3_HOST_HINTS = [
  ".amazonaws.com/",
  ".s3.",
  "andes-workforce-s3",
  "dev-test-andesworkforce",
];

function getPublicApiBase(): string {
  const raw =
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) ||
    "http://localhost:5000/api/";
  let url = raw.trim();
  if (!url.endsWith("/")) url += "/";
  if (!url.toLowerCase().includes("/api/")) {
    url = `${url}api/`;
  }
  return url.replace(/([^:]\/)\/+/g, "$1");
}

export function isS3CanonicalUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string") return false;
  if (!url.startsWith("http")) return false;
  return S3_HOST_HINTS.some((h) => url.includes(h));
}

/**
 * Devuelve una URL que el <img>/<video> puede cargar con bucket privado.
 * Si no es S3, se deja igual (blob:, data:, API, etc.).
 */
export function toAccessibleMediaUrl(
  url: string | null | undefined,
  options?: { mode?: "redirect" | "stream"; expiresIn?: number },
): string {
  if (!url) return "";
  if (url.startsWith("blob:") || url.startsWith("data:")) return url;
  if (!isS3CanonicalUrl(url)) return url;

  const api = getPublicApiBase();
  const params = new URLSearchParams();
  params.set("url", url);
  if (options?.mode) params.set("mode", options.mode);
  if (options?.expiresIn) params.set("expiresIn", String(options.expiresIn));

  return `${api}files/content?${params.toString()}`;
}
