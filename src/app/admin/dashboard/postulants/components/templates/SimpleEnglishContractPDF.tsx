import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Simplified styles for better compatibility
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
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginTop: 15,
    marginBottom: 8,
    color: "#333333",
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  underline: {
    textDecoration: "underline",
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  signatureBlock: {
    width: "45%",
    alignItems: "center",
  },
  signatureLabel: {
    fontSize: 10,
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
    marginBottom: 5,
  },
  indentedText: {
    marginLeft: 20,
    marginBottom: 6,
  },
});

interface SimpleEnglishContractData {
  fechaEjecucion?: string;
  nombreCompleto?: string;
  fechaInicioLabores?: string;
  descripcionServicios?: string;
  correoElectronico?: string;
  salarioProbatorio?: string;
  ofertaSalarial?: string;
  telefono?: string;
  cedula?: string;
  direccionCompleta?: string;
  puestoTrabajo?: string;
  nombreBanco?: string;
  numeroCuenta?: string;
}

interface SimpleEnglishContractPDFProps {
  data: SimpleEnglishContractData;
}

const SimpleEnglishContractPDF: React.FC<SimpleEnglishContractPDFProps> = ({
  data,
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "_____________";
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
    if (!dateString) return "_____________";
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
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image src="/images/logo-andes.png" style={styles.logo} />
          </View>
        </View>

        <Text style={styles.title}>STATEMENT OF WORK</Text>

        <Text style={styles.paragraph}>
          This Statement of Work is being executed on{" "}
          {formatDate(data.fechaEjecucion || "")}, between Andes Workforce LLC
          (&quot;Company&quot;) and{" "}
          {data.nombreCompleto || "__________________________"}{" "}
          (&quot;Contractor&quot;). This Statement of Work describes the
          Services to be performed and provided by Contractor pursuant to the
          Professional Services Agreement.
        </Text>

        <Text style={styles.clauseTitle}>Term</Text>
        <Text style={styles.paragraph}>
          Contractor agrees to provide{" "}
          {data.puestoTrabajo || "____________________"} services as further
          detailed below (&quot;Services&quot;) to Company beginning on{" "}
          {formatDateShort(data.fechaInicioLabores || "")} (&quot;Start
          Date&quot;) and continuing until it expires or is terminated by
          Company or Contractor.
        </Text>

        <Text style={styles.clauseTitle}>Services</Text>
        <Text style={styles.paragraph}>
          The Contractor will provide the following Services:
        </Text>
        <Text style={styles.paragraph}>
          {data.descripcionServicios ||
            "Professional services including but not limited to administrative support, data processing, client communication, document management, and other related tasks as assigned by the Company."}
        </Text>

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
        <Text style={styles.indentedText}>Miguel Rendon</Text>
        <Text style={styles.indentedText}>info@andes-workforce.com</Text>
        <Text style={styles.indentedText}>
          (&quot;Key Company Contact&quot;)
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Contact person (Contractor):</Text>
        </Text>
        <Text style={styles.indentedText}>
          {data.nombreCompleto || "_________________________"}
        </Text>
        <Text style={styles.indentedText}>
          {data.correoElectronico || "_________________________"}
        </Text>
        <Text style={styles.indentedText}>
          (&quot;Key Contractor Contact&quot;)
        </Text>

        <Text style={styles.clauseTitle}>Service Fee</Text>
        <Text style={styles.paragraph}>
          As of the Start Date, Contractor will be paid a fee of USD{" "}
          {data.salarioProbatorio || "_______"} fixed per month during a 3-month
          probationary period. Starting the first day of the month following the
          probationary period, Contractor will be paid a fee of USD{" "}
          {data.ofertaSalarial || "________"} fixed per month, inclusive of all
          taxes (howsoever described) (&quot;Service Fee&quot;). Payment of the
          Service Fee to Contractor will be initiated on the last day of the
          month. This Service Fee will be increased by 5% annually.
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

        <Text style={styles.indentedText}>
          Name of Bank: {data.nombreBanco || "________________"}
        </Text>
        <Text style={styles.indentedText}>
          Account Number: {data.numeroCuenta || "____________"}
        </Text>
        <Text style={styles.indentedText}>
          Account holder name as it appears on bank account:{" "}
          {data.nombreCompleto || "_________________________________"}
        </Text>
        <Text style={styles.indentedText}>
          Account holder address, city, state, and zip code:{" "}
          {data.direccionCompleta || "____________________________________"}
        </Text>
        <Text style={styles.indentedText}>
          Telephone number: {data.telefono || "__________________________"}
        </Text>
        <Text style={styles.indentedText}>
          Government Identification Number:{" "}
          {data.cedula || "__________________"}
        </Text>

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
              {data.nombreCompleto || "Contractor Name"}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default SimpleEnglishContractPDF;
