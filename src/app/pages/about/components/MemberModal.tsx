import Image from "next/image";
import { useEffect } from "react";
import type { TeamMember } from "../../team/team.data";

interface MemberModalProps {
  member: TeamMember | null;
  onClose: () => void;
}

export default function MemberModal({ member, onClose }: MemberModalProps) {
  const memberPets = member?.pets ?? [];

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    // Solo bloquear si hay un member
    if (!member) return;

    // Guardar el overflow original
    const originalOverflow = document.body.style.overflow;
    
    // Bloquear scroll
    document.body.style.overflow = "hidden";

    // Restaurar overflow cuando se desmonte el componente
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [member]);

  if (!member) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-start md:items-center justify-center overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[12px] w-full max-w-[355px] md:max-w-4xl min-h-full md:min-h-0 md:max-h-[90vh] shadow-2xl animate-scaleIn overflow-hidden flex flex-col md:flex-row my-0 md:my-4"
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

        {/* Mobile: Vertical Layout | Desktop: Horizontal Layout */}
        <div className="flex flex-col md:flex-row w-full md:h-full">
          {/* Image Section */}
          <div className="w-full md:w-2/5 md:bg-gradient-to-br md:from-gray-100 md:to-gray-200 flex-shrink-0">
            <div className="flex items-center justify-center p-[33px] md:p-0 h-full">
              <div className="relative w-full max-w-[317px] h-[346px] md:max-w-none md:h-full rounded-[12px] md:rounded-none overflow-hidden">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 317px, 40vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl bg-gray-200">
                    No Image
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1 flex flex-col w-full md:overflow-hidden md:max-h-[90vh]">
            <div className="flex flex-col gap-[22px] p-[33px] md:p-0 md:flex-1 md:overflow-y-auto custom-scrollbar">
              {/* Header */}
              <div className="flex flex-col gap-[11px] items-center text-center md:px-8 md:py-8 md:border-b md:border-gray-100 md:flex-shrink-0">
                <p className="font-bold text-[24px] md:text-3xl text-black leading-[1.3]">
                  {member.name}
                </p>
                <p className="font-semibold text-[16px] md:text-lg text-black leading-[1.3]">
                  {member.role}
                </p>
                {member.summary && (
                  <p className="text-sm text-gray-600 italic">
                    {member.summary}
                  </p>
                )}
                {member.group && (
                  <div className="bg-[#dde2ff] px-[9px] py-[5px] rounded-[12px]">
                    <p className="font-semibold text-[14px] text-[#4356a6] leading-[1.3]">
                      {member.group}
                    </p>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col gap-[33px] md:px-6 md:pb-6">
                {/* About Us */}
                {member.bullets && member.bullets.length > 0 && (
                  <div className="flex flex-col gap-[14px]">
                    <p className="font-semibold text-[18px] text-black leading-[1.3]">
                      About Us
                    </p>
                    <ul className="list-disc text-[14px] text-black leading-[1.5] ms-[21px]">
                      {member.bullets.map((bullet, idx) => (
                        <li key={idx} className="mb-0">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Their furry teammate */}
                {memberPets.length > 0 && (
                  <div className="flex flex-col gap-[14px]">
                    <p className="font-semibold text-[18px] text-black leading-[1.3]">
                      Their furry teammate{memberPets.length > 1 ? "s" : ""}
                    </p>
                    <div className="flex flex-col gap-[11px]">
                      {memberPets.map((pet) => (
                        <div key={pet.id} className="flex gap-[11px]">
                          {/* Pet image */}
                          <div className="relative w-[76px] h-[76px] rounded-[12px] overflow-hidden flex-shrink-0">
                            {pet.image ? (
                              <Image
                                src={pet.image}
                                alt={pet.name}
                                fill
                                sizes="76px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-[#0097B2] flex items-center justify-center text-2xl">
                                🐾
                              </div>
                            )}
                          </div>
                          {/* Pet info */}
                          <div className="flex flex-col gap-[3px] flex-1">
                            <p className="font-semibold text-[16px] text-black leading-[1.3]">
                              {pet.name}
                            </p>
                            <p className="font-medium text-[14px] text-black leading-[1.2]">
                              {pet.role}
                            </p>
                            {pet.bullets[0] && (
                              <p className="font-normal text-[12px] text-black tracking-[0.24px] leading-[1.3]">
                                {pet.bullets[0]}
                              </p>
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
