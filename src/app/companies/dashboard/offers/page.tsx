import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ofertas Asignadas | Andes",
  description: "Gestión de ofertas laborales asignadas a tu empresa",
};

export default function CompanyOffers() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Ofertas Laborales Asignadas
        </h1>
      </div>

      {/* Aquí irá el componente de tabla de ofertas que reutilizaremos del admin */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          {/* Placeholder - Aquí se integrará el componente de tabla */}
          <p className="text-gray-600">
            Lista de ofertas laborales cargando...
          </p>
        </div>
      </div>
    </div>
  );
}
