"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNotificationStore } from "@/store/notifications.store";
import { createCompany, updateCompany } from "../actions/company.actions";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface FormData {
  name: string;
  description: string;
  email: string;
  password?: string;
  representativeName: string;
  representativeLastName: string;
}

interface Props {
  initialData?: FormData;
  companyId?: string;
  onClose: () => void;
}

export default function CreateCompanyForm({
  initialData,
  companyId,
  onClose,
}: Props) {
  const { addNotification } = useNotificationStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: initialData || {
      name: "",
      description: "",
      email: "",
      password: "",
      representativeName: "",
      representativeLastName: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Transform data to match API expectations
      const apiData = {
        nombre: data.name,
        descripcion: data.description,
        correo: data.email,
        contrasena: data.password,
        nombreRepresentante: data.representativeName,
        apellidoRepresentante: data.representativeLastName,
      };

      const response = companyId
        ? await updateCompany(companyId, apiData)
        : await createCompany(apiData);

      if (response.success) {
        addNotification(response.message, "success");
        onClose();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error("Error:", error);
      addNotification(
        companyId ? "Error updating company" : "Error creating company",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-[#17323A]">
        {companyId ? "Edit Company" : "Create Company"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-[#17323A]"
          >
            Company Name
          </label>
          <input
            type="text"
            id="name"
            {...register("name", { required: "Company name is required" })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#0097B2] focus:outline-none focus:ring-1 focus:ring-[#0097B2]"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-[#17323A]"
          >
            Description
          </label>
          <textarea
            id="description"
            {...register("description")}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#0097B2] focus:outline-none focus:ring-1 focus:ring-[#0097B2]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="representativeName"
              className="block text-sm font-medium text-[#17323A]"
            >
              Representative Name
            </label>
            <input
              type="text"
              id="representativeName"
              {...register("representativeName", {
                required: "Representative name is required",
              })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#0097B2] focus:outline-none focus:ring-1 focus:ring-[#0097B2]"
            />
            {errors.representativeName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.representativeName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="representativeLastName"
              className="block text-sm font-medium text-[#17323A]"
            >
              Representative Last Name
            </label>
            <input
              type="text"
              id="representativeLastName"
              {...register("representativeLastName", {
                required: "Representative last name is required",
              })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#0097B2] focus:outline-none focus:ring-1 focus:ring-[#0097B2]"
            />
            {errors.representativeLastName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.representativeLastName.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#17323A]"
          >
            Representative Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#0097B2] focus:outline-none focus:ring-1 focus:ring-[#0097B2]"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {!companyId && (
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#17323A]"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#0097B2] focus:outline-none focus:ring-1 focus:ring-[#0097B2]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-[60%] transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOffIcon size={18} color="#0097B2" />
                ) : (
                  <EyeIcon size={18} color="#0097B2" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0097B2] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-[#0097B2] border border-transparent rounded-md hover:bg-[#007B8E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0097B2] disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "Saving..." : companyId ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
