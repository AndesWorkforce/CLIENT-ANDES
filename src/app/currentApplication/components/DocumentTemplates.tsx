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
          MANUAL DE BUEN GOBIERNO PARA
          <br />
          CONTRATISTAS POR PRESTACIÓN DE SERVICIOS
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
            Este Manual tiene como propósito establecer las pautas de conducta,
            principios éticos y reglas de relacionamiento entre la Empresa
            Contratante y los contratistas por prestación de servicios
            personales (personas naturales), garantizando transparencia,
            integridad y cumplimiento normativo en el marco de la legislación
            colombiana vigente.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-gray-50 p-3 rounded">
            2. Marco Normativo
          </h3>
          <p className="text-justify mb-3">Este Manual se basa en:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Constitución Política de Colombia.</li>
            <li>Código Civil y Código Sustantivo del Trabajo.</li>
            <li>Ley 1474 de 2011 (Estatuto Anticorrupción).</li>
            <li>Ley 1581 de 2012 (Protección de Datos Personales).</li>
            <li>
              Conceptos del Ministerio del Trabajo sobre tercerización laboral.
            </li>
            <li>
              Lineamientos internos de ética y buen gobierno corporativo de la
              Empresa Contratante.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-gray-50 p-3 rounded">
            3. Principios Rectores
          </h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>Legalidad:</strong> Cumplimiento estricto de las normas
              legales y contractuales.
            </li>
            <li>
              <strong>Transparencia:</strong> Actuar con rectitud y claridad en
              todos los procesos y comunicaciones.
            </li>
            <li>
              <strong>Confidencialidad:</strong> Reserva sobre la información a
              la que se accede en virtud del contrato.
            </li>
            <li>
              <strong>Integridad:</strong> Coherencia entre lo que se piensa, se
              dice y se hace.
            </li>
            <li>
              <strong>Respeto:</strong> Trato digno y profesional entre todas
              las partes.
            </li>
            <li>
              <strong>No subordinación:</strong> Reconocimiento de la autonomía
              e independencia del contratista.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-gray-50 p-3 rounded">
            4. Buenas Prácticas en el Relacionamiento
          </h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              Utilizar los canales de comunicación establecidos en el protocolo
              de comunicaciones.
            </li>
            <li>
              Responder oportunamente solicitudes relacionadas con el objeto del
              contrato.
            </li>
            <li>
              Evitar comportamientos que puedan ser interpretados como
              subordinación laboral.
            </li>
            <li>
              Garantizar la calidad y oportunidad en los productos o servicios
              entregados.
            </li>
            <li>
              No utilizar recursos, instalaciones ni activos de la empresa salvo
              autorización expresa.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-red-50 p-3 rounded border-l-4 border-red-500">
            5. Conductas No Permitidas
          </h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              Solicitar o aceptar beneficios indebidos por parte del contratista
              o de terceros.
            </li>
            <li>
              Incurrir en conflicto de intereses sin declararlo oportunamente.
            </li>
            <li>
              Utilizar información confidencial para beneficio personal o de
              terceros.
            </li>
            <li>
              Emitir órdenes directas o exigir horarios al contratista (por
              parte del contratante).
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-gray-50 p-3 rounded">
            6. Mecanismos de Prevención y Control
          </h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Firma de acuerdos de confidencialidad.</li>
            <li>Declaración de conflictos de interés.</li>
            <li>
              Seguimiento a los entregables por parte del supervisor del
              contrato.
            </li>
            <li>
              Espacios de retroalimentación sobre el cumplimiento del contrato.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-blue-50 p-3 rounded border-l-4 border-blue-500">
            7. Canales de Reporte
          </h3>
          <p className="text-justify">
            Se habilita el correo <strong>help@teamandes.com</strong> para que
            contratistas puedan reportar situaciones irregulares, conflictos de
            interés o conductas contrarias al presente manual. Se garantizará
            reserva y no represalias.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-gray-50 p-3 rounded">
            8. Aceptación y Actualización
          </h3>
          <p className="text-justify">
            Este Manual será aceptado por el contratista al momento de suscribir
            el contrato o sus adendas, y podrá ser actualizado por la Empresa
            Contratante cuando lo considere pertinente, previa notificación a
            los contratistas vigentes.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-gray-50 p-3 rounded">
            9. Vigencia
          </h3>
          <p className="text-justify">
            Este Manual rige a partir de su publicación y será aplicable a todos
            los contratistas por prestación de servicios personales que tengan
            relación con la Empresa Contratante.
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
