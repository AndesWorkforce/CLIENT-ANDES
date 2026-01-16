"use client";
import { axiosBase } from "@/services/axios.instance";

export async function esignCreateDocumentBase64(payload: {
  titulo: string;
  descripcion?: string;
  pdfBase64: string;
  procesoContratacionId?: string;
  nombreArchivo?: string;
}) {
  const res = await axiosBase.post("esign/documents/base64", payload);
  return res.data;
}

export async function filesUploadPdf(pdfBlob: Blob): Promise<string> {
  const form = new FormData();
  const filename = `contract-${Date.now()}.pdf`;
  form.append("pdf", pdfBlob, filename);
  const res = await axiosBase.post("files/upload/pdf", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}

export async function filesUploadPdfWithKey(
  pdfBlob: Blob,
  key: string
): Promise<string> {
  const form = new FormData();
  const filename = key.split("/").pop() || `contract-${Date.now()}.pdf`;
  form.append("pdf", pdfBlob, filename);
  form.append("key", key);
  form.append("folder", "documents/esign");
  const res = await axiosBase.post("files/upload/pdf", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function esignCreateDocument(payload: {
  titulo: string;
  descripcion?: string;
  archivoOrigenUrl?: string;
  procesoContratacionId?: string;
  isAnnex?: boolean;
}) {
  const res = await axiosBase.post("esign/documents", payload);

  const data = res.data;
  return data && data.id ? { document: data } : data;
}

export async function esignUpdateDocumentSource(
  documentId: string,
  archivoOrigenUrl: string
) {
  const res = await axiosBase.post(`esign/documents/${documentId}/source`, {
    archivoOrigenUrl,
  });
  return res.data;
}

export async function esignAddRecipients(
  documentId: string,
  payload: {
    recipients: Array<{
      email: string;
      nombre?: string;
      telefono?: string;
      orden: number;
      rol?: string;
    }>;
  }
) {
  const res = await axiosBase.post(
    `esign/documents/${documentId}/recipients`,
    payload
  );
  return res.data;
}

export async function esignAddFields(
  documentId: string,
  payload: {
    fields: Array<{
      pageNumber: number;
      x: number;
      y: number;
      width: number;
      height: number;
      fieldType: string;
      assignedToRecipientId: string;
      required?: boolean;
      label?: string;
    }>;
  }
) {
  const res = await axiosBase.post(
    `esign/documents/${documentId}/fields`,
    payload
  );
  return res.data;
}

export async function esignSendDocument(documentId: string) {
  const res = await axiosBase.post(`esign/documents/${documentId}/send`);
  return res.data;
}

export async function esignUpdateProcessOffer(
  documentId: string,
  ofertaSalarial: number | string,
  monedaSalario?: string,
  fechaInicioLabores?: string
) {
  const res = await axiosBase.patch(
    `esign/documents/${documentId}/proceso/oferta`,
    { ofertaSalarial, monedaSalario, fechaInicioLabores }
  );
  return res.data;
}

export async function esignGetDocument(documentId: string) {
  const res = await axiosBase.get(`esign/documents/${documentId}`);
  return res.data;
}
