import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Edit } from "lucide-react";
import { fetchEmailTemplates } from "../templates/actions/email.actions";
import { sendEmail } from "@/app/pages/contact/actions/contact-actions";
import { useNotificationStore } from "@/store/notifications.store";

const QuillEditor = dynamic(() => import("./QuillEditor"), {
  ssr: false,
});

const SIGNATURE_SEND_HTML = `
  <br/>
  <img 
    src="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/firma_laura.jpeg" 
    alt="Andes Workforce Signature" 
    style="margin-top: 32px; width: 400px; height: 200px;"
  />
`;

const SIGNATURE_PREVIEW_URL =
  "https://appwiseinnovations.dev/Andes/firma_nicole.png";

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

  useEffect(() => {
    if (isOpen) {
      setSelectedTemplate(null);
      setEditableSubject("");
      setEditableBodyHtml("");
      setDraftSubject("");
      setDraftBodyHtml("");
      setIsEditing(false);
      if (!propTemplates) {
        loadTemplates();
      }
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

  const buildEmailHtml = () => `${editableBodyHtml}${SIGNATURE_SEND_HTML}`;

  const handleSendEmail = async () => {
    if (!selectedTemplate || !applicant || isEditing) return;

    if (!editableSubject.trim()) {
      addNotification("Subject cannot be empty", "error");
      return;
    }

    if (!editableBodyHtml.trim()) {
      addNotification("Email body cannot be empty", "error");
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
      <div className="bg-white rounded-lg shadow-lg w-[95%] max-w-7xl h-[90vh] p-4 md:p-6 relative">
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
                          You are editing the message only. Formatting (bold,
                          links, lists) is preserved. The signature image below
                          is added automatically and cannot be edited.
                        </p>
                      </div>
                      <div className="mt-4 pt-6 border-t border-[#0097B2]/30">
                        <img
                          src={SIGNATURE_PREVIEW_URL}
                          alt="Andes Workforce Signature"
                          className="w-full max-w-[400px] h-auto object-contain opacity-80"
                        />
                      </div>
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
                      <div className="mt-8 pt-6 border-t border-[#0097B2]/30">
                        <img
                          src={SIGNATURE_PREVIEW_URL}
                          alt="Andes Workforce Signature"
                          className="w-full max-w-[400px] h-auto object-contain"
                        />
                      </div>
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
            disabled={!selectedTemplate || sending || isEditing}
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
