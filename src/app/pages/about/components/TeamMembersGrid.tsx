"use client";

import { useState } from "react";
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

  const rows: TeamMember[][] = [];
  for (let i = 0; i < visibleMembers.length; i += 4) {
    rows.push(visibleMembers.slice(i, i + 4));
  }

  // ~3.5s per card for a smooth continuous scroll feel
  const carouselDuration = `${members.length * 3.5}s`;

  return (
    <section className="relative w-full overflow-hidden py-[33px] sm:py-[109px]">
      <style>{`
        @keyframes teamMembersScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .team-members-carousel {
          will-change: transform;
        }
        .team-members-carousel:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Background image */}
      <Image
        src="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/about_us/The+people+behind+it+all+-+Fondo.jpg"
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

        {/* Mobile: infinite auto-scroll carousel */}
        <div className="md:hidden -mx-[21px] overflow-hidden w-[calc(100%+42px)]">
          <div
            className="team-members-carousel flex gap-[19px] pl-[19px]"
            style={{
              width: "max-content",
              animation: `teamMembersScroll ${carouselDuration} linear infinite`,
            }}
          >
            {/* Duplicate cards for seamless looping */}
            {[...members, ...members].map((member, i) => (
              <div key={`carousel-${member.id}-${i}`} className="w-[201px] flex-shrink-0">
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
          <Image
            src={member.image}
            alt={member.name}
            fill
            sizes="(max-width: 768px) 50vw, 305px"
            className={member.imageClass || "object-cover object-top"}
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
