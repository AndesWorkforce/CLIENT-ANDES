import { redirect } from "next/navigation";

export default async function LegacyProviderSignRedirect({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const resolvedParams = await params;
  // Backward-compat: redirect old /esign/provider/:token to new public URL
  redirect(`/esign/public/sign/${resolvedParams.token}`);
}
