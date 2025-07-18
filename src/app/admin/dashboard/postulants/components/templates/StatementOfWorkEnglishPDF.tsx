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
  telefono: string;
  cedula: string;
  nacionalidad?: string;
  direccionCompleta?: string;
  puestoTrabajo?: string;
  nombreBanco?: string;
  numeroCuenta?: string;
  // Nuevo campo para determinar si es el template en inglés
  isEnglish?: boolean;
}

interface StatementOfWorkPDFProps {
  data: StatementOfWorkData;
}

const StatementOfWorkPDF: React.FC<StatementOfWorkPDFProps> = ({ data }) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (data.isEnglish) {
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      } else {
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
      }
    } catch {
      return dateString;
    }
  };

  const formatDateShort = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // Renderizar template en inglés
  if (data.isEnglish) {
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
          <Text style={styles.title}>STATEMENT OF WORK</Text>

          {/* Introducción */}
          <Text style={styles.paragraph}>
            This Statement of Work is being executed on{" "}
            <Text style={styles.underline}>
              {data.fechaEjecucion
                ? formatDate(data.fechaEjecucion)
                : "_____________"}
            </Text>
            , between Andes Workforce LLC (&quot;Company&quot;) and{" "}
            <Text style={styles.underline}>
              {data.nombreCompleto || "__________________________"}
            </Text>{" "}
            (&quot;Contractor&quot;). This Statement of Work describes the
            Services to be performed and provided by Contractor pursuant to the
            Professional Services Agreement.
          </Text>

          {/* Term */}
          <Text style={styles.clauseTitle}>Term</Text>
          <Text style={styles.paragraph}>
            Contractor agrees to provide{" "}
            <Text style={styles.underline}>
              {data.puestoTrabajo || "____________________"}
            </Text>{" "}
            services as further detailed below (&quot;Services&quot;) to Company
            beginning on{" "}
            <Text style={styles.underline}>
              {data.fechaInicioLabores
                ? formatDateShort(data.fechaInicioLabores)
                : "_____________"}
            </Text>{" "}
            (&quot;Start Date&quot;) and continuing until it expires or is
            terminated by Company or Contractor.
          </Text>

          {/* Services */}
          <Text style={styles.clauseTitle}>Services</Text>
          <Text style={styles.paragraph}>
            The Contractor will provide the following Services:
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.underline}>
              {data.descripcionServicios ||
                "______________________________________________________________________________"}
            </Text>
          </Text>

          {/* Description of workflow */}
          <Text style={styles.clauseTitle}>Description of workflow</Text>
          <Text style={styles.paragraph}>
            Contractor shall devote the necessary time for the performance of
            Services, in accordance with the Professional Services Agreement.
            Contractor can determine their place of work and equipment to be
            used subject to the terms agreed with Company.
          </Text>

          <Text style={styles.paragraph}>
            In connection with this Statement of Work, the parties may reach out
            to each other as follows:
          </Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Contact person (Company):</Text>
          </Text>
          <Text style={styles.paragraph}>Miguel Rendon</Text>
          <Text style={styles.paragraph}>info@andes-workforce.com</Text>
          <Text style={styles.paragraph}>
            (&quot;Key Company Contact&quot;)
          </Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Contact person (Contractor):</Text>
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.underline}>
              {data.nombreCompleto || "_________________________"}
            </Text>
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.underline}>
              {data.correoElectronico || "_________________________"}
            </Text>
          </Text>
          <Text style={styles.paragraph}>
            (&quot;Key Contractor Contact&quot;)
          </Text>

          {/* Service Fee */}
          <Text style={styles.clauseTitle}>Service Fee</Text>
          <Text style={styles.paragraph}>
            As of the Start Date, Contractor will be paid a fee of USD{" "}
            <Text style={styles.underline}>
              {data.salarioProbatorio || "_______"}
            </Text>{" "}
            fixed per month during a 3-month probationary period. Starting the
            first day of the month following the probationary period, Contractor
            will be paid a fee of USD{" "}
            <Text style={styles.underline}>
              {data.ofertaSalarial || "________"}
            </Text>{" "}
            fixed per month, inclusive of all taxes (howsoever described)
            (&quot;Service Fee&quot;). Payment of the Service Fee to Contractor
            will be initiated on the last day of the month. This Service Fee
            will be increased by 5% annually.
          </Text>

          <Text style={styles.paragraph}>
            Contractors will receive extra pay when required to work during a
            local holiday according to their country of residence regulation.
          </Text>

          <Text style={styles.paragraph}>
            Additionally, Contractor will receive a 2-week holiday bonus at the
            end of each calendar year. The holiday bonus will be prorated for
            Contractors who have completed less than 6 months of work at the end
            of the calendar year.
          </Text>

          <Text style={styles.paragraph}>
            Contractor will receive payment via direct deposit to the bank
            account below:
          </Text>

          <Text style={styles.paragraph}>
            Name of Bank:{" "}
            <Text style={styles.underline}>
              {data.nombreBanco || "________________"}
            </Text>
          </Text>
          <Text style={styles.paragraph}>
            Account Number:{" "}
            <Text style={styles.underline}>
              {data.numeroCuenta || "____________"}
            </Text>
          </Text>
          <Text style={styles.paragraph}>
            Account holder name as it appears on bank account:{" "}
            <Text style={styles.underline}>
              {data.nombreCompleto || "_________________________________"}
            </Text>
          </Text>
          <Text style={styles.paragraph}>
            Account holder address, city, state, and zip code:{" "}
            <Text style={styles.underline}>
              {data.direccionCompleta || "____________________________________"}
            </Text>
          </Text>
          <Text style={styles.paragraph}>
            Telephone number:{" "}
            <Text style={styles.underline}>
              {data.telefono || "__________________________"}
            </Text>
          </Text>
          <Text style={styles.paragraph}>
            Government Identification Number:{" "}
            <Text style={styles.underline}>
              {data.cedula || "__________________"}
            </Text>
          </Text>

          {/* Independent Contractor Relationship */}
          <Text style={styles.clauseTitle}>
            Independent Contractor Relationship
          </Text>
          <Text style={styles.paragraph}>
            Company and Contractor acknowledge and agree that Contractor is not
            an employee and expressly state that the Services covered by this
            Statement of Work shall be rendered independently by Contractor, and
            that the contractual relationship does not and will not create an
            employer-employee relationship. This declaration constitutes an
            essential element of this Agreement and a fundamental cause that the
            Parties, and especially the Company, have had for its execution.
          </Text>

          {/* Termination */}
          <Text style={styles.clauseTitle}>Termination</Text>
          <Text style={styles.paragraph}>
            This Statement of Work will end upon the completion of Services, as
            reasonably determined by the Company, or on the last date
            practicable after the Start Date in accordance with applicable law,
            unless extended by the parties in writing. Additional Statements of
            Work may be entered into upon mutual agreement of the Parties.
            During the 3-month probationary period, either party may terminate
            this Statement of Work without cause, upon at least 2 days written
            notice to the other Party.
          </Text>

          <Text style={styles.paragraph}>
            After completion of the 3-month probationary period, the Company
            requires a two-week notice to terminate this Statement of Work. In
            the event of separation from the company, whether voluntary or
            involuntary, contractor shall ensure a proper turnover of all duties
            and responsibilities to other employees, including any and all
            company records, documents, properties, equipment and other
            materials in possession and custody of contractor.
          </Text>

          {/* Paid Time Off */}
          <Text style={styles.clauseTitle}>Paid Time Off (PTO)</Text>
          <Text style={styles.paragraph}>
            Contractor will accrue 15 PTO days per calendar year. Contractor
            will request PTO via email from Company ahead of time and, once
            approved, Company will notify contractor with an updated PTO
            balance.
          </Text>

          <Text style={styles.paragraph}>
            PTO is not authorized during initial 3-month probationary period,
            Contractor can accrue a maximum of 30 PTO days, PTO accrual will
            stop once a Contractor reaches the 30-day balance limit.
          </Text>

          <Text style={styles.paragraph}>
            Agreed to this day, by and between,
          </Text>

          {/* Signature section */}
          <View style={styles.signatureSection}>
            <View style={styles.signatureBlock}>
              <Text style={styles.signatureLabel}>
                _______Firma Miguel__________
              </Text>
              <View style={styles.signatureLine}></View>
              <Text style={styles.signatureLabel}>Andes Workforce LLC</Text>
            </View>
            <View style={styles.signatureBlock}>
              <View style={styles.signatureLine}></View>
              <Text style={styles.signatureLabel}>
                {data.nombreCompleto || "____________________________"}
              </Text>
            </View>
          </View>
        </Page>
      </Document>
    );
  }

  // Renderizar template original en español (código existente)
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
          Entre los suscritos Andes Workforce LLC (&quot;Compañía&quot;) bajo el
          Registro de Compañía de Responsabilidad Limitada No. L24000192685 con
          su lugar principal de negocios en Florida, Estados Unidos y quien para
          efectos del presente contrato se denominará{" "}
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

        {/* Cláusula Primera */}
        <Text style={styles.clauseTitle}>CLÁUSULA PRIMERA. – OBJETO:</Text>
        <Text style={styles.paragraph}>
          {data.descripcionServicios ||
            "EL CONTRATISTA de manera independiente, haciendo uso de sus propios medios y herramientas, prestará los servicios de Mantener archivos de clientes, atender llamadas telefónicas, hablar con clientes potenciales y actuales, procesar documentos legales, iniciar reclamaciones y apelaciones, proporcionar información relacionada con los casos de los clientes, subir documentos PDF al portales electrónicos, recopilar información de clientes potenciales y proporcionarla para revisión, procesar documentos de admisión e ingresar información digitalmente, confirmar instalaciones médicas de los clientes, asistir a los clientes con los formularios requeridos y realizar tareas adicionales según se asignen."}
        </Text>

        {/* Resto del contenido en español... */}
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
          mensuales.
        </Text>

        {/* Signature section */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine}></View>
            <Text style={styles.signatureLabel}>COMPAÑÍA</Text>
            <Text style={styles.signatureLabel}>Andes Workforce LLC</Text>
          </View>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine}></View>
            <Text style={styles.signatureLabel}>CONTRATISTA</Text>
            <Text style={styles.signatureLabel}>
              {data.nombreCompleto || "___________________"}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default StatementOfWorkPDF;
