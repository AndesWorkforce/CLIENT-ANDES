import axios from "axios";

const base = "/esign";

export async function createDocument(data: {
  titulo: string;
  descripcion?: string;
  archivoOrigenUrl?: string;
  procesoContratacionId?: string;
}) {
  const res = await axios.post(`${base}/documents`, data);
  return res.data;
}

export async function uploadDocument(formData: FormData) {
  const res = await axios.post(`${base}/documents/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function uploadTemplate(formData: FormData) {
  const res = await axios.post(`${base}/templates/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function listTemplates() {
  const res = await axios.get(`${base}/templates`);
  return res.data;
}

export async function getTemplate(id: string) {
  const res = await axios.get(`${base}/templates/${id}`);
  return res.data;
}

export async function instantiateTemplate(
  id: string,
  payload: {
    titulo?: string;
    descripcion?: string;
    variableValues?: any;
    recipientsOverride?: { email: string; nombre?: string; orden: number }[];
  }
) {
  const res = await axios.post(`${base}/templates/${id}/instantiate`, payload);
  return res.data;
}

export async function addRecipients(
  documentId: string,
  recipients: { email: string; orden: number; nombre?: string }[]
) {
  const res = await axios.post(`${base}/documents/${documentId}/recipients`, {
    recipients,
  });
  return res.data;
}

export async function addFields(documentId: string, fields: any[]) {
  const res = await axios.post(`${base}/documents/${documentId}/fields`, {
    fields,
  });
  return res.data;
}

export async function sendDocument(documentId: string) {
  const res = await axios.post(`${base}/documents/${documentId}/send`);
  return res.data;
}

export async function fetchDocument(documentId: string) {
  const res = await axios.get(`${base}/documents/${documentId}`);
  return res.data;
}

export async function getSignPayload(
  docId: string,
  recipientId: string,
  token: string
) {
  const res = await axios.get(
    `${base}/documents/${docId}/recipient/${recipientId}/sign`,
    { params: { token } }
  );
  return res.data;
}

export async function submitSignature(
  docId: string,
  recipientId: string,
  token: string,
  firmaBase64: string,
  fieldId?: string,
  mode: "DRAW" | "TYPED" = "DRAW",
  typedName?: string
) {
  const res = await axios.post(
    `${base}/documents/${docId}/recipient/${recipientId}/sign`,
    { firmaBase64, fieldId, mode, typedName },
    { params: { token } }
  );
  return res.data;
}
