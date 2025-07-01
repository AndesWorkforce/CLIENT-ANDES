import { StyleSheet } from "@react-pdf/renderer";

export const createBaseStyles = () =>
  StyleSheet.create({
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
