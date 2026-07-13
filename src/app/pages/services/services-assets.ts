/**
 * Assets de la página Services (S3).
 * Solo fotos de fondo — iconos y overlay se renderizan en CSS/Lucide.
 */
const S3_BASE =
  "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/Services";

export const servicesAssets = {
  contactHeroBg: `${S3_BASE}/contact-hero-bg.jpg`,
  benefitsOffice: `${S3_BASE}/benefits-office.jpg`,
} as const;
