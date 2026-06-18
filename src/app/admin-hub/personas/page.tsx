import Link from "next/link";
import AdminHubBreadcrumbs from "../components/AdminHubBreadcrumbs";
import AdminHubTableShell, {
  ADMIN_HUB_TABLE_ROW,
} from "../components/AdminHubTableShell";
import { MOCK_CONTRACTORS } from "../nominas/data/mock-contractors";
import { getPersonaProfile, personaToDetailPath } from "./data/mock-persona-detail";
import PersonaStatusBadge from "./components/PersonaStatusBadge";

export default function AdminHubPersonasPage() {
  const headClass =
    "px-3 py-5 text-left text-[14px] font-bold leading-[1.3] text-[#525252]";
  const cellClass =
    "px-3 py-3 text-[14px] leading-[1.3] tracking-[0.28px] text-[#858585] whitespace-nowrap";

  return (
    <div className="flex flex-col gap-6">
      <AdminHubBreadcrumbs />

      <h1 className="text-[32px] font-bold text-black leading-[1.3]">Personas</h1>

      <AdminHubTableShell>
        <table className="w-full min-w-[700px] border-collapse bg-white">
          <thead>
            <tr className="border-b border-[#EFEFEF]">
              <th className="rounded-tl-[12px] py-5 pl-6 pr-3 text-left text-[14px] font-bold leading-[1.3] text-[#525252]">
                Contratista
              </th>
              <th className={headClass}>País</th>
              <th className={headClass}>Cliente</th>
              <th className={headClass}>Puesto</th>
              <th className={headClass}>Estado</th>
              <th className="w-[108px] rounded-tr-[12px] py-5 pr-6" />
            </tr>
          </thead>
          <tbody>
            {MOCK_CONTRACTORS.map((contractor) => {
              const primaryContract = contractor.contracts[0];
              const profile = getPersonaProfile(contractor);

              return (
                <tr key={contractor.id} className={ADMIN_HUB_TABLE_ROW}>
                  <td className={`pl-6 pr-3 ${cellClass}`}>{contractor.name}</td>
                  <td className={cellClass}>
                    {profile.nationality || contractor.countryName}
                  </td>
                  <td className={cellClass}>{primaryContract?.client ?? "—"}</td>
                  <td className={cellClass}>{primaryContract?.position ?? "—"}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <PersonaStatusBadge status={profile.status} />
                  </td>
                  <td className="w-[108px] whitespace-nowrap py-3 pl-3 pr-6 text-right">
                    <Link
                      href={personaToDetailPath(contractor)}
                      className="inline-block text-[14px] font-medium leading-none text-[#0097B2] transition-colors hover:text-[#008099]"
                    >
                      Ver Perfil
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </AdminHubTableShell>
    </div>
  );
}
