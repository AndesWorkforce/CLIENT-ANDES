import React from "react";
/**
 * UNUSED TEMPLATE (2025-10-15)
 * Only used by deprecated PDFPreviewSSG; not used in SignContractModal.
 */
import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { createBaseStyles } from "./styles";

const styles = createBaseStyles();

interface ContractData {
  fechaEjecucion: string;
  nombreCompleto: string;
  correoElectronico: string;
  ofertaSalarial: string;
  monedaSalario: string;
  direccionCompleta: string;
  telefono: string;
  cedula: string;
  nacionalidad?: string;
  nombreBanco?: string;
  numeroCuenta?: string;
}

interface EntradaDatosContractPDFProps {
  data: ContractData;
}

const EntradaDatosContractPDF: React.FC<EntradaDatosContractPDFProps> = ({
  data,
}) => {
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

  const descripcionServicio = `entrada de datos. El alcance de este servicio es ingresar información relacionada con el cliente y el caso de manera precisa en bases de datos definidas para tal fin. El objeto principal de este servicio es mantener la integridad de los datos, señalar las discrepancias y admitir actualizaciones oportunas en todos los sistemas legales.`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image src="/images/logo-andes.png" style={styles.logo} />
          </View>
        </View>

        <Text style={styles.title}>
          CONTRATO DE PRESTACIÓN DE SERVICIOS PROFESIONALES
        </Text>

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

        <Text style={styles.clauseTitle}>CLÁUSULA PRIMERA. – OBJETO:</Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>EL CONTRATISTA</Text> de manera
          independiente, haciendo uso de sus propios medios y herramientas,
          prestará los servicios de {descripcionServicio}
        </Text>

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
          ({data.monedaSalario}{" "}
          {data.ofertaSalarial
            ? `${data.ofertaSalarial} dólares`
            : "_____ dólares"}
          ) mensuales, pagaderos en dos cuotas quincenales.
        </Text>

        <Text style={styles.clauseTitle}>
          CLÁUSULA TERCERA. – PLAZO DE EJECUCIÓN:
        </Text>
        <Text style={styles.paragraph}>
          El presente contrato tendrá una duración indefinida y podrá ser
          terminado por cualquiera de las partes con un preaviso de treinta (30)
          días calendario.
        </Text>

        <Text style={styles.clauseTitle}>
          CLÁUSULA CUARTA. – OBLIGACIONES DEL CONTRATISTA:
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>EL CONTRATISTA</Text> se obliga a:
        </Text>
        <Text style={styles.listItem}>
          a) Prestar los servicios objeto del presente contrato con la calidad,
          eficiencia y oportunidad requeridas.
        </Text>
        <Text style={styles.listItem}>
          b) Cumplir con los estándares de calidad establecidos por{" "}
          <Text style={styles.bold}>EL CONTRATANTE</Text>.
        </Text>
        <Text style={styles.listItem}>
          c) Mantener absoluta confidencialidad sobre la información a la que
          tenga acceso.
        </Text>
        <Text style={styles.listItem}>
          d) Utilizar sus propios medios y herramientas para la prestación del
          servicio.
        </Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.clauseTitle}>
          CLÁUSULA QUINTA. – OBLIGACIONES DEL CONTRATANTE:
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>EL CONTRATANTE</Text> se obliga a:
        </Text>
        <Text style={styles.listItem}>
          a) Pagar oportunamente el valor acordado por los servicios prestados.
        </Text>
        <Text style={styles.listItem}>
          b) Proporcionar la información necesaria para la adecuada prestación
          del servicio.
        </Text>
        <Text style={styles.listItem}>
          c) Brindar el apoyo técnico requerido para el desarrollo de las
          actividades.
        </Text>

        <Text style={styles.clauseTitle}>CLÁUSULA SEXTA. – FORMA DE PAGO:</Text>
        <Text style={styles.paragraph}>
          Los pagos se realizarán mediante transferencia bancaria a la cuenta
          del <Text style={styles.bold}>CONTRATISTA</Text>:
        </Text>
        <Text style={styles.listItem}>
          Banco:{" "}
          <Text style={styles.underline}>
            {data.nombreBanco || "_________________"}
          </Text>
        </Text>
        <Text style={styles.listItem}>
          Número de cuenta:{" "}
          <Text style={styles.underline}>
            {data.numeroCuenta || "_________________"}
          </Text>
        </Text>

        <Text style={styles.clauseTitle}>
          CLÁUSULA SÉPTIMA. – INDEPENDENCIA:
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>EL CONTRATISTA</Text> actuará como
          contratista independiente, manteniendo autonomía técnica y
          administrativa en la prestación del servicio.
        </Text>

        <Text style={styles.clauseTitle}>CLÁUSULA OCTAVA. – TERMINACIÓN:</Text>
        <Text style={styles.paragraph}>
          El presente contrato podrá terminarse por mutuo acuerdo, por
          vencimiento del plazo, por incumplimiento de cualquiera de las partes
          o por las demás causales establecidas en la ley.
        </Text>

        <Text style={styles.clauseTitle}>
          CLÁUSULA NOVENA. – CONFIDENCIALIDAD:
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>EL CONTRATISTA</Text> se compromete a
          mantener en estricta confidencialidad toda la información, documentos
          y datos a los que tenga acceso durante la ejecución del presente
          contrato.
        </Text>

        <Text style={styles.clauseTitle}>
          CLÁUSULA DÉCIMA. – PERFECCIONAMIENTO:
        </Text>
        <Text style={styles.paragraph}>
          El presente contrato se perfecciona con la firma de las partes y
          produce efectos jurídicos a partir de{" "}
          <Text style={styles.underline}>
            {data.fechaEjecucion
              ? formatDate(data.fechaEjecucion)
              : "_________________"}
          </Text>
          .
        </Text>

        <View style={styles.signatureSection}>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>EL CONTRATANTE</Text>
            <Text style={styles.signatureLabel}>Andes Workforce LLC</Text>
          </View>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>EL CONTRATISTA</Text>
            <Text style={styles.signatureLabel}>
              {data.nombreCompleto || "Nombre del Contratista"}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default EntradaDatosContractPDF;
