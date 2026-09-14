// Interfaz para el template de contrato
export interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  variables: string[];
  fileName?: string;
  component?: string;
  category?: string;
}

// Template principal para Statement of Work (PDF)
export const statementOfWorkTemplate: ContractTemplate = {
  id: "statement-of-work-pdf",
  name: "Statement of Work - PDF",
  description: "Professional document Statement of Work generated as PDF",
  subject: "Statement of Work - {{nombreCompleto}} - {{puestoTrabajo}}",
  variables: [
    "nombreCompleto",
    "correoElectronico",
    "cedula",
    "telefono",
    "direccionCompleta",
    "puestoTrabajo",
    "descripcionServicios",
    "ofertaSalarial",
    "salarioProbatorio",
    "monedaSalario",
    "fechaInicioLabores",
    "fechaEjecucion",
    "nombreBanco",
    "numeroCuenta",
  ],
};

// Template para Statement of Work en Inglés (PDF)
export const statementOfWorkEnglishTemplate: ContractTemplate = {
  id: "statement-of-work-english-pdf",
  name: "Statement of Work - English PDF",
  description:
    "Professional document Statement of Work generated as PDF in English",
  subject: "Statement of Work - {{nombreCompleto}} - {{puestoTrabajo}}",
  variables: [
    "nombreCompleto",
    "correoElectronico",
    "cedula",
    "telefono",
    "direccionCompleta",
    "puestoTrabajo",
    "descripcionServicios",
    "ofertaSalarial",
    "salarioProbatorio",
    "fechaInicioLabores",
    "fechaEjecucion",
    "nombreBanco",
    "numeroCuenta",
  ],
};

// Template para Nuevo Statement of Work en Inglés (PDF) - Version actualizada
export const newStatementOfWorkEnglishTemplate: ContractTemplate = {
  id: "new-statement-of-work-english-pdf",
  name: "New Statement of Work - English PDF (Updated)",
  description:
    "Updated professional Statement of Work document with new Service Fee structure and confidentiality agreement",
  subject: "Statement of Work - {{nombreCompleto}} - {{puestoTrabajo}}",
  variables: [
    "nombreCompleto",
    "correoElectronico",
    "cedula",
    "telefono",
    "direccionCompleta",
    "puestoTrabajo",
    "descripcionServicios",
    "fechaInicioLabores",
    "fechaEjecucion",
    "nombreBanco",
    "numeroCuenta",
  ],
};

// Exportar templates
export const contractTemplates: ContractTemplate[] = [
  statementOfWorkTemplate,
  statementOfWorkEnglishTemplate,
  newStatementOfWorkEnglishTemplate,
];

// La interfaz ya está exportada arriba

// Re-export PDF components so other modules can import from this index
export { default as ProfessionalServicesAgreementColPDF } from "./ProfessionalServicesAgreementColPDF";
export { default as IndependentContractorAgreementUsaPDF } from "./IndependentContractorAgreementUsaPDF";
export { default as InternationalProfessionalServicesAgreementPDF } from "./InternationalProfessionalServicesAgreementPDF";
export { default as VELSContractPDF } from "./VELSContractPDF";

// Definición de servicios disponibles con sus descripciones
export const SERVICIOS_DISPONIBLES = {
  ADMISIONES: {
    nombre: "Admisiones",
    descripcion:
      "Admisiones. Este servicio se establece en el primer punto de contacto para clientes nuevos o potenciales. El objeto principal es recopilar la información inicial del caso, verificar la elegibilidad básica e ingresar los detalles del cliente en los sistemas internos. Desempeña un papel clave en la creación de una primera impresión positiva y garantiza una experiencia de incorporación fluida para los clientes, en particular para los veteranos que buscan asistencia legal.",
  },
  LLAMADAS_BIENVENIDA: {
    nombre: "Representación de Llamadas de Bienvenida",
    descripcion:
      "Llamadas de bienvenida. El alcance de este servicio es realizar llamadas introductorias amistosas y profesionales con nuevos clientes para confirmar los datos de contacto, explicar los próximos pasos en el proceso legal y establecer expectativas claras. El objeto principal es asegurar que los clientes se sientan informados y apoyados desde el comienzo de su caso.",
  },
  ADMINISTRACION_CASOS: {
    nombre: "Administración de casos",
    descripcion:
      "Administracion de casos. El enfoque de este servicio es hacer seguimiento y validaciones a los casos legales asignados desde la admisión hasta la resolución. El objeto principal es el seguimiento de los plazos, garantizar la presentación oportuna de documentos, facilitar la comunicación entre clientes, abogados y terceros, y realizar un seguimiento de los elementos de acción. Desempeña un papel central en el mantenimiento del impulso y el cumplimiento en el ciclo de vida de los casos.",
  },
  LLAMADAS_INICIALES_CLIENTE: {
    nombre: "Asistencia de llamadas iniciales al cliente",
    descripcion:
      "Llamada inicial al cliente. El alcance de este servicio es el apoyo logístico de los casos entre departamentos internos. El objeto principal es hacer seguimiento a las asignaciones de tareas según el flujo del proceso, realiza un seguimiento de las actualizaciones del estado de los casos y ayuda a garantizar que la información crítica fluya de manera precisa y eficiente entre los equipos.",
  },
  GESTION_NIVEL_AUDITIVO: {
    nombre: "Gestión en Nivel Auditivo",
    descripcion:
      "Gestión en nivel auditivo. El alcance de este servicio es preparar los casos para las audiencias organizando la documentación, confirmando la logística y el aseguramiento de que el equipo legal y los clientes estén listos. El objeto principal es coordinar con los abogados haciendo uso de las herramientas definidas para ello y así mismo con los clientes para garantizar que todos los elementos necesarios estén en su lugar antes de las audiencias programadas.",
  },
  ASISTENCIA_LEGAL: {
    nombre: "Asistencia Legal",
    descripcion:
      "Asistencia legal. Este servicio consiste en dar soporte de manera integral a los abogados. El objeto principal es la asistencia legal definida según la necesidad y enmarcada en la preparación de documentos legales, gestionar la correspondencia, gestión de archivos de casos y asistencia con las presentaciones judiciales o la preparación de pruebas, con el fin de garantizar la precisión y la eficiencia en el proceso legal.",
  },
  ENTRADA_DATOS: {
    nombre: "Entrada de Datos",
    descripcion:
      "Entrada de datos. El alcance de este servicio es ingresar información relacionada con el cliente y el caso de manera precisa en bases de datos definidas para tal fin. El objeto principal de este servicio es mantener la integridad de los datos, señalar las discrepancias y admitir actualizaciones oportunas en todos los sistemas legales.",
  },
  CLASIFICACION_CORREO: {
    nombre: "Clasificación de correo digital",
    descripcion:
      "Clasificación de correo digital. El alcance del servicio es ordenar y categorizar la correspondencia y los documentos digitales entrantes. El objeto principal es garantizar el correcto enrutamiento de los archivos a los equipos legales y mantener las carpetas de casos actualizadas y organizadas.",
  },
  REVISION_ARCHIVOS: {
    nombre: "Revisión de Archivos",
    descripcion:
      "Revisión de archivos. El alcance del servicio está en revisar cuidadosamente los archivos de casos legales para verificar que estén completos y cumplan. El objeto principal es identificar la información faltante o las inconsistencias, así como, señalar los problemas para el personal legal y garantizar la precisión de la documentación antes de las audiencias o presentaciones.",
  },
  FACENOTES: {
    nombre: "Facenotes",
    descripcion:
      "Transcribir y resumir las conversaciones entre abogado y cliente y las interacciones legales. El objeto principal es actualizar los sistemas de gestión de casos con registros precisos, manteniendo la documentación adecuada de todas las comunicaciones legales.",
  },
  OPERADOR_LLAMADAS: {
    nombre: "Operador de llamadas",
    descripcion:
      "Administración de las líneas telefónicas. Responde y dirige las llamadas a los equipos adecuados, registra las consultas y garantiza que todas las personas que llaman reciban respuestas profesionales y oportunas. Actúa como el primer punto de contacto para muchos clientes y socios externos.",
  },
  ADMINISTRACION_SALESFORCE: {
    nombre: "Administración de Salesforce",
    descripcion:
      "Administración de Salesforce. El alcance del servicio es gestionar y mantener la plataforma Salesforce acorde a las necesidades de la empresa. El objeto principal es garantizar la precisión de los datos, gestionar y aprobar el acceso de los usuarios y propender por automatizar los flujos de trabajo para mejorar el seguimiento de casos y los informes.",
  },
  DESARROLLO_SALESFORCE: {
    nombre: "Desarrollo de Salesforce (plataforma)",
    descripcion:
      "Desarrollo de Salesforce. El alcance del servicio es crear y configurar soluciones de Salesforce adaptadas a las operaciones legales. El objeto principal es gestionar el desarrollo de la herramienta recibiendo realimentación de los equipos de operaciones para crear automatizaciones, formularios y paneles que mejoren la productividad y la generación de informes.",
  },
  ADMINISTRACION_BASES_DATOS: {
    nombre: "Administración de bases de datos",
    descripcion:
      "Administración de base de datos. El alcance del servicio es el seguimiento y supervisión a los sistemas de gestión de archivos digitales y las bases de datos. El objeto principal es mantener el acceso seguro a los registros de clientes y casos, organizar las estructuras de datos y garantizar que los registros se puedan recuperar y cumplan con los protocolos de privacidad.",
  },
  COORDINACION_EQUIPOS: {
    nombre: "Coordinación de equipos",
    descripcion:
      "Coordinación de equipos. El alcance del servicio es la coordinación de los flujos de actividades periódicas de los contratistas y su seguimiento, también debe definir los planes de formación requeridos para quienes ingresen a prestar servicios y garantizar el cumplimiento de los procesos según aplique. El objetivo principal es validar el complimiento de los servicios contratos por el contratante, asi como servir de enlace entre el contratante y el contratista, por otra parte, se podrá comunicar directamente con los clientes cuando es necesario.",
  },
  CUSTOM: {
    nombre: "Personalizado",
    descripcion: "", // Se puede personalizar
  },
};

// Tipos para TypeScript
export interface ContractData {
  fechaEjecucion: string;
  nombreCompleto: string;
  correoElectronico: string;
  ofertaSalarial: string;
  monedaSalario: string;
  direccionCompleta: string;
  telefono: string;
  cedula: string;
  nacionalidad?: string;
}

export interface CustomContractData extends ContractData {
  descripcionServicios: string;
}

// Función helper para obtener el template correcto según el servicio
// Nota: Todos usan StatementOfWorkPDF con descripciones específicas para evitar errores de rendering
export const getContractTemplate = () => {
  return "StatementOfWorkPDF"; // Template unificado que funciona correctamente
};

// Lista de categorías organizadas
export const CATEGORIAS_SERVICIOS = {
  SERVICIO_AL_CLIENTE: {
    nombre: "🌟 Servicio al Cliente y Admisión",
    servicios: ["ADMISIONES", "LLAMADAS_BIENVENIDA"],
  },
  GESTION_CASOS: {
    nombre: "📋 Gestión y Coordinación de Casos",
    servicios: [
      "ADMINISTRACION_CASOS",
      "LLAMADAS_INICIALES_CLIENTE",
      "GESTION_NIVEL_AUDITIVO",
    ],
  },
  APOYO_ADMINISTRATIVO: {
    nombre: "📄 Apoyo Administrativo y Operativo",
    servicios: [
      "ASISTENCIA_LEGAL",
      "ENTRADA_DATOS",
      "CLASIFICACION_CORREO",
      "REVISION_ARCHIVOS",
      "FACENOTES",
    ],
  },
  COMUNICACIONES: {
    nombre: "📞 Comunicaciones y soporte al cliente",
    servicios: ["OPERADOR_LLAMADAS"],
  },
  FUNCIONES_TECNICAS: {
    nombre: "💻 Funciones técnicas",
    servicios: [
      "ADMINISTRACION_SALESFORCE",
      "DESARROLLO_SALESFORCE",
      "ADMINISTRACION_BASES_DATOS",
    ],
  },
  GESTION_EQUIPOS: {
    nombre: "👥 Gestión de equipos",
    servicios: ["COORDINACION_EQUIPOS"],
  },
  PERSONALIZADO: {
    nombre: "⚙️ Personalizado",
    servicios: ["CUSTOM"],
  },
};
