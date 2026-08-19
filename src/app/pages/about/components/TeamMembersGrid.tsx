"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import type { TeamMember } from "../../team/team.data";

const INITIAL_COUNT = 4;

interface TeamMembersGridProps {
  members: TeamMember[];
  onMemberClick: (member: TeamMember) => void;
}

export default function TeamMembersGrid({
  members,
  onMemberClick,
}: TeamMembersGridProps) {
  const [showAll, setShowAll] = useState(false);
  const visibleMembers = showAll ? members : members.slice(0, INITIAL_COUNT);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const userScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isAutoScrollingRef = useRef(true); // Para rastrear si el scroll es automático

  const rows: TeamMember[][] = [];
  for (let i = 0; i < visibleMembers.length; i += 4) {
    rows.push(visibleMembers.slice(i, i + 4));
  }

  // Auto-scroll effect for mobile
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const startAutoScroll = () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }

      autoScrollIntervalRef.current = setInterval(() => {
        if (!scrollContainer || !isAutoScrolling) return;

        // Marcar que este scroll es automático
        isAutoScrollingRef.current = true;

        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        const currentScroll = scrollContainer.scrollLeft;
        
        // Calcular el ancho de una tarjeta más el gap (201px + 19px = 220px)
        const cardWidth = 220;
        // Punto donde terminan los miembros originales (antes de los duplicados)
        const originalEndPoint = cardWidth * members.length;

        // Si llegamos al punto donde empiezan los duplicados, volver al inicio
        if (currentScroll >= originalEndPoint - cardWidth) {
          scrollContainer.scrollLeft = 0;
        } else {
          // Avanzamos suavemente
          scrollContainer.scrollBy({ left: 1, behavior: "auto" });
        }
      }, 20); // Velocidad de scroll
    };

    if (isAutoScrolling) {
      startAutoScroll();
    }

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [isAutoScrolling, members.length]);

  // Detectar scroll manual del usuario
  const handleScroll = () => {
    // Si el scroll es automático, no hacer nada
    if (isAutoScrollingRef.current) {
      isAutoScrollingRef.current = false;
      return;
    }

    // El usuario hizo scroll manualmente
    setIsAutoScrolling(false);

    // Limpiar timeout anterior
    if (userScrollTimeoutRef.current) {
      clearTimeout(userScrollTimeoutRef.current);
    }

    // Reanudar auto-scroll después de 3 segundos de inactividad
    userScrollTimeoutRef.current = setTimeout(() => {
      setIsAutoScrolling(true);
    }, 3000);
  };

  // Detectar cuando el usuario toca el contenedor
  const handleTouchStart = () => {
    isAutoScrollingRef.current = false;
    setIsAutoScrolling(false);

    // Limpiar timeout anterior
    if (userScrollTimeoutRef.current) {
      clearTimeout(userScrollTimeoutRef.current);
    }

    // Reanudar auto-scroll después de 3 segundos de inactividad
    userScrollTimeoutRef.current = setTimeout(() => {
      setIsAutoScrolling(true);
    }, 3000);
  };

  return (
    <section className="relative w-full overflow-hidden py-[33px] sm:py-[109px]">

      {/* Background image */}
      <Image
        src="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/about_us_team/optimized/The+people+behind+it+all+-+Fondo.webp"
        alt=""
        fill
        className="object-cover"
        aria-hidden
      />
      {/* Dark teal overlay */}
      <div className="absolute inset-0 bg-[rgba(4,78,92,0.72)]" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-[21px] sm:px-[80px] flex flex-col gap-[22px] sm:gap-[55px] items-center">
        {/* Centered header */}
        <div className="flex flex-col gap-[11px] items-center text-center">
          <h2 className="text-[24px] sm:text-[48px] font-bold text-white leading-[1.3]">
            The <span className="text-[#89e9fa]">people</span> behind it all
          </h2>
          <p className="text-[14px] sm:text-[22px] font-semibold text-white leading-[1.3]">
            Behind every great result, there&apos;s a team that makes it possible.
          </p>
        </div>

        {/* Mobile: auto-scroll + manual scroll carousel */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          onTouchStart={handleTouchStart}
          className="md:hidden -mx-[21px] overflow-x-auto w-[calc(100%+42px)] scrollbar-hide"
        >
          <div className="flex gap-[19px] px-[21px] pb-[11px]">
            {/* Mostrar todos los miembros */}
            {members.map((member) => (
              <div key={`carousel-${member.id}`} className="w-[201px] flex-shrink-0">
                <MemberCard member={member} onMemberClick={onMemberClick} />
              </div>
            ))}
            {/* Duplicar solo los primeros 3 miembros para el loop */}
            {members.slice(0, 3).map((member, idx) => (
              <div key={`carousel-loop-${member.id}-${idx}`} className="w-[201px] flex-shrink-0">
                <MemberCard member={member} onMemberClick={onMemberClick} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: rows of 4 */}
        <div className="hidden md:flex flex-col gap-[55px] w-full">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-4 gap-[19px]">
              {row.map((member) => (
                <MemberCard key={member.id} member={member} onMemberClick={onMemberClick} />
              ))}
            </div>
          ))}
        </div>

        {/* See more / Show less — desktop only */}
        <div className="hidden md:flex justify-center">
          {!showAll ? (
            <button
              onClick={() => setShowAll(true)}
              className="border border-white rounded-[20px] px-[25px] py-[12px] text-white text-[20px] font-semibold leading-[1.3] shadow-[0px_4px_4px_0px_rgba(255,255,255,0.15)] hover:bg-white/10 transition-colors"
            >
              See more team members
            </button>
          ) : (
            <button
              onClick={() => setShowAll(false)}
              className="border border-white rounded-[20px] px-[25px] py-[12px] text-white text-[20px] font-semibold leading-[1.3] shadow-[0px_4px_4px_0px_rgba(255,255,255,0.15)] hover:bg-white/10 transition-colors"
            >
              Show less
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function MemberCard({
  member,
  onMemberClick,
}: {
  member: import("../../team/team.data").TeamMember;
  onMemberClick: (member: import("../../team/team.data").TeamMember) => void;
}) {
  return (
    <div
      onClick={() => onMemberClick(member)}
      className="flex flex-col cursor-pointer rounded-[15px] overflow-hidden hover:scale-[1.02] transition-transform h-full"
    >
      {/* Photo */}
      <div className="relative w-full h-[204px] sm:h-[380px] bg-gray-200 rounded-tl-[15px] rounded-tr-[15px]">
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            className={`absolute inset-0 size-full ${member.imageClass || "object-cover object-top"}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
            No Image
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-white flex flex-col flex-1 items-center justify-center gap-[11px] px-[25px] py-[22px] rounded-bl-[15px] rounded-br-[15px]">
        <div className="flex flex-col items-center gap-[4px] text-center w-auto sm:w-[275px]">
          <h3 className="text-[18px] sm:text-[24px] font-bold text-black leading-[1.3]">
            {member.name}
          </h3>
          <p className="text-[12px] sm:text-[16px] font-normal text-black leading-[1.3]">
            {member.role}
          </p>
        </div>
        <div className="border border-[#0097b2] rounded-[8px] px-[8px] py-[6px] h-[21px] sm:h-[30px] flex items-center justify-center">
          <span className="text-[#0097b2] text-[10px] sm:text-[12px] tracking-[0.24px]">
            See details
          </span>
        </div>
      </div>
    </div>
  );
}
