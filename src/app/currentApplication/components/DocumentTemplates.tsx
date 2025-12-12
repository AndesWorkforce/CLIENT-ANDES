import React from "react";

interface DocumentTemplateProps {
  candidateName?: string;
  companyName?: string;
  position?: string;
  startDate?: string;
}

export const PoliticaPrevencionAcoso: React.FC<DocumentTemplateProps> = ({
  candidateName = "[Nombre del Candidato]",
  position = "[Posición]",
}) => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-gray-900 leading-relaxed">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 leading-tight">
          POLÍTICA DE PREVENCIÓN Y ATENCIÓN DEL ACOSO LABORAL, ACOSO SEXUAL Y
          ACOSO SEXUAL LABORAL
        </h1>
        {/* <h2 className="text-lg font-semibold text-gray-700">{companyName}</h2> */}
        {/* <p className="text-sm text-gray-600 mt-4">Colombia - 2024</p> */}
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            1. Introducción
          </h3>
          <p className="text-justify">
            La presente política tiene como propósito establecer los
            lineamientos generales para la prevención, atención y sanción del
            acoso laboral, acoso sexual y acoso sexual laboral en ANDES
            COLOMBIA. Esta política refleja el compromiso institucional con la
            promoción de ambientes laborales sanos, seguros y respetuosos de la
            dignidad humana.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            2. Objetivo
          </h3>
          <p className="text-justify">
            Establecer directrices claras para la prevención, atención oportuna
            y sanción adecuada de las conductas de acoso laboral, acoso sexual y
            acoso sexual laboral en ANDES COLOMBIA, incluyendo a trabajadores,
            contratistas por prestación de servicios y personas naturales
            vinculadas.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            3. Ámbito de Aplicación
          </h3>
          <p className="text-justify">
            Esta política aplica a todos los trabajadores, colaboradores,
            contratistas por prestación de servicios, personas naturales
            vinculadas por cualquier modalidad contractual, practicantes,
            aprendices, voluntarios y cualquier otra persona que tenga una
            relación directa o indirecta con ANDES COLOMBIA, incluido{" "}
            <strong>{candidateName}</strong> en su rol como{" "}
            <strong>{position}</strong>.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            4. Marco Legal
          </h3>
          <p className="text-justify mb-3">
            Esta política se fundamenta en la normativa legal vigente en
            Colombia, entre ellas:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Ley 1010 de 2006</li>
            <li>Ley 1257 de 2008</li>
            <li>Código Sustantivo del Trabajo</li>
            <li>Resolución 652 de 2012</li>
            <li>Resolución 1356 de 2012</li>
            <li>Constitución Política de Colombia</li>
            <li>Otras normas complementarias</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            5. Definiciones
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">
                Acoso laboral:
              </h4>
              <p className="text-justify">
                Toda conducta persistente y demostrable ejercida sobre un
                trabajador por parte de un empleador, jefe o compañero,
                encaminada a infundir miedo, intimidación, terror y angustia.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">
                Acoso sexual:
              </h4>
              <p className="text-justify">
                Toda conducta de naturaleza sexual, no deseada, que afecta la
                dignidad de una persona en el trabajo.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">
                Acoso sexual laboral:
              </h4>
              <p className="text-justify">
                Manifestación del acoso sexual en el ámbito laboral, con
                implicaciones jerárquicas o contractuales.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">
                Conductas prohibidas:
              </h4>
              <p className="text-justify">
                Comentarios ofensivos, contacto físico no consentido, propuestas
                sexuales, amenazas, entre otros.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            6. Principios Rectores
          </h3>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Confidencialidad</li>
            <li>Respeto</li>
            <li>Diligencia</li>
            <li>No revictimización</li>
            <li>Perspectiva de género</li>
            <li>Enfoque diferencial</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            7. Estrategias de Prevención
          </h3>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Jornadas de sensibilización y formación</li>
            <li>Difusión de la política institucional</li>
            <li>Promoción del respeto en el ambiente laboral</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            8. Mecanismos de Atención y Denuncia
          </h3>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Canales confidenciales para la denuncia</li>
            <li>Comité de Convivencia Laboral</li>
            <li>Procedimiento interno de atención</li>
            <li>Medidas de protección a las víctimas</li>
            <li>Derivación a autoridades competentes si aplica</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            9. Medidas
          </h3>
          <p className="text-justify">
            Las conductas de acoso serán evaluadas por la Gerencia de ANDES
            COLOMBIA, según su gravedad y con base en el protocolo guiará a las
            partes afectadas a fin de que acudan a las rutas establecidas
            normativamente para los fines correspondientes. En caso de encontrar
            conductas que afecten a las personas que hacen parte de nuestro
            grupo de intereses, se tomarán medidas contractuales, entre ellas,
            podrá darse por terminado el contrato de prestación de servicios. En
            casos graves, se informará a las autoridades competentes.
          </p>
        </section>

        {/* <section className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Compromiso del Colaborador
          </h3>
          <p className="text-justify">
            Yo, <strong>{candidateName}</strong>, declaro haber leído, entendido
            y me comprometo a cumplir con esta política de prevención y atención
            del acoso laboral, acoso sexual y acoso sexual laboral de ANDES
            COLOMBIA. Me comprometo a mantener un ambiente laboral respetuoso,
            libre de acoso y a reportar cualquier situación de acoso de la que
            tenga conocimiento a través de los canales establecidos.
          </p>
        </section> */}
      </div>

      <div className="mt-12 pt-8 border-t border-gray-300">
        <p className="text-center text-sm text-gray-600">
          Este documento ha sido leído y aceptado digitalmente por{" "}
          <strong>{candidateName}</strong> a través del sistema de ANDES
          COLOMBIA
        </p>
        <p className="text-center text-xs text-gray-500 mt-2">
          Fecha: {new Date().toLocaleDateString("es-CO")}
        </p>
      </div>
    </div>
  );
};

export const ContratoServicio: React.FC<DocumentTemplateProps> = ({
  candidateName = "[Nombre del Candidato]",
  companyName = "ANDES COLOMBIA",
  position = "[Posición]",
}) => {
  const currentDate = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-gray-900 leading-relaxed">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          PROTOCOLO DE COMUNICACIONES:
          <br />
          CONTRATANTE – CONTRATISTA POR
          <br />
          PRESTACIÓN DE SERVICIOS
          <br />
          (PERSONA NATURAL)
        </h1>
        <h2 className="text-lg font-semibold text-gray-700">{companyName}</h2>
        <p className="text-sm text-gray-600 mt-4">Colombia - {currentDate}</p>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-gray-50 p-3 rounded">
            1. Objetivo
          </h3>
          <p className="text-justify">
            Establecer las pautas de comunicación entre la Empresa Contratante y
            el Contratista, garantizando una coordinación eficaz de los
            servicios contratados sin generar una relación de subordinación
            laboral, de conformidad con la legislación colombiana vigente.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-gray-50 p-3 rounded">
            2. Principios Rectores
          </h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>Autonomía:</strong> Se respeta la independencia técnica,
              administrativa y operativa del contratista.
            </li>
            <li>
              <strong>No subordinación:</strong> No se impartirán órdenes
              directas, ni se exigirá cumplimiento de horarios o asistencia
              obligatoria, propios de una relación laboral.
            </li>
            <li>
              <strong>Comunicación efectiva:</strong> La información entre las
              partes será clara, oportuna y documentada.
            </li>
            <li>
              <strong>Transparencia:</strong> Todas las instrucciones y
              solicitudes estarán en el marco del objeto del contrato.
            </li>
            <li>
              <strong>Legalidad:</strong> Se cumplirá con lo dispuesto en la
              legislación laboral y civil vigente.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-gray-50 p-3 rounded">
            3. Canales de Comunicación
          </h3>
          <p className="text-sm text-gray-600 mb-2 italic">
            (incluir herramientas y contrato de comodato)
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>Correo electrónico institucional</strong> (del
              contratante) o personal (del contratista): Canal principal para
              comunicaciones formales.
            </li>
            <li>
              <strong>Reuniones virtuales o presenciales:</strong> Coordinadas
              previamente, con agenda clara y actas de reunión.
            </li>
            <li>
              <strong>Plataformas de gestión de proyectos</strong> (opcional):
              Siempre que no impliquen control horario ni supervisión directa
              del contratista.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-gray-50 p-3 rounded">
            4. Tipología de Comunicaciones
          </h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>Inicio de actividades:</strong> El contratista informará
              su cronograma estimado de ejecución.
            </li>
            <li>
              <strong>Seguimiento de actividades:</strong> Se podrá solicitar al
              contratista informes parciales, entregables o avances, siempre en
              función de resultados, no de cumplimiento de horarios.
            </li>
            <li>
              <strong>Solicitudes puntuales:</strong> Toda solicitud debe estar
              relacionada con el objeto del contrato. Se evitará lenguaje
              imperativo para mantener la independencia.
            </li>
            <li>
              <strong>Finalización del contrato:</strong> Se notificará con
              antelación según lo estipulado en el contrato, incluyendo entrega
              de informe final y evaluación de resultados.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-gray-50 p-3 rounded">
            5. Reuniones de Coordinación
          </h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              Se realizarán cuando sea estrictamente necesario para la ejecución
              del contrato.
            </li>
            <li>
              La convocatoria será mediante correo con mínimo 48 horas de
              antelación.
            </li>
            <li>
              Se dejará constancia de los temas tratados y compromisos (sin
              generar órdenes).
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-gray-50 p-3 rounded">
            6. Responsables de Comunicación
          </h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>Empresa Contratante:</strong> Un coordinador o supervisor
              del contrato será el punto de contacto oficial, sin asumir rol de
              jefe.
            </li>
            <li>
              <strong>Contratista:</strong> Será responsable de la entrega de
              productos y avances, según lo acordado contractualmente.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-red-50 p-3 rounded border-l-4 border-red-500">
            7. Prohibiciones Expresas
          </h3>
          <p className="font-semibold mb-2">No exigir al contratista:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Cumplimiento de horarios.</li>
            <li>Permanencia en instalaciones de la empresa.</li>
            <li>
              Uso de uniforme, carné con funciones operativas o correo
              institucional (excepto para temas de coordinación).
            </li>
            <li>
              Reporte diario de actividades en términos de tiempo trabajado.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-gray-50 p-3 rounded">
            8. Confidencialidad y Protección de Datos
          </h3>
          <p className="text-justify">
            Ambas partes mantendrán reserva sobre la información compartida en
            el marco del contrato. El contratista firmará un acuerdo de
            confidencialidad si es requerido, conforme a la Ley 1581 de 2012
            (Habeas Data).
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-gray-50 p-3 rounded">
            9. Actualización del Protocolo
          </h3>
          <p className="text-justify">
            Este protocolo podrá ser ajustado de mutuo acuerdo entre las partes,
            cuando se requiera mejorar el relacionamiento, siempre respetando el
            marco normativo.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-300">
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <p className="text-center text-sm text-gray-800 font-semibold">
            Este Protocolo de Comunicaciones ha sido aceptado digitalmente por{" "}
            <strong>{candidateName}</strong>
            <br />
            para el cargo de <strong>{position}</strong>
            <br />a través del sistema de {companyName} el {currentDate}
          </p>
        </div>
      </div>
    </div>
  );
};

export const AcuerdoConfidencialidad: React.FC<DocumentTemplateProps> = ({
  candidateName = "[Nombre del Candidato]",
  companyName = "ANDES COLOMBIA",
}) => {
  const currentDate = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-gray-900 leading-relaxed">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          ACUERDO DE CONFIDENCIALIDAD
        </h1>
        <h2 className="text-lg font-semibold text-gray-700">{companyName}</h2>
        <p className="text-sm text-gray-600 mt-4">Colombia - {currentDate}</p>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-gray-50 p-3 rounded">
            Entre:
          </h3>
          <p className="text-justify">
            La <strong>EMPRESA CONTRATANTE</strong> y{" "}
            <strong>EL CONTRATISTA</strong>, acuerdan celebrar el presente
            Acuerdo de Confidencialidad, el cual se regirá por las siguientes
            cláusulas:
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-gray-50 p-3 rounded">
            Primera - Objeto:
          </h3>
          <p className="text-justify">
            El presente Acuerdo tiene por objeto establecer las condiciones bajo
            las cuales <strong>EL CONTRATISTA</strong> se compromete a mantener
            la confidencialidad sobre la información que reciba o a la que tenga
            acceso en desarrollo del contrato de prestación de servicios
            suscrito con <strong>LA CONTRATANTE</strong>.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-gray-50 p-3 rounded">
            Segunda - Información Confidencial:
          </h3>
          <p className="text-justify">
            Se entiende por Información Confidencial toda información,
            documentación, datos, procesos, conocimientos técnicos, informes,
            especificaciones, metodologías, know-how, estrategias comerciales o
            cualquier otro tipo de información, ya sea escrita, verbal o
            contenida en cualquier medio, entregada por{" "}
            <strong>LA CONTRATANTE</strong> a <strong>EL CONTRATISTA</strong> o
            a la que este tenga acceso.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-gray-50 p-3 rounded">
            Tercera - Obligaciones del CONTRATISTA:
          </h3>
          <p className="text-justify mb-3">
            <strong>EL CONTRATISTA</strong> se compromete a:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              a) Utilizar la información confidencial única y exclusivamente
              para el desarrollo del objeto del contrato.
            </li>
            <li>
              b) No divulgar, copiar, reproducir, ceder, transmitir o comunicar
              la información confidencial a terceros.
            </li>
            <li>
              c) Tomar las medidas necesarias para evitar la divulgación no
              autorizada de la información.
            </li>
            <li>
              d) Informar de manera inmediata a <strong>LA CONTRATANTE</strong>{" "}
              en caso de pérdida, uso indebido o filtración de la información.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-gray-50 p-3 rounded">
            Cuarta - Excepciones a la Confidencialidad:
          </h3>
          <p className="text-justify mb-3">
            No será considerada información confidencial aquella que:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>a) Sea de dominio público sin violar este Acuerdo.</li>
            <li>
              b) Sea divulgada con autorización escrita de{" "}
              <strong>LA CONTRATANTE</strong>.
            </li>
            <li>
              c) Deba ser revelada por requerimiento legal o judicial, en cuyo
              caso <strong>EL CONTRATISTA</strong>
              deberá notificar a <strong>LA CONTRATANTE</strong> previamente.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-gray-50 p-3 rounded">
            Quinta - Vigencia:
          </h3>
          <p className="text-justify">
            La obligación de confidencialidad tendrá una vigencia igual a la del
            contrato de prestación de servicios y se extenderá por un período
            adicional de dos (2) años contados a partir de la terminación del
            contrato.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-gray-50 p-3 rounded">
            Sexta - Responsabilidad:
          </h3>
          <p className="text-justify">
            En caso de incumplimiento del presente Acuerdo,{" "}
            <strong>EL CONTRATISTA</strong> será responsable por los perjuicios
            causados a <strong>LA CONTRATANTE</strong>, sin perjuicio de las
            acciones legales a que haya lugar.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-gray-50 p-3 rounded">
            Séptima - Legislación Aplicable:
          </h3>
          <p className="text-justify">
            El presente Acuerdo se rige por las leyes de la República de
            Colombia.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-300">
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <p className="text-center text-sm text-gray-800 font-semibold">
            Este Acuerdo de Confidencialidad ha sido aceptado digitalmente por{" "}
            <strong>{candidateName}</strong>
            <br />a través del sistema de {companyName} el {currentDate}
          </p>
        </div>
      </div>
    </div>
  );
};

export const AnexosPoliticaAcoso: React.FC<DocumentTemplateProps> = ({
  candidateName = "[Nombre del Candidato]",
  companyName = "ANDES COLOMBIA",
}) => {
  const currentDate = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-gray-900 leading-relaxed">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          ANEXOS - POLÍTICA DE PREVENCIÓN Y<br />
          ATENCIÓN DEL ACOSO
        </h1>
        <h2 className="text-lg font-semibold text-gray-700">{companyName}</h2>
        <p className="text-sm text-gray-600 mt-4">Colombia - {currentDate}</p>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 bg-red-50 p-4 rounded border-l-4 border-red-500">
            Anexo 1: Formato de Denuncia de Acoso
          </h3>

          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Fecha de la denuncia:
                </label>
                <div className="border-b-2 border-dotted border-gray-400 h-8"></div>
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Nombre de la persona denunciante (opcional):
                </label>
                <div className="border-b-2 border-dotted border-gray-400 h-8"></div>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Vínculo con la empresa (marcar con una X):
              </label>
              <div className="flex flex-wrap gap-6">
                <span>[ ] Trabajador/a</span>
                <span>[ ] Contratista</span>
                <span>[ ] Practicante</span>
                <span>[ ] Otro: _______________</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Nombre del presunto/a agresor/a (si se conoce):
              </label>
              <div className="border-b-2 border-dotted border-gray-400 h-8"></div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Descripción detallada de los hechos:
              </label>
              <div className="space-y-2">
                <div className="border-b-2 border-dotted border-gray-400 h-8"></div>
                <div className="border-b-2 border-dotted border-gray-400 h-8"></div>
                <div className="border-b-2 border-dotted border-gray-400 h-8"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Lugar(es) donde ocurrieron los hechos:
                </label>
                <div className="border-b-2 border-dotted border-gray-400 h-8"></div>
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Fecha(s) aproximada(s):
                </label>
                <div className="border-b-2 border-dotted border-gray-400 h-8"></div>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Testigos (si los hay):
              </label>
              <div className="border-b-2 border-dotted border-gray-400 h-8"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Firma del denunciante (si aplica):
                </label>
                <div className="border-b-2 border-dotted border-gray-400 h-12"></div>
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Firma de recibido:
                </label>
                <div className="border-b-2 border-dotted border-gray-400 h-12"></div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 bg-blue-50 p-4 rounded border-l-4 border-blue-500">
            Anexo 2: Ruta de Atención y Protección
          </h3>

          <ol className="list-decimal list-inside space-y-3 ml-4">
            <li className="font-semibold">
              Recepción de la denuncia (canal designado).
            </li>
            <li className="font-semibold">
              Valoración preliminar de la situación y activación de ruta de
              atención.
            </li>
            <li className="font-semibold">
              Entrevista confidencial con la persona denunciante.
            </li>
            <li className="font-semibold">
              Implementación de medidas de protección si se requiere
              (reubicación temporal, etc.).
            </li>
            <li className="font-semibold">Acciones internas según el caso.</li>
            <li className="font-semibold">
              Derivación a autoridades externas si es necesario.
            </li>
            <li className="font-semibold">
              Seguimiento del caso y cierre formal.
            </li>
          </ol>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 bg-green-50 p-4 rounded border-l-4 border-green-500">
            Anexo 3: Recursos de Apoyo Psicológico y Legal
          </h3>

          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Recursos internos disponibles:
              </h4>
              <ul className="space-y-2 ml-4">
                <li className="flex items-center">
                  <strong className="mr-2">Psicólogo/a institucional:</strong>
                  <div className="border-b border-dotted border-gray-400 flex-1 h-6"></div>
                </li>
                <li className="flex items-center">
                  <strong className="mr-2">
                    Asesor/a legal institucional:
                  </strong>
                  <div className="border-b border-dotted border-gray-400 flex-1 h-6"></div>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Recursos externos recomendados:
              </h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Línea 155</strong> (orientación a mujeres víctimas de
                  violencia)
                </li>
                <li>
                  <strong>Fiscalía General de la Nación</strong>
                </li>
                <li>
                  <strong>Ministerio de Trabajo</strong>
                </li>
                <li>
                  <strong>EPS o ARL</strong> (si aplica)
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-300">
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <p className="text-center text-sm text-gray-800 font-semibold">
            Estos Anexos de la Política de Prevención y Atención del Acoso han
            sido revisados por <strong>{candidateName}</strong>
            <br />a través del sistema de {companyName} el {currentDate}
          </p>
        </div>
      </div>
    </div>
  );
};

export const ManualBuenGobierno: React.FC<DocumentTemplateProps> = ({
  candidateName = "[Nombre del Candidato]",
  companyName = "ANDES COLOMBIA",
}) => {
  const currentDate = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-gray-900 leading-relaxed">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          MANUAL DE BUEN GOBIERNO PARA CONTRATISTAS REMOTOS
          <br />
          (PERSONA NATURAL)
        </h1>
        <h2 className="text-lg font-semibold text-gray-700">{companyName}</h2>
        <p className="text-sm text-gray-600 mt-4">Colombia - {currentDate}</p>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-gray-50 p-3 rounded">
            1. Introducción
          </h3>
          <p className="text-justify">
            Este Manual establece pautas de conducta, principios éticos y reglas
            de relacionamiento entre la Empresa Contratante y contratistas que
            prestan servicios personales (personas naturales), con el objetivo
            de asegurar transparencia, integridad y cumplimiento regulatorio en
            ambientes digitales y remotos, en consonancia con los principios de
            la OIT sobre trabajo decente y relaciones laborales justas.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-gray-50 p-3 rounded">
            2. Objetivo
          </h3>
          <p className="text-justify mb-3">
            Asegurar una colaboración ética, eficiente y respetuosa entre
            contratistas y la organización, alineada con estándares
            internacionales de la OIT:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Libertad profesional.</li>
            <li>Igualdad de oportunidades.</li>
            <li>Condiciones seguras de trabajo en entornos digitales.</li>
            <li>Relaciones laborales transparentes.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-gray-50 p-3 rounded">
            3. Alcance
          </h3>
          <p className="text-justify mb-2">Aplica a contratistas que:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Prestán servicios de forma remota, digital o híbrida.</li>
            <li>
              Usan plataformas tecnológicas para comunicación o entrega de
              actividades.
            </li>
            <li>
              Representan a la organización frente a terceros o colaboradores
              internos.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-gray-50 p-3 rounded">
            4. Principios de Buen Gobierno
          </h3>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>
              Profesionalismo: estándares de calidad y conducta apropiados.
            </li>
            <li>Transparencia: comunicación clara, precisa y veraz.</li>
            <li>
              Responsabilidad: cumplimiento de obligaciones contractuales y
              operativas.
            </li>
            <li>Integridad: actuar éticamente.</li>
            <li>
              Confidencialidad: proteger información estratégica, operativa y
              personal.
            </li>
            <li>Respeto mutuo: trato digno a todas las personas.</li>
            <li>
              Uso responsable de tecnología: prácticas seguras y eficientes.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-gray-50 p-3 rounded">
            5. Buenas Prácticas de Relacionamiento
          </h3>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>
              Usar los canales definidos en el protocolo de comunicaciones.
            </li>
            <li>
              Responder con prontitud a solicitudes dentro del objeto
              contractual.
            </li>
            <li>
              Evitar comportamientos que se interpreten como subordinación
              laboral.
            </li>
            <li>Asegurar calidad y oportunidad en entregables y servicios.</li>
            <li>
              No usar recursos/activos de la empresa sin autorización expresa.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-red-50 p-3 rounded border-l-4 border-red-500">
            6. Conductas Prohibidas
          </h3>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Solicitar o aceptar beneficios indebidos.</li>
            <li>Incurrir en conflictos de interés sin declararlos.</li>
            <li>
              Usar información confidencial para beneficio propio o de terceros.
            </li>
            <li>Emitir órdenes directas o imponer horarios al contratista.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-gray-50 p-3 rounded">
            7. Mecanismos de Prevención y Control
          </h3>
          <p className="text-justify mb-2">
            En línea con principios de la OIT sobre condiciones seguras y
            protección de datos, el contratista se compromete a:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>
              Usar información solo para fines contractuales y plataformas
              autorizadas.
            </li>
            <li>Mantener sistemas protegidos y actualizados.</li>
            <li>
              Firmar acuerdos de confidencialidad y declarar conflictos de
              interés.
            </li>
            <li>Participar en espacios de seguimiento y retroalimentación.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-blue-50 p-3 rounded border-l-4 border-blue-500">
            8. Canales de Reporte
          </h3>
          <p className="text-justify">
            Se habilita el correo <strong>help@teamandes.com</strong> para
            reportar irregularidades, conflictos de interés o conductas
            contrarias al Manual. Se garantiza confidencialidad y no
            represalias.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-gray-50 p-3 rounded">
            9. Aceptación y Actualizaciones
          </h3>
          <p className="text-justify">
            El Manual se entiende aceptado con la firma del contrato o adendas.
            Podrá ser actualizado por la Empresa Contratante con notificación
            previa a contratistas activos.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-gray-50 p-3 rounded">
            10. Vigencia
          </h3>
          <p className="text-justify">
            Vigente desde su publicación y aplicable a todos los contratistas de
            servicios personales con relación vigente con la Empresa
            Contratante.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-300">
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <p className="text-center text-sm text-gray-800 font-semibold">
            Este Manual de Buen Gobierno ha sido leído y aceptado por{" "}
            <strong>{candidateName}</strong>
            <br />a través del sistema de {companyName} el {currentDate}
          </p>
        </div>
      </div>
    </div>
  );
};

export const GoodGovernanceManualEN: React.FC<DocumentTemplateProps> = ({
  companyName = "ANDES WORKFORCE LLC",
}) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-gray-900 leading-relaxed">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Good Governance Manual for Remote Service Contractors (Natural
          Persons)
        </h1>
        <h2 className="text-lg font-semibold text-gray-700">{companyName}</h2>
        <p className="text-sm text-gray-600 mt-2">{currentDate}</p>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            1. Introduction
          </h3>
          <p className="text-justify">
            This Manual aims to establish conduct guidelines, ethical
            principles, and rules of engagement between the Contracting Company
            and contractors providing personal services (natural persons). It
            seeks to ensure transparency, integrity, and regulatory compliance
            as promoted by the International Labour Organization (ILO),
            particularly regarding decent work, professional responsibility, and
            fair labor relations.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            2. Objetive
          </h3>
          <p className="text-justify mb-2">
            To ensure ethical, efficient, and respectful collaboration between
            contractors and the organization, in alignment with international
            labor standards promoted by the ILO related to:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Professional freedom</li>
            <li>Equal opportunities</li>
            <li>Safe working conditions in digital environments</li>
            <li>Transparent labor relations</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">3. Scope</h3>
          <p className="text-justify mb-2">
            This Manual applies to all contractors who:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>
              Provide services remotely, digitally, or in a hybrid format.
            </li>
            <li>
              Use technological platforms for communication or delivery of
              activities.
            </li>
            <li>
              Represent the organization before third parties or internal
              collaborators.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            4. Principles of Good Governance
          </h3>
          <p className="text-justify mb-2">
            In accordance with best practices recognized by the ILO:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>
              Professionalism: Maintain appropriate quality standards and
              conduct.
            </li>
            <li>
              Transparency: Communicate clearly, accurately, and truthfully.
            </li>
            <li>
              Responsibility: Fulfill contractual and operational obligations.
            </li>
            <li>Integrity: Act ethically.</li>
            <li>
              Confidentiality: Protect strategic, operational, and personal
              information.
            </li>
            <li>Mutual respect: Treat all individuals with dignity.</li>
            <li>
              Responsible use of technology: Ensure safe and efficient digital
              work practices.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            5. Good Practices in Engagement
          </h3>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>
              Use the communication channels established in the communications
              protocol.
            </li>
            <li>
              Respond promptly to requests related to the purpose of the
              contract.
            </li>
            <li>
              Avoid behaviors that may be interpreted as labor subordination.
            </li>
            <li>
              Ensure quality and timeliness in the products or services
              delivered.
            </li>
            <li>
              Do not use company resources, facilities, or assets without
              express authorization.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            6. Prohibited Conduct
          </h3>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>
              Requesting or accepting undue benefits from the contractor or
              third parties.
            </li>
            <li>Engaging conflicts of interest without timely disclosure.</li>
            <li>
              Using confidential information for personal or third-party
              benefits.
            </li>
            <li>
              Issuing direct orders or imposing schedules on the contractor (by
              the contracting company).
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            7. Prevention and Control Mechanisms
          </h3>
          <p className="text-justify mb-2">
            In accordance with ILO principles on safe working conditions and
            data protection, the contractor commits to:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>
              Use information solely for contractual purposes and employ only
              authorized platforms, keeping systems protected and updated.
            </li>
            <li>
              Sign confidentiality agreements and disclose any conflict of
              interest.
            </li>
            <li>
              Comply with deliverable monitoring processes and participate in
              feedback spaces to ensure responsible information management and
              contract compliance.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            8. Reporting Channels
          </h3>
          <p className="text-justify">
            The email{" "}
            <a
              className="text-[#0097B2] hover:underline"
              href="mailto:help@teamandes.com"
            >
              help@teamandes.com
            </a>{" "}
            is available for contractors to report irregular situations,
            conflicts of interest, or conduct contrary to this Manual.
            Confidentiality and non-retaliation are guaranteed.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            9. Acceptance and Updates
          </h3>
          <p className="text-justify">
            This Manual will be deemed accepted by the contractor upon signing
            the contract or any addenda. It may be updated by the Contracting
            Company when deemed necessary, with prior notification to active
            contractors.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            10. Validity
          </h3>
          <p className="text-justify">
            This Manual is effective as of its publication and applies to all
            contractors providing personal services who maintain a relationship
            with the Contracting Company.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-300">
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <p className="text-center text-sm text-gray-800 font-semibold">
            This Manual has been read and accepted through the {companyName}{" "}
            system on {currentDate}
          </p>
        </div>
      </div>
    </div>
  );
};

export const AnnexesHarassmentEN: React.FC<DocumentTemplateProps> = ({
  companyName = "ANDES WORKFORCE LLC",
}) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-gray-900 leading-relaxed">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Annexes – Policy for the Prevention and Response to Harassment
        </h1>
        <h2 className="text-lg font-semibold text-gray-700">{companyName}</h2>
        <p className="text-sm text-gray-600 mt-2">{currentDate}</p>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 bg-red-50 p-4 rounded border-l-4 border-red-500">
            Annex 1: Harassment Complaint Form
          </h3>
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Date of complaint:
                </label>
                <div className="border-b-2 border-dotted border-gray-400 h-8"></div>
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Name of complainant (optional):
                </label>
                <div className="border-b-2 border-dotted border-gray-400 h-8"></div>
              </div>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Relationship with the company (mark with an X):
              </label>
              <div className="flex flex-wrap gap-6">
                <span>[ ] Contractor</span>
                <span>[ ] Other: _______________</span>
              </div>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Name of alleged aggressor (if known):
              </label>
              <div className="border-b-2 border-dotted border-gray-400 h-8"></div>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Detailed description of the facts (include place, approximate
                date(s), and witness(es), if any):
              </label>
              <div className="space-y-2">
                <div className="border-b-2 border-dotted border-gray-400 h-8"></div>
                <div className="border-b-2 border-dotted border-gray-400 h-8"></div>
                <div className="border-b-2 border-dotted border-gray-400 h-8"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Places where events occurred:
                </label>
                <div className="border-b-2 border-dotted border-gray-400 h-8"></div>
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Approximate dates:
                </label>
                <div className="border-b-2 border-dotted border-gray-400 h-8"></div>
              </div>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Witnesses (if any):
              </label>
              <div className="border-b-2 border-dotted border-gray-400 h-8"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Signature of complainant (if applicable):
                </label>
                <div className="border-b-2 border-dotted border-gray-400 h-12"></div>
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Signature of receipt:
                </label>
                <div className="border-b-2 border-dotted border-gray-400 h-12"></div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 bg-blue-50 p-4 rounded border-l-4 border-blue-500">
            Annex 2: Response and Protection Pathway
          </h3>
          <ol className="list-decimal list-inside space-y-3 ml-4">
            <li className="font-semibold">
              Receipt of the complaint (designated channel).
            </li>
            <li className="font-semibold">
              Preliminary assessment of the situation and activation of the
              response pathway.
            </li>
            <li className="font-semibold">
              Confidential interview with the complainant.
            </li>
            <li className="font-semibold">
              Implementation of protection measures if required (e.g., temporary
              adjustments to tasks or communication channels).
            </li>
            <li className="font-semibold">Internal actions as appropriate.</li>
            <li className="font-semibold">
              Referral to external authorities if necessary.
            </li>
            <li className="font-semibold">
              Case follow-up and formal closure.
            </li>
          </ol>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 bg-green-50 p-4 rounded border-l-4 border-green-500">
            Annex 3: Psychological and Legal Support Resources
          </h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Internal resources:
              </h4>
              <ul className="space-y-2 ml-4">
                <li className="flex items-center">
                  <strong className="mr-2">Ethics line:</strong>{" "}
                  Help@teamandes.com
                </li>
                <li className="flex items-center">
                  <strong className="mr-2">Institutional psychologist:</strong>
                  <div className="border-b border-dotted border-gray-400 flex-1 h-6"></div>
                </li>
                <li className="flex items-center">
                  <strong className="mr-2">Institutional legal advisor:</strong>
                  <div className="border-b border-dotted border-gray-400 flex-1 h-6"></div>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                External resources:
              </h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Hotlines for victims of harassment or violence (international
                  or local)
                </li>
                <li>Online psychological support platforms</li>
                <li>Virtual legal counseling</li>
                <li>
                  Competent authorities in the complainant’s country of
                  residence, if required.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-300">
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <p className="text-center text-sm text-gray-800 font-semibold">
            These Annexes have been reviewed through the {companyName} system on{" "}
            {currentDate}
          </p>
        </div>
      </div>
    </div>
  );
};

export const ConfidentialityAgreementEN: React.FC<DocumentTemplateProps> = ({
  companyName = "ANDES WORKFORCE LLC",
}) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-gray-900 leading-relaxed">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Confidentiality Agreement
        </h1>
        <h2 className="text-lg font-semibold text-gray-700">{companyName}</h2>
        <p className="text-sm text-gray-600 mt-2">{currentDate}</p>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Parties</h3>
          <p className="text-justify">
            The Contracting Company and the Contractor enter into this
            Confidentiality Agreement under the following terms.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            1. Purpose
          </h3>
          <p className="text-justify">
            The Contractor agrees to maintain confidentiality on any information
            received or accessed in the course of the services rendered.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            2. Confidential Information
          </h3>
          <p className="text-justify">
            Includes documents, data, processes, technical knowledge, reports,
            specifications, methodologies, strategies, and any information
            provided or accessed, in any medium.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            3. Contractor Obligations
          </h3>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>
              Use confidential information solely for contractual purposes.
            </li>
            <li>
              Do not disclose, copy, reproduce, transfer, or communicate
              information to third parties.
            </li>
            <li>Adopt measures to prevent unauthorized disclosure.</li>
            <li>
              Immediately inform the Company in case of loss, misuse, or
              leakage.
            </li>
          </ul>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            4. Exceptions
          </h3>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Public domain information not resulting from a breach.</li>
            <li>Information disclosed with written authorization.</li>
            <li>
              Information required by law or court order, with prior notice.
            </li>
          </ul>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">5. Term</h3>
          <p className="text-justify">
            This obligation remains for the duration of the services contract
            and for two (2) years after termination.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            6. Liability
          </h3>
          <p className="text-justify">
            In case of breach, the Contractor is liable for damages caused,
            without prejudice to applicable legal actions.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            7. Applicable Law
          </h3>
          <p className="text-justify">
            This Agreement is governed by applicable laws in the relevant
            jurisdiction.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-300">
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <p className="text-center text-sm text-gray-800 font-semibold">
            This Agreement has been accepted through the {companyName} system on{" "}
            {currentDate}
          </p>
        </div>
      </div>
    </div>
  );
};

export const CommunicationsProtocolEN: React.FC<DocumentTemplateProps> = ({
  companyName = "ANDES WORKFORCE LLC",
}) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-gray-900 leading-relaxed">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Communications Protocol: Contracting Company – Independent Service
          Contractor (Natural Person)
        </h1>
        <h2 className="text-lg font-semibold text-gray-700">{companyName}</h2>
        <p className="text-sm text-gray-600 mt-2">{currentDate}</p>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            1. Objetive
          </h3>
          <p className="text-justify">
            To establish clear guidelines for communication and coordination
            between the organization and the contractor, ensuring the effective
            execution of contracted services, respecting the contractor’s
            independence, and avoiding any employment-like subordination
            relationship, in line with ILO principles on decent work and fair
            labor relations.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            2. Guiding Principles
          </h3>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>
              <strong>Autonomy:</strong> The contractor’s technical,
              administrative, and operational independence is respected.
            </li>
            <li>
              <strong>No subordination:</strong> No direct orders will be given,
              nor will compliance with schedules or mandatory attendance be
              required, as these are characteristics of an employment
              relationship.
            </li>
            <li>
              <strong>Effective communication:</strong> All information
              exchanged between the parties will be clear, timely, and
              documented.
            </li>
            <li>
              <strong>Transparency:</strong> All instructions and requests must
              remain strict within the scope of the contract.
            </li>
            <li>
              <strong>Legality:</strong> Compliance with applicable labor and
              civil legislation will be ensured.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            3. Communication Channels (including tools and loan agreements)
          </h3>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>
              <strong>
                Institutional email (company) or personal email (contractor):
              </strong>{" "}
              Primary channel for formal communications.
            </li>
            <li>
              <strong>Virtual or in-person meetings:</strong> Scheduled in
              advance, with a clear agenda and meeting minutes.
            </li>
            <li>
              <strong>Project management platforms (optional):</strong> Only
              when they do not involve time tracking or direct supervision of
              the contractor.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            4. Types of Communication
          </h3>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>
              <strong>Start of activities:</strong> The contractor will inform
              the organization of their estimated execution schedule.
            </li>
            <li>
              <strong>Activity monitoring:</strong> The contractor may be asked
              for partial reports, deliverables, or progress updates—always
              based on results, never on compliance with schedules.
            </li>
            <li>
              <strong>Specific requests:</strong> All requests must relate to
              the purpose of the contract. Imperative language will be avoided
              to preserve independence.
            </li>
            <li>
              <strong>Contract termination:</strong> Notification will be
              provided in advance as stipulated in the contract, including
              submission of the final report and evaluation of results.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            5. Coordination Meetings
          </h3>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>
              Will be held only when strictly necessary for the execution of the
              contract.
            </li>
            <li>
              Invitations will be sent via email at least 48 hours in advance.
            </li>
            <li>
              A record of discussed topics and agreed-upon commitments will be
              kept (without generating orders).
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            6. Communication Responsibilities
          </h3>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>
              <strong>Contracting Company:</strong> A contract coordinator or
              supervisor will serve as the official point of contact, without
              assuming the role of employer.
            </li>
            <li>
              <strong>Contractor:</strong> Responsible for delivering products
              and progress as contractually agreed.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            7. Express Prohibitions
          </h3>
          <p className="text-justify mb-2">
            The contractor will not be required to:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Comply with fixed schedules.</li>
            <li>Remain at company facilities.</li>
            <li>
              Use uniforms, operational ID cards, or institutional email (except
              for coordination when applicable).
            </li>
            <li>Submit daily activity reports based on hours worked.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            8. Confidentiality and Data Protection
          </h3>
          <p className="text-justify">
            Both parties commit to maintaining confidentiality of all
            information exchanged under the contract. The contractor must sign a
            confidentiality agreement when required and ensure responsible data
            management, following international data protection, privacy, and
            security standards, including those promoted by the ILO.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            9. Protocol Updates
          </h3>
          <p className="text-justify">
            This protocol may be updated by mutual agreement between the parties
            when necessary to improve coordination, always respecting the
            applicable regulatory framework.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-300">
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <p className="text-center text-sm text-gray-800 font-semibold">
            This Protocol has been read and accepted through the {companyName}{" "}
            system on {currentDate}
          </p>
        </div>
      </div>
    </div>
  );
};

export const RemoteHarassmentPolicyEN: React.FC<DocumentTemplateProps> = ({
  companyName = "ANDES WORKFORCE LLC",
}) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-gray-900 leading-relaxed">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Policy for the Prevention and Response to Harassment in Remote Work
        </h1>
        <h2 className="text-lg font-semibold text-gray-700">{companyName}</h2>
        <p className="text-sm text-gray-600 mt-2">{currentDate}</p>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            1. Purpose
          </h3>
          <p className="text-justify">
            This policy establishes clear rules and practices to prevent,
            identify, and address any form of harassment in remote or hybrid
            work environments, promoting a respectful, safe, and inclusive
            workplace across all digital platforms and communication channels
            used at {companyName}.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">2. Scope</h3>
          <p className="text-justify">
            This policy applies to all individuals working with or collaborating
            with the organization, regardless of location, including employees,
            supervisors, contractors, and suppliers. It covers all digital
            interactions such as video calls, chats, emails, and internal
            platforms.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            3. What is Considered Harassment?
          </h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>Harassment:</strong> Unwanted conduct that undermines the
              dignity, well-being, or performance of a person.
            </li>
            <li>
              <strong>Digital harassment:</strong> Insults, mockery, deliberate
              exclusion from communications, offensive messages, invasive
              monitoring, screenshots, or recordings without permission.
            </li>
            <li>
              <strong>Sexual harassment:</strong> Sexual messages or
              insinuations, sending inappropriate content, or unwanted comments
              during video calls.
            </li>
            <li>
              <strong>Retaliation:</strong> Negative actions taken against
              someone who reports a situation.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            4. Principles
          </h3>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Zero tolerance for harassment.</li>
            <li>Respect all digital communications.</li>
            <li>Confidentiality when handling reports.</li>
            <li>No retaliation.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            5. Responsibilities
          </h3>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>
              <strong>Organization:</strong> Provide security tools, train
              staff, address reports promptly, and act impartially.
            </li>
            <li>
              <strong>Collaborators:</strong> Maintain professionalism, respect
              work schedules, avoid inappropriate conduct, and report incidents.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            6. Incident Reporting
          </h3>
          <p className="text-justify mb-2">
            Reports may be submitted with a name or anonymously (when
            applicable). Situations can be reported through:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>
              Designated email: <strong>help@teamandes.com</strong>
            </li>
            <li>Internal platform</li>
            <li>Supervisor or designated area</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            7. Basic Procedure
          </h3>
          <ol className="list-decimal list-inside space-y-1 ml-4">
            <li>Receipt of the report</li>
            <li>Review and analysis</li>
            <li>Remote investigation</li>
            <li>Conclusions</li>
            <li>Corrective measures</li>
            <li>Follow-up to prevent retaliation</li>
          </ol>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            8. Consequences
          </h3>
          <p className="text-justify mb-2">
            Depending on the severity and nature of the case, measures may
            include:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Corrective conversations or formal warnings</li>
            <li>Mandatory training</li>
            <li>Temporary suspension of access to digital platforms</li>
            <li>Proportional disciplinary actions</li>
            <li>Termination of employment or contractual relationship</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            9. Best Practices in Remote Work
          </h3>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Professional language</li>
            <li>Respect for schedules</li>
            <li>No recording without permission</li>
            <li>Privacy during video calls</li>
            <li>Responsible use of digital platforms</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            10. Measures
          </h3>
          <p className="text-justify">
            Harassment behaviors will be evaluated by the Management of{" "}
            {companyName} according to their severity. Based on the established
            protocol, affected parties will be guided to the legally appropriate
            channels. If actions affecting individuals within our stakeholder
            group are confirmed, contractual measures may be taken, including
            termination of the service contract. In serious cases, the competent
            authorities will be notified.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-300">
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <p className="text-center text-sm text-gray-800 font-semibold">
            This policy has been read and accepted through the {companyName}{" "}
            system on {currentDate}
          </p>
        </div>
      </div>
    </div>
  );
};
