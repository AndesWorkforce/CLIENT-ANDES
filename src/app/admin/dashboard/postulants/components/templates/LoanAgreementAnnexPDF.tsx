import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingTop: 40,
    paddingLeft: 50,
    paddingRight: 50,
    paddingBottom: 40,
    lineHeight: 1.4,
  },
  header: {
    alignItems: "flex-end",
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 50,
    objectFit: "contain",
  },
  title: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 15,
    marginTop: 5,
    textTransform: "uppercase",
  },
  paragraph: {
    marginBottom: 10,
    textAlign: "justify",
    lineHeight: 1.4,
  },
  clauseTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginTop: 8,
    marginBottom: 4,
  },
  listItem: {
    marginLeft: 20,
    marginBottom: 4,
    textAlign: "justify",
    lineHeight: 1.4,
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  signatureSection: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBlock: {
    width: "45%",
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginTop: 40,
    marginBottom: 5,
  },
  contactInfo: {
    marginLeft: 10,
    marginTop: 5,
    marginBottom: 10,
  },
});

interface LoanAgreementData {
  nombreCompleto: string;
  laptopModel: string;
  serialNumber: string;
  telefono: string;
  direccionCompleta: string;
  correoElectronico: string;
  fechaInicioLabores: string;
}

const LoanAgreementAnnexPDF: React.FC<{
  data: LoanAgreementData;
}> = ({ data }) => {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <Image
            src="https://andes-public-data.s3.amazonaws.com/andes-logo.png"
            style={styles.logo}
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>
          ANNEX I – LOAN AGREEMENT FOR LAPTOP COMPUTER
        </Text>

        {/* Intro */}
        <Text style={styles.paragraph}>
          This Delivery Record forms an integral part of the Professional
          Services Agreement entered between Andes Workforce LLC and the
          CONTRACTOR subscribed below (&quot;
          <Text style={styles.bold}>THE CONTRACTOR</Text>&quot;) and is issued
          in accordance with CLAUSE TWELVE – WORK EQUIPMENT of the Agreement.
        </Text>

        {/* Clause 1 */}
        <Text style={styles.clauseTitle}>CLAUSE 1 – PURPOSE:</Text>
        <Text style={styles.paragraph}>
          The purpose of this agreement is the loan, under a commodatum
          arrangenet, of the following equipment owned by the LENDER:
        </Text>
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.listItem}>• Equipment: Laptop computer</Text>
          <Text style={styles.listItem}>
            • Brand/Model:{" "}
            <Text style={styles.bold}>
              {data.laptopModel || "[Brand/Model]"}
            </Text>
          </Text>
          <Text style={styles.listItem}>
            • Serial Number:{" "}
            <Text style={styles.bold}>
              {data.serialNumber || "[Serial Number]"}
            </Text>
          </Text>
          <Text style={styles.listItem}>• Condition: Perfect Condition</Text>
        </View>

        {/* Clause 2 */}
        <Text style={styles.clauseTitle}>CLAUSE 2 – USE:</Text>
        <Text style={styles.paragraph}>
          The equipment is delivered exclusively for the performance of work
          tasks and activities assigned by the LENDER. Its use for personal
          purposes or unrelated activities is strictly prohibited.
        </Text>

        {/* Clause 3 */}
        <Text style={styles.clauseTitle}>CLAUSE 3 – TERM:</Text>
        <Text style={styles.paragraph}>
          The commodatum shall be valid from the start date of the employment
          relationship and shall remain in effect until the termination of said
          employment or contractual relationship. It may be terminated at any
          time by the LENDER upon notice to the BORROWER.
        </Text>

        {/* Clause 4 */}
        <Text style={styles.clauseTitle}>
          CLAUSE 4 – OBLIGATIONS OF THE BORROWER:
        </Text>
        <Text style={styles.paragraph}>The BORROWER undertakes to:</Text>
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.listItem}>
            • Properly care for and maintain the equipment, avoiding damage or
            misuse.
          </Text>
          <Text style={styles.listItem}>
            • Not transfer, lend, or assign the equipment to third parties.
          </Text>
          <Text style={styles.listItem}>
            • Immediately notify the LENDER of any damage, loss, theft, or
            malfunction.
          </Text>
          <Text style={styles.listItem}>
            • Return the equipment in the same condition in which it was
            received, except for normal wear and tear.
          </Text>
        </View>

        {/* Clause 5 */}
        <Text style={styles.clauseTitle}>
          CLAUSE 5: MAINTENANCE AND TECHNICAL SUPPORT OF COMPUTERS:
        </Text>
        <Text style={styles.paragraph}>
          The LENDER is responsible for carrying out preventive, predictive, and
          corrective maintenance. Any anomaly with the computer equipment must
          be reported to <Text style={styles.bold}>Nicole Chica</Text> and{" "}
          <Text style={styles.bold}>Ruben Darío Romero</Text>.
        </Text>

        {/* Clause 6 */}
        <Text style={styles.clauseTitle}>CLAUSE 6 – LIABILITY:</Text>
        <Text style={styles.paragraph}>
          The BORROWER shall be liable for any damage, loss, or deterioration
          caused by improper use or negligence and shall indemnify the LENDER in
          the event of irreparable damage or total loss of the equipment.
        </Text>

        {/* Clause 7 */}
        <Text style={styles.clauseTitle}>
          CLAUSE 7 – WITHHOLDING OF OUTSTANDING BALANCES:
        </Text>
        <Text style={styles.paragraph}>
          The LENDER reserves the right to withhold any amounts owed to the
          BORROWER (fees, bonuses, or other payments) until the equipment and
          its accessories are returned and verified by the responsible
          department, confirming their proper condition and functionality.
        </Text>

        {/* Clause 8 */}
        <Text style={styles.clauseTitle}>CLAUSE 8 – RETURN OF EQUIPMENT:</Text>
        <Text style={styles.paragraph}>
          The BORROWER must return the equipment and all its accessories within
          days following the end of the commodatum period or when required by
          the LENDER.
        </Text>

        {/* Clause 9 */}
        <Text style={styles.clauseTitle}>
          CLAUSE 9: ADDRESSES AND CONTACT POINTS:
        </Text>
        <Text style={styles.paragraph}>
          All communications that one Party must make to the other under this
          Agreement shall be made in writing to:
        </Text>

        <Text style={[styles.bold, { marginTop: 5 }]}>THE LENDER</Text>
        <View style={styles.contactInfo}>
          <Text>Responsible Area: Administration</Text>
          <Text>Contact Person: Nicole Chica</Text>
          <Text>Phone: 314 5008390</Text>
          <Text>
            Address: Km 3 vía Armenia-Pereira, Hacienda Horizontes #31,
            Circasia, Quindío
          </Text>
          <Text>mail: nchica@teamandes.com</Text>
        </View>

        <Text style={[styles.bold, { marginTop: 5 }]}>THE BORROWER</Text>
        <View style={styles.contactInfo}>
          <Text>
            Contact Person:{" "}
            <Text style={styles.bold}>
              {data.nombreCompleto || "CANDIDATE NAME"}
            </Text>
          </Text>
          <Text>
            Phone: <Text style={styles.bold}>{data.telefono || "N/A"}</Text>
          </Text>
          <Text>
            Address:{" "}
            <Text style={styles.bold}>{data.direccionCompleta || "N/A"}</Text>
          </Text>
          <Text>
            Email:{" "}
            <Text style={styles.bold}>
              {data.correoElectronico || "email@example.com"}
            </Text>
          </Text>
        </View>

        {/* Clause 10 */}
        <Text style={styles.clauseTitle}>CLAUSE 10 – GENERAL PROVISIONS:</Text>
        <Text style={styles.paragraph}>
          This agreement enters into force as of the date of its signature and
          forms an integral part of the contractual relationship between the
          Parties. It is governed by the same laws applicable to the
          Professional Services Agreement.
        </Text>

        <Text style={[styles.paragraph, { marginTop: 20 }]}>
          In witness whereof, this agreement is signed on{" "}
          <Text style={styles.bold}>{data.fechaInicioLabores}</Text>
        </Text>

        {/* Signatures will be added dynamically by ESIGN overlays (Contractor only) */}
        {/* Static signature blocks commented out to avoid duplication/overlap */}
        {/**
        <View style={styles.signatureSection}>
          <View style={styles.signatureBlock}>
            <Text style={styles.bold}>NICOLE CHICA</Text>
            <Text>Andes Workforce LLC</Text>
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.bold}>THE BORROWER</Text>
          </View>
        </View>
        **/}
      </Page>
    </Document>
  );
};

export default LoanAgreementAnnexPDF;
