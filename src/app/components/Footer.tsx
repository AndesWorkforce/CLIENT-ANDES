"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import useRouteExclusion from "@/hooks/useRouteExclusion";

const navigation = [
  { name: "Home", href: "/pages/home" },
  { name: "About", href: "/pages/about" },
  { name: "Open Contracts", href: "/pages/offers" },
  { name: "Services", href: "/pages/services" },
  { name: "Contact", href: "/pages/contact" },
  { name: "Privacy Policy", href: "/pages/privacy-policy" },
  { name: "Data Privacy Policy", href: "/politica-datos" },
];

export default function Footer() {
  const { isFooterExcluded } = useRouteExclusion();

  if (isFooterExcluded) {
    return null;
  }

  return (
    <>
      {/* Separación blanca */}
      <div className="h-8 bg-[#FCFEFF]"></div>

      {/* Footer con fondo gris */}
      <footer className="bg-[#E2E2E2]">
        <div className="container mx-auto px-4 py-8">
          {/* Logo y redes sociales */}
          <div className="flex flex-col items-center mb-6">
            <Image
              src="https://appwiseinnovations.dev/Andes/logo-andes.png"
              alt="Andes Workforce Logo"
              width={150}
              height={60}
              className="mb-10"
            />

            <div className="text-center mb-2">
              <p className="text-[#17323A] text-sm">Follow Us</p>
            </div>

            <div className="flex space-x-4">
              <Link
                href="https://www.facebook.com/profile.php?id=61553675729226&mibextid=LQQJ4d"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-[#0097B2] hover:text-[#00778E]"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="https://www.instagram.com/andesworkforce/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-[#0097B2] hover:text-[#00778E]"
              >
                <Instagram size={20} />
              </Link>
              <Link
                href="https://www.linkedin.com/company/andes-workforce/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-[#0097B2] hover:text-[#00778E]"
              >
                <Linkedin size={20} />
              </Link>
            </div>
          </div>

          {/* Línea divisoria solo visible en desktop */}
          <hr className="hidden md:block border-[#8B8B8B] my-4" />

          {/* Navegación y copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <nav className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8 mb-4 md:mb-0">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm text-[#08252A] hover:text-[#0097B2]"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Línea divisoria solo visible en móvil, sin márgenes */}
            <hr className="block md:hidden w-full border-[#8B8B8B] my-0" />

            <p className="text-sm text-[#08252A] mt-4 md:mt-0">
              &copy;2023 Andes Workforce All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
