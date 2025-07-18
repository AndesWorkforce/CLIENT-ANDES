import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Registrar fuentes
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxK.woff2",
      fontWeight: "normal",
    },
    {
      src: "https://fonts.gstatic.com/s/roboto/v27/KFOlCnqEu92Fr1MmWUlfBBc4.woff2",
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40,
    fontSize: 10,
    fontFamily: "Roboto",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    textTransform: "uppercase",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    textDecoration: "underline",
  },
  paragraph: {
    marginBottom: 8,
    lineHeight: 1.5,
    textAlign: "justify",
  },
  contactInfo: {
    marginBottom: 5,
  },
  signature: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
    paddingTop: 20,
  },
  signatureBox: {
    width: "45%",
    borderTop: "1 solid black",
    paddingTop: 5,
    textAlign: "center",
  },
  fillLine: {
    borderBottom: "1 solid black",
    marginBottom: 5,
    height: 12,
  },
  date: {
    textAlign: "right",
    marginBottom: 20,
  },
});

interface StatementOfWorkSpanishPDFProps {
  data: {
    nombreCompleto: string;
    correoElectronico: string;
    cedula: string;
    telefono: string;
    direccionCompleta: string;
    nacionalidad: string;
    puestoTrabajo: string;
    descripcionServicios: string;
    ofertaSalarial: string;
    salarioProbatorio: string;
    monedaSalario: string;
    fechaInicioLabores: string;
    fechaEjecucion: string;
    nombreBanco: string;
    numeroCuenta: string;
  };
}

const StatementOfWorkSpanishPDF: React.FC<StatementOfWorkSpanishPDFProps> = ({
  data,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>DECLARACIÓN DE TRABAJO</Text>

        <View style={styles.date}>
          <Text>Fecha: {data.fechaEjecucion}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.paragraph}>
            Esta Declaración de Trabajo se ejecuta el{" "}
            {formatDate(data.fechaInicioLabores)}, entre Andes Workforce LLC
            (&quot;Empresa&quot;) y {data.nombreCompleto}{" "}
            (&quot;Contratista&quot;). Esta Declaración de Trabajo describe los
            Servicios que serán realizados y proporcionados por el Contratista
            según el Acuerdo de Servicios Profesionales.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Término</Text>
          <Text style={styles.paragraph}>
            El Contratista acuerda proporcionar servicios de{" "}
            {data.puestoTrabajo} como se detalla más adelante
            (&quot;Servicios&quot;) a la Empresa comenzando el{" "}
            {formatDate(data.fechaInicioLabores)}
            (&quot;Fecha de Inicio&quot;) y continuando hasta que expire o sea
            terminado por la Empresa o el Contratista.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Servicios</Text>
          <Text style={styles.paragraph}>
            El Contratista proporcionará los siguientes Servicios:
          </Text>
          <Text style={styles.paragraph}>{data.descripcionServicios}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Descripción del flujo de trabajo
          </Text>
          <Text style={styles.paragraph}>
            El Contratista deberá dedicar el tiempo necesario para el desempeño
            de los Servicios, de acuerdo con el Acuerdo de Servicios
            Profesionales. El Contratista puede determinar su lugar de trabajo y
            equipo a utilizar sujeto a los términos acordados con la Empresa.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.paragraph}>
            En relación con esta Declaración de Trabajo, las partes pueden
            comunicarse entre sí de la siguiente manera:
          </Text>

          <View style={styles.contactInfo}>
            <Text style={styles.paragraph}>Persona de contacto (Empresa):</Text>
            <Text>Miguel Rendon</Text>
            <Text>info@andes-workforce.com</Text>
            <Text>(&quot;Contacto Clave de la Empresa&quot;)</Text>
          </View>

          <View style={styles.contactInfo}>
            <Text style={styles.paragraph}>
              Persona de contacto (Contratista):
            </Text>
            <Text>{data.nombreCompleto}</Text>
            <Text>{data.correoElectronico}</Text>
            <Text>(&quot;Contacto Clave del Contratista&quot;)</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tarifa de Servicio</Text>
          <Text style={styles.paragraph}>
            A partir de la Fecha de Inicio, se pagará al Contratista una tarifa
            de {data.monedaSalario} {data.salarioProbatorio}
            fijos por mes durante un período de prueba de 3 meses. A partir del
            primer día del mes siguiente al período de prueba, se pagará al
            Contratista una tarifa de {data.monedaSalario} {data.ofertaSalarial}
            fijos por mes, incluyendo todos los impuestos (&quot;Tarifa de
            Servicio&quot;). El pago de la Tarifa de Servicio al Contratista se
            iniciará el último día del mes. Esta Tarifa de Servicio se
            incrementará un 5% anualmente.
          </Text>
          <Text style={styles.paragraph}>
            Los contratistas recibirán pago adicional cuando se requiera
            trabajar durante un día festivo local según la regulación de su país
            de residencia.
          </Text>
          <Text style={styles.paragraph}>
            Adicionalmente, el Contratista recibirá un bono de vacaciones de 2
            semanas al final de cada año calendario. El bono de vacaciones será
            prorrateado para Contratistas que hayan completado menos de 6 meses
            de trabajo al final del año calendario.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.paragraph}>
            El Contratista recibirá el pago mediante depósito directo a la
            cuenta bancaria a continuación:
          </Text>
          <Text>Nombre del Banco: {data.nombreBanco}</Text>
          <Text>Número de Cuenta: {data.numeroCuenta}</Text>
          <Text>Nombre del titular de la cuenta: {data.nombreCompleto}</Text>
          <Text>Dirección del titular: {data.direccionCompleta}</Text>
          <Text>Número de teléfono: {data.telefono}</Text>
          <Text>Número de Identificación Gubernamental: {data.cedula}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Relación de Contratista Independiente
          </Text>
          <Text style={styles.paragraph}>
            La Empresa y el Contratista reconocen y acuerdan que el Contratista
            no es un empleado y expresamente declaran que los Servicios
            cubiertos por esta Declaración de Trabajo serán prestados
            independientemente por el Contratista, y que la relación contractual
            no crea ni creará una relación empleador-empleado. Esta declaración
            constituye un elemento esencial de este Acuerdo y una causa
            fundamental que las Partes, y especialmente la Empresa, han tenido
            para su ejecución.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Terminación</Text>
          <Text style={styles.paragraph}>
            Esta Declaración de Trabajo terminará al completarse los Servicios,
            según lo determine razonablemente la Empresa, o en la última fecha
            práctica después de la Fecha de Inicio de acuerdo con la ley
            aplicable, a menos que se extienda por las partes por escrito.
            Durante el período de prueba de 3 meses, cualquiera de las partes
            puede terminar esta Declaración de Trabajo sin causa, con al menos 2
            días de aviso por escrito a la otra Parte.
          </Text>
          <Text style={styles.paragraph}>
            Después de completar el período de prueba de 3 meses, la Empresa
            requiere un aviso de dos semanas para terminar esta Declaración de
            Trabajo. En caso de separación de la empresa, ya sea voluntaria o
            involuntaria, el contratista asegurará una transferencia adecuada de
            todos los deberes y responsabilidades a otros empleados.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tiempo Libre Pagado (PTO)</Text>
          <Text style={styles.paragraph}>
            El Contratista acumulará 15 días de PTO por año calendario. El
            Contratista solicitará PTO por correo electrónico a la Empresa con
            anticipación y, una vez aprobado, la Empresa notificará al
            contratista con un saldo de PTO actualizado.
          </Text>
          <Text style={styles.paragraph}>
            El PTO no está autorizado durante el período de prueba inicial de 3
            meses. El Contratista puede acumular un máximo de 30 días de PTO. La
            acumulación de PTO se detendrá una vez que el Contratista alcance el
            límite de saldo de 30 días.
          </Text>
        </View>

        <View style={styles.signature}>
          <View style={styles.signatureBox}>
            <Text>Firma Miguel</Text>
            <Text>Andes Workforce LLC</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text>{data.nombreCompleto}</Text>
            <Text>Contratista</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default StatementOfWorkSpanishPDF;
