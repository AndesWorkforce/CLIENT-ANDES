import React from "react";
/**
 * UNUSED TEMPLATE (2025-10-15)
 * Not referenced by SignContractModal or Contracts page flows.
 * Retained temporarily for reference; consider deleting if not needed.
 */
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Styles for the PDF - using only safe fonts
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
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#0097B2",
  },
  indentedText: {
    marginLeft: 20,
    marginBottom: 8,
  },
});

interface EnglishServiceAgreementData {
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
}

interface EnglishServiceAgreementPDFProps {
  data: EnglishServiceAgreementData;
}

const EnglishServiceAgreementPDF: React.FC<EnglishServiceAgreementPDFProps> = ({
  data,
}) => {
  // Asegurar que los datos estén presentes con valores por defecto
  const safeData = {
    ...data,
    nombreCompleto: data.nombreCompleto || "Contractor Name",
    correoElectronico: data.correoElectronico || "contractor@email.com",
    cedula: data.cedula || "000000000",
    telefono: data.telefono || "000-000-0000",
    nacionalidad: data.nacionalidad || "Unknown",
    direccionCompleta: data.direccionCompleta || "Address not provided",
    puestoTrabajo: data.puestoTrabajo || "Professional Services",
    descripcionServicios:
      data.descripcionServicios || "Professional services to be provided",
    ofertaSalarial: data.ofertaSalarial || "0",
    salarioProbatorio: data.salarioProbatorio || "0",
    monedaSalario: data.monedaSalario || "USD",
    nombreBanco: data.nombreBanco || "Bank Name",
    numeroCuenta: data.numeroCuenta || "Account Number",
    fechaEjecucion:
      data.fechaEjecucion ||
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    fechaInicioLabores:
      data.fechaInicioLabores || new Date().toISOString().split("T")[0],
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return date.toLocaleDateString("en-US", options);
    } catch {
      return dateString;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image src="/images/logo-andes.png" style={styles.logo} />
          </View>
        </View>

        {/* Main title */}
        <Text style={styles.title}>STATEMENT OF WORK</Text>

        {/* Introduction */}
        <Text style={styles.paragraph}>
          This Statement of Work is being executed on{" "}
          <Text style={styles.underline}>
            {safeData.fechaEjecucion
              ? formatDate(safeData.fechaEjecucion)
              : "_____________"}
          </Text>
          , between Andes Workforce LLC (&quot;Company&quot;) and{" "}
          <Text style={styles.underline}>
            {safeData.nombreCompleto || "__________________________"}
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
            {safeData.puestoTrabajo || "____________________"}
          </Text>{" "}
          services as further detailed below (&quot;Services&quot;) to Company
          beginning on{" "}
          <Text style={styles.underline}>
            {safeData.fechaInicioLabores || "_____________"}
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
          {safeData.descripcionServicios ||
            "Professional services including but not limited to administrative support, data processing, client communication, document management, and other related tasks as assigned by the Company."}
        </Text>

        {/* Description of workflow */}
        <Text style={styles.clauseTitle}>Description of workflow</Text>
        <Text style={styles.paragraph}>
          Contractor shall devote the necessary time for the performance of
          Services, in accordance with the Professional Services Agreement.
          Contractor can determine their place of work and equipment to be used
          subject to the terms agreed with Company.
        </Text>

        <Text style={styles.paragraph}>
          In connection with this Statement of Work, the parties may reach out
          to each other as follows:
        </Text>

        {/* Contact Information */}
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Contact person (Company):</Text>
        </Text>
        <Text style={styles.indentedText}>Miguel Rendon</Text>
        <Text style={styles.indentedText}>info@andes-workforce.com</Text>
        <Text style={styles.indentedText}>
          (&quot;Key Company Contact&quot;)
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Contact person (Contractor):</Text>
        </Text>
        <Text style={styles.indentedText}>
          <Text style={styles.underline}>
            {safeData.nombreCompleto || "_________________________"}
          </Text>
        </Text>
        <Text style={styles.indentedText}>
          <Text style={styles.underline}>
            {safeData.correoElectronico || "_________________________"}
          </Text>
        </Text>
        <Text style={styles.indentedText}>
          (&quot;Key Contractor Contact&quot;)
        </Text>

        {/* Service Fee */}
        <Text style={styles.clauseTitle}>Service Fee</Text>
        <Text style={styles.paragraph}>
          As of the Start Date, Contractor will be paid a fee of USD{" "}
          <Text style={styles.underline}>
            {safeData.salarioProbatorio || "_______"}
          </Text>{" "}
          fixed per month during a 3-month probationary period. Starting the
          first day of the month following the probationary period, Contractor
          will be paid a fee of USD{" "}
          <Text style={styles.underline}>
            {safeData.ofertaSalarial || "________"}
          </Text>{" "}
          fixed per month, inclusive of all taxes (howsoever described)
          (&quot;Service Fee&quot;). Payment of the Service Fee to Contractor
          will be initiated on the last day of the month. This Service Fee will
          be increased by 5% annually.
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
          Contractor will receive payment via direct deposit to the bank account
          below:
        </Text>

        <View style={styles.indentedText}>
          <Text style={styles.paragraph}>
            Name of Bank: {safeData.nombreBanco || "________________"}
          </Text>
          <Text style={styles.paragraph}>
            Account Number: {safeData.numeroCuenta || "____________"}
          </Text>
          <Text style={styles.paragraph}>
            Account holder name as it appears on bank account:{" "}
            {safeData.nombreCompleto || "_________________________________"}
          </Text>
          <Text style={styles.paragraph}>
            Account holder address, city, state, and zip code:{" "}
            {safeData.direccionCompleta ||
              "____________________________________"}
          </Text>
          <Text style={styles.paragraph}>
            Telephone number:{" "}
            {safeData.telefono || "__________________________"}
          </Text>
          <Text style={styles.paragraph}>
            Government Identification Number:{" "}
            {safeData.cedula || "__________________"}
          </Text>
        </View>

        {/* Independent Contractor Relationship */}
        <Text style={styles.clauseTitle}>
          Independent Contractor Relationship
        </Text>
        <Text style={styles.paragraph}>
          Company and Contractor acknowledge and agree that Contractor is not an
          employee and expressly state that the Services covered by this
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
          reasonably determined by the Company, or on the last date practicable
          after the Start Date in accordance with applicable law, unless
          extended by the parties in writing. Additional Statements of Work may
          be entered into upon mutual agreement of the Parties. During the
          3-month probationary period, either party may terminate this Statement
          of Work without cause, upon at least 2 days written notice to the
          other Party.
        </Text>

        <Text style={styles.paragraph}>
          After completion of the 3-month probationary period, the Company
          requires a two-week notice to terminate this Statement of Work. In the
          event of separation from the company, whether voluntary or
          involuntary, contractor shall ensure a proper turnover of all duties
          and responsibilities to other employees, including any and all company
          records, documents, properties, equipment and other materials in
          possession and custody of contractor.
        </Text>

        {/* Paid Time Off */}
        <Text style={styles.clauseTitle}>Paid Time Off (PTO)</Text>
        <Text style={styles.paragraph}>
          Contractor will accrue 15 PTO days per calendar year. Contractor will
          request PTO via email from Company ahead of time and, once approved,
          Company will notify contractor with an updated PTO balance.
        </Text>

        <Text style={styles.paragraph}>
          PTO is not authorized during initial 3-month probationary period,
          Contractor can accrue a maximum of 30 PTO days, PTO accrual will stop
          once a Contractor reaches the 30-day balance limit.
        </Text>

        {/* Signature section */}
        <Text style={styles.paragraph}>
          Agreed to this day, by and between,
        </Text>

        <View style={styles.signatureSection}>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLabel}>
              _______Firma Miguel__________
            </Text>
            <Text style={styles.signatureLabel}>Andes Workforce LLC</Text>
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLabel}>
              ____________________________
            </Text>
            <Text style={styles.signatureLabel}>
              {safeData.nombreCompleto || "Contractor Name"}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default EnglishServiceAgreementPDF;
