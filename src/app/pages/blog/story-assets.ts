/**
 * Assets del artículo "The Story Behind Andes Workforce".
 * Pegar aquí las URLs reales de S3 cuando estén subidas.
 */
const S3_STORY =
  "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/05.+Blog/2.+The+Story+Behind+Andes+Workforce";

export const storyAssets = {
  hero: `${S3_STORY}/Banner.webp`,
  officeTeam: `${S3_STORY}/IMG-20251007-WA0031.webp`,
  tabakChicago: `${S3_STORY}/Tabak+Law+VA.webp`,
} as const;
