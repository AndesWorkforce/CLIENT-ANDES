import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Edit, ImageIcon, Upload } from "lucide-react";
import { fetchEmailTemplates } from "../templates/actions/email.actions";
import { sendEmail } from "@/app/pages/contact/actions/contact-actions";
import { useNotificationStore } from "@/store/notifications.store";
import {
  isS3CanonicalUrl,
  toAccessibleMediaUrl,
} from "@/lib/s3-media";

const QuillEditor = dynamic(() => import("./QuillEditor"), {
  ssr: false,
});

const EMAIL_SIGNATURES_PREFIX = "email-signatures/";
const ACCEPTED_SIGNATURE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const MAX_SIGNATURE_SIZE = 5 * 1024 * 1024; // 5 MB

type SignatureOption = {
  id: string;
  label: string;
  url: string;
};

function getApiBase(): string {
  const raw = (process.env.NEXT_PUBLIC_API_URL || "").trim();
  if (!raw) return "";
  return raw.endsWith("/") ? raw : `${raw}/`;
}

/** Parsea la respuesta del upload (texto plano o JSON envuelto). */
function parseUploadUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http")) return trimmed.replace(/^"|"$/g, "");
  try {
    const json = JSON.parse(trimmed);
    const candidate =
      json?.data?.url ||
      json?.data ||
      json?.url ||
      json?.publicUrl ||
      "";
    return typeof candidate === "string" ? candidate : "";
  } catch {
    return trimmed.replace(/^"|"$/g, "");
  }
}

function labelFromFileName(fileName: string): string {
  const withoutExt = fileName.replace(/\.[^.]+$/, "");
  const cleaned = withoutExt
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return fileName;
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

async function fetchEmailSignaturesFromS3(): Promise<SignatureOption[]> {
  const response = await fetch(`${getApiBase()}files/email-signatures`, {
    method: "GET",
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Failed to list signatures (HTTP ${response.status})`);
  }

  const json = await response.json();
  const items = (json?.data?.items || json?.items || []) as Array<{
    key?: string;
    url?: string;
    fileName?: string;
  }>;

  return items
    .filter((item) => item?.url && item.url.startsWith("http"))
    .map((item) => ({
      id: item.key || item.url!,
      label: labelFromFileName(item.fileName || item.key || "Signature"),
      url: item.url!,
    }));
}

/**
 * URL para el HTML del mail. Si es S3 privado, usa el proxy público de la API
 * para que los clientes de correo puedan cargar la imagen.
 */
function resolveSignatureUrlForEmail(imageUrl: string): string {
  const url = imageUrl.trim();
  if (!url) return url;
  if (!isS3CanonicalUrl(url)) return url;
  return toAccessibleMediaUrl(url, { mode: "stream" });
}

function buildSignatureHtml(imageUrl: string): string {
  const safeUrl = resolveSignatureUrlForEmail(imageUrl).replace(/"/g, "&quot;");
  return `
  <br/>
  <img 
    src="${safeUrl}" 
    alt="Andes Workforce Signature" 
    style="margin-top: 32px; width: 400px; height: 200px;"
  />
`;
}

async function uploadSignatureImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("folder", "email-signatures");

  const uploadEndpoint = `${getApiBase()}files/upload/image/IMAGE`;
  const response = await fetch(uploadEndpoint, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed (HTTP ${response.status})`);
  }

  const publicUrl = parseUploadUrl(await response.text());
  if (!publicUrl || !publicUrl.startsWith("http")) {
    throw new Error("Upload did not return a valid image URL");
  }
  return publicUrl;
}

interface EmailTemplate {
  id: string;
  nombre: string;
  asunto: string;
  contenido: string;
  variables: string[];
  descripcion?: string;
}

interface SendEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicant: {
    nombre: string;
    apellido: string;
    correo: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  } | null;
  templates?: EmailTemplate[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSend?: (template: any) => void;
}

function applyVariables(
  content: string,
  variables: string[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>
): string {
  let result = content;
  for (const variable of variables) {
    if (data[variable]) {
      result = result.replace(
        new RegExp(`{{${variable}}}`, "g"),
        String(data[variable])
      );
    }
  }
  return result;
}

function htmlToPlainText(html: string): string {
  if (typeof window === "undefined") {
    return html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<\/div>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || div.innerText || "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const SendEmailModal: React.FC<SendEmailModalProps> = ({
  isOpen,
  onClose,
  applicant,
  templates: propTemplates,
  onSend,
}) => {
  const [selectedTemplate, setSelectedTemplate] =
    useState<EmailTemplate | null>(null);
  const [editableSubject, setEditableSubject] = useState("");
  const [editableBodyHtml, setEditableBodyHtml] = useState("");
  const [draftSubject, setDraftSubject] = useState("");
  const [draftBodyHtml, setDraftBodyHtml] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [dbTemplates, setDbTemplates] = useState<EmailTemplate[]>([]);
  const [sending, setSending] = useState<boolean>(false);
  const [signatureImageUrl, setSignatureImageUrl] = useState("");
  const [draftSignatureUrl, setDraftSignatureUrl] = useState("");
  const [signatureOptions, setSignatureOptions] = useState<SignatureOption[]>(
    []
  );
  const [loadingSignatures, setLoadingSignatures] = useState(false);
  const [isEditingSignature, setIsEditingSignature] = useState(false);
  const [isUploadingSignature, setIsUploadingSignature] = useState(false);
  const signatureFileInputRef = useRef<HTMLInputElement>(null);
  const { addNotification } = useNotificationStore();

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const templates = await fetchEmailTemplates();
      setDbTemplates(templates);
    } catch (error) {
      console.error("Error loading templates:", error);
      addNotification("Error loading email templates", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadSignatureOptions = async (opts?: {
    preferUrl?: string;
    selectFirstIfEmpty?: boolean;
  }) => {
    setLoadingSignatures(true);
    try {
      const options = await fetchEmailSignaturesFromS3();
      setSignatureOptions(options);

      const preferred = opts?.preferUrl?.trim();
      if (preferred) {
        setSignatureImageUrl(preferred);
        setDraftSignatureUrl(preferred);
        return;
      }

      if (opts?.selectFirstIfEmpty !== false && options.length > 0) {
        setSignatureImageUrl((current) => {
          if (current && options.some((o) => o.url === current)) return current;
          return options[0].url;
        });
        setDraftSignatureUrl((current) => {
          if (current && options.some((o) => o.url === current)) return current;
          return options[0].url;
        });
      }
    } catch (error) {
      console.error("[SendEmailModal] Error loading S3 signatures:", error);
      addNotification("Error loading signature images from S3", "error");
      setSignatureOptions([]);
    } finally {
      setLoadingSignatures(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedTemplate(null);
      setEditableSubject("");
      setEditableBodyHtml("");
      setDraftSubject("");
      setDraftBodyHtml("");
      setIsEditing(false);
      setSignatureImageUrl("");
      setDraftSignatureUrl("");
      setIsEditingSignature(false);
      setIsUploadingSignature(false);
      if (signatureFileInputRef.current) {
        signatureFileInputRef.current.value = "";
      }
      if (!propTemplates) {
        loadTemplates();
      }
      void loadSignatureOptions({ selectFirstIfEmpty: true });
    }
  }, [isOpen, propTemplates]);

  useEffect(() => {
    if (!selectedTemplate || !applicant) return;

    const resolvedSubject = applyVariables(
      selectedTemplate.asunto,
      selectedTemplate.variables,
      applicant
    );
    const resolvedBody = applyVariables(
      selectedTemplate.contenido,
      selectedTemplate.variables,
      applicant
    );

    setEditableSubject(resolvedSubject);
    setEditableBodyHtml(resolvedBody);
    setIsEditing(false);
  }, [selectedTemplate, applicant]);

  const handleStartEdit = () => {
    setDraftSubject(editableSubject);
    setDraftBodyHtml(editableBodyHtml);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!draftSubject.trim() || !htmlToPlainText(draftBodyHtml).trim()) {
      addNotification("Subject and message cannot be empty", "error");
      return;
    }
    setEditableSubject(draftSubject.trim());
    setEditableBodyHtml(draftBodyHtml);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setDraftSubject(editableSubject);
    setDraftBodyHtml(editableBodyHtml);
    setIsEditing(false);
  };

  const handleStartEditSignature = () => {
    setDraftSignatureUrl(signatureImageUrl);
    setIsEditingSignature(true);
  };

  const handleSaveSignature = () => {
    const next = draftSignatureUrl.trim();
    if (!next) {
      addNotification("Select a signature image", "error");
      return;
    }
    setSignatureImageUrl(next);
    setIsEditingSignature(false);
  };

  const handleCancelSignature = () => {
    setDraftSignatureUrl(signatureImageUrl);
    setIsEditingSignature(false);
    if (signatureFileInputRef.current) {
      signatureFileInputRef.current.value = "";
    }
  };

  const handleSignatureFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_SIGNATURE_TYPES.includes(file.type)) {
      addNotification("Only JPG, PNG and WEBP images are accepted", "error");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_SIGNATURE_SIZE) {
      addNotification("Image must be 5 MB or less", "error");
      e.target.value = "";
      return;
    }

    setIsUploadingSignature(true);
    try {
      const uploadedUrl = await uploadSignatureImage(file);
      await loadSignatureOptions({ preferUrl: uploadedUrl });
      setIsEditingSignature(false);
      addNotification("Signature image uploaded", "success");
    } catch (error) {
      console.error("[SendEmailModal] Signature upload error:", error);
      addNotification(
        error instanceof Error
          ? error.message
          : "Error uploading signature image",
        "error"
      );
    } finally {
      setIsUploadingSignature(false);
      e.target.value = "";
    }
  };

  const buildEmailHtml = () =>
    `${editableBodyHtml}${buildSignatureHtml(signatureImageUrl)}`;

  const handleSendEmail = async () => {
    if (
      !selectedTemplate ||
      !applicant ||
      isEditing ||
      isEditingSignature ||
      isUploadingSignature
    )
      return;

    if (!editableSubject.trim()) {
      addNotification("Subject cannot be empty", "error");
      return;
    }

    if (!editableBodyHtml.trim()) {
      addNotification("Email body cannot be empty", "error");
      return;
    }

    if (!signatureImageUrl.trim()) {
      addNotification("Select a signature image", "error");
      return;
    }

    setSending(true);
    try {
      const body = buildEmailHtml();

      if (onSend) {
        onSend({
          name: selectedTemplate.nombre,
          subject: editableSubject.trim(),
          body,
        });
        setSending(false);
        return;
      }

      const result = await sendEmail({
        to: applicant.correo,
        subject: editableSubject.trim(),
        html: body,
        replyTo: "info@teamandes.com",
      });

      if (result.success) {
        addNotification("Email sent successfully", "success");
        onClose();
      } else {
        addNotification(result.message || "Error sending email", "error");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      addNotification("Unexpected error sending email", "error");
    } finally {
      setSending(false);
    }
  };

  if (!isOpen || !applicant) return null;

  const templatesForDisplay = propTemplates || dbTemplates;
  const previewSignatureUrl = toAccessibleMediaUrl(
    isEditingSignature
      ? draftSignatureUrl.trim() || signatureImageUrl
      : signatureImageUrl
  );

  const signatureBlock = (
    <div className="mt-8 pt-6 border-t border-[#0097B2]/30 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
          <ImageIcon size={16} className="text-[#0097B2]" />
          Signature image
        </span>
        {!isEditingSignature ? (
          <button
            type="button"
            onClick={handleStartEditSignature}
            disabled={isUploadingSignature}
            className="p-1.5 text-[#0097B2] hover:bg-[#0097B2]/10 rounded-full transition-colors cursor-pointer disabled:opacity-50"
            title="Change signature image"
          >
            <Edit size={16} />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCancelSignature}
              disabled={isUploadingSignature}
              className="px-2.5 py-1 text-xs bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveSignature}
              disabled={isUploadingSignature}
              className="px-2.5 py-1 text-xs bg-[#0097B2] text-white rounded-lg hover:bg-[#007a8f] transition-colors cursor-pointer disabled:opacity-50"
            >
              Save
            </button>
          </div>
        )}
      </div>

      {isEditingSignature && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-gray-500">
              From S3 folder <code>{EMAIL_SIGNATURES_PREFIX}</code>
            </p>
            <button
              type="button"
              onClick={() =>
                void loadSignatureOptions({
                  preferUrl: draftSignatureUrl || signatureImageUrl,
                })
              }
              disabled={loadingSignatures || isUploadingSignature}
              className="text-xs text-[#0097B2] hover:underline cursor-pointer disabled:opacity-50"
            >
              {loadingSignatures ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {loadingSignatures && signatureOptions.length === 0 ? (
            <p className="text-xs text-gray-500">Loading signatures…</p>
          ) : signatureOptions.length === 0 ? (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              No images found in <code>{EMAIL_SIGNATURES_PREFIX}</code>. Upload
              one below.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[220px] overflow-y-auto pr-1">
              {signatureOptions.map((option) => {
                const selected = draftSignatureUrl.trim() === option.url;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setDraftSignatureUrl(option.url)}
                    disabled={isUploadingSignature}
                    className={`text-left rounded-lg border p-2 transition-colors cursor-pointer disabled:opacity-50 ${
                      selected
                        ? "border-[#0097B2] bg-[#0097B2]/10"
                        : "border-gray-200 hover:border-[#0097B2]"
                    }`}
                    title={option.label}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={toAccessibleMediaUrl(option.url)}
                      alt={option.label}
                      className="w-full h-16 object-contain bg-white rounded mb-1"
                    />
                    <span className="block text-[11px] text-gray-700 truncate">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex items-center gap-3">
            <input
              ref={signatureFileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              className="hidden"
              onChange={handleSignatureFileChange}
            />
            <button
              type="button"
              onClick={() => signatureFileInputRef.current?.click()}
              disabled={isUploadingSignature}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-[#0097B2] text-[#0097B2] rounded-lg hover:bg-[#0097B2]/10 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Upload size={16} />
              {isUploadingSignature ? "Uploading..." : "Upload image"}
            </button>
            <span className="text-xs text-gray-500">
              JPG, PNG or WEBP · max 5 MB
            </span>
          </div>

          <p className="text-xs text-gray-500">
            Select an image from the gallery or upload a new one.
          </p>
        </div>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={previewSignatureUrl}
        src={previewSignatureUrl}
        alt="Andes Workforce Signature"
        className={`w-full max-w-[400px] h-auto object-contain ${
          isEditingSignature || isUploadingSignature ? "opacity-80" : ""
        }`}
        onError={(e) => {
          (e.target as HTMLImageElement).style.opacity = "0.35";
        }}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
      <div className="bg-white rounded-lg shadow-lg w-[95%] max-w-[1440px] h-[90vh] p-4 md:p-6 relative">
        <button
          className="absolute top-4 right-4 text-[#0097B2]/50 hover:text-[#0097B2] text-3xl cursor-pointer"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl md:text-2xl font-semibold mb-6">
          Send email to {applicant.nombre} {applicant.apellido}
        </h2>

        <div className="flex flex-col md:flex-row h-[calc(100%-120px)] gap-4 md:gap-6">
          {/* Templates Column */}
          <div className="w-full md:w-1/2 h-[300px] md:h-auto overflow-y-auto pr-2 md:pr-4 border-b md:border-b-0 md:border-r border-[#0097B2] pb-4 md:pb-0">
            <h3 className="text-lg font-medium mb-4">Email Templates</h3>
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0097B2]"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {templatesForDisplay.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedTemplate?.id === template.id
                        ? "border-[#0097B2] bg-[#0097B2]/10"
                        : "border-[#0097B2]/30 hover:border-[#0097B2]"
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <h4 className="font-medium text-lg mb-1">
                      {template.nombre}
                    </h4>
                    <p className="text-gray-600 text-sm mb-2">
                      {template.descripcion}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Subject:</span>{" "}
                      {template.asunto}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preview Column */}
          <div className="w-full md:w-1/2 flex-1 overflow-hidden flex flex-col custom-scrollbar">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Preview</h3>
              {selectedTemplate && !isEditing && (
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="p-2 text-[#0097B2] hover:bg-[#0097B2]/10 rounded-full transition-colors cursor-pointer"
                  title="Edit email text"
                >
                  <Edit size={18} />
                </button>
              )}
              {selectedTemplate && isEditing && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-3 py-1.5 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="px-3 py-1.5 text-sm bg-[#0097B2] text-white rounded-lg hover:bg-[#007a8f] transition-colors cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>

            {selectedTemplate ? (
              <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-4 md:p-6">
                <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 min-h-full">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subject
                        </label>
                        <input
                          type="text"
                          value={draftSubject}
                          onChange={(e) => setDraftSubject(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0097B2] focus:border-[#0097B2]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Message
                        </label>
                        <QuillEditor
                          value={draftBodyHtml}
                          onChange={setDraftBodyHtml}
                          placeholder="Edit the email text..."
                          editorId="send-email-quill-editor"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          You are editing the message text. Use the signature
                          section below to change the signature image.
                        </p>
                      </div>
                      {signatureBlock}
                    </div>
                  ) : (
                    <>
                      <div className="mb-4 pb-3 border-b-2 border-[#0097B2]">
                        <span className="font-medium">Subject: </span>
                        <span className="text-gray-700">{editableSubject}</span>
                      </div>
                      <div className="prose max-w-none">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: editableBodyHtml,
                          }}
                        />
                      </div>
                      {signatureBlock}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg">
                Select a template to preview
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 bg-[#0097B2] text-white rounded-lg hover:bg-[#007a8f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            disabled={
              !selectedTemplate ||
              sending ||
              isEditing ||
              isEditingSignature ||
              isUploadingSignature
            }
            onClick={handleSendEmail}
          >
            {sending ? "Sending..." : "Send Email"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendEmailModal;
