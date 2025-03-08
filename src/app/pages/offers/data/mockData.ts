// Tipos para TypeScript
export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  department: string;
  seniority: string;
  modality: string;
  salary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  postDate: string;
  logoUrl: string;
}

// Datos de ejemplo
export const jobs: Job[] = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp",
    location: "remoto",
    department: "desarrollo",
    seniority: "mid",
    modality: "full-time",
    salary: "$50,000 - $70,000",
    description:
      "Estamos buscando un desarrollador Frontend con experiencia en React y TypeScript para unirse a nuestro equipo de desarrollo de productos digitales. Serás responsable de diseñar e implementar interfaces de usuario para nuestras aplicaciones web.",
    responsibilities: [
      "Desarrollar interfaces de usuario utilizando React, TypeScript y Next.js",
      "Colaborar con diseñadores para convertir mockups en componentes funcionales",
      "Optimizar aplicaciones para máximo rendimiento en varios dispositivos",
      "Implementar pruebas unitarias para garantizar la calidad del código",
    ],
    requirements: [
      "Al menos 2 años de experiencia con React",
      "Experiencia con TypeScript y Next.js",
      "Conocimiento sólido de HTML, CSS y JavaScript",
      "Experiencia trabajando con APIs RESTful",
    ],
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Git"],
    postDate: "2024-02-12",
    logoUrl: "/images/techcorp-logo.png",
  },
  {
    id: 2,
    title: "UX/UI Designer",
    company: "DesignHub",
    location: "hibrido",
    department: "diseño",
    seniority: "senior",
    modality: "full-time",
    salary: "$70,000 - $90,000",
    description:
      "Buscamos un Diseñador UX/UI experimentado para liderar el diseño de experiencias digitales innovadoras para nuestros clientes. Serás responsable de crear diseños atractivos y funcionales que mejoren la experiencia del usuario.",
    responsibilities: [
      "Crear wireframes, prototipos y diseños detallados para aplicaciones web y móviles",
      "Realizar investigaciones de usuarios y pruebas de usabilidad",
      "Colaborar con desarrolladores para implementar diseños",
      "Definir y mantener el sistema de diseño",
    ],
    requirements: [
      "Al menos 5 años de experiencia en diseño UX/UI",
      "Experiencia con herramientas como Figma, Sketch o Adobe XD",
      "Conocimiento de principios de diseño de interacción",
      "Experiencia liderando proyectos de diseño",
    ],
    skills: [
      "Figma",
      "User Research",
      "Design Systems",
      "Interaction Design",
      "Prototyping",
    ],
    postDate: "2024-02-10",
    logoUrl: "/images/designhub-logo.png",
  },
  {
    id: 3,
    title: "Marketing Specialist",
    company: "GrowthAgency",
    location: "presencial",
    department: "marketing",
    seniority: "junior",
    modality: "part-time",
    salary: "$30,000 - $45,000",
    description:
      "Estamos contratando un especialista en marketing para ayudar a nuestros clientes a aumentar su visibilidad online. Serás parte de un equipo dinámico y trabajarás en campañas de marketing digital para varias empresas.",
    responsibilities: [
      "Planificar y ejecutar campañas de marketing digital",
      "Gestionar presencia en redes sociales",
      "Analizar métricas de campañas y optimizar resultados",
      "Crear contenido para blogs y newsletters",
    ],
    requirements: [
      "Al menos 1 año de experiencia en marketing digital",
      "Conocimiento de herramientas de análisis como Google Analytics",
      "Experiencia en gestión de redes sociales",
      "Excelentes habilidades de comunicación escrita",
    ],
    skills: [
      "Social Media Marketing",
      "Content Creation",
      "Google Analytics",
      "SEO",
      "Email Marketing",
    ],
    postDate: "2024-02-05",
    logoUrl: "/images/growthagency-logo.png",
  },
  {
    id: 4,
    title: "Backend Developer",
    company: "ServerTech",
    location: "remoto",
    department: "desarrollo",
    seniority: "senior",
    modality: "contract",
    salary: "$80,000 - $110,000",
    description:
      "Buscamos un desarrollador Backend senior para trabajar en nuestras APIs y servicios. Serás responsable de diseñar, desarrollar y mantener la infraestructura del backend para nuestros productos SaaS.",
    responsibilities: [
      "Diseñar y desarrollar APIs RESTful escalables",
      "Implementar microservicios utilizando Node.js y TypeScript",
      "Configurar y optimizar bases de datos",
      "Integrar servicios de terceros y APIs externas",
    ],
    requirements: [
      "Al menos 5 años de experiencia en desarrollo backend",
      "Experiencia profunda con Node.js y TypeScript",
      "Conocimiento de bases de datos SQL y NoSQL",
      "Experiencia con arquitecturas de microservicios",
    ],
    skills: ["Node.js", "TypeScript", "MongoDB", "PostgreSQL", "Docker", "AWS"],
    postDate: "2024-02-10",
    logoUrl: "/images/servertech-logo.png",
  },
  {
    id: 5,
    title: "Sales Representative",
    company: "SalesPro",
    location: "hibrido",
    department: "ventas",
    seniority: "mid",
    modality: "full-time",
    salary: "$40,000 + comisiones",
    description:
      "Estamos buscando un representante de ventas motivado para unirse a nuestro equipo. Serás responsable de generar nuevos clientes y mantener relaciones con los existentes para impulsar el crecimiento de ingresos.",
    responsibilities: [
      "Identificar y contactar clientes potenciales",
      "Realizar demostraciones de productos y servicios",
      "Negociar contratos y cerrar ventas",
      "Mantener relaciones con clientes existentes",
    ],
    requirements: [
      "Al menos 2 años de experiencia en ventas B2B",
      "Historial comprobado de logro de objetivos de ventas",
      "Excelentes habilidades de comunicación y negociación",
      "Capacidad para trabajar de forma independiente y en equipo",
    ],
    skills: [
      "Ventas B2B",
      "CRM",
      "Negociación",
      "Prospección",
      "Gestión de relaciones",
    ],
    postDate: "2024-02-05",
    logoUrl: "/images/salespro-logo.png",
  },
];
