"use client";

import { useEffect, useState, useCallback } from "react";
import { Star, StarOff } from "lucide-react";
import { getAllOffersWithAcceptedGlobal } from "@/app/admin/dashboard/actions/offers-with-accepted.actions";
import {
  getFeaturedProfiles,
  toggleFeaturedProfile,
  FeaturedProfile,
} from "@/app/admin/dashboard/actions/featured-profiles.actions";

/** Renders a profile photo or an initials fallback — never loops on 404 */
function ProfileAvatar({
  src,
  name,
  size = 80,
}: {
  src: string | null;
  name: string;
  size?: number;
}) {
  const [errored, setErrored] = useState(false);
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (!src || errored) {
    return (
      <div
        className="flex items-center justify-center rounded-lg bg-[#0097B2] text-white font-semibold flex-shrink-0"
        style={{ width: size, height: size, fontSize: size * 0.3 }}
      >
        {initials}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      onError={() => setErrored(true)}
      className="rounded-lg object-cover flex-shrink-0"
      style={{ width: size, height: size }}
    />
  );
}

interface Member {
  id: string;
  candidateId: string;
  fullName: string;
  country?: string;
  position: string;
  firm?: string;
  profesion?: string;
  contractStatus?: string;
}

export default function FeaturedProfilesManager() {
  const [members, setMembers] = useState<Member[]>([]);
  const [featuredIds, setFeaturedIds] = useState<Set<string>>(new Set());
  const [featuredProfiles, setFeaturedProfiles] = useState<FeaturedProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [offersRes, featuredRes] = await Promise.all([
        getAllOffersWithAcceptedGlobal(),
        getFeaturedProfiles(),
      ]);

      if (offersRes.success && Array.isArray(offersRes.data)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const allMembers: Member[] = (offersRes.data as any[]).flatMap((offer) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (offer.postulaciones as any[])
            .filter(
              (p) =>
                Array.isArray(p.procesosContratacion) &&
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                p.procesosContratacion.some((pc: any) => pc.activo === true)
            )
            .map((p) => ({
              id: p.id,
              candidateId: p.candidato.id,
              fullName: `${p.candidato.nombre} ${p.candidato.apellido}`,
              country: p.candidato.pais,
              position: offer.titulo,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              firm: (offer as any).empresaOferta?.nombre || "",
              profesion: p.candidato.profesion || "",
              contractStatus: "ACTIVE",
            }))
        );

        const seen = new Set<string>();
        const unique = allMembers.filter((m) => {
          if (seen.has(m.candidateId)) return false;
          seen.add(m.candidateId);
          return true;
        });
        setMembers(unique);
      }

      if (featuredRes.success && Array.isArray(featuredRes.data)) {
        setFeaturedIds(new Set(featuredRes.data.map((f) => f.id)));
        setFeaturedProfiles(featuredRes.data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggle = async (candidateId: string) => {
    setTogglingId(candidateId);
    try {
      const res = await toggleFeaturedProfile(candidateId);
      if (res.success) {
        setFeaturedIds((prev) => {
          const next = new Set(prev);
          if (next.has(candidateId)) next.delete(candidateId);
          else next.add(candidateId);
          return next;
        });
        const featuredRes = await getFeaturedProfiles();
        if (featuredRes.success && Array.isArray(featuredRes.data))
          setFeaturedProfiles(featuredRes.data);
      }
    } finally {
      setTogglingId(null);
    }
  };

  const filteredMembers = members
    .filter((m) =>
      search
        ? m.fullName.toLowerCase().includes(search.toLowerCase()) ||
          (m.profesion || "").toLowerCase().includes(search.toLowerCase())
        : true
    )
    .sort((a, b) => {
      const aFeatured = featuredIds.has(a.candidateId) ? 0 : 1;
      const bFeatured = featuredIds.has(b.candidateId) ? 0 : 1;
      return aFeatured - bFeatured;
    });

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold mb-1 text-[#0097B2]">
        Featured Profiles
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Manage which team members appear in the public &quot;Meet Our Featured
        Talent&quot; section.
      </p>

      {/* Preview of currently featured */}
      {featuredProfiles.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
            Currently featured ({featuredProfiles.length})
          </h2>
          <div className="flex flex-wrap gap-4">
            {featuredProfiles.map((profile) => (
              <div
                key={profile.id}
                className="bg-white border border-[#0097B2] rounded-xl p-4 flex gap-4 min-w-[300px] max-w-[360px] shadow-sm"
              >
                <ProfileAvatar
                  src={profile.fotoPerfil}
                  name={`${profile.nombre ?? ""} ${profile.apellido ?? ""}`}
                  size={80}
                />
                <div className="flex flex-col justify-center gap-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">
                    {profile.nombre} {profile.apellido}
                  </p>
                  <p className="text-[#0097b2] text-xs font-medium truncate">
                    {profile.position ?? "—"}
                  </p>
                  <p className="text-gray-500 text-xs truncate">
                    {profile.profesion ?? "—"}
                  </p>
                  <p className="text-gray-400 text-xs">{profile.pais ?? "—"}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Search */}
      <div className="mb-4 flex flex-col md:flex-row gap-3 items-start md:items-center">
        <input
          type="text"
          placeholder="Search by name or profession..."
          className="border rounded px-3 py-2 text-sm w-full md:w-72"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="text-xs text-gray-500">
          {filteredMembers.length} active team member
          {filteredMembers.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table — desktop */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            Loading team members…
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="border-b bg-white">
              <tr>
                {["Full Name", "Position", "Profession", "Country", "Featured"].map(
                  (col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left font-medium text-[#17323A] uppercase text-xs"
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => {
                const isFeatured = featuredIds.has(member.candidateId);
                const isToggling = togglingId === member.candidateId;
                return (
                  <tr
                    key={member.id}
                    className={`border-b hover:bg-gray-50 transition-colors ${
                      isFeatured ? "bg-[#f0feff]" : ""
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-[#17323A] whitespace-nowrap">
                      {member.fullName}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[200px] break-words">
                      {member.position}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {member.profesion || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {member.country || "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => handleToggle(member.candidateId)}
                        disabled={isToggling}
                        title={isFeatured ? "Remove from featured" : "Add to featured"}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors disabled:opacity-50 ${
                          isFeatured
                            ? "bg-[#0097B2] text-white hover:bg-[#007a8e]"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {isFeatured ? (
                          <>
                            <Star size={12} className="fill-white" />
                            Featured
                          </>
                        ) : (
                          <>
                            <StarOff size={12} />
                            Add
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredMembers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-400 text-sm"
                  >
                    No team members found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Cards — mobile */}
      <div className="block md:hidden mt-2 space-y-3">
        {loading ? (
          <p className="text-center text-gray-400 text-sm py-8">
            Loading team members…
          </p>
        ) : (
          filteredMembers.map((member) => {
            const isFeatured = featuredIds.has(member.candidateId);
            const isToggling = togglingId === member.candidateId;
            return (
              <div
                key={member.id}
                className={`bg-white rounded-lg shadow p-4 flex flex-col gap-2 ${
                  isFeatured ? "border border-[#0097B2]" : ""
                }`}
              >
                <div className="flex justify-between items-center gap-2">
                  <span className="font-semibold text-[#17323A] text-sm">
                    {member.fullName}
                  </span>
                  <button
                    onClick={() => handleToggle(member.candidateId)}
                    disabled={isToggling}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors disabled:opacity-50 ${
                      isFeatured
                        ? "bg-[#0097B2] text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {isFeatured ? (
                      <>
                        <Star size={11} className="fill-white" />
                        Featured
                      </>
                    ) : (
                      <>
                        <StarOff size={11} />
                        Add
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  {member.position} · {member.country || "—"}
                </p>
                <p className="text-xs text-gray-400">
                  Profession: {member.profesion || "—"}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
