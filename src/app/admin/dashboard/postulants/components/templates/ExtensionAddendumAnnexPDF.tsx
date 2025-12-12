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
  montoUltimoPago: string;
  fechaInicioExtension: string;
  fechaFinExtension: string;
  nuevoValorContrato: string;
}

const ExtensionAddendumAnnexPDF: React.FC<{
  data: ExtensionAddendumData;
}> = ({ data }) => {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.title}>
          ADDENDUM FOR EXTENSION AND AMENDMENT TO THE SERVICE AGREEMENT
        </Text>

        <View style={styles.headerInfo}>
          <View style={styles.headerRow}>
            <Text style={styles.label}>CONTRACTOR:</Text>
            <Text style={styles.bold}>
              {data.nombreCompleto || "CANDIDATE NAME"}
            </Text>
          </View>
          <View style={styles.headerRow}>
            <Text style={styles.label}>ID No.:</Text>
            <Text style={styles.bold}>{data.cedula || "N/A"}</Text>
          </View>
          <View style={styles.headerRow}>
            <Text style={styles.label}>PURPOSE:</Text>
            <Text style={styles.bold}>Provision of Professional Services</Text>
          </View>
          <View style={styles.headerRow}>
            <Text style={styles.label}>CONTRACT VALUE:</Text>
            <Text style={styles.bold}>{data.nuevoValorContrato}</Text>
          </View>
          <View style={styles.headerRow}>
            <Text style={styles.label}>TERM OF DURATION:</Text>
            <Text style={styles.bold}>{data.fechaFinExtension}</Text>
          </View>
        </View>

        <Text style={styles.paragraph}>
          Between the undersigned:{" "}
          <Text style={styles.bold}>{data.nombreCompleto}</Text>, of legal age,
          identified with document No.{" "}
          <Text style={styles.bold}>{data.cedula}</Text> issued in{" "}
          <Text style={styles.bold}>{data.paisDocumento || "[COUNTRY]"}</Text>,
          and, on the other hand,{" "}
          <Text style={styles.bold}>ANDES WORKFORCE LLC</Text>, registered as a
          Limited Liability Company under No. L24000192685, with its principal
          place of business in Florida, United States, who, for the purposes of
          this Addendum, agree to enter into this Addendum to the Service
          Agreement, which shall be governed by the clauses set forth below
          under the following <Text style={styles.bold}>CONSIDERATIONS</Text>:
        </Text>

        <View style={{ marginBottom: 10 }}>
          <View style={styles.listItem}>
            <Text style={styles.listBullet}>1.</Text>
            <Text style={styles.listContent}>
              On{" "}
              <Text style={styles.bold}>
                {data.fechaInicioContratoOriginal || "[DATE]"}
              </Text>
              , ANDES WORKFORCE LLC and{" "}
              <Text style={styles.bold}>{data.nombreCompleto}</Text> entered
              into the Service Agreement.
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listBullet}>2.</Text>
            <Text style={styles.listContent}>
              The contract stipulated a duration of four (4) months.
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listBullet}>3.</Text>
            <Text style={styles.listContent}>
              The contract stipulated the payment of fees in the amount of (
              <Text style={styles.bold}>
                ${data.montoUltimoPago} USD LAST PAYMENT
              </Text>
              .)
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listBullet}>4.</Text>
            <Text style={styles.listContent}>
              It is hereby stated and justified that the Service Agreement
              requires an extension for a period of four (4) months, from{" "}
              <Text style={styles.bold}>
                {data.fechaInicioExtension || "[START DATE]"}
              </Text>{" "}
              until{" "}
              <Text style={styles.bold}>
                {data.fechaFinExtension || "[END DATE]"}
              </Text>
              .
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listBullet}>5.</Text>
            <Text style={styles.listContent}>
              In consideration of the extension, the contract value shall be
              increased by (
              <Text style={styles.bold}>
                ${data.nuevoValorContrato} USD NEW CONTRACT VALUE
              </Text>
              .)
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listBullet}>6.</Text>
            <Text style={styles.listContent}>
              The contractor has fulfilled the obligations of the contract.
            </Text>
          </View>
        </View>

        <Text style={styles.paragraph}>
          Based on the foregoing considerations, the parties agree to extend the
          contract, which shall be governed by the applicable regulations and
          the stipulations contained in the following clauses:
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>FIRST - PURPOSE:</Text> To amend the value
          of the Service Agreement under the same conditions as the principal
          contract.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>SECOND - EXTENSION:</Text> To extend the
          Service Agreement from{" "}
          <Text style={styles.bold}>{data.fechaInicioExtension}</Text> until{" "}
          <Text style={styles.bold}>{data.fechaFinExtension}</Text> under the
          same conditions as the principal contract.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>THIRD - VALIDITY OF TERMS:</Text> All other
          terms and stipulations of the principal contract not amended or
          extended by this document shall remain in full force and effect.
        </Text>

        <Text style={[styles.paragraph, { marginTop: 20 }]}>
          In witness whereof, this document is signed on the{" "}
          <Text style={styles.bold}>{day}</Text> day of{" "}
          <Text style={styles.bold}>{month}</Text>,{" "}
          <Text style={styles.bold}>{year}</Text>.
        </Text>

        <View style={styles.signatureSection}>
          <View style={styles.signatureBlock}>
            <Text style={styles.bold}>NICOLE CHICA</Text>
            <Text>Andes Workforce LLC</Text>
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.bold}>
              {data.nombreCompleto || "CANDIDATE NAME"}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ExtensionAddendumAnnexPDF;
