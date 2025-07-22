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
  contactSection: {
    marginTop: 15,
    marginBottom: 15,
  },
});

interface StatementOfWorkEnglishData {
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

interface StatementOfWorkEnglishPDFProps {
  data: StatementOfWorkEnglishData;
}

const StatementOfWorkEnglishPDF: React.FC<StatementOfWorkEnglishPDFProps> = ({
  data,
}) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
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

  return (
    <Document>
      {/* Página 1: Statement of Work */}
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
          Contractor can determine their place of work and equipment to be used
          subject to the terms agreed with Company.
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
        <Text style={styles.paragraph}>(&quot;Key Company Contact&quot;)</Text>

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

      {/* Página 2: Professional Services Agreement */}
      <Page size="A4" style={styles.page}>
        {/* Header con logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image src="/images/logo-andes.png" style={styles.logo} />
          </View>
        </View>

        {/* Título */}
        <Text style={styles.title}>PROFESSIONAL SERVICES AGREEMENT</Text>

        <Text style={styles.paragraph}>
          This Professional Services Agreement (&quot;Agreement&quot;) is
          entered into effective as of{" "}
          <Text style={styles.underline}>
            {data.fechaEjecucion
              ? formatDate(data.fechaEjecucion)
              : "_____________"}
          </Text>
          , between Andes Workforce LLC, a Florida limited liability company
          (&quot;Company&quot;), and{" "}
          <Text style={styles.underline}>
            {data.nombreCompleto || "__________________________"}
          </Text>
          , an individual (&quot;Contractor&quot;).
        </Text>

        <Text style={styles.clauseTitle}>1. Services</Text>
        <Text style={styles.paragraph}>
          Contractor agrees to provide the Services described in one or more
          Statements of Work (&quot;SOW&quot;) entered into between the parties
          pursuant to this Agreement. Each SOW will describe the Services to be
          performed, the compensation to be paid by Company for such Services,
          and any other terms specific to such Services.
        </Text>

        <Text style={styles.clauseTitle}>2. Payment</Text>
        <Text style={styles.paragraph}>
          Company will pay Contractor the amounts specified in the applicable
          SOW for Services satisfactorily performed by Contractor hereunder.
          Unless otherwise specified in an SOW, Company will pay Contractor
          within thirty (30) days after the end of each calendar month for
          Services performed during such month.
        </Text>

        <Text style={styles.clauseTitle}>3. Independent Contractor</Text>
        <Text style={styles.paragraph}>
          Contractor acknowledges and agrees that Contractor is an independent
          contractor and not an employee of Company. Contractor will not be
          entitled to any employee benefits, including without limitation,
          health or dental insurance, disability insurance, or participation in
          any pension, profit sharing or similar plan. Contractor is responsible
          for paying all taxes associated with compensation received hereunder.
        </Text>

        <Text style={styles.clauseTitle}>4. Confidentiality</Text>
        <Text style={styles.paragraph}>
          During the performance of Services, Contractor may have access to
          certain confidential and proprietary information of Company
          (&quot;Confidential Information&quot;). Contractor agrees to maintain
          in confidence and not disclose any Confidential Information to any
          third party without the prior written consent of Company.
        </Text>

        <Text style={styles.clauseTitle}>5. Ownership of Work Product</Text>
        <Text style={styles.paragraph}>
          Any work product, inventions, discoveries, developments, or other
          materials created by Contractor in the performance of Services
          (&quot;Work Product&quot;) shall be the sole and exclusive property of
          Company. Contractor hereby assigns to Company all right, title and
          interest in and to the Work Product.
        </Text>

        <Text style={styles.clauseTitle}>6. Non-Solicitation</Text>
        <Text style={styles.paragraph}>
          During the term of this Agreement and for a period of twelve (12)
          months thereafter, Contractor agrees not to directly or indirectly
          solicit, recruit, or hire any employee of Company or any of its
          affiliates.
        </Text>

        <Text style={styles.clauseTitle}>7. Termination</Text>
        <Text style={styles.paragraph}>
          This Agreement may be terminated by either party upon thirty (30)
          days&apos; written notice to the other party. Upon termination,
          Contractor shall promptly return all Confidential Information and
          Company property in Contractor&apos;s possession.
        </Text>

        <Text style={styles.clauseTitle}>8. Governing Law</Text>
        <Text style={styles.paragraph}>
          This Agreement shall be governed by and construed in accordance with
          the laws of the State of Florida, without regard to its conflict of
          law principles.
        </Text>

        <Text style={styles.paragraph}>
          IN WITNESS WHEREOF, the parties have executed this Agreement as of the
          date first written above.
        </Text>

        {/* Signature section */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLabel}>COMPANY:</Text>
            <View style={styles.signatureLine}></View>
            <Text style={styles.signatureLabel}>
              By: Miguel Rendon, Manager
            </Text>
            <Text style={styles.signatureLabel}>Andes Workforce LLC</Text>
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLabel}>CONTRACTOR:</Text>
            <View style={styles.signatureLine}></View>
            <Text style={styles.signatureLabel}>
              {data.nombreCompleto || "____________________________"}
            </Text>
          </View>
        </View>
      </Page>

      {/* Página 3: Confidentiality Agreement */}
      <Page size="A4" style={styles.page}>
        {/* Header con logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image src="/images/logo-andes.png" style={styles.logo} />
          </View>
        </View>

        {/* Título */}
        <Text style={styles.title}>CONFIDENTIALITY AGREEMENT</Text>

        <Text style={styles.paragraph}>
          This Confidentiality Agreement (&quot;Agreement&quot;) is entered into
          effective as of{" "}
          <Text style={styles.underline}>
            {data.fechaEjecucion
              ? formatDate(data.fechaEjecucion)
              : "_____________"}
          </Text>
          , between Andes Workforce LLC (&quot;Company&quot;) and{" "}
          <Text style={styles.underline}>
            {data.nombreCompleto || "__________________________"}
          </Text>
          (&quot;Contractor&quot;).
        </Text>

        <Text style={styles.clauseTitle}>
          1. Definition of Confidential Information
        </Text>
        <Text style={styles.paragraph}>
          &quot;Confidential Information&quot; means any and all non-public,
          confidential or proprietary information disclosed by Company to
          Contractor, including but not limited to:
        </Text>
        <Text style={styles.listItem}>
          • Technical data, know-how, research, product plans, products,
          services, customers, customer lists, markets, software, developments,
          inventions, processes, formulas, technology, designs, drawings,
          engineering, hardware configuration information, marketing, finances,
          or other business information.
        </Text>
        <Text style={styles.listItem}>
          • Information received from third parties that Company is obligated to
          treat as confidential.
        </Text>
        <Text style={styles.listItem}>
          • Any other information that Contractor knew, or reasonably should
          have known, was the confidential information of Company.
        </Text>

        <Text style={styles.clauseTitle}>2. Non-Disclosure Obligations</Text>
        <Text style={styles.paragraph}>Contractor agrees to:</Text>
        <Text style={styles.listItem}>
          • Hold and maintain all Confidential Information in strict confidence;
        </Text>
        <Text style={styles.listItem}>
          • Not disclose any Confidential Information to any third parties
          without Company&apos;s prior written consent;
        </Text>
        <Text style={styles.listItem}>
          • Not use any Confidential Information for any purpose other than
          performing Services for Company;
        </Text>
        <Text style={styles.listItem}>
          • Take reasonable precautions to prevent unauthorized disclosure of
          Confidential Information.
        </Text>

        <Text style={styles.clauseTitle}>3. Exceptions</Text>
        <Text style={styles.paragraph}>
          The obligations set forth in Section 2 shall not apply to information
          that:
        </Text>
        <Text style={styles.listItem}>
          • Is or becomes publicly available through no breach of this Agreement
          by Contractor;
        </Text>
        <Text style={styles.listItem}>
          • Is rightfully received by Contractor from a third party without
          restriction and without breach of this Agreement;
        </Text>
        <Text style={styles.listItem}>
          • Is independently developed by Contractor without use of or reference
          to Confidential Information;
        </Text>
        <Text style={styles.listItem}>
          • Is required to be disclosed by law or court order, provided that
          Contractor gives Company reasonable advance notice of such required
          disclosure.
        </Text>

        <Text style={styles.clauseTitle}>4. Return of Materials</Text>
        <Text style={styles.paragraph}>
          Upon termination of Contractor&apos;s relationship with Company, or
          upon Company&apos;s request, Contractor will promptly return to
          Company all documents, materials, and other tangible items containing
          or representing Confidential Information and all copies thereof.
        </Text>

        <Text style={styles.clauseTitle}>5. Remedies</Text>
        <Text style={styles.paragraph}>
          Contractor acknowledges that any breach of this Agreement may cause
          irreparable harm to Company for which monetary damages would be
          inadequate. Therefore, Company shall be entitled to seek injunctive
          relief and other equitable remedies to enforce this Agreement.
        </Text>

        <Text style={styles.clauseTitle}>6. Duration</Text>
        <Text style={styles.paragraph}>
          This Agreement shall remain in effect for a period of five (5) years
          from the date first written above, or until the Confidential
          Information is no longer confidential, whichever occurs first.
        </Text>

        <Text style={styles.clauseTitle}>7. Governing Law</Text>
        <Text style={styles.paragraph}>
          This Agreement shall be governed by and construed in accordance with
          the laws of the State of Florida.
        </Text>

        <Text style={styles.paragraph}>
          IN WITNESS WHEREOF, the parties have executed this Agreement as of the
          date first written above.
        </Text>

        {/* Signature section */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLabel}>COMPANY:</Text>
            <View style={styles.signatureLine}></View>
            <Text style={styles.signatureLabel}>
              By: Miguel Rendon, Manager
            </Text>
            <Text style={styles.signatureLabel}>Andes Workforce LLC</Text>
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLabel}>CONTRACTOR:</Text>
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

export default StatementOfWorkEnglishPDF;
