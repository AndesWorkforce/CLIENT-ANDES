"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const AUTO_SCROLL_SECONDS = 18;

export default function PartnersSection() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const partners = [
    // {
    //   name: "Ardon Health Group",
    //   logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/bernheim-kelley-battista-injury-lawyers-logo-home.png",
    //   width: 80,
    //   height: 40,
    // },
    {
      name: "Port Law",
      logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/home/Logos+Clientes/Port-Law-Firm-Logo.webp",
      width: 80,
      height: 40,
    },
    {
      name: "Tabak",
      logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/home/Logos+Clientes/tabak-law-logo-2017.jpg",
      width: 80,
      height: 40,
    },
    // {
    //   name: "Vels",
    //   logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/VELS-Main-Logo.png",
    //   width: 110,
    //   height: 40,
    // },
    // {
    //   name: "VetLaw",
    //   logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/VetLaw.jpg",
    //   width: 110,
    //   height: 40,
    // },
    {
      name: "WHG",
      logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/home/Logos+Clientes/443713131_293370327175156_2158509847576955820_n.jpg",
      width: 110,
      height: 40,
    },
    {
      name: "Schomburg Insurance",
      logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/home/Logos+Clientes/Schomburg_Insurance.webp",
      width: 110,
      height: 40,
    },
    {
      name: "Veteran Esquire",
      logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/home/Logos+Clientes/logo.webp",
      width: 110,
      height: 40,
    },
    /*     {
      name: "Jelks Veteran Services",
      logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/home/Logos+Clientes/Jelks.webp",
      width: 110,
      height: 40,
    }, */
    // {
    //   name: "CaseScribe",
    //   logo: "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/casescribe.png",
    //   width: 110,
    //   height: 40,
    // },
  ];

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const offset = { current: 0 };
    const halfWidth = { current: 0 };
    const paused = { current: false };
    const pointerActive = { current: false };
    const dragging = { current: false };
    const lastX = { current: 0 };
    const startX = { current: 0 };
    const startY = { current: 0 };

    const measure = () => {
      halfWidth.current = track.scrollWidth / 2;
    };
    measure();

    const wrap = () => {
      const half = halfWidth.current;
      if (half <= 0) return;
      offset.current = ((offset.current % half) + half) % half;
    };

    const apply = () => {
      track.style.transform = `translate3d(${-offset.current}px, 0, 0)`;
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onReduceChange = () => {
      if (reduceMotion.matches) paused.current = true;
    };
    onReduceChange();
    reduceMotion.addEventListener("change", onReduceChange);

    let frame = 0;
    let lastTs = performance.now();

    const tick = (ts: number) => {
      const dt = Math.min((ts - lastTs) / 1000, 0.05);
      lastTs = ts;
      const half = halfWidth.current;
      if (half > 0 && !paused.current && !dragging.current && !reduceMotion.matches) {
        offset.current += (half / AUTO_SCROLL_SECONDS) * dt;
        wrap();
        apply();
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const onPointerDown = (event: PointerEvent) => {
      pointerActive.current = true;
      dragging.current = false;
      lastX.current = event.clientX;
      startX.current = event.clientX;
      startY.current = event.clientY;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!pointerActive.current) return;

      if (!dragging.current) {
        const dx = event.clientX - startX.current;
        const dy = event.clientY - startY.current;
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        if (Math.abs(dy) > Math.abs(dx)) {
          pointerActive.current = false;
          return;
        }
        dragging.current = true;
        viewport.setPointerCapture?.(event.pointerId);
      }

      offset.current -= event.clientX - lastX.current;
      lastX.current = event.clientX;
      wrap();
      apply();
    };

    const onPointerUp = (event: PointerEvent) => {
      pointerActive.current = false;
      dragging.current = false;
      if (viewport.hasPointerCapture?.(event.pointerId)) {
        viewport.releasePointerCapture(event.pointerId);
      }
    };

    const onPointerEnter = (event: PointerEvent) => {
      if (event.pointerType === "mouse") paused.current = true;
    };
    const onPointerLeave = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && !reduceMotion.matches) {
        paused.current = false;
      }
    };

    viewport.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    viewport.addEventListener("pointerenter", onPointerEnter);
    viewport.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", measure);

    const observer = new ResizeObserver(measure);
    observer.observe(track);

    return () => {
      cancelAnimationFrame(frame);
      reduceMotion.removeEventListener("change", onReduceChange);
      viewport.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      viewport.removeEventListener("pointerenter", onPointerEnter);
      viewport.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", measure);
      observer.disconnect();
    };
  }, []);

  const logos = (prefix: string, hidden?: boolean) =>
    partners.map((partner, index) => (
      <div
        key={`${prefix}-${index}`}
        className="mx-6 flex flex-shrink-0 items-center justify-center select-none md:mx-10"
        aria-hidden={hidden || undefined}
      >
        <Image
          src={partner.logo}
          alt={hidden ? "" : partner.name}
          width={partner.width * 1.5}
          height={partner.height * 1.5}
          className="pointer-events-none object-contain"
          draggable={false}
        />
      </div>
    ));

  return (
    <section className="bg-white py-10">
      <div className="container mx-auto px-5">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-[#00224d]">Trusted By</h2>
          <p className="mt-1 text-base text-[#676565]">
            Backed by world-class companies
          </p>
        </div>

        <div
          ref={viewportRef}
          className="relative cursor-grab overflow-hidden touch-pan-y active:cursor-grabbing"
        >
          <div ref={trackRef} className="flex w-max will-change-transform">
            {logos("original")}
            {logos("duplicate", true)}
          </div>
        </div>
      </div>
    </section>
  );
}
