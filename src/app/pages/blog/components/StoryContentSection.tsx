"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import QuoteBlock from "./QuoteBlock";
import { storyAssets } from "../story-assets";

function Body({ children }: { children: ReactNode }) {
  return (
    <p className="font-normal text-[14px] text-black leading-[1.5]">
      {children}
    </p>
  );
}

export default function StoryContentSection() {
  return (
    <section className="relative w-full bg-white pt-0 pb-[11px] md:pb-[44px]">
      <div className="max-w-[850px] mx-auto px-[18px] md:px-[44px]">
        <div className="flex flex-col gap-[44px]">
          <div className="relative w-full h-[250px] md:h-[336px] rounded-[20px] overflow-hidden">
            <Image
              src={storyAssets.officeTeam}
              alt="Andes Workforce team"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-[16px]">
            <p className="font-semibold text-[14px] text-[#044E5C] leading-[1.3]">
              ORIGINS
            </p>
            <h2 className="font-semibold text-[18px] md:text-[20px] text-black leading-[1.3]">
              From Shipmates to Something More
            </h2>
            <div className="space-y-[16px]">
              <Body>
                Every company has a beginning. For Andes Workforce, that
                beginning was rooted in a simple belief: exceptional talent
                exists everywhere, and businesses should not be limited by
                geography when building great teams.
              </Body>
              <Body>
                But before Andes Workforce became a company, a model, or a
                growing network of professionals across Latin America, the story
                began with something even more personal: trust.
              </Body>
              <Body>
                Years before Andes Workforce was founded, Miguel and Michael
                Hoffman met as shipmates in the Navy. Serving together creates a
                kind of bond that is difficult to replicate anywhere else. In
                that environment, trust is not just a value written on a wall.
                It is something people practice every day through
                responsibility, discipline, communication, and showing up for
                the person beside them.
              </Body>
              <Body>
                That early connection left a lasting impression. Miguel and
                Michael got to know each other in a setting where character
                matters. They saw what it means to work as part of a team, to
                depend on others, and to build confidence through consistency.
                Long before there was a business conversation, there was a
                relationship built on mutual respect.
              </Body>
              <Body>
                Years later, when Andes Workforce began taking shape, that
                foundation mattered.
              </Body>
            </div>
            <QuoteBlock
              text="Long before there was a business conversation, there was a relationship built on mutual respect."
              author="Andes Workforce"
            />
          </div>

          <div className="flex flex-col gap-[16px]">
            <p className="font-semibold text-[14px] text-[#044E5C] leading-[1.3]">
              FROM SHIPMATES TO PARTNERS
            </p>
            <h2 className="font-semibold text-[18px] md:text-[20px] text-black leading-[1.3]">
              From Shipmates to Partners
            </h2>
            <div className="space-y-[16px]">
              <Body>
                When Miguel envisioned Andes Workforce, the mission was clear:
                create meaningful career opportunities for talented
                professionals across Latin America while helping businesses in
                the United States find dedicated, skilled team members they
                could trust.
              </Body>
              <Body>
                It was not simply about filling open positions. It was about
                building reliable teams, creating long-term relationships, and
                proving that remote talent could become a true extension of an
                organization when the right people, training, and support were
                in place.
              </Body>
              <Body>
                Michael understood that vision because he already knew the kind
                of trust Miguel valued. Their shared history helped open the
                door to one of Andes Workforce&apos;s earliest and most
                important partnerships. Alongside WHG, Tabak Law also became
                part of the early story, believing in the potential of building
                strong remote teams with professionals from Latin America.
              </Body>
              <Body>
                Those first partnerships helped shape what Andes Workforce would
                become. They gave the company the opportunity to prove what we
                believed in from the beginning: when businesses invest in people
                and build with intention, remote professionals can become
                indispensable members of the team.
              </Body>
            </div>
            <QuoteBlock
              text="Meeting in person reinforced something we have always believed: this work is not transactional. It is relational."
              author="Andes Workforce"
            />
          </div>

          <div className="flex flex-col gap-[16px]">
            <p className="font-semibold text-[14px] text-[#044E5C] leading-[1.3]">
              REAL RELATIONSHIPS
            </p>
            <h2 className="font-semibold text-[18px] md:text-[20px] text-black leading-[1.3]">
              Relationships That Go Beyond the Screen
            </h2>
            <div className="space-y-[16px]">
              <Body>
                As Andes Workforce grew, so did the relationships behind the
                work.
              </Body>
              <Body>
                In a remote-first world, it can be easy to think of partnerships
                as something that happens only through calls, messages, and
                shared systems. For Andes Workforce, the opposite has always
                been true. Technology helps us connect, but relationships are
                built through attention, consistency, and genuine care.
              </Body>
              <Body>
                That is why it has been so meaningful to meet both WHG and Tabak
                Law in person at their offices in the United States. Those
                visits gave us the opportunity to sit across the table from our
                clients, understand their teams more deeply, and see firsthand
                the environments where Andes professionals are making an impact.
              </Body>
              <Body>
                Meeting in person reinforced something we have always believed:
                this work is not transactional. It is relational.
              </Body>
              <Body>
                When we visit a client office, we are not just checking in on a
                staffing solution. We are strengthening a partnership. We are
                listening to what is working, learning what can improve, and
                making sure the people we place are supported in a way that
                benefits both the client and the professional.
              </Body>
              <Body>
                Those moments matter because they remind us that Andes Workforce
                is built on real human connections across borders.
              </Body>
            </div>
          </div>

          <figure className="flex flex-col gap-[10px]">
            <div className="relative w-full h-[250px] md:h-[314px] rounded-[20px] overflow-hidden">
              <Image
                src={storyAssets.tabakChicago}
                alt="Andes Workforce and Tabak Law in Chicago"
                fill
                className="object-cover"
              />
            </div>
            <figcaption className="text-center font-normal text-[14px] text-[#858585] leading-[1.5] tracking-[0.28px]">
              Andes Workforce and Tabak Law, together in Chicago.
            </figcaption>
          </figure>

          <div className="flex flex-col gap-[16px]">
            <p className="font-semibold text-[14px] text-[#044E5C] leading-[1.3]">
              OUR MISSION
            </p>
            <h2 className="font-semibold text-[18px] md:text-[20px] text-black leading-[1.3]">
              More Than Staffing
            </h2>
            <div className="space-y-[16px]">
              <Body>
                From day one, Andes Workforce has never viewed its work as
                simply placing candidates into roles.
              </Body>
              <Body>
                Every placement represents a person with goals, ambitions,
                responsibilities, and the desire to grow. Every client
                relationship represents an organization that is trusting us to
                help them build a stronger team. We take both responsibilities
                seriously.
              </Body>
              <Body>
                Our mission has always been to create opportunities that
                transform lives while helping organizations scale sustainably.
                Over time, we have seen professionals step into larger
                responsibilities, develop new skills, and grow into leadership
                roles. We have also seen clients benefit from committed team
                members who bring consistency, care, and meaningful
                contributions to their businesses.
              </Body>
              <Body>
                That is the kind of growth Andes Workforce was created to
                support.
              </Body>
            </div>
          </div>

          <div className="flex flex-col gap-[16px]">
            <p className="font-semibold text-[14px] text-[#044E5C] leading-[1.3]">
              GROWTH
            </p>
            <h2 className="font-semibold text-[18px] md:text-[20px] text-black leading-[1.3]">
              A Community Across Borders
            </h2>
            <div className="space-y-[16px]">
              <Body>
                What started with a few early clients and a belief in untapped
                talent has grown into a community of businesses and
                professionals working together across countries, cultures, and
                time zones.
              </Body>
              <Body>
                The foundation is still the same one that existed at the very
                beginning: trust.
              </Body>
              <Body>
                Trust between founders and clients. Trust between companies and
                their remote teams. Trust between professionals and the
                organizations that give them the opportunity to grow. Trust
                built through communication, accountability, and shared success.
              </Body>
              <Body>
                The story of Miguel and Michael&apos;s Navy connection is more
                than a meaningful detail in our history. It reflects the values
                that continue to guide Andes Workforce today. Strong teams are
                built by people who believe in each other, support each other,
                and understand that success is never achieved alone.
              </Body>
            </div>
            <QuoteBlock
              text="Strong teams are built by people who believe in each other, support each other, and understand that success is never achieved alone."
              author="Andes Workforce"
            />
          </div>

          <div className="flex flex-col gap-[16px]">
            <p className="font-semibold text-[14px] text-[#044E5C] leading-[1.3]">
              CONCLUSION
            </p>
            <div className="space-y-[16px]">
              <p className="font-medium text-[16px] text-black leading-[1.5]">
                We are deeply grateful to the clients who believed in Andes
                Workforce from the beginning, especially WHG and Tabak Law.
                Their trust helped lay the foundation for everything Andes has
                become.
              </p>
              <p className="font-medium text-[16px] text-black leading-[1.5]">
                Today, we continue to grow, but our purpose remains unchanged:
                connecting exceptional talent with outstanding opportunities and
                helping both businesses and professionals thrive.
              </p>
              <p className="font-medium text-[16px] text-black leading-[1.5]">
                Our story is still being written, and the most exciting chapters
                are ahead.
              </p>
              <p className="font-medium text-[16px] text-black leading-[1.5]">
                Because Andes Workforce was never just about remote staffing. It
                was, and always will be, about people.
              </p>
            </div>
            <QuoteBlock
              centered
              text="Because Andes Workforce was never just about remote staffing. It was, and always will be, about people."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
