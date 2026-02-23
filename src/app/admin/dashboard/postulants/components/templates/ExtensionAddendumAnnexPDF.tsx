import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

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
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 20,
    textTransform: "uppercase",
  },
  headerInfo: {
    marginBottom: 20,
    fontSize: 10,
  },
  headerRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    fontFamily: "Helvetica-Bold",
    width: 150,
  },
  value: {
    fontFamily: "Helvetica-Bold",
    backgroundColor: "#FFFF00", // Highlight as per image style, though usually we remove highlight in final. Keeping it for now or making it bold.
    // Actually, for the final PDF we probably want just Bold, not yellow highlight unless it's a draft.
    // The user said "recuerda que donde esta lo amarillo es donde se debe modificar la informacion".
    // I will render the value.
  },
  paragraph: {
    marginBottom: 10,
    textAlign: "justify",
    lineHeight: 1.4,
  },
  listItem: {
    marginLeft: 20,
    marginBottom: 4,
    textAlign: "justify",
    lineHeight: 1.4,
    flexDirection: "row",
  },
  listBullet: {
    width: 15,
  },
  listContent: {
    flex: 1,
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  signatureSection: {
    marginTop: 50,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBlock: {
    width: "45%",
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginBottom: 5,
  },
});

interface ExtensionAddendumData {
  nombreCompleto: string;
  cedula: string;
  paisDocumento: string;
  fechaInicioContratoOriginal: string;
  nuevoValorContrato: string;
  descripcionServicios?: string;
  montoUltimoPago?: string;
  fechaInicioExtension?: string;
  fechaFinExtension?: string;
}

const ExtensionAddendumAnnexPDF: React.FC<{
  data: ExtensionAddendumData;
}> = ({ data }) => {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.toLocaleString("en-US", { month: "long" });
  const year = currentDate.getFullYear();

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.title}>
          ADDENDUM AND EXTENSION TO THE SERVICE PROVISION AGREEMENT
        </Text>

        <View style={styles.headerInfo}>
          <View style={styles.headerRow}>
            <Text style={styles.label}>CONTRACTOR:</Text>
            <Text style={styles.bold}>
              {data.nombreCompleto || "CONTRACTOR NAME"}
            </Text>
          </View>
          <View style={styles.headerRow}>
            <Text style={styles.label}>ID No.:</Text>
            <Text style={styles.bold}>{data.cedula || "ID NUMBER"}</Text>
          </View>
          <View style={styles.headerRow}>
            <Text style={styles.label}>PURPOSE:</Text>
            <Text style={styles.bold}>PROFESSIONAL SERVICES</Text>
          </View>
          <View style={styles.headerRow}>
            <Text style={styles.label}>CONTRACT VALUE:</Text>
            <Text style={styles.bold}>
              {data.nuevoValorContrato || "{amount}"}
            </Text>
          </View>
        </View>

        <Text style={styles.paragraph}>
          Between the undersigned parties, namely:{" "}
          <Text style={styles.bold}>{data.nombreCompleto}</Text>, of legal age,
          identified with identification document No.{" "}
          <Text style={styles.bold}>{data.cedula}</Text> issued in{" "}
          <Text style={styles.bold}>
            {data.paisDocumento || "{COUNTRY}"}
          </Text>
          , and <Text style={styles.bold}>Andes Workforce LLC</Text>, under
          Limited Liability Company Registration No. L24000192685, with its
          principal place of business in Florida, United States, who hereinafter,
          for the purposes of this Addendum, have agreed to execute this
          Addendum and Extension to the Professional Services Agreement, which
          shall be governed by the clauses set forth below and the following{" "}
          <Text style={styles.bold}>RECITALS</Text>:
        </Text>

        <View style={{ marginBottom: 10 }}>
          <View style={styles.listItem}>
            <Text style={styles.listBullet}>1.</Text>
            <Text style={styles.listContent}>
              On{" "}
              <Text style={styles.bold}>
                {data.fechaInicioContratoOriginal ||
                  "{DATE OF CONTRACT EXECUTION}"}
              </Text>
              , Andes Workforce LLC and{" "}
              <Text style={styles.bold}>{data.nombreCompleto}</Text> executed a
              Professional Services Agreement.
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listBullet}>2.</Text>
            <Text style={styles.listContent}>
              The Agreement established an initial term of four (4) months and
              provides for automatic renewal unless either party gives notice to
              the contrary.
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listBullet}>3.</Text>
            <Text style={styles.listContent}>
              In consideration of the extension, it is necessary to modify the
              originally agreed compensation to the following amount:{" "}
              <Text style={styles.bold}>
                ${data.nuevoValorContrato || "{amount}"}
              </Text>
              .
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listBullet}>4.</Text>
            <Text style={styles.listContent}>
              Description of New Services: The new services covered by this
              extension are as follows:
              {" "}
              <Text style={styles.bold}>
                {data.descripcionServicios ||
                  "{DESCRIPTION OF THE NEW SERVICES ASSIGNED TO THE CONTRACTOR}"}
              </Text>
            </Text>
          </View>
        </View>

        <Text style={styles.paragraph}>
          Based on the foregoing recitals, the parties have agreed to extend the
          Agreement, which shall continue to be governed by the applicable laws
          and the terms set forth in the following clauses:
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>FIRST – PURPOSE:</Text> To increase the
          value of the Professional Services Agreement under the same terms and
          conditions of the main agreement.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>SECOND – TERM:</Text> To extend the
          Professional Services Agreement from the date of execution of this
          document, under the same terms and conditions as the main agreement.
          Extensions shall not affect the contractor’s seniority.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>THIRD – VALIDITY:</Text> All other terms and
          conditions of the main agreement not amended or extended by this
          document shall remain in full force and effect.
        </Text>

        <Text style={[styles.paragraph, { marginTop: 20 }]}>
          In witness whereof, this document is executed on the{" "}
          <Text style={styles.bold}>{day}</Text> day of the month of{" "}
          <Text style={styles.bold}>{month}</Text>, year{" "}
          <Text style={styles.bold}>{year}</Text>.
        </Text>

        <View style={styles.signatureSection}>
          <View style={styles.signatureBlock}>
            <Text style={styles.bold}>Miguel A. Rendon</Text>
            <Text>Andes Workforce LLC</Text>
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.bold}>
              {data.nombreCompleto || "{NAME}"}
            </Text>
            <Text>CONTRACTOR</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ExtensionAddendumAnnexPDF;
