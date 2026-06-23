"use client";

import { useEffect, useState } from "react";
import { useNotificationStore } from "@/store/notifications.store";
import AdminHubDrawerFooter from "../../components/AdminHubDrawerFooter";
import AdminHubDrawerProgress from "../../components/AdminHubDrawerProgress";
import AdminHubSideDrawer from "../../components/AdminHubSideDrawer";
import AdminHubTypeSelectStep from "../../components/AdminHubTypeSelectStep";
import {
  CONTRACT_CREATION_TOTAL_STEPS,
  CONTRACT_STEP_META,
  CONTRACT_TYPE_LABELS,
  CONTRACT_TYPE_OPTIONS,
  emptyCreateContractForm,
  isGeneralInfoComplete,
  isResidenceComplete,
  type ContractCreationStep,
  type ContractCreationType,
  type CreateContractFormData,
} from "../data/contract-creation-types";
import CreateContractGeneralInfoForm from "./CreateContractGeneralInfoForm";
import CreateContractResidenceForm from "./CreateContractResidenceForm";

interface CreateContractDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateContractDrawer({ open, onClose }: CreateContractDrawerProps) {
  const { addNotification } = useNotificationStore();
  const [step, setStep] = useState<ContractCreationStep>("select-type");
  const [selectedType, setSelectedType] = useState<ContractCreationType | null>(null);
  const [formData, setFormData] = useState<CreateContractFormData>(emptyCreateContractForm);

  useEffect(() => {
    if (!open) {
      setStep("select-type");
      setSelectedType(null);
      setFormData(emptyCreateContractForm());
    }
  }, [open]);

  const stepMeta = CONTRACT_STEP_META[step];
  const canGoNext =
    step === "select-type"
      ? selectedType !== null
      : step === "general-info"
        ? isGeneralInfoComplete(formData)
        : isResidenceComplete(formData);

  const cancelActive =
    step === "select-type" ? selectedType !== null : canGoNext;

  const showTypeSubtitle = step !== "select-type" && selectedType !== null;

  function handleSecondaryAction() {
    if (step === "select-type") {
      onClose();
      return;
    }

    if (step === "general-info") {
      setStep("select-type");
      return;
    }

    if (step === "residence") {
      setStep("general-info");
    }
  }

  function handleNext() {
    if (step === "select-type" && selectedType) {
      setFormData(emptyCreateContractForm());
      setStep("general-info");
      return;
    }

    if (step === "general-info" && isGeneralInfoComplete(formData)) {
      setStep("residence");
      return;
    }

    if (step === "residence" && isResidenceComplete(formData)) {
      addNotification("Los siguientes pasos estarán disponibles próximamente.", "info");
    }
  }

  return (
    <AdminHubSideDrawer
      open={open}
      onClose={onClose}
      title="Crear contrato"
      subtitle={showTypeSubtitle ? CONTRACT_TYPE_LABELS[selectedType!] : undefined}
      titleId="create-contract-title"
      headerExtra={
        <div className="mt-4">
          <AdminHubDrawerProgress
            currentStep={stepMeta.stepNumber}
            totalSteps={CONTRACT_CREATION_TOTAL_STEPS}
            stepLabel={stepMeta.label}
          />
        </div>
      }
      footer={
        <AdminHubDrawerFooter
          onCancel={handleSecondaryAction}
          cancelLabel={step === "select-type" ? "Cancelar" : "Atrás"}
          cancelVariant={step === "select-type" ? "cancel" : "back"}
          cancelActive={cancelActive}
          primaryLabel="Siguiente"
          onPrimary={handleNext}
          primaryDisabled={!canGoNext}
        />
      }
    >
      {step === "select-type" && (
        <AdminHubTypeSelectStep
          title="Seleccionar tipo de contrato"
          options={CONTRACT_TYPE_OPTIONS}
          selectedId={selectedType}
          onSelect={setSelectedType}
        />
      )}

      {step === "general-info" && (
        <CreateContractGeneralInfoForm formData={formData} onChange={setFormData} />
      )}

      {step === "residence" && (
        <CreateContractResidenceForm formData={formData} onChange={setFormData} />
      )}
    </AdminHubSideDrawer>
  );
}
