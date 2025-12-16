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
    fontSize: 11,
    paddingTop: 40,
    paddingLeft: 60,
    paddingRight: 60,
    paddingBottom: 40,
    lineHeight: 1.4,
  },
  header: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 60,
    objectFit: "contain",
  },
  title: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 10,
    textTransform: "uppercase",
  },
  paragraph: {
    marginBottom: 12,
    textAlign: "justify",
    lineHeight: 1.5,
  },
  clauseTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginTop: 10,
    marginBottom: 4,
  },
  listItem: {
    marginBottom: 8,
    textAlign: "justify",
    lineHeight: 1.5,
  },
  highlight: {
    backgroundColor: "yellow",
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
});

interface ComplianceDeclarationData {
  nombreCompleto: string;
}

const ComplianceDeclarationAnnexPDF: React.FC<{
  data: ComplianceDeclarationData;
}> = ({ data }) => {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header with Logo */}
        <View style={styles.header}>
          {/* Assuming the logo is available at this path or passed as prop. Using the same path as other templates usually do */}
          <Image
            src="https://andes-public-data.s3.amazonaws.com/andes-logo.png"
            style={styles.logo}
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>
          ANNEX - COMPLIANCE DECLARATION – ANDES WORKFORCE CONTRACTORS.
        </Text>

        {/* Declaration Paragraph */}
        <Text style={styles.paragraph}>
          I,{" "}
          <Text style={styles.bold}>
            {data.nombreCompleto || "____________________"}
          </Text>{" "}
          declare that I have been informed of and agree to comply with the
          following work policies established by Andes Workforce:
        </Text>

        <Text style={styles.clauseTitle}>Additional Clauses</Text>

        {/* Clause 1 */}
        <View style={styles.listItem}>
          <Text>
            <Text style={styles.bold}>1. Authorized Equipment:</Text>
            {"\n"}
            Andes will provide each employee assigned the assigned firm with a
            secure laptop preloaded with the necessary systems, including
            Microsoft Office Suite, Adobe Acrobat Reader and Watchguard.
            Employees are required to have their own computer headset, which
            must be compatible with the provided equipment.
          </Text>
        </View>

        {/* Clause 2 */}
        <View style={styles.listItem}>
          <Text>
            <Text style={styles.bold}>2. Prohibition of Personal Devices:</Text>
            {"\n"}
            Andes employees may only perform work using the equipment mentioned
            above. Access to the systems of the assigned firm from personal
            devices (such as mobile phones, laptops, or tablets) not owned by
            the assigned firm is strictly prohibited.
          </Text>
        </View>

        {/* Clause 3 */}
        <View style={styles.listItem}>
          <Text>
            <Text style={styles.bold}>3. Secure Work Location:</Text>
            {"\n"}
            Andes employees must work from a secure location, which may include
            their home. Working from shared or public spaces is not allowed
            unless the space is specifically designated for the exclusive use of
            Andes Workforce staff. Any location where conversations could be
            overheard by individuals outside of Andes or the assigned firm will
            be considered unauthorized.
          </Text>
        </View>

        {/* Clause 4 */}
        <View style={styles.listItem}>
          <Text>
            <Text style={styles.bold}>4. Confidentiality of Information:</Text>
            {"\n"}
            All personal and health-related information of the assigned
            firm&apos;s clients must be kept confidential. This includes, but is
            not limited to: name, address, phone number, social security number,
            protected health information, veteran status, etc., in both digital
            and physical formats.
          </Text>
        </View>

        {/* Clause 5 */}
        <View style={styles.listItem}>
          <Text>
            <Text style={styles.bold}>5. Client Case Information:</Text>
            {"\n"}
            No information related to client cases may be discussed with anyone
            outside of Andes Workforce or the assigned firm.
          </Text>
        </View>

        {/* Clause 6 */}
        <View style={styles.listItem}>
          <Text>
            <Text style={styles.bold}>6. Note Taking:</Text>
            {"\n"}
            All notes related to clients or their cases must be recorded
            exclusively in the system. Note-taking on paper or through any
            unauthorized means is strictly prohibited.
          </Text>
        </View>

        {/* Final Declaration */}
        <Text style={[styles.paragraph, { marginTop: 20 }]}>
          I declare that I have read and understood this policy, and I commit to
          fully complying with it. I understand that failure to adhere to any of
          these policies may result in disciplinary action, including
          termination of the contract.
        </Text>

        {/* Signature area will be added dynamically by ESIGN fields */}
      </Page>
    </Document>
  );
};

export default ComplianceDeclarationAnnexPDF;
