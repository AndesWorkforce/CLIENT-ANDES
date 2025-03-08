import Image from "next/image";

export default function Logo() {
  return (
    <div className="relative w-[120px] h-[40px]">
      <Image
        src="https://appwiseinnovations.dev/Andes/logo-andes.png"
        alt="Andes Workforce"
        fill
        sizes="120px"
        priority
        className="object-contain"
      />
    </div>
  );
}
