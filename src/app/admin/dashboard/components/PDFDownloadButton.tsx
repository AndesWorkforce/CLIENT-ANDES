"use client";

import { Download } from "lucide-react";
import { PerfilCompleto } from "@/app/types/profile";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Image,
} from "@react-pdf/renderer";

interface PDFDownloadButtonProps {
  profile: PerfilCompleto;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 50,
    objectFit: "contain",
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: "#0097B2",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    color: "#374151",
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    color: "#4B5563",
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 5,
  },
  bullet: {
    width: 10,
  },
  imageContainer: {
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 150,
    objectFit: "contain",
  },
});

const ProfilePDF = ({ profile }: PDFDownloadButtonProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Logo de Andes */}
      <View style={styles.logoContainer}>
        <Image src="/images/logo-andes.png" style={styles.logo} />
      </View>

      {/* Datos Personales */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Contact Information</Text>
        <Text style={styles.title}>
          {profile.datosPersonales.nombre} {profile.datosPersonales.apellido}
        </Text>
        <Text style={styles.text}>Email: {profile.datosPersonales.correo}</Text>
        <Text style={styles.text}>
          Phone Number: {profile.datosPersonales.telefono}
        </Text>
        <Text style={styles.text}>
          Address: {profile.datosPersonales.residencia}
        </Text>
        <Text style={styles.text}>Country: {profile.datosPersonales.pais}</Text>
      </View>

      {/* Video */}
      {profile.archivos.videoPresentacion && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Video Presentation</Text>
          <Text style={styles.text}>
            URL: {profile.archivos.videoPresentacion}
          </Text>
        </View>
      )}

      {/* Skills */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Skills</Text>
        {profile.habilidades.map((habilidad) => (
          <View key={habilidad.id} style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.text}>{habilidad.nombre}</Text>
          </View>
        ))}
      </View>

      {/* Especificaciones PC */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>PC Specifications</Text>
        {profile.archivos.imagenTestVelocidad && (
          <View style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.text}>
              Speed Test: {profile.archivos.imagenTestVelocidad}
            </Text>
          </View>
        )}
        {profile.archivos.imagenRequerimientosPC && (
          <View style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.text}>
              PC Requirements: {profile.archivos.imagenRequerimientosPC}
            </Text>
          </View>
        )}
      </View>

      {/* Experiencia */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Experience</Text>
        {profile.experiencia.map((exp) => (
          <View key={exp.id} style={{ marginBottom: 10 }}>
            <Text style={{ ...styles.text, fontWeight: "bold" }}>
              {exp.cargo}
            </Text>
            <Text style={styles.text}>{exp.empresa}</Text>
            <Text style={styles.text}>
              {exp.fechaInicio} - {exp.fechaFin || "Presente"}
            </Text>
            <Text style={styles.text}>{exp.descripcion}</Text>
          </View>
        ))}
      </View>
    </Page>

    <Page size="A4" style={styles.page}>
      {/* Educación */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Education</Text>
        {profile.educacion.map((edu) => (
          <View key={edu.id} style={{ marginBottom: 10 }}>
            <Text style={{ ...styles.text, fontWeight: "bold" }}>
              {edu.titulo}
            </Text>
            <Text style={styles.text}>{edu.institucion}</Text>
            <Text style={styles.text}>
              {edu.añoInicio} - {edu.añoFin || "Presente"}
            </Text>
          </View>
        ))}
      </View>

      {/* Formulario */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Form</Text>
        {Object.entries(profile.datosFormulario).map(
          ([pregunta, respuesta], index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text style={{ ...styles.text, fontWeight: "bold" }}>
                {pregunta}
              </Text>
              <Text style={styles.text}>{respuesta}</Text>
            </View>
          )
        )}
      </View>
    </Page>
  </Document>
);

export default function PDFDownloadButton({ profile }: PDFDownloadButtonProps) {
  return (
    <PDFDownloadLink
      document={<ProfilePDF profile={profile} />}
      fileName={`perfil_${profile.datosPersonales.nombre}_${profile.datosPersonales.apellido}.pdf`}
      className="flex items-center gap-2 px-4 py-2 bg-[#0097B2] text-white rounded-lg hover:bg-[#007B8E] transition-colors"
    >
      {({ loading, error }) => (
        <>
          <Download size={18} />
          <span>
            {loading
              ? "Generating PDF..."
              : error
              ? "Error generating PDF"
              : "Download PDF"}
          </span>
        </>
      )}
    </PDFDownloadLink>
  );
}
