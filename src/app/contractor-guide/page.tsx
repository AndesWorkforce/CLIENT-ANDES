import type { Metadata } from "next";
import { getPaymentChecklistState } from "./actions/payment-checklist.actions";
import GuideHeroSection from "./components/GuideHeroSection";
import GuidePageContent from "./components/GuidePageContent";

export const metadata: Metadata = {
  title: "Contractor Guide",
  description:
    "Complete these steps after signing your contract to set up payments and benefits.",
};

export const dynamic = "force-dynamic";

export default async function ContractorGuidePage() {
  const checklistState = await getPaymentChecklistState();

  return (
    <div className="min-h-screen bg-white">
      <GuideHeroSection />
      <GuidePageContent checklistState={checklistState} />
    </div>
  );
}
