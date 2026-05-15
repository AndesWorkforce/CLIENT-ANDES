"use client";

import { useState } from "react";
import Image from "next/image";
import type { TeamMember } from "../../team/team.data";

const INITIAL_COUNT = 6;

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

  return (
    <section className="relative w-full overflow-hidden py-24">
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

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 flex flex-col gap-10">
        {/* Top row: text left + first 2 cards right */}
        {/* Top row: text (2 cols) + first 2 cards (1 col each) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 items-center">
          {/* Left: Section header spans 2 cols */}
          <div className="lg:col-span-2 flex flex-col justify-center py-4">
            <h2 className="text-4xl md:text-[48px] font-bold text-white leading-[1.3]">
              The <span className="text-[#89e9fa]">people</span> behind it all
            </h2>
            <p className="mt-4 text-lg md:text-[22px] font-semibold text-white leading-[1.3]">
              Behind every great result, there&apos;s a team that makes it
              <br />
              possible.
            </p>
            <p className="mt-2 text-base md:text-[20px] font-normal text-white leading-[1.3]">
              We&apos;re a group of dedicated professionals committed to
              delivering quality, collaboration, and continuous growth in
              everything we do.
            </p>
          </div>

          {/* First 2 cards: 1 col each */}
          {visibleMembers.slice(0, 2).map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onMemberClick={onMemberClick}
            />
          ))}
        </div>

        {/* Bottom grid: remaining visible members */}
        {visibleMembers.length > 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
            {visibleMembers.slice(2).map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                onMemberClick={onMemberClick}
              />
            ))}
          </div>
        )}

        {/* See more / Show less buttons */}
        <div className="flex justify-center gap-4">
          {!showAll ? (
            <button
              onClick={() => setShowAll(true)}
              className="border border-white rounded-[20px] px-6 py-3 text-white text-[20px] font-semibold leading-[1.3] hover:bg-white/10 transition-colors"
            >
              See more team members
            </button>
          ) : (
            <button
              onClick={() => setShowAll(false)}
              className="border border-white rounded-[20px] px-6 py-3 text-white text-[20px] font-semibold leading-[1.3] hover:bg-white/10 transition-colors"
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
      className="flex flex-col cursor-pointer rounded-[15px] overflow-hidden hover:scale-[1.02] transition-transform"
    >
      {/* Photo */}
      <div className="relative w-full h-[309px] bg-gray-200">
        {member.image ? (
          <Image
            src={member.image}
            alt={member.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={member.imageClass || "object-cover"}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
            No Image
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-white flex flex-col items-center justify-center gap-[10px] px-[25px] py-[33px] h-[138px] rounded-bl-[15px] rounded-br-[15px]">
        <div className="text-center">
          <h3 className="text-[24px] font-bold text-black leading-[1.3]">
            {member.name}
          </h3>
          <p className="text-[16px] font-normal text-black leading-[1.1] mt-1">
            {member.role}
          </p>
        </div>
        <div className="border border-[#0097b2] rounded-[8px] px-[8px] py-[6px]">
          <span className="text-[#0097b2] text-[12px] tracking-[0.24px]">
            See details
          </span>
        </div>
      </div>
    </div>
  );
}
