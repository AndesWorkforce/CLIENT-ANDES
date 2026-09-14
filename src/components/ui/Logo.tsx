import Image from "next/image";

type LogoProps = {
  variant?: "default" | "white";
  className?: string;
};

export default function Logo({ variant = "default", className }: LogoProps) {
  return (
    <div className={`relative w-[114px] h-[44px] ${className ?? ""}`}>
      <Image
        src="https://appwiseinnovations.dev/Andes/logo-andes.png"
        alt="Andes Workforce"
        fill
        sizes="114px"
        priority
        className={`object-contain object-left ${
          variant === "white" ? "brightness-0 invert" : ""
        }`}
      />
    </div>
  );
}
