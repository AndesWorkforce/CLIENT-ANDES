"use server";

import { createServerAxios } from "@/services/axios.server";

export async function adminUpdateContratoYPostulacionServer(payload: {
  procesoContratacionId: string;
  propuestaId?: string;
  puestoTrabajo?: string;
  ofertaSalarial?: number | string;
  monedaSalario?: string;
  /** Actualiza ProcesoContratacion.fechaInicio (no fechaInicioLabores). */
  fechaInicio?: string;
}) {
  const {
    procesoContratacionId,
    propuestaId,
    puestoTrabajo,
    ofertaSalarial,
    monedaSalario,
    fechaInicio,
  } = payload;

  const body: Record<string, string | number> = {};
  if (propuestaId !== undefined) body.propuestaId = propuestaId;
  if (puestoTrabajo !== undefined) body.puestoTrabajo = puestoTrabajo;
  if (ofertaSalarial !== undefined) body.ofertaSalarial = ofertaSalarial;
  if (monedaSalario !== undefined) body.monedaSalario = monedaSalario;
  if (fechaInicio !== undefined) body.fechaInicio = fechaInicio;

  const axios = await createServerAxios();
  const res = await axios.patch(
    `admin/contratacion/${procesoContratacionId}/admin-update`,
    body
  );
  return res.data;
}
