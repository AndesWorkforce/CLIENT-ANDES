import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { PerfilCompleto } from "@/app/types/profile";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "#0097B2",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    color: "#374151",
  },
  text: {
    marginBottom: 5,
    color: "#4B5563",
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 5,
  },
  bullet: {
    width: 10,
    color: "#0097B2",
  },
});

interface ProfileDocumentProps {
  profile: PerfilCompleto;
}

const ProfileDocument = ({ profile }: ProfileDocumentProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Datos Personales */}
      <View style={styles.section}>
        <Text style={styles.title}>
          {profile.datosPersonales.nombre} {profile.datosPersonales.apellido}
        </Text>
        <Text style={styles.subtitle}>Datos de contacto</Text>
        <Text style={styles.text}>
          Teléfono: {profile.datosPersonales.telefono}
        </Text>
        <Text style={styles.text}>Email: {profile.datosPersonales.correo}</Text>
      </View>

      {/* Video */}
      {profile.archivos.videoPresentacion && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Video Presentación</Text>
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
        <Text style={styles.subtitle}>Especificaciones PC</Text>
        <Text style={styles.text}>
          Tipo de dispositivo: {profile.requisitosDispositivo.tipoDispositivo}
        </Text>
        <Text style={styles.text}>
          Proveedor de Internet:{" "}
          {profile.requisitosDispositivo.proveedorInternet}
        </Text>
      </View>

      {/* Experiencia */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Experiencia</Text>
        {profile.experiencia.map((exp) => (
          <View key={exp.id} style={{ marginBottom: 15 }}>
            <Text style={{ ...styles.text, fontWeight: "bold" }}>
              {exp.cargo}
            </Text>
            <Text style={styles.text}>{exp.empresa}</Text>
            <Text style={styles.text}>
              {exp.fechaInicio} - {exp.fechaFin || "Present"}
            </Text>
            <Text style={styles.text}>{exp.descripcion}</Text>
          </View>
        ))}
      </View>
    </Page>

    <Page size="A4" style={styles.page}>
      {/* Educación */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Educación</Text>
        {profile.educacion.map((edu) => (
          <View key={edu.id} style={{ marginBottom: 15 }}>
            <Text style={{ ...styles.text, fontWeight: "bold" }}>
              {edu.titulo}
            </Text>
            <Text style={styles.text}>{edu.institucion}</Text>
            <Text style={styles.text}>
              {edu.añoInicio} - {edu.añoFin || "Present"}
            </Text>
          </View>
        ))}
      </View>

      {/* Formulario */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Formulario</Text>
        {Object.entries(profile.datosFormulario).map(
          ([pregunta, respuesta], index) => (
            <View key={index} style={{ marginBottom: 15 }}>
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

export const PDFDownloadButton = ({ profile }: ProfileDocumentProps) => (
  <PDFDownloadLink
    document={<ProfileDocument profile={profile} />}
    fileName={`perfil_${profile.datosPersonales.nombre}_${profile.datosPersonales.apellido}.pdf`}
  >
    {({ loading }) => (loading ? "Generando PDF..." : "Descargar PDF")}
  </PDFDownloadLink>
);
