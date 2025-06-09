"use client";

import React, { useEffect, useState } from "react";
import EmailTemplateModal from "./components/EmailtemplateModal";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import {
  deleteEmailTemplate,
  fetchEmailTemplates,
} from "./actions/email.actions";
import { Edit, Trash2 } from "lucide-react";

export interface EmailTemplate {
  id: string;
  nombre: string;
  asunto: string;
  contenido: string;
  variables: string[];
  descripcion?: string;
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editTemplate, setEditTemplate] = useState<EmailTemplate | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [templateToDelete, setTemplateToDelete] =
    useState<EmailTemplate | null>(null);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await fetchEmailTemplates();
      console.log("Templates fetched:", response);
      setTemplates(response);
    } catch (e) {
      console.error("Error fetching templates:", e);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleCreate = () => {
    setEditTemplate(null);
    setShowModal(true);
  };

  const handleEdit = (template: EmailTemplate) => {
    setEditTemplate(template);
    setShowModal(true);
  };

  const handleDelete = (template: EmailTemplate) => {
    setTemplateToDelete(template);
    setShowDeleteModal(true);
  };

  const handleModalClose = (refresh = false) => {
    setShowModal(false);
    setEditTemplate(null);
    if (refresh) fetchTemplates();
  };

  const handleDeleteConfirm = async () => {
    if (!templateToDelete) return;
    await deleteEmailTemplate(templateToDelete.id);
    setShowDeleteModal(false);
    setTemplateToDelete(null);
    fetchTemplates();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-2 sm:px-4">
      {/* DESKTOP TABLE */}
      <div
        className="hidden md:flex bg-white rounded-lg shadow-lg w-full max-w-4xl mx-auto flex-col"
        style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
      >
        <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-700">
            Email Templates
          </h1>
          <button
            className="w-full sm:w-auto bg-[#0097B2] text-white px-4 py-2 rounded hover:bg-[#007a8f] transition-colors shadow-md"
            onClick={handleCreate}
          >
            Create Template
          </button>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="min-w-[500px] w-full border-collapse">
            <thead className="sticky top-0 bg-white z-20 shadow-sm">
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-medium text-gray-700">
                  Title
                </th>
                <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-medium text-gray-700">
                  Description
                </th>
                <th className="text-center py-2 px-2 sm:py-3 sm:px-4 font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : templates.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-gray-500">
                    No templates found.
                  </td>
                </tr>
              ) : (
                templates.map((tpl) => (
                  <tr
                    key={tpl.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-2 sm:px-4 text-gray-700 max-w-[120px] sm:max-w-[200px] truncate align-middle">
                      {tpl.nombre}
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-gray-700 max-w-[140px] sm:max-w-[300px] truncate align-middle">
                      {tpl.descripcion}
                    </td>
                    <td className="py-3 px-2 sm:px-4 align-middle">
                      <div className="flex justify-center space-x-2">
                        <button
                          className="p-1 text-[#0097B2] rounded hover:bg-[#0097B2]/10 cursor-pointer"
                          title="Edit"
                          onClick={() => handleEdit(tpl)}
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          className="p-1 text-red-500 rounded hover:bg-red-50 cursor-pointer"
                          title="Delete"
                          onClick={() => handleDelete(tpl)}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* MOBILE LIST */}
      <div
        className="md:hidden bg-white rounded-lg shadow-lg w-full min-w-96 mx-auto flex flex-col"
        style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
      >
        <div className="p-4 border-b border-gray-200 flex flex-col gap-2">
          <h1 className="text-lg font-bold text-gray-700">Email Templates</h1>
          <button
            className="w-full bg-[#0097B2] text-white px-4 py-2 rounded hover:bg-[#007a8f] transition-colors shadow-md"
            onClick={handleCreate}
          >
            Create Template
          </button>
        </div>
        <div className="flex-1 overflow-y-auto rounded-b-lg">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : templates.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No templates found.
            </div>
          ) : (
            <div className="flex flex-col gap-4 p-4">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="w-full bg-white rounded-xl shadow border border-gray-200 px-4 py-3 flex flex-col gap-2"
                >
                  <div className="font-semibold text-gray-800 text-base mb-1 truncate">
                    {tpl.nombre}
                  </div>
                  <div className="text-gray-600 text-sm mb-2 truncate">
                    {tpl.descripcion}
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-[#0097B2] text-[#0097B2] bg-[#F0FBFD] hover:bg-[#e0f6fa] transition-colors"
                      title="Edit"
                      onClick={() => handleEdit(tpl)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 3.487a2.1 2.1 0 1 1 2.97 2.97L7.5 18.79l-4 1 1-4 14.362-14.303z"
                        />
                      </svg>
                      <span className="text-sm font-medium">Edit</span>
                    </button>
                    <button
                      className={`flex items-center justify-between text-white px-3 py-2 rounded-md transition-colors bg-red-500`}
                      title="Delete"
                      onClick={() => handleDelete(tpl)}
                    >
                      <Trash2 size={18} className="text-white mr-2" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* MODALS */}
      {showModal && (
        <EmailTemplateModal
          open={showModal}
          onClose={handleModalClose}
          template={editTemplate}
        />
      )}
      {showDeleteModal && (
        <ConfirmDeleteModal
          open={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
          template={templateToDelete}
        />
      )}
    </div>
  );
}
