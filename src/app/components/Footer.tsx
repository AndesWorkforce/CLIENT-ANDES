"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Phone, Mail } from "lucide-react";
import useRouteExclusion from "@/hooks/useRouteExclusion";

const platformLinks = [
  { name: "Home", href: "/pages/home" },
  { name: "About", href: "/pages/about" },
  { name: "Services", href: "/pages/services" },
  { name: "Open Contracts", href: "/pages/offers" },
  { name: "Contact", href: "/pages/contact" },
];

const legalLinks = [
  { name: "Privacy Policy", href: "/pages/privacy-policy" },
  { name: "Data Privacy Policy", href: "/politica-datos" },
];

export default function Footer({ forceRender = false }: { forceRender?: boolean } = {}) {
  const { isFooterExcluded } = useRouteExclusion();

  if (isFooterExcluded && !forceRender) {
    return null;
  }

  return (
    <footer className="bg-[#0097B2]">
      <div className="max-w-[1440px] mx-auto px-8 py-10">

        {/* Main content row */}
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">

          {/* Left: Logo + Description + Social */}
          <div className="flex flex-col gap-[35px] max-w-[462px]">
            <Image
              src="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/Group+858+(1).png"
              alt="Andes Workforce Logo"
              width={150}
              height={60}
            />
            <div className="flex flex-col gap-5">
              <p className="text-white text-xs font-normal leading-relaxed">
                Andes Workforce connects growing companies with top-tier talent. We specialize in
                providing high-performance professionals who deliver exceptional value and drive
                business success.
              </p>
              <div className="flex gap-[10px] items-center">
                <Link
                  href="https://www.facebook.com/profile.php?id=61553675729226&mibextid=LQQJ4d"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-white hover:text-white/75 transition-colors"
                >
                  <Facebook size={24} />
                </Link>
                <Link
                  href="https://www.instagram.com/andesworkforce/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-white hover:text-white/75 transition-colors"
                >
                  <Instagram size={24} />
                </Link>
                <Link
                  href="https://www.linkedin.com/company/andes-workforce/posts/?feedView=all"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-white hover:text-white/75 transition-colors"
                >
                  <Linkedin size={24} />
                </Link>
              </div>
            </div>
          </div>

          {/* Center: Platform Navigation */}
          <div className="flex flex-col gap-[15px]">
            <p className="text-white text-sm font-bold tracking-wide">PLATFORM</p>
            <nav className="flex flex-col gap-[10px]">
              {platformLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white text-sm font-normal hover:text-white/75 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: Contact Us */}
          <div className="flex flex-col gap-[15px]">
            <p className="text-white text-sm font-bold tracking-wide">CONTACT US</p>
            <div className="flex flex-col gap-[10px]">
              <div className="flex gap-[5px] items-start">
                <Phone size={16} className="text-white shrink-0 mt-[1px]" />
                <span className="text-white text-sm font-normal">
                  +1 7572373612 - +1 3057030023
                </span>
              </div>
              <div className="flex gap-[5px] items-start">
                <Mail size={16} className="text-white shrink-0 mt-[1px]" />
                <span className="text-white text-sm font-normal">
                  info@andes-workforce.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="grid grid-cols-3 items-center">
          <p className="text-white text-xs font-normal whitespace-nowrap">
            ©2023 Andes Workforce All Rights Reserved
          </p>

          <div className="flex gap-[25px] items-center justify-center">
            {legalLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white text-xs font-normal hover:text-white/75 transition-colors whitespace-nowrap"
              >
                {item.name}
              </Link>
            ))}
          </div>

        </div>

      </div>
    </footer>
  );
}
