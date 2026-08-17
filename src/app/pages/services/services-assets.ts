/**
 * Assets de la página Services (S3).
 * Solo fotos de fondo — iconos y overlay se renderizan en CSS/Lucide.
 */
const S3_BASE =
  "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/03.+Our+Services/optimized";

export const servicesAssets = {
  contactHeroBg: `${S3_BASE}/Let%E2%80%99s+build.webp`,
  benefitsOffice: `${S3_BASE}/Elevate+your+team.webp`,
} as const;
