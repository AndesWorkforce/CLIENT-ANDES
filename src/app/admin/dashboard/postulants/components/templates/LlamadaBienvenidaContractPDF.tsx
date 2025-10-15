import React from "react";
/**
 * UNUSED TEMPLATE (2025-10-15)
 * Currently referenced only by deprecated PDFPreviewSSG.
 */
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Reutilizando los mismos estilos
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
}

interface LlamadaBienvenidaContractPDFProps {
  data: ContractData;
}

const LlamadaBienvenidaContractPDF: React.FC<
  LlamadaBienvenidaContractPDFProps
> = ({ data }) => {
  // const formatDate = (dateString: string) => {
  //   try {
  //     const date = new Date(dateString);
  //     const day = date.getDate();
  //     const months = [
  //       "enero",
  //       "febrero",
  //       "marzo",
  //       "abril",
  //       "mayo",
  //       "junio",
  //       "julio",
  //       "agosto",
  //       "septiembre",
  //       "octubre",
  //       "noviembre",
  //       "diciembre",
  //     ];
  //     const month = months[date.getMonth()];
  //     const year = date.getFullYear();
  //     return `${day} días del mes de ${month} año ${year}`;
  //   } catch (error) {
  //     return dateString;
  //   }
  // };

  const descripcionServicio = `llamadas de bienvenida. El alcance de este servicio es realizar llamadas introductorias amistosas y profesionales con nuevos clientes para confirmar los datos de contacto, explicar los próximos pasos en el proceso legal y establecer expectativas claras. El objeto principal es asegurar que los clientes se sientan informados y apoyados desde el comienzo de su caso.`;

  return (
    <Document>
      {/* Página 1 */}
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

        {/* Resto del contrato continúa igual... */}
      </Page>
    </Document>
  );
};

export default LlamadaBienvenidaContractPDF;
