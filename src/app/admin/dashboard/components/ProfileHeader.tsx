import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Phone, Mail } from "lucide-react";

interface ProfileHeaderProps {
  name: string;
  email?: string;
  phone?: string;
}

export default function ProfileHeader({
  name,
  email,
  phone,
}: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <Link
            href="/admin/dashboard/candidates"
            className="text-[#0097B2] flex items-center hover:underline mr-4"
          >
            <ArrowLeft size={16} className="mr-1" />
            <span>Volver</span>
          </Link>
          <h1 className="text-xl font-medium text-[#0097B2]">
            {name || "Sin nombre"}
          </h1>
        </div>

        <hr className="border-[#E2E2E2] my-2" />

        <div className="space-y-3">
          {phone && (
            <div className="flex items-center">
              <Phone size={18} className="text-[#0097B2] mr-2" />
              <span className="text-gray-700">{phone}</span>
            </div>
          )}

          {email && (
            <div className="flex items-center">
              <Mail size={18} className="text-[#0097B2] mr-2" />
              <span className="text-gray-700">{email}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
