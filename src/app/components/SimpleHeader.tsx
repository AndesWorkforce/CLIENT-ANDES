import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import Logo from "./Logo";

export default function SimpleHeader({ title }: { title: string }) {
  return (
    <header className="bg-white sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-gray-700">
            <ChevronLeft size={20} color="#0097B2" />
          </Link>
          <h1 className="text-xl font-medium">{title}</h1>
        </div>
        <div>
          <Logo />
        </div>
      </div>
    </header>
  );
}
