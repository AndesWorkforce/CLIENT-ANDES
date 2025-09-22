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
  Link,
} from "@react-pdf/renderer";

interface PDFDownloadButtonProps {
  profile: PerfilCompleto;
}

// Helper function to check if profile has enough data to generate PDF
const hasMinimumData = (profile: PerfilCompleto): boolean => {
  return !!(
    profile?.datosPersonales?.nombre && profile?.datosPersonales?.apellido
  );
};

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
  linkText: {
    fontSize: 12,
    marginBottom: 5,
    color: "#0097B2",
    textDecoration: "underline",
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
          {profile?.datosPersonales?.nombre || ""}{" "}
          {profile?.datosPersonales?.apellido || ""}
        </Text>
        {profile?.datosPersonales?.residencia && (
          <Text style={styles.text}>
            Address: {profile.datosPersonales.residencia}
          </Text>
        )}
        {profile?.datosPersonales?.pais && (
          <Text style={styles.text}>
            Country: {profile.datosPersonales.pais}
          </Text>
        )}
      </View>

      {/* Video */}
      {profile?.archivos?.videoPresentacion && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Video Presentation</Text>
          <Link
            src={profile.archivos.videoPresentacion}
            style={styles.linkText}
          >
            Ver video de presentación
          </Link>
        </View>
      )}

      {/* Skills */}
      {profile?.habilidades && profile.habilidades.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Skills</Text>
          {profile.habilidades.map((habilidad) => (
            <View key={habilidad.id} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>{habilidad?.nombre || ""}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Especificaciones PC */}
      {(profile?.archivos?.imagenTestVelocidad ||
        profile?.archivos?.imagenRequerimientosPC) && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>PC Specifications</Text>
          {profile?.archivos?.imagenTestVelocidad && (
            <View style={{ marginBottom: 10 }}>
              <Text style={styles.text}>Speed Test:</Text>
              <Link
                src={profile.archivos.imagenTestVelocidad}
                style={styles.linkText}
              >
                Ver imagen del test de velocidad
              </Link>
            </View>
          )}
          {profile?.archivos?.imagenRequerimientosPC && (
            <View style={{ marginBottom: 10 }}>
              <Text style={styles.text}>PC Requirements:</Text>
              <Link
                src={profile.archivos.imagenRequerimientosPC}
                style={styles.linkText}
              >
                Ver imagen de requerimientos de PC
              </Link>
            </View>
          )}
        </View>
      )}

      {/* Experiencia */}
      {profile?.experiencia && profile.experiencia.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Experience</Text>
          {profile.experiencia.map((exp) => (
            <View key={exp.id} style={{ marginBottom: 10 }}>
              <Text style={{ ...styles.text, fontWeight: "bold" }}>
                {exp?.cargo || "No title specified"}
              </Text>
              <Text style={styles.text}>
                {exp?.empresa || "No company specified"}
              </Text>
              <Text style={styles.text}>
                {exp?.fechaInicio || ""} - {exp?.fechaFin || "Present"}
              </Text>
              {exp?.descripcion && (
                <Text style={styles.text}>{exp.descripcion}</Text>
              )}
            </View>
          ))}
        </View>
      )}
    </Page>

    <Page size="A4" style={styles.page}>
      {/* Educación */}
      {profile?.educacion && profile.educacion.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Education</Text>
          {profile.educacion.map((edu) => (
            <View key={edu.id} style={{ marginBottom: 10 }}>
              <Text style={{ ...styles.text, fontWeight: "bold" }}>
                {edu?.titulo || "No title specified"}
              </Text>
              <Text style={styles.text}>
                {edu?.institucion || "No institution specified"}
              </Text>
              <Text style={styles.text}>
                {edu?.añoInicio || ""} - {edu?.añoFin || "Present"}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Formulario */}
      {profile?.datosFormulario &&
        Object.keys(profile.datosFormulario).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>Form</Text>
            {Object.entries(profile.datosFormulario)
              .filter(([pregunta]) => {
                const preguntaLower = pregunta.toLowerCase();
                return (
                  !preguntaLower.includes("whatsapp") &&
                  !preguntaLower.includes("gmail") &&
                  !preguntaLower.includes("correo")
                );
              })
              .map(([pregunta, respuesta], index) => (
                <View key={index} style={{ marginBottom: 10 }}>
                  <Text style={{ ...styles.text, fontWeight: "bold" }}>
                    {pregunta || "No question"}
                  </Text>
                  <Text style={styles.text}>{respuesta || "No answer"}</Text>
                </View>
              ))}
          </View>
        )}
    </Page>
  </Document>
);

export default function PDFDownloadButton({ profile }: PDFDownloadButtonProps) {
  // Don't show the button if there's not enough data
  if (!hasMinimumData(profile)) {
    return null;
  }

  const fileName = `perfil_${profile?.datosPersonales?.nombre || "unknown"}_${
    profile?.datosPersonales?.apellido || "user"
  }.pdf`;

  return (
    <PDFDownloadLink
      document={<ProfilePDF profile={profile} />}
      fileName={fileName}
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
