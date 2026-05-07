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
    alignItems: "center",
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
  listItem: {
    marginBottom: 6,
    marginLeft: 16,
    lineHeight: 1.5,
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
});

interface ImageUseAuthorizationData {
  nombreCompleto: string;
  cedula?: string;
}

const ImageUseAuthorizationAnnexPDF: React.FC<{
  data: ImageUseAuthorizationData;
}> = ({ data }) => {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <Image
            src="/images/logo-andes.png"
            style={styles.logo}
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>IMAGE USE AUTHORIZATION</Text>

        {/* Authorization Paragraph */}
        <Text style={styles.paragraph}>
          {"I, "}
          <Text style={styles.bold}>
            {data.nombreCompleto || "____________________"}
          </Text>
          {", holder of identification document "}
          <Text style={styles.bold}>
            {data.cedula || "____________________"}
          </Text>
          {", hereby authorize Andes Workforce LLC. to use my image (photographs and/or videos) for publication in:"}
        </Text>

        {/* Bullet list */}
        <Text style={styles.listItem}>{"• Social media"}</Text>
        <Text style={styles.listItem}>{"• Website"}</Text>
        <Text style={styles.listItem}>{"• Corporate or promotional materials"}</Text>

        {/* Terms */}
        <Text style={[styles.paragraph, { marginTop: 16 }]}>
          {"I understand that this use will be solely for professional and company communication purposes."}
        </Text>

        <Text style={styles.paragraph}>
          {"This authorization is granted free of charge, without territorial limitation, remains valid after the termination of my employment, for an indefinite period, and may be withdrawn at any time by written request."}
        </Text>
      </Page>
    </Document>
  );
};

export default ImageUseAuthorizationAnnexPDF;
