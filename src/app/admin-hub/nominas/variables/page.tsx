import PayrollVariablesPageContent from "../components/PayrollVariablesPageContent";

interface AdminHubNominasVariablesPageProps {
  searchParams: Promise<{ contractor?: string }>;
}

export default async function AdminHubNominasVariablesPage({
  searchParams,
}: AdminHubNominasVariablesPageProps) {
  const { contractor } = await searchParams;

  return <PayrollVariablesPageContent initialSearchQuery={contractor ?? ""} />;
}