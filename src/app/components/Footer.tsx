"use client";

import type { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail } from "lucide-react";
import { FaSquareFacebook, FaLinkedin } from "react-icons/fa6";
import { AiFillInstagram, AiFillTikTok } from "react-icons/ai";
import useRouteExclusion from "@/hooks/useRouteExclusion";

const platformLinks = [
  { name: "Home", href: "/pages/home" },
  { name: "About Us", href: "/pages/about" },
  { name: "Our Services", href: "/pages/services" },
  { name: "Join Our Team", href: "/pages/offers" },
  { name: "Contact Us", href: "/pages/contact" },
];

interface FooterProps {
  forceRender?: boolean;
}

const Footer: FC<FooterProps> = ({ forceRender = false }) => {
  const { isFooterExcluded } = useRouteExclusion();

  if (isFooterExcluded && !forceRender) {
    return null;
  }

  return (
    <footer className="bg-white shadow-[0px_0px_10px_1px_#d2d2d2]">
      <div className="container mx-auto px-4 py-[45px] flex flex-col gap-[45px]">
        {/* Top section - 3 columns */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10 md:gap-8 lg:gap-0">
          {/* Column 1: Logo + Description + Social */}
          <div className="flex flex-col gap-[35px] md:flex-1 md:max-w-[462px] shrink-0">
            <div className="relative w-[145px] h-[66px]">
              <Image
                src="/logo-andes.png"
                alt="Andes Workforce Logo"
                fill
                className="object-contain object-left"
              />
            </div>
            <div className="flex flex-col gap-[20px]">
              <p className="text-[#343434] text-[12px] leading-normal font-['Inter',sans-serif]">
                Andes Workforce connects growing companies with top-tier talent.
                We specialize in providing high-performance professionals who
                deliver exceptional value and drive business success.
              </p>
              <div className="flex gap-[10px]">
                <Link
                  href="https://www.facebook.com/profile.php?id=61553675729226&mibextid=LQQJ4d"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="hover:opacity-80 transition-opacity"
                >
                  <FaSquareFacebook size={24} color="#666666" />
                </Link>
                <Link
                  href="https://www.instagram.com/andesworkforce/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="hover:opacity-80 transition-opacity"
                >
                  <AiFillInstagram size={24} color="#666666" />
                </Link>
                <Link
                  href="https://www.linkedin.com/company/andes-workforce/posts/?feedView=all"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="hover:opacity-80 transition-opacity"
                >
                  <FaLinkedin size={24} color="#666666" />
                </Link>
                <Link
                  href="https://www.tiktok.com/@andesworkforce?_r=1&_t=ZS-95Qs2ALJBau"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="hover:opacity-80 transition-opacity"
                >
                  <AiFillTikTok size={24} color="#666666" />
                </Link>
              </div>
            </div>
          </div>

          {/* Column 2: Platform */}
          <div className="flex flex-col gap-[15px] shrink-0">
            <h3 className="text-[#343434] text-[12px] font-bold font-['Inter',sans-serif]">
              PLATFORM
            </h3>
            <nav className="flex flex-col gap-[10px]">
              {platformLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-[#343434] text-[12px] font-['Inter',sans-serif] hover:text-[#0097b2] whitespace-nowrap transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Contact Us */}
          <div className="flex flex-col gap-[15px] md:max-w-[300px] shrink-0">
            <h3 className="text-[#343434] text-[12px] font-bold font-['Inter',sans-serif]">
              CONTACT US
            </h3>
            <div className="flex flex-col gap-[10px]">
              <div className="flex items-start gap-[5px]">
                <Phone size={16} className="text-[#0097b2] shrink-0 mt-0.5" />
                <span className="text-[#343434] text-[12px] font-['Inter',sans-serif]">
                  +1 7572373612 - +1 3057030023
                </span>
              </div>
              <div className="flex items-start gap-[5px]">
                <Mail size={16} className="text-[#0097b2] shrink-0 mt-0.5" />
                <Link
                  href="mailto:info@andes-workforce.com"
                  className="text-[#343434] text-[12px] font-['Inter',sans-serif] hover:text-[#0097b2] transition-colors"
                >
                  info@andes-workforce.com
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 lg:gap-0 mt-4 md:mt-0">
          <p className="text-[#343434] text-[12px] font-['Inter',sans-serif] text-center md:text-left md:shrink-0">
            &copy;2023 Andes Workforce All Rights Reserved
          </p>
          <div className="flex flex-wrap gap-[25px] justify-center md:justify-center flex-1">
            <Link
              href="/pages/privacy-policy"
              className="text-[#343434] text-[12px] font-['Inter',sans-serif] hover:text-[#0097b2] whitespace-nowrap transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/politica-datos"
              className="text-[#343434] text-[12px] font-['Inter',sans-serif] hover:text-[#0097b2] whitespace-nowrap transition-colors"
            >
              Data Privacy Policy
            </Link>
          </div>
          <div className="flex justify-center md:justify-end md:shrink-0">
            <Link
              href="https://appwiseinnovations.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-[6px] bg-white border border-gray-200 rounded-[20px] pl-[10px] pr-[12px] py-[5px] w-fit hover:opacity-90 transition-opacity"
            >
              <Image
                src="https://appwiseinnovations.dev/r2-appwise/appwise/logo_appwise.png"
                alt="AppWise Innovations"
                width={35}
                height={35}
                className="rounded-full object-cover flex-shrink-0"
              />
              <div className="flex flex-col justify-center leading-none">
                <span className="text-[12px] font-normal text-black">by</span>
                <span className="text-[10px] font-extrabold text-black whitespace-nowrap font-['Inter',sans-serif]">
                  APPWISE INNOVATIONS
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
