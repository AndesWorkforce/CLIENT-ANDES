import Link from "next/link";
import AdminHubBreadcrumbs from "../components/AdminHubBreadcrumbs";
import AdminHubTableShell, {
  ADMIN_HUB_TABLE_HEAD_LAST_CELL,
  ADMIN_HUB_TABLE_ROW,
} from "../components/AdminHubTableShell";
import { MOCK_CONTRACTORS } from "../nominas/data/mock-contractors";
import { getPersonaProfile, personaToDetailPath } from "./data/mock-persona-detail";
import PersonaStatusBadge from "./components/PersonaStatusBadge";

export default function AdminHubPersonasPage() {
  return (
    <div className="flex flex-col gap-6">
      <AdminHubBreadcrumbs />

      <h1 className="text-[32px] font-bold text-black leading-[1.3]">Personas</h1>

      <AdminHubTableShell>
        <table className="w-full min-w-[700px] border-collapse bg-white">
          <thead>
            <tr className="border-b border-[#EFEFEF]">
              <th className="rounded-tl-[12px] px-6 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                Contratista
              </th>
              <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                País
              </th>
              <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                Cliente
              </th>
              <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                Puesto
              </th>
              <th className="px-3 py-5 text-left text-[12px] font-bold leading-[18px] text-[#525252]">
                Estado
              </th>
              <th className={ADMIN_HUB_TABLE_HEAD_LAST_CELL} />
            </tr>
          </thead>
          <tbody>
            {MOCK_CONTRACTORS.map((contractor) => {
              const primaryContract = contractor.contracts[0];
              const profile = getPersonaProfile(contractor);

              return (
                <tr key={contractor.id} className={ADMIN_HUB_TABLE_ROW}>
                  <td className="px-6 py-6 text-[14px] tracking-[0.28px] text-[#858585]">
                    {contractor.name}
                  </td>
                  <td className="px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585]">
                    {profile.nationality || contractor.countryName}
                  </td>
                  <td className="px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585]">
                    {primaryContract?.client ?? "—"}
                  </td>
                  <td className="px-3 py-6 text-[14px] tracking-[0.28px] text-[#858585]">
                    {primaryContract?.position ?? "—"}
                  </td>
                  <td className="px-3 py-6">
                    <PersonaStatusBadge status={profile.status} />
                  </td>
                  <td className="px-6 py-6 text-right">
                    <Link
                      href={personaToDetailPath(contractor)}
                      className="text-[14px] font-medium text-[#0097B2] transition-colors hover:text-[#008099]"
                    >
                      Ver perfil
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
