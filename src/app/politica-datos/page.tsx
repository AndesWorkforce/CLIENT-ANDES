import React from "react";
import Link from "next/link";

export default function PoliticaDatosPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Política de Tratamiento de Datos Personales
            </h1>
            <p className="text-lg text-gray-600">
              Fundación Andes - Protección de Datos Personales
            </p>
          </div>

          <div className="prose max-w-none text-gray-700 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Identificación del Responsable
              </h2>
              <p>
                <strong>Fundación Andes</strong> es el responsable del
                tratamiento de los datos personales recolectados a través de
                esta plataforma. Nos comprometemos a proteger la privacidad y
                confidencialidad de la información personal que nos
                proporciones.
              </p>
              <div className="mt-3">
                <p>
                  <strong>Dirección:</strong> [Dirección de la Fundación Andes]
                </p>
                <p>
                  <strong>Teléfono:</strong> [Número de contacto]
                </p>
                <p>
                  <strong>Email:</strong> privacidad@fundacionandes.org
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Datos que Recolectamos
              </h2>
              <p>Recolectamos los siguientes tipos de datos personales:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  <strong>Datos de identificación:</strong> Nombres, apellidos,
                  documento de identidad, fecha de nacimiento
                </li>
                <li>
                  <strong>Datos de contacto:</strong> Dirección de correo
                  electrónico, número de teléfono, dirección física
                </li>
                <li>
                  <strong>Información profesional:</strong> Experiencia laboral,
                  formación académica, habilidades y competencias
                </li>
                <li>
                  <strong>Datos socioeconómicos:</strong> Información sobre
                  situación laboral, nivel de ingresos (cuando sea relevante)
                </li>
                <li>
                  <strong>Documentos:</strong> CV, certificados, cartas de
                  recomendación y otros documentos que subas voluntariamente
                </li>
                <li>
                  <strong>Datos de navegación:</strong> Información sobre tu uso
                  de la plataforma, preferencias y configuraciones
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Finalidades del Tratamiento
              </h2>
              <p>
                Utilizamos tus datos personales para las siguientes finalidades:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  <strong>Gestión de perfiles:</strong> Crear y mantener tu
                  perfil de usuario en la plataforma
                </li>
                <li>
                  <strong>Intermediación laboral:</strong> Conectarte con
                  oportunidades laborales y empleadores relevantes
                </li>
                <li>
                  <strong>Comunicaciones:</strong> Enviarte notificaciones sobre
                  oportunidades, actualizaciones de la plataforma y
                  comunicaciones relevantes
                </li>
                <li>
                  <strong>Mejora del servicio:</strong> Analizar el uso de la
                  plataforma para mejorar nuestros servicios
                </li>
                <li>
                  <strong>Cumplimiento legal:</strong> Cumplir con obligaciones
                  legales y regulatorias aplicables
                </li>
                <li>
                  <strong>Estudios estadísticos:</strong> Realizar análisis
                  agregados y anónimos para estudios de mercado laboral
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Base Legal del Tratamiento
              </h2>
              <p>El tratamiento de tus datos personales se basa en:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  <strong>Consentimiento:</strong> Has dado tu consentimiento
                  libre, específico e informado
                </li>
                <li>
                  <strong>Ejecución contractual:</strong> Es necesario para la
                  prestación de nuestros servicios
                </li>
                <li>
                  <strong>Interés legítimo:</strong> Para mejorar nuestros
                  servicios y realizar estudios estadísticos
                </li>
                <li>
                  <strong>Cumplimiento legal:</strong> Para cumplir con
                  obligaciones legales aplicables
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Compartir Información
              </h2>
              <p>
                Podemos compartir tu información personal en las siguientes
                circunstancias:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  <strong>Con empleadores:</strong> Cuando apliques a ofertas
                  laborales o cuando sea relevante para procesos de selección
                </li>
                <li>
                  <strong>Proveedores de servicios:</strong> Con terceros que
                  nos ayudan a operar la plataforma (hosting, análisis, etc.)
                </li>
                <li>
                  <strong>Autoridades competentes:</strong> Cuando sea requerido
                  por ley o para proteger nuestros derechos
                </li>
                <li>
                  <strong>Transferencias corporativas:</strong> En caso de
                  fusión, adquisición o venta de activos
                </li>
              </ul>
              <p className="mt-3">
                <strong>Importante:</strong> Nunca venderemos, alquilaremos o
                compartiremos tu información personal con terceros para fines
                comerciales sin tu consentimiento expreso.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Seguridad de los Datos
              </h2>
              <p>
                Implementamos medidas técnicas y organizativas apropiadas para
                proteger tus datos personales contra el acceso no autorizado,
                alteración, divulgación o destrucción, incluyendo:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Cifrado de datos en tránsito y en reposo</li>
                <li>Controles de acceso y autenticación</li>
                <li>Monitoreo y auditorías de seguridad regulares</li>
                <li>Capacitación en privacidad para nuestro personal</li>
                <li>Contratos de confidencialidad con proveedores</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Retención de Datos
              </h2>
              <p>
                Conservaremos tus datos personales durante el tiempo necesario
                para cumplir con las finalidades para las cuales fueron
                recolectados, considerando:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  <strong>Usuarios activos:</strong> Mientras mantengas tu
                  cuenta activa
                </li>
                <li>
                  <strong>Usuarios inactivos:</strong> Hasta 2 años después de
                  la última actividad
                </li>
                <li>
                  <strong>Datos legales:</strong> Según los plazos establecidos
                  por la legislación aplicable
                </li>
                <li>
                  <strong>Estudios estadísticos:</strong> En forma anonimizada
                  por tiempo indefinido
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Tus Derechos
              </h2>
              <p>
                Tienes los siguientes derechos respecto a tus datos personales:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  <strong>Acceso:</strong> Conocer qué datos tenemos sobre ti
                </li>
                <li>
                  <strong>Rectificación:</strong> Corregir datos inexactos o
                  incompletos
                </li>
                <li>
                  <strong>Supresión:</strong> Solicitar la eliminación de tus
                  datos
                </li>
                <li>
                  <strong>Portabilidad:</strong> Recibir tus datos en formato
                  estructurado
                </li>
                <li>
                  <strong>Oposición:</strong> Oponerte al tratamiento de tus
                  datos
                </li>
                <li>
                  <strong>Limitación:</strong> Restringir el procesamiento de
                  tus datos
                </li>
                <li>
                  <strong>Revocación del consentimiento:</strong> Retirar tu
                  consentimiento en cualquier momento
                </li>
              </ul>
              <p className="mt-3">
                Para ejercer estos derechos, contáctanos a:{" "}
                <strong>privacidad@fundacionandes.org</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Transferencias Internacionales
              </h2>
              <p>
                Si transferimos tus datos personales fuera del país, nos
                aseguraremos de que se mantengan las garantías adecuadas de
                protección, mediante:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Cláusulas contractuales estándar aprobadas</li>
                <li>Certificaciones de adecuación</li>
                <li>Otros mecanismos legalmente reconocidos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Menores de Edad
              </h2>
              <p>
                Nuestros servicios están dirigidos a personas mayores de 18
                años. No recolectamos conscientemente datos personales de
                menores de edad sin el consentimiento de sus padres o tutores
                legales.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Cambios a esta Política
              </h2>
              <p>
                Podemos actualizar esta política periódicamente. Te
                notificaremos sobre cambios materiales a través de la plataforma
                o por correo electrónico. La versión actualizada será efectiva
                desde su publicación.
              </p>
              <p className="mt-3">
                <strong>Última actualización:</strong>{" "}
                {new Date().toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                12. Contacto
              </h2>
              <p>
                Si tienes preguntas sobre esta política o sobre el tratamiento
                de tus datos personales, puedes contactarnos:
              </p>
              <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                <p>
                  <strong>Email:</strong> privacidad@fundacionandes.org
                </p>
                <p>
                  <strong>Teléfono:</strong> [Número de contacto]
                </p>
                <p>
                  <strong>Dirección:</strong> [Dirección de la Fundación Andes]
                </p>
                <p>
                  <strong>Horario de atención:</strong> Lunes a Viernes, 9:00 AM
                  - 5:00 PM
                </p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex justify-center space-x-4">
              <Link
                href="/auth/register"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Volver al Registro
              </Link>
              <Link
                href="/profile"
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Ir a Mi Perfil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
