"use client";

import { useState, useEffect } from "react";
import OfferViewer from "@/app/components/OfferViewer";

export default function OfferDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffer = async () => {
      setLoading(true);
      try {
        // En una aplicación real, harías una llamada a la API
        // const response = await fetch(`/api/offers/${params.id}`);
        // const data = await response.json();

        // Simulamos datos de una oferta para este ejemplo
        const data = {
          id: params.id,
          titulo: "Desarrollador Full Stack",
          descripcion: JSON.stringify({
            "41f7c813-a99b-4142-96db-c1cd2e771179": {
              id: "41f7c813-a99b-4142-96db-c1cd2e771179",
              type: "HeadingOne",
              meta: {
                depth: 0,
                order: 0,
              },
              value: [
                {
                  id: "937fd900-344d-480e-9913-4c7bf41e2535",
                  type: "heading-one",
                  props: {
                    nodeType: "block",
                  },
                  children: [
                    {
                      text: "Desarrollador Full Stack",
                    },
                  ],
                },
              ],
            },
            "4eb248b7-a3c3-4404-bd4a-769e8bcb2530": {
              id: "4eb248b7-a3c3-4404-bd4a-769e8bcb2530",
              type: "Paragraph",
              value: [
                {
                  id: "522f87cc-f0af-4e7c-a1ea-fdfeb2923b39",
                  type: "paragraph",
                  children: [
                    {
                      text: "Buscamos un profesional con experiencia en desarrollo web para unirse a nuestro equipo.",
                    },
                  ],
                },
              ],
              meta: {
                align: "left",
                depth: 0,
                order: 1,
              },
            },
          }),
          requerimientos: JSON.stringify({
            "5eb248b7-a3c3-4404-bd4a-769e8bcb2540": {
              id: "5eb248b7-a3c3-4404-bd4a-769e8bcb2540",
              type: "Paragraph",
              value: [
                {
                  id: "622f87cc-f0af-4e7c-a1ea-fdfeb2923b49",
                  type: "paragraph",
                  children: [
                    {
                      text: "Se requiere experiencia de 3 años mínimo en desarrollo web con React y Node.js. Conocimientos en bases de datos SQL y NoSQL.",
                    },
                  ],
                },
              ],
              meta: {
                align: "left",
                depth: 0,
                order: 0,
              },
            },
          }),
          empresa: "Andes Tech",
          ubicacion: "Remoto",
          fechaPublicacion: "2023-07-15",
        };

        setOffer(data);
      } catch (error) {
        console.error("Error al cargar la oferta:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Oferta no encontrada</h1>
          <p className="text-gray-600">
            La oferta que buscas no existe o ha sido eliminada.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg overflow-hidden shadow">
          <div className="px-6 py-8">
            <h1 className="text-2xl font-bold mb-4">{offer.titulo}</h1>

            <div className="flex items-center mb-6 text-sm text-gray-600">
              <span className="mr-4">{offer.empresa}</span>
              <span className="mr-4">•</span>
              <span>{offer.ubicacion}</span>
              <span className="mr-4 ml-4">•</span>
              <span>
                Publicado:{" "}
                {new Date(offer.fechaPublicacion).toLocaleDateString()}
              </span>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold mb-4">Descripción</h2>
              <OfferViewer
                content={offer.descripcion}
                className="prose max-w-none"
              />
            </div>

            <div className="border-t border-gray-200 mt-6 pt-6">
              <h2 className="text-lg font-semibold mb-4">Requerimientos</h2>
              <OfferViewer
                content={offer.requerimientos}
                className="prose max-w-none"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
