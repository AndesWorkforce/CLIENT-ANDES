"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function PoliticaDatosPage() {
  const [language, setLanguage] = useState<"es" | "en">("es");

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {language === "es"
                ? "POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES"
                : "PERSONAL DATA PROCESSING POLICY"}
            </h1>
            <p className="text-lg text-gray-600">ANDES WORKFORCE</p>

            {/* Language Toggle */}
            <div className="mt-6 flex justify-center">
              <div className="bg-gray-100 rounded-lg p-1 flex">
                <button
                  onClick={() => setLanguage("es")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                    language === "es"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Español
                </button>
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                    language === "en"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  English
                </button>
              </div>
            </div>
          </div>

          <div className="prose max-w-none text-gray-700 space-y-6">
            {language === "es" ? (
              // Spanish Version
              <>
                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    1. Objetivo
                  </h2>
                  <p>
                    Establecer los lineamientos para el tratamiento de los datos
                    personales recolectados por Andes Workforce, garantizando la
                    protección de los derechos de los titulares conforme a
                    principios internacionales de privacidad y protección de
                    datos.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    2. Alcance
                  </h2>
                  <p>
                    Aplica a todos los datos personales recolectados,
                    almacenados, usados, circulados y/o suprimidos por Andes
                    Workforce en el desarrollo de su actividad de outsourcing de
                    talento humano, especialmente con empresas en Estados
                    Unidos.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    3. Glosario
                  </h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Aviso de Privacidad:</strong> Comunicación
                      dirigida al titular de los datos personales mediante la
                      cual se informa sobre la existencia de esta política, la
                      forma de acceder a ella y las finalidades del tratamiento.
                    </li>
                    <li>
                      <strong>Autorización:</strong> Consentimiento previo,
                      expreso e informado del titular de los datos para el
                      tratamiento de sus datos personales.
                    </li>
                    <li>
                      <strong>Bases de Datos:</strong> Conjunto organizado de
                      datos personales que son objeto de tratamiento.
                    </li>
                    <li>
                      <strong>Dato Personal:</strong> Cualquier información
                      vinculada o que pueda asociarse a una persona natural
                      identificada o identificable.
                    </li>
                    <li>
                      <strong>Dato Sensible:</strong> Información que afecta la
                      intimidad del titular o cuyo uso indebido puede generar
                      discriminación (por ejemplo, salud, orientación sexual,
                      religión, ideología, origen étnico, entre otros).
                    </li>
                    <li>
                      <strong>Encargado del Tratamiento:</strong> Persona que
                      realiza el tratamiento de datos personales por cuenta del
                      responsable.
                    </li>
                    <li>
                      <strong>Responsable del Tratamiento:</strong> Persona
                      natural o jurídica que decide sobre la finalidad y
                      tratamiento de los datos personales.
                    </li>
                    <li>
                      <strong>Titular:</strong> Persona natural cuyos datos
                      personales son objeto de tratamiento.
                    </li>
                    <li>
                      <strong>Transferencia Internacional:</strong> Envío de
                      datos personales a otro país, garantizando niveles
                      adecuados de protección.
                    </li>
                    <li>
                      <strong>Transmisión:</strong> Comunicación de datos
                      personales a un encargado, dentro o fuera del país, para
                      que los trate por cuenta del responsable.
                    </li>
                    <li>
                      <strong>Tratamiento:</strong> Cualquier operación sobre
                      datos personales como recolección, almacenamiento, uso,
                      circulación o supresión.
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    4. Responsable del Tratamiento
                  </h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Nombre:</strong> Andes Workforce
                    </li>
                    <li>
                      <strong>Correo electrónico:</strong>{" "}
                      info@andes-workforce.com
                    </li>
                    <li>
                      <strong>Teléfono:</strong> +1 3057030023
                    </li>
                    <li>
                      <strong>Sitio Web:</strong> andes-workforce.com
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    5. Finalidades del Tratamiento
                  </h2>
                  <p>
                    Los datos personales recolectados serán utilizados para:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-3">
                    <li>
                      Evaluar y gestionar procesos de selección de personal.
                    </li>
                    <li>Ofrecer servicios requeridos por los clientes.</li>
                    <li>
                      Facilitar la conexión entre clientes y proveedores de
                      servicios.
                    </li>
                    <li>
                      Realizar seguimiento a la calidad y satisfacción del
                      servicio prestado.
                    </li>
                    <li>
                      Promover la oferta y demanda de servicios con empresas
                      contratantes.
                    </li>
                    <li>
                      Compartir perfiles y hojas de vida con empresas
                      contratantes.
                    </li>
                    <li>
                      Gestionar pagos, afiliaciones y procesos contractuales.
                    </li>
                    <li>Cumplir con obligaciones legales y contractuales.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    6. Principios
                  </h2>
                  <p>
                    El tratamiento de datos personales se realizará bajo los
                    siguientes principios:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-3">
                    <li>
                      <strong>Legalidad:</strong> Se realizará conforme a la
                      legislación aplicable en cada jurisdicción.
                    </li>
                    <li>
                      <strong>Finalidad:</strong> Los datos serán tratados con
                      una finalidad legítima, clara y previamente informada.
                    </li>
                    <li>
                      <strong>Libertad:</strong> El tratamiento se hará con el
                      consentimiento del titular.
                    </li>
                    <li>
                      <strong>Veracidad:</strong> La información será veraz,
                      actualizada y verificable.
                    </li>
                    <li>
                      <strong>Transparencia:</strong> El titular podrá conocer
                      en todo momento el uso de sus datos.
                    </li>
                    <li>
                      <strong>Acceso y Circulación Restringida:</strong> El
                      tratamiento solo será realizado por personas autorizadas.
                    </li>
                    <li>
                      <strong>Seguridad:</strong> Se adoptarán medidas para
                      proteger los datos contra el acceso no autorizado o
                      fraudulento.
                    </li>
                    <li>
                      <strong>Confidencialidad:</strong> Toda persona
                      involucrada en el tratamiento está obligada a guardar
                      reserva sobre los datos.
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    7. Transferencia Internacional de Datos
                  </h2>
                  <p>
                    Los datos personales podrán ser transferidos a otros países
                    donde Andes Workforce o sus aliados operen, siempre que se
                    garantice un nivel adecuado de protección de datos y se
                    cumplan los requisitos legales aplicables.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    8. Derechos del Titular
                  </h2>
                  <p>Los titulares de datos personales tienen derecho a:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-3">
                    <li>Conocer, actualizar y rectificar sus datos.</li>
                    <li>
                      Solicitar la eliminación de sus datos personales cuando no
                      se respeten los principios o finalidades autorizadas.
                    </li>
                    <li>Solicitar prueba de la autorización otorgada.</li>
                    <li>Ser informados sobre el uso que se da a sus datos.</li>
                    <li>
                      Revocar la autorización en cualquier momento, siempre que
                      no exista una obligación legal o contractual vigente.
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    9. Ejercicio de Derechos
                  </h2>
                  <p>
                    Los titulares pueden ejercer sus derechos mediante una
                    solicitud escrita enviada al correo electrónico
                    info@andes-workforce.com, incluyendo:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-3">
                    <li>Nombre completo del solicitante</li>
                    <li>Tipo de solicitud</li>
                    <li>Descripción clara del requerimiento o corrección</li>
                    <li>Datos de contacto</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    10. Vigencia
                  </h2>
                  <p>
                    Esta política entra en vigor a partir del{" "}
                    {new Date().toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    y estará disponible en el sitio web de Andes Workforce o
                    mediante solicitud al correo de contacto.
                  </p>
                </section>
              </>
            ) : (
              // English Version
              <>
                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    1. Objective
                  </h2>
                  <p>
                    Establish the guidelines for the processing of personal data
                    collected by Andes Workforce, guaranteeing the protection of
                    the rights of the owners in accordance with international
                    principles of privacy and data protection.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    2. Scope
                  </h2>
                  <p>
                    It applies to all personal data collected, stored, used,
                    circulated and/or deleted by Andes Workforce in the
                    development of its human talent outsourcing activity,
                    especially with companies in the United States.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    3. Glossary
                  </h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Privacy Notice:</strong> Communication addressed
                      to the owner of the personal data informing them about the
                      existence of this policy, the way to access it and the
                      purposes of the processing.
                    </li>
                    <li>
                      <strong>Authorization:</strong> Prior, express and
                      informed consent of the data subject for the processing of
                      their personal data.
                    </li>
                    <li>
                      <strong>Databases:</strong> An organized set of personal
                      data that is subject to processing.
                    </li>
                    <li>
                      <strong>Personal Data:</strong> Any information linked to
                      or that can be associated with an identified or
                      identifiable natural person.
                    </li>
                    <li>
                      <strong>Sensitive Data:</strong> Information that affects
                      the privacy of the owner or whose improper use may
                      generate discrimination (for example, health, sexual
                      orientation, religion, ideology, ethnic origin, among
                      others).
                    </li>
                    <li>
                      <strong>Data Processor:</strong> Person who processes
                      personal data on behalf of the data controller.
                    </li>
                    <li>
                      <strong>Data Controller:</strong> Natural or legal person
                      who decides on the purpose and processing of personal
                      data.
                    </li>
                    <li>
                      <strong>Owner:</strong> Natural person whose personal data
                      are subject to processing.
                    </li>
                    <li>
                      <strong>International Transfer:</strong> Sending personal
                      data to another country, guaranteeing adequate levels of
                      protection.
                    </li>
                    <li>
                      <strong>Transmission:</strong> Communication of personal
                      data to a data processor, inside or outside the country,
                      so that they can process them on behalf of the controller.
                    </li>
                    <li>
                      <strong>Processing:</strong> Any operation on personal
                      data such as collection, storage, use, circulation or
                      deletion.
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    4. Data Controller
                  </h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Name:</strong> Andes Workforce
                    </li>
                    <li>
                      <strong>Email:</strong> info@andes-workforce.com
                    </li>
                    <li>
                      <strong>Phone:</strong> +1 3057030023
                    </li>
                    <li>
                      <strong>Website:</strong> andes-workforce.com
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    5. Purposes of the Processing
                  </h2>
                  <p>The personal data collected will be used to:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-3">
                    <li>Evaluate and manage personnel selection processes.</li>
                    <li>To offer services required by customers.</li>
                    <li>
                      Facilitate the connection between customers and service
                      providers.
                    </li>
                    <li>
                      Monitor the quality and satisfaction of the service
                      provided.
                    </li>
                    <li>
                      Promote the supply and demand of services with contracting
                      companies.
                    </li>
                    <li>
                      Share profiles and resumes with contracting companies.
                    </li>
                    <li>
                      Manage payments, memberships, and contract processes.
                    </li>
                    <li>Comply with legal and contractual obligations.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    6. Principles
                  </h2>
                  <p>
                    The processing of personal data will be carried out under
                    the following principles:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-3">
                    <li>
                      <strong>Legality:</strong> It will be carried out in
                      accordance with the applicable legislation in each
                      jurisdiction.
                    </li>
                    <li>
                      <strong>Purpose:</strong> The data will be processed for a
                      legitimate, clear and previously informed purpose.
                    </li>
                    <li>
                      <strong>Freedom:</strong> The processing will be carried
                      out with the consent of the owner.
                    </li>
                    <li>
                      <strong>Veracity:</strong> The information will be
                      truthful, updated and verifiable.
                    </li>
                    <li>
                      <strong>Transparency:</strong> The owner may know at all
                      times the use of his/her data.
                    </li>
                    <li>
                      <strong>Access and Restricted Circulation:</strong> The
                      treatment will only be carried out by authorized persons.
                    </li>
                    <li>
                      <strong>Security:</strong> Measures will be taken to
                      protect data against unauthorized or fraudulent access.
                    </li>
                    <li>
                      <strong>Confidentiality:</strong> Any person involved in
                      the processing is obliged to keep the data confidential.
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    7. International Data Transfer
                  </h2>
                  <p>
                    Personal data may be transferred to other countries where
                    Andes Workforce or its partners operate, provided that an
                    adequate level of data protection is guaranteed and
                    applicable legal requirements are met.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    8. Rights of the Owner
                  </h2>
                  <p>Owners of personal data have the right to:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-3">
                    <li>Know, update and rectify your data.</li>
                    <li>
                      Request the deletion of your personal data when the
                      principles or authorised purposes are not respected.
                    </li>
                    <li>Request proof of the authorization granted.</li>
                    <li>To be informed about the use given to their data.</li>
                    <li>
                      Revoke the authorisation at any time, provided that there
                      is no legal or contractual obligation in force.
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    9. Exercise of Rights
                  </h2>
                  <p>
                    Owners may exercise their rights by means of a written
                    request sent to the email info@andes-workforce.com,
                    including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-3">
                    <li>Applicant&apos;s full name</li>
                    <li>Type of request</li>
                    <li>Clear description of the requirement or correction</li>
                    <li>Contact details</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    10. Validity
                  </h2>
                  <p>
                    This policy is effective as of{" "}
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    and will be available on the Andes Workforce website or by
                    request to the contact email.
                  </p>
                </section>
              </>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex justify-center space-x-4">
              <Link
                href="/auth/register"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {language === "es" ? "Volver al Registro" : "Back to Register"}
              </Link>
              <Link
                href="/profile"
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                {language === "es" ? "Ir a Mi Perfil" : "Go to My Profile"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
