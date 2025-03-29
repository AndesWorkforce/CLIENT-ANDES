export interface DatosPersonales {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  residencia: string;
  fotoPerfil: string;
}

export interface RequisitosDispositivo {
  tipoDispositivo: "PC_LAPTOP" | "PC_DESKTOP";
  proveedorInternet: string;
  cantidadRAM: string;
  velocidadDescarga: string;
  conexionCableada: boolean;
}

export interface Archivos {
  videoPresentacion: string | null;
  curriculum: string | null;
  documentosAdicionales: string[];
  imagenTestExterno: string;
  imagenTestVelocidad: string;
  imagenRequerimientosPC: string;
}

export interface DatosFormulario {
  "What type of computer do you use?": string;
  "What Internet provider do you use?": string;
  "What is the URL for their website?": string;
  "Do you use a wired internet connection?": string;
  "In what city and country do you reside?": string;
  "What 3 words best describe you and why?": string;
  "What phone number do you use for WhatsApp?": string;
  "How much RAM is available on your computer?": string;
  "What is your preferred first and last name?": string;
  "What makes you the best candidate for this position?": string;
  "How many monitors do you currently have/use for work?": string;
  "Please run a speed test on your computer: what is the current upload speed?": string;
  "Please run a speed test on your computer: what is the current download speed?": string;
  "What type of headset do you currently have? How does it connect with your computer?": string;
  "What type of headset do you currently want? How does it connect with your computer?": string;
  "Please write a few sentences about any previous experience you have had with making and/or taking calls.": string;
  "If you have a Gmail email address, what is it? (Some training documents are most easily shared with google accounts.)": string;
  "On a scale of 1-10, how comfortable are you with making calls with native English speakers? Please explain your rating.": string;
}

export interface Habilidad {
  id: string;
  nombre: string;
  nivel: number;
  usuarioId: string;
}

export interface Educacion {
  id: string;
  institucion: string;
  titulo: string;
  añoInicio: string;
  añoFin: string | null;
  esActual: boolean;
  usuarioId: string;
}

export interface Experiencia {
  id: string;
  empresa: string;
  cargo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  esActual: boolean;
  usuarioId: string;
}

export interface PerfilCompleto {
  datosPersonales: DatosPersonales;
  requisitosDispositivo: RequisitosDispositivo;
  archivos: Archivos;
  datosFormulario: DatosFormulario;
  habilidades: Habilidad[];
  educacion: Educacion[];
  experiencia: Experiencia[];
  estadoPerfil: "COMPLETO" | "INCOMPLETO";
  validacionExterna: boolean;
  videoPresentacion: string;
}

export interface ProfileResponse {
  data: PerfilCompleto;
  meta: {
    status: number;
    message: string;
    timestamp: string;
    path: string;
  };
}
