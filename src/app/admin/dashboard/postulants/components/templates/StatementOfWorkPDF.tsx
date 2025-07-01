import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Estilos para el PDF - usando solo fuentes seguras
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    paddingTop: 40,
    paddingLeft: 60,
    paddingRight: 60,
    paddingBottom: 40,
    lineHeight: 1.4,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 120,
    height: 60,
  },
  title: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 25,
    marginTop: 15,
    color: "#333333",
  },
  paragraph: {
    marginBottom: 12,
    textAlign: "justify",
    lineHeight: 1.5,
  },
  clauseTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginTop: 15,
    marginBottom: 8,
    color: "#333333",
  },
  listItem: {
    marginLeft: 15,
    marginBottom: 6,
    lineHeight: 1.4,
  },
  underline: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 2,
    minWidth: 100,
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 50,
    paddingTop: 30,
  },
  signatureBlock: {
    width: "40%",
    alignItems: "center",
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    width: "100%",
    height: 30,
    marginBottom: 8,
  },
  signatureLabel: {
    fontSize: 11,
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
});

interface StatementOfWorkData {
  fechaEjecucion: string;
  nombreCompleto: string;
  fechaInicioLabores: string;
  descripcionServicios: string;
  correoElectronico: string;
  salarioProbatorio: string;
  ofertaSalarial: string;
  monedaSalario: string;
  nombreBanco: string;
  numeroCuenta: string;
  direccionCompleta: string;
  telefono: string;
  cedula: string;
  nacionalidad?: string;
}

interface StatementOfWorkPDFProps {
  data: StatementOfWorkData;
}

const StatementOfWorkPDF: React.FC<StatementOfWorkPDFProps> = ({ data }) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const months = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
      ];
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      return `${day} días del mes de ${month} año ${year}`;
    } catch {
      return dateString;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header con logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image src="/images/logo-andes.png" style={styles.logo} />
          </View>
        </View>

        {/* Título principal */}
        <Text style={styles.title}>
          CONTRATO DE PRESTACIÓN DE SERVICIOS PROFESIONALES
        </Text>

        {/* Introducción */}
        <Text style={styles.paragraph}>
          Entre los suscritos Andes Workforce LLC (`&ldquo;Compañía&rdquo;`)
          bajo el Registro de Compañía de Responsabilidad Limitada No.
          L24000192685 con su lugar principal de negocios en Florida, Estados
          Unidos y quien para efectos del presente contrato se denominará{" "}
          <Text style={styles.bold}>EL CONTRATANTE</Text> y, por otra parte,{" "}
          <Text style={styles.underline}>
            {data.nombreCompleto || "_________________"}
          </Text>{" "}
          identificado con cédula de ciudadanía No.
          <Text style={styles.underline}>
            {data.cedula || "_________________"}
          </Text>
          , de nacionalidad{" "}
          <Text style={styles.underline}>
            {data.nacionalidad || "_________________"}
          </Text>
          , quien para los efectos del presente contrato se denominará en
          adelante <Text style={styles.bold}>EL CONTRATISTA</Text>, y quienes
          conjuntamente han decidido denominarse{" "}
          <Text style={styles.bold}>LAS PARTES</Text>, hemos convenido celebrar
          el presente CONTRATO DE PRESTACIÓN DE SERVICIOS, el cual se regirá por
          las cláusulas que a continuación se expresan y en general por las
          disposiciones del Código Civil Colombiano y las Leyes Comerciales
          aplicables a la materia de qué trata este contrato:
        </Text>

        {/* Cláusula Primera - CON DESCRIPCIÓN DINÁMICA */}
        <Text style={styles.clauseTitle}>CLÁUSULA PRIMERA. – OBJETO:</Text>
        <Text style={styles.paragraph}>
          {data.descripcionServicios ||
            "EL CONTRATISTA de manera independiente, haciendo uso de sus propios medios y herramientas, prestará los servicios de Mantener archivos de clientes, atender llamadas telefónicas, hablar con clientes potenciales y actuales, procesar documentos legales, iniciar reclamaciones y apelaciones, proporcionar información relacionada con los casos de los clientes, subir documentos PDF al portales electrónicos, recopilar información de clientes potenciales y proporcionarla para revisión, procesar documentos de admisión e ingresar información digitalmente, confirmar instalaciones médicas de los clientes, asistir a los clientes con los formularios requeridos y realizar tareas adicionales según se asignen."}
        </Text>

        {/* Cláusula Segunda */}
        <Text style={styles.clauseTitle}>
          CLÁUSULA SEGUNDA. – VALOR DEL CONTRATO:
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>LAS PARTES</Text> acuerdan que el valor
          acordado como honorarios por los servicios como contratista
          independiente será de{" "}
          <Text style={styles.underline}>
            {data.monedaSalario} {data.ofertaSalarial || "___________"}
          </Text>{" "}
          (
          <Text style={styles.underline}>
            ${data.ofertaSalarial || "___________"}
          </Text>
          ), dólares americanos, los cuales se pagarán durante la vigencia del
          presente contrato. Los dineros serán depositados a la cuenta
          registrada en la cuenta de cobro.
        </Text>

        {/* Cláusula Tercera */}
        <Text style={styles.clauseTitle}>
          CLÁUSULA TERCERA. – FORMA DE PAGO:
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>EL CONTRATANTE</Text> se compromete con{" "}
          <Text style={styles.bold}>EL CONTRATISTA</Text> a realizar el pago de
          la totalidad del valor de los honorarios descritos en la cláusula
          segunda, el pago se iniciara el último día hábil del mes según
          calendario de Estados Unidos, previa presentación de la cuenta de
          cobro remitida por parte de{" "}
          <Text style={styles.bold}>EL CONTRATISTA</Text> adjuntando la relación
          detallada de los servicios prestados, previa presentación de la
          planilla de aportes al Sistema Integral de Seguridad Social.
        </Text>

        {/* Cláusula Cuarta */}
        <Text style={styles.clauseTitle}>
          CLÁUSULA CUARTA. - DURACIÓN DEL CONTRATO:
        </Text>
        <Text style={styles.paragraph}>
          La vigencia del contrato será de cuatro (4) meses, contados a partir
          de la fecha de suscripción de este documento. Si vencido el término de
          vigencia del contrato, <Text style={styles.bold}>LAS PARTES</Text> no
          han expresado por escrito el deseo de prorrogar o ninguna de{" "}
          <Text style={styles.bold}>LAS PARTES</Text> manifestó por escrito su
          deseo de terminarlo con al menos quince (15) días de antelación a su
          finalización, el mismo se entenderá prorrogado por el mismo término
          inicial.
        </Text>

        {/* Cláusula Quinta */}
        <Text style={styles.clauseTitle}>
          CLÁUSULA QUINTA. - OBLIGACIONES ESPECIALES DEL CONTRATANTE:
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>EL CONTRATANTE</Text> se compromete con{" "}
          <Text style={styles.bold}>EL CONTRATISTA</Text> a:
        </Text>
        <Text style={styles.listItem}>
          1) Pagar los honorarios acordados en la Cláusula Segunda y Cláusula
          Tercera del presente contrato.
        </Text>
        <Text style={styles.listItem}>
          2) Atender a las solicitudes de información de{" "}
          <Text style={styles.bold}>EL CONTRATISTA</Text>.
        </Text>
        <Text style={styles.listItem}>
          3) Las demás obligaciones a su cargo de conformidad con este acuerdo,
          sus anexos y las normas y jurisprudencia aplicables al mismo.
        </Text>

        {/* Cláusula Sexta */}
        <Text style={styles.clauseTitle}>
          CLÁUSULA SEXTA. – OBLIGACIONES ESPECIALES DEL CONTRATISTA:
        </Text>
        <Text style={styles.paragraph}>
          Constituyen las principales obligaciones para{" "}
          <Text style={styles.bold}>EL CONTRATISTA</Text>:
        </Text>
        <Text style={styles.listItem}>
          a) Obrar con diligencia y buena fe los asuntos encomendados.
        </Text>
        <Text style={styles.listItem}>
          b) Realizar los servicios contratados de acuerdo con las
          estipulaciones del presente contrato y los lineamientos,
          procedimientos, protocolos, políticas y códigos corporativos y de buen
          gobierno.
        </Text>
        <Text style={styles.listItem}>
          c) Resolver las consultas de{" "}
          <Text style={styles.bold}>EL CONTRATANTE</Text> con la mayor celeridad
          posible.
        </Text>
        <Text style={styles.listItem}>
          d) Informar oportunamente a{" "}
          <Text style={styles.bold}>EL CONTRATANTE</Text> cualquier situación
          que pueda afectar el cumplimiento de sus obligaciones.
        </Text>
        <Text style={styles.listItem}>
          e) Restituir a <Text style={styles.bold}>EL CONTRATANTE</Text> a la
          finalización del presente contrato la totalidad de la información,
          registros, soportes o documentos que de forma física y/o digital
          obtenidas en desarrollo del presente contrato.
        </Text>
        <Text style={styles.listItem}>
          f) En ninguna circunstancia podrá el Contratista realizar trabajos
          para Andes Workforce LLC y sus Clientes mientras se encuentre en
          cualquier territorio de los EE. UU. En caso de que el Contratista
          viaje a los Estados Unidos o cualquiera de sus territorios, deberá
          suspenderse el contrato.
        </Text>
        <Text style={styles.listItem}>
          g) El resto de las obligaciones a su cargo de conformidad con este
          acuerdo, sus anexos y las normas y jurisprudencia aplicables al mismo.
        </Text>

        {/* Cláusula Séptima */}
        <Text style={styles.clauseTitle}>
          CLÁUSULA SÉPTIMA. – NATURALEZA DE LA PRESENTE RELACIÓN CONTRACTUAL:
        </Text>
        <Text style={styles.paragraph}>
          La naturaleza del presente contrato es civil y comercial, es decir que
          se regirá por las normas contempladas en el Código Civil Colombiano y
          el Código de Comercio, sin que en momento alguno se genere vínculo
          laboral entre <Text style={styles.bold}>EL CONTRATANTE</Text> y{" "}
          <Text style={styles.bold}>EL CONTRATISTA</Text>, por lo cual los
          derechos de <Text style={styles.bold}>EL CONTRATANTE</Text> se
          limitarán por la naturaleza del contrato a exigir el cumplimiento de
          las obligaciones de <Text style={styles.bold}>EL CONTRATISTA</Text> al
          tiempo que este podrá exigir el cumplimiento en el pago de sus
          honorarios en las condiciones pactadas.
        </Text>
      </Page>

      {/* Segunda página */}
      <Page size="A4" style={styles.page}>
        {/* Cláusula Octava */}
        <Text style={styles.clauseTitle}>
          CLÁUSULA OCTAVA. – CAUSALES DE TERMINACIÓN:
        </Text>
        <Text style={styles.paragraph}>
          El presente contrato podrá darse por finalizado en cualquier momento
          de su vigencia en caso de que se presenten las siguientes causales:
        </Text>
        <Text style={styles.listItem}>
          1) La finalización del término de duración pactado en el mismo,
          cumpliendo las condiciones previstas para que no haya una prórroga
          contractual.
        </Text>
        <Text style={styles.listItem}>
          2) Mutuo acuerdo entre <Text style={styles.bold}>LAS PARTES</Text>.
        </Text>
        <Text style={styles.listItem}>
          3) <Text style={styles.bold}>EL CONTRATANTE</Text> podrá dar por
          terminado el presente contrato por el incumplimiento total o parcial
          de las obligaciones contractuales contenidas en el presente acuerdo, a
          cargo de <Text style={styles.bold}>EL CONTRATISTA</Text>, siempre y
          cuando dicho incumplimiento perdure, sin haber sido remediado por{" "}
          <Text style={styles.bold}>EL CONTRATISTA</Text>, por un término mayor
          a cinco (5) días hábiles, contados a partir de la notificación por
          escrito realizada por <Text style={styles.bold}>EL CONTRATANTE</Text>{" "}
          a <Text style={styles.bold}>EL CONTRATISTA</Text>, comunicándole de su
          incumplimiento.
        </Text>
        <Text style={styles.listItem}>
          4) <Text style={styles.bold}>EL CONTRATISTA</Text> podrá dar por
          terminado el presente contrato por el incumplimiento total o parcial
          de las obligaciones contractuales contenidas en el presente acuerdo, a
          cargo de <Text style={styles.bold}>EL CONTRATANTE</Text>, siempre y
          cuando dicho incumplimiento perdure, sin haber sido remediado por{" "}
          <Text style={styles.bold}>EL CONTRATANTE</Text>, por un término mayor
          a cinco (5) días hábiles, contados a partir de la notificación por
          escrito realizada por <Text style={styles.bold}>EL CONTRATISTA</Text>{" "}
          a <Text style={styles.bold}>EL CONTRATANTE</Text>, comunicándole de su
          incumplimiento.
        </Text>
        <Text style={styles.listItem}>
          5) Por muerte de alguna de <Text style={styles.bold}>LAS PARTES</Text>
          .
        </Text>
        <Text style={styles.listItem}>
          6) Por las demás causales establecidas en la ley colombiana que sean
          aplicables a este mecanismo contractual y las demás contempladas en el
          presente contrato.
        </Text>

        {/* Parágrafos */}
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>PARÁGRAFO PRIMERO:</Text> El término de
          cinco (5) días hábiles para declarar un incumplimiento, contemplado en
          la presente cláusula, solo tendrá aplicación en caso de que dicho
          incumplimiento sea subsanable por la parte incumplida.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>PARÁGRAFO SEGUNDO:</Text> No obstante, a lo
          anterior, <Text style={styles.bold}>EL CONTRATANTE</Text> podrá dar
          por terminado el presente contrato en cualquier momento, sin
          justificar causa alguna, previo aviso por escrito remitido a{" "}
          <Text style={styles.bold}>EL CONTRATISTA</Text>, manifestando su
          determinación de finalizarlo, al menos con treinta (30) días
          calendario de antelación a dicha terminación anticipada, sin que por
          este evento se genere ningún tipo de indemnización, sanción, pena o
          multa a cargo o a favor de alguna de las partes.{" "}
          <Text style={styles.bold}>EL CONTRATANTE</Text> pagará a{" "}
          <Text style={styles.bold}>EL CONTRATISTA</Text> lo correspondiente por
          los servicios efectivamente prestados hasta la fecha de terminación.
        </Text>

        {/* Cláusula Novena */}
        <Text style={styles.clauseTitle}>
          CLÁUSULA NOVENA. - RESOLUCIÓN DE CONFLICTOS:
        </Text>
        <Text style={styles.paragraph}>
          Toda controversia, conflicto o diferencia relativa al presente
          contrato, su celebración, cumplimiento, interpretación, ejecución,
          liquidación e incluso en su fase precontractual, así como cualquier
          perjuicio en general producido con ocasión del contrato que no
          signifique propiamente su incumplimiento, se resolverá inicialmente a
          través de un arreglo directo que podrá tomarse máximo 30 días
          calendario, de lo contrario a través de la justicia ordinaria.
        </Text>

        {/* Cláusula Décima */}
        <Text style={styles.clauseTitle}>
          CLÁUSULA DÉCIMA. – CONFIDENCIALIDAD Y RESERVA:
        </Text>
        <Text style={styles.paragraph}>
          Para efectos del presente contrato, toda la información de{" "}
          <Text style={styles.bold}>EL CONTRATANTE</Text> al que{" "}
          <Text style={styles.bold}>EL CONTRATISTA</Text> tenga acceso o
          conocimiento y viceversa, tendrá carácter de información confidencial
          y, en consecuencia, deberá ser tratada como tal. Ninguna de{" "}
          <Text style={styles.bold}>LAS PARTES</Text> revelará los términos y
          condiciones del contrato o la información técnica, comercial, bases de
          datos de los clientes incluidos teléfonos, dirección electrónica,
          direcciones de domicilio, o financiera que reciba de la otra parte con
          ocasión de su ejecución, sin el previo consentimiento escrito.
        </Text>

        {/* Más párrafos de confidencialidad */}
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>PARÁGRAFO PRIMERO:</Text> Las obligaciones
          de no revelar la información confidencial cesarán únicamente cuando:
          i) exista obligación de conformidad con la Ley o por mandato judicial
          o administrativo ii) la respectiva información sea de dominio público
          iii) la parte receptora la genere o desarrolle en forma independiente,
          sin violar el presente contrato.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>PARÁGRAFO SEGUNDO:</Text> En el evento en
          que alguna de <Text style={styles.bold}>LAS PARTES</Text> esté
          obligada por orden de alguna autoridad pública o judicial a revelar la
          información sujeta a confidencialidad bajo este acuerdo, deberán
          informar de manera oportuna a la parte sobre la cual versa la
          información confidencial con el fin de que pueda proteger la
          confidencialidad de dicha información. Si en ausencia de una medida de
          protección de la información,{" "}
          <Text style={styles.bold}>LAS PARTES</Text> están obligados a revelar
          la Información Confidencial a cualquier autoridad administrativa o
          jurisdiccional, podrán enviar a dicha autoridad sólo aquella porción
          de la Información Confidencial cuya revelación sea obligatoria, sin
          perjuicio de que la parte sobre la cual versa la información utilice
          sus mejores esfuerzos para preservar la confidencialidad de la
          Información Confidencial, y para que pueda obtener una orden de
          protección u otra seguridad razonable de que se le dará tratamiento
          confidencial a la Información Confidencial por parte de mencionada
          autoridad.
        </Text>
      </Page>

      {/* Tercera página */}
      <Page size="A4" style={styles.page}>
        {/* Continuación de cláusulas */}
        <Text style={styles.clauseTitle}>
          CLÁUSULA DÉCIMA PRIMERA. - AUTORIZACIÓN PARA EL TRATAMIENTO DE DATOS
          PERSONALES:
        </Text>
        <Text style={styles.paragraph}>
          Conforme a la Ley 1581 del 2012 y Decreto 1377 del 2013, las partes
          autorizan de manera previa, expresa e informada para que, directamente
          o a través de sus consultores, asesores, matrices, subsidiarias,
          afiliadas y/o cualquier tercero encargado del Tratamiento de Datos
          Personales, bien sea en Colombia o en el exterior, lleven a cabo
          cualquier operación o conjunto de operaciones tales como la
          recolección, almacenamiento, uso, circulación, supresión y transmisión
          sobre sus datos Personales, o en caso de tratarse de personas
          jurídicas, los datos personales de sus accionistas, socios, empleados
          y/o colaboradores. Entendiéndose que las partes siempre deberán
          cumplir con las obligaciones indicadas en las anteriores disposiciones
          normativas, así como las normas que eventualmente pudiesen
          modificarlas, derogarlas y/o complementarlas. En este orden de ideas
          las partes podrán almacenar, consultar, procesar, actualizar y grabar
          dichos datos personales, así como cualquier otra acción necesaria en
          aras de llevar a cabo el objeto contractual del presente acuerdo,
          siempre y cuando se ciñan integralmente a las finalidades establecidas
          de la otra parte en su tratamiento de datos personales y no vayan en
          contra de la Ley 1581 del 2012, el Decreto 1377 del 2013 y las normas
          que eventualmente pudiesen modificar, derogar y/o complementar dichas
          disposiciones normativas.
        </Text>

        <Text style={styles.paragraph}>
          Las Partes se reservan el derecho de conocer, actualizar, rectificar y
          demás establecidos en las normas de Protección de Datos.{" "}
          <Text style={styles.bold}>EL CONTRATISTA</Text> autoriza en especial,
          pero sin limitación alguna, que{" "}
          <Text style={styles.bold}>EL CONTRATANTE</Text> pueda: 1) Registrar la
          información de <Text style={styles.bold}>EL CONTRATISTA</Text> para
          organizar, administrar y gestionar su información y sus datos
          personales; 2) Mantener actualizada la información de{" "}
          <Text style={styles.bold}>EL CONTRATISTA</Text>; 3) Realizar
          invitaciones a eventos y/o actividades de{" "}
          <Text style={styles.bold}>EL CONTRATANTE</Text>; 4) Las demás, acordes
          con el presente contrato.
        </Text>

        <Text style={styles.paragraph}>
          De igual manera cada parte se obliga para con la otra, a obtener,
          verificar y confirmar la existencia de la autorización otorgada por
          los titulares de los datos personales que puedan ser objeto de
          transmisión o transferencia a la otra parte en la ejecución del
          presente contrato, de acuerdo con las normas aplicables y en
          particular por las contenidas en la Ley 1581 de 2012. En virtud de lo
          anterior, la parte que como responsable o encargada recibe los datos
          personales transmitidos o transferidos deberá acogerse a las políticas
          y normativas establecidas y adoptadas por la ley respecto de
          tratamiento de datos personales, de tal manera que se permita a los
          Titulares ejercer oportunamente sus derechos. Siempre que una de las
          partes actúe como Responsable o Encargada de los datos personales que
          le puedan ser transmitidos o transferidos por la otra parte deberá dar
          aplicación a las obligaciones que le impone la Ley 1581 de 2012 y
          demás normas que las complementen, modifiquen y/o deroguen, y realizar
          el Tratamiento de datos de acuerdo con la finalidad que los Titulares
          hayan autorizado en el tratamiento de datos en cuestión; debiendo así
          mismo, velar porque el tratamiento de los datos personales se efectúe
          conforme a los principios que los tutelan; velar porque se salvaguarde
          la seguridad de las bases de datos en los que se contengan datos
          personales y que se guarde absoluta confidencialidad respecto del
          Tratamiento de los datos personales transferidos o transmitidos en
          razón el presente contrato. El incumplimiento de esta obligación hará
          responsable a la parte que vulneró dichos derechos y disposiciones
          legales por los perjuicios que se causen, directa o indirectamente al
          titular de los datos personales o a la otra parte, dando lugar a la
          iniciación de las acciones penales y civiles correspondientes. Las
          obligaciones referidas al tratamiento de los datos personales,
          adquiridas por las partes en desarrollo del presente contrato,
          sobrevivirán aún a la terminación del mismo de manera indefinida.
        </Text>

        {/* Cláusula Décima Segunda */}
        <Text style={styles.clauseTitle}>
          CLÁUSULA DÉCIMA SEGUNDA. - MÉRITO EJECUTIVO:
        </Text>
        <Text style={styles.paragraph}>
          El presente documento presta mérito ejecutivo para exigirle a la parte
          incumplida, el cumplimiento de todas las obligaciones en él
          consagradas y de la cláusula penal, ya que se trata de una obligación
          clara, expresa y exigible al tenor de los arts. 422 y 424 del C. G. P,
          la cual no requiere de prueba diferente a la mera presentación en
          copia simple de este contrato debidamente suscrito por ambas partes.
          Ambas partes le otorgan la fuerza necesaria para presumir su
          autenticidad y presumir el incumplimiento con su presentación ante un
          juez colombiano para su respectivo cobro ejecutivo.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>PARÁGRAFO PRIMERO:</Text> La parte
          incumplida renuncia expresamente a los requerimientos privados y
          judiciales de ley y, en caso de incumplimiento de sus obligaciones
          será deudor de la cláusula penal establecida, la cual en caso de no
          pagarse al momento de su exigibilidad generará intereses moratorios
          conforme al Artículo 884 del Código de Comercio.
        </Text>

        {/* Cláusula Décima Cuarta */}
        <Text style={styles.clauseTitle}>
          CLÁUSULA DÉCIMA CUARTA. - CESIÓN:
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>LAS PARTES</Text> no podrán ceder total o
          parcialmente su posición contractual en el presente acuerdo sin la
          autorización previa y por escrito de la otra parte.
        </Text>

        {/* Cláusula Décima Quinta */}
        <Text style={styles.clauseTitle}>
          CLÁUSULA DÉCIMA QUINTA. - DESCUBRIMIENTOS E INVENCIONES:
        </Text>
        <Text style={styles.paragraph}>
          Los descubrimientos o invenciones y las mejoras en los procedimientos,
          lo mismo que todos los servicios y consiguientes resultados en las
          actividades de <Text style={styles.bold}>EL CONTRATISTA</Text>, cuando
          este haya sido contratado para investigar o cuando por naturaleza de
          sus obligaciones haya tenido acceso a secretos o investigaciones
          confidenciales, quedarán de propiedad exclusiva de{" "}
          <Text style={styles.bold}>EL CONTRATANTE</Text> y además tendrá este
          último derecho de hacer patentar a su nombre o a nombre de terceros
          esos inventos o mejoras, para lo cual{" "}
          <Text style={styles.bold}>EL CONTRATISTA</Text> accederá a facilitar
          el conocimiento y consentimiento oportuno de las correspondientes
          formalidades y dar su firma y extender los poderes y documentos
          necesarios para tal fin, según y cuando lo solicite{" "}
          <Text style={styles.bold}>EL CONTRATANTE</Text>, sin que éste quede
          obligado al pago de compensación alguna.
        </Text>

        {/* Cláusula Décima Sexta */}
        <Text style={styles.clauseTitle}>CLÁUSULA DÉCIMA SEXTA. Efectos.</Text>
        <Text style={styles.paragraph}>
          El presente contrato reemplaza y deja sin efecto cualquier otro
          contrato verbal o escrito, que se hubiera celebrado entre las partes
          con anterioridad.
        </Text>

        {/* Cláusula Décima Séptima */}
        <Text style={styles.clauseTitle}>
          CLAUSULA DECIMA SEPTIMA- MODIFICACIONES:
        </Text>
        <Text style={styles.paragraph}>
          El presente contrato sólo podrá ser modificado mediante acuerdo
          escrito y firmado por <Text style={styles.bold}>LAS PARTES</Text>.
        </Text>

        {/* Fecha de firma */}
        <Text style={styles.paragraph}>
          El presente contrato se suscribe a los{" "}
          <Text style={styles.underline}>
            {formatDate(data.fechaEjecucion)}
          </Text>
          .
        </Text>

        {/* Sección de firmas */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLabel}>EL CONTRATANTE,</Text>
            <View style={styles.signatureLine}></View>
            <Text style={styles.signatureLabel}>Andes Workforce LLC</Text>
          </View>

          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLabel}>EL CONTRATISTA,</Text>
            <View style={styles.signatureLine}></View>
            <Text style={styles.signatureLabel}>
              {data.nombreCompleto || "____________________________"}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default StatementOfWorkPDF;
