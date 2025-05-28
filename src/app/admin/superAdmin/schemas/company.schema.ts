export interface Company {
  id: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  fechaCreacion: string;
  usuarioResponsable: {
    id: string;
    nombre?: string;
    apellido?: string;
    correo: string;
  };
  _count?: {
    empleados: number;
  };
}
