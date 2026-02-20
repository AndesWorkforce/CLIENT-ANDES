"use client";

import { UserCheck, TrendingUp, Tag } from "lucide-react";
import Image from "next/image";

interface BenefitsSectionProps {
  onContactClick: () => void;
}

export default function BenefitsSection({ onContactClick }: BenefitsSectionProps) {
  return (
    <section className="relative w-full h-[700px] flex bg-white">
      {/* Left side - Content */}
      <div className="w-[55%] px-[73px] py-[81px] flex items-center">
        <div className="flex flex-col gap-[50px] py-[40px] max-w-[645px]">
          {/* Title */}
          <h2 className="text-[40px] font-bold text-black leading-normal">
            Elevate Your Team with<br />World-Class Talent
          </h2>

          {/* Benefits List */}
          <div className="flex flex-col gap-[30px] max-w-[572px]">
            {/* Benefit 1 */}
            <div className="flex gap-[10px] items-start">
              <div className="flex-shrink-0">
                <UserCheck size={45} className="text-[#0097b2]" />
              </div>
              <div className="flex flex-col text-base leading-[25px]">
                <h3 className="font-bold text-[#0097b2]">Vetted Elite Talent</h3>
                <p className="text-black">
                  Access a pool of highly skilled professionals dedicated to excellence
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex gap-[10px] items-start">
              <div className="flex-shrink-0">
                <TrendingUp size={45} className="text-[#0097b2]" />
              </div>
              <div className="flex flex-col text-base leading-[25px]">
                <h3 className="font-bold text-[#0097b2]">High-Impact Performance</h3>
                <p className="text-black">
                  Every role is filled with experts committed to delivering results
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex gap-[10px] items-start">
              <div className="flex-shrink-0">
                <Tag size={45} className="text-[#0097b2] -scale-y-100 rotate-180" />
              </div>
              <div className="flex flex-col text-base leading-[25px]">
                <h3 className="font-bold text-[#0097b2]">Exceptional Value</h3>
                <p className="text-black">
                  Positions start at{" "}
                  <span className="font-bold">$2,000/month</span> with zero compromise on
                  quality
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={onContactClick}
            className="bg-[#0097b2] hover:bg-[#007A8F] text-white px-15 py-3 rounded-[20px] text-base font-medium transition-colors cursor-pointer w-fit"
          >
            Contact Us
          </button>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="w-[45%] relative">
        <Image
          src="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/Rectangle%203.png"
          alt="Professional working"
          fill
          className="object-cover"
        />
      </div>
    </section>
  );
}
