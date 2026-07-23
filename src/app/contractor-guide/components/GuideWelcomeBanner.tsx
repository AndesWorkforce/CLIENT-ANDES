import { GUIDE_WELCOME } from "../contractor-guide.data";

export default function GuideWelcomeBanner() {
  return (
    <div className="w-full rounded-[12px] border border-[#0097b2] bg-[#edfcf2] px-4 py-4 sm:px-6 sm:py-5">
      <p className="text-[16px] sm:text-[18px] font-medium leading-[1.4] text-[#04343d]">
        {GUIDE_WELCOME}
      </p>
    </div>
  );
}
