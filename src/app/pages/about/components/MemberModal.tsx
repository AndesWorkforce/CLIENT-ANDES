import Image from "next/image";
import type { TeamMember } from "../../team/team.data";

interface MemberModalProps {
  member: TeamMember | null;
  onClose: () => void;
}

export default function MemberModal({ member, onClose }: MemberModalProps) {
  if (!member) return null;

  const memberPets = member.pets ?? [];

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] shadow-2xl animate-scaleIn overflow-hidden flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-all hover:scale-110 z-20"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Left Side: Image */}
        <div className="w-full md:w-2/5 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200">
          <div className="relative w-full h-64 md:h-full overflow-hidden">
            {member.image ? (
              <Image
                src={member.image}
                alt={member.name}
                fill
                className={member.imageClass || "object-cover"}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">
                No Image
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Info */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header Info */}
          <div className="flex-shrink-0 text-center px-8 py-8 border-b border-gray-100">
            <h3 className="text-2xl md:text-3xl font-bold text-[#08252A] mb-2">
              {member.name}
            </h3>
            <p className="text-base md:text-lg text-[#0097B2] font-semibold mb-2">
              {member.role}
            </p>
            {member.summary && (
              <p className="text-sm text-gray-600 italic mb-2">
                {member.summary}
              </p>
            )}
            {member.group && (
              <span className="inline-block mt-2 px-4 py-1 bg-[#e6f6f9] text-[#007c92] rounded-full text-xs md:text-sm font-medium">
                {member.group}
              </span>
            )}
          </div>

          {/* Bullets Section with scroll */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {member.bullets && member.bullets.length > 0 && (
              <div>
                <h4 className="text-base md:text-lg font-semibold text-[#08252A] mb-4">
                  About
                </h4>
                <ul className="space-y-3">
                  {member.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-[#0097B2] mt-1 flex-shrink-0 text-base">
                        •
                      </span>
                      <span className="text-sm md:text-base text-gray-700 leading-relaxed">
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Their furry teammate section */}
            {memberPets.length > 0 && (
              <div className="mt-6 pt-5 border-t border-gray-100">
                <h4 className="text-base md:text-lg font-semibold text-[#08252A] mb-3">
                  🐾 Their furry teammate{memberPets.length > 1 ? "s" : ""}
                </h4>
                <div className="flex flex-col gap-3">
                  {memberPets.map((pet) => (
                    <div key={pet.id} className="flex items-center gap-3">
                      {/* Pet thumbnail */}
                      <div className="relative w-[81px] h-[81px] rounded-xl overflow-hidden flex-shrink-0">
                        {pet.image ? (
                          <Image
                            src={pet.image}
                            alt={pet.name}
                            fill
                            sizes="81px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#0097B2] flex items-center justify-center text-2xl">
                            🐾
                          </div>
                        )}
                      </div>
                      {/* Pet info */}
                      <div className="flex flex-col">
                        <span className="text-[16px] font-semibold text-[#08252A] leading-tight">
                          {pet.name}
                        </span>
                        <span className="text-[14px] font-medium text-[#0097B2] leading-snug">
                          {pet.role}
                        </span>
                        {pet.bullets[0] && (
                          <span className="text-[12px] font-normal text-gray-500 tracking-[0.24px] leading-relaxed mt-0.5 line-clamp-2">
                            {pet.bullets[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
}
