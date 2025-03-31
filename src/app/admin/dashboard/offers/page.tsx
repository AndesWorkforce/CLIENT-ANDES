"use client";

import { useState } from "react";
import { createOffer } from "./actions/offers.actions";
import { useNotificationStore } from "@/store/notifications.store";
import { useRouter } from "next/navigation";
import QuillEditor from "../components/QuillEditor";

export default function OfferDetailPage() {
  const { addNotification } = useNotificationStore();
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [descriptionHTML, setDescriptionHTML] = useState<string>("");
  const [key, setKey] = useState<number>(0);

  const handleDescriptionChange = (content: string) => {
    setDescriptionHTML(content);
  };

  const isContentEmpty = (htmlContent: string) => {
    return !htmlContent || htmlContent === "" || htmlContent === "<p><br></p>";
  };

  const handlePublish = async () => {
    if (!title || isContentEmpty(descriptionHTML)) {
      addNotification("Debes completar el título y la descripción", "error");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", descriptionHTML);
    formData.append("estado", "publicado");

    const response = await createOffer(formData);
    if (response.success) {
      addNotification("Oferta publicada", "success");
      resetForm();
      router.refresh();
      router.push("/admin/dashboard/offers");
    } else {
      addNotification("Error al publicar oferta", "error");
    }
  };

  const handleSave = async () => {
    if (!title || isContentEmpty(descriptionHTML)) {
      addNotification("Debes completar el título y la descripción", "error");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", descriptionHTML);
    formData.append("estado", "borrador");

    const response = await createOffer(formData);
    if (response.success) {
      addNotification("Oferta guardada como borrador", "success");
      resetForm();
      router.refresh();
      router.push("/admin/dashboard/offers");
    } else {
      addNotification("Error al guardar cambios", "error");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescriptionHTML("");
    setKey((prev) => prev + 1);
  };

  const handleDiscard = () => {
    resetForm();
    addNotification("Cambios descartados", "info");
    router.push("/admin/dashboard/offers/list");
  };

  return (
    <div className="container mx-auto min-h-screen bg-white flex flex-col">
      <main className="flex-1 max-w-3xl mx-auto px-4 py-6 w-full">
        <div className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title of the offer
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Graphic design service"
              className="shadow-sm focus:ring-[#0097B2] focus:border-[#0097B2] block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description of the job
            </label>
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <QuillEditor
                key={key}
                value={descriptionHTML}
                onChange={handleDescriptionChange}
                placeholder="Describe the job..."
                editorId={`editor-${key}`}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-3 pt-4">
            <button
              onClick={handlePublish}
              className="w-full p-3 rounded-md bg-[#0097B2] text-white font-medium hover:bg-[#008aa2] transition-colors cursor-pointer"
            >
              Publish offer
            </button>
            <button
              onClick={handleSave}
              className="w-full p-3 rounded-md bg-[#E6F7FA] text-[#0097B2] font-medium hover:bg-[#d6f0f5] transition-colors cursor-pointer"
            >
              Save as draft
            </button>
            <button
              onClick={handleDiscard}
              className="w-full p-3 text-[#FF3B30] font-medium hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Discard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
