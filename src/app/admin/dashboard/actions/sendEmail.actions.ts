"use server";

import nodemailer from "nodemailer";
import { InterviewInvitationEmail } from "../emails/InterviewInvitation";
import { PreliminaryInterviewInvitation } from "../emails/PreliminaryInterviewInvitation";
import { RejectPositionEmail } from "../emails/RejectPosition";
import { render } from "@react-email/render";
import { ContractJob } from "../emails/ContratJob";
import { AdvanceNextStep } from "../emails/AdvanceNextStep";
import { AssignJobNotification } from "../emails/AssignJobNotification";
import { BlacklistNotificationEmail } from "../emails/BlacklistNotification";
import { AccessRestoredNotificationEmail } from "../emails/AccessRestoredNotification";
import { RemovalNotificationEmail } from "../emails/RemovalNotification";
import { CompanyWelcomeEmail } from "../emails/CompanyWelcomeEmail";
import { EmployeeWelcomeEmail } from "../emails/EmployeeWelcomeEmail";
import { ContractSentEmail } from "../emails/ContractSentEmail";

// Crear transportador de nodemailer con autenticación básica
const createTransporter = async () => {
  console.log("🔧 [createTransporter] Verificando variables de entorno...");

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error("❌ [createTransporter] Variables de entorno faltantes:", {
      EMAIL_USER: !!process.env.EMAIL_USER,
      EMAIL_PASSWORD: !!process.env.EMAIL_PASSWORD,
    });
    throw new Error("Faltan variables de entorno necesarias para el email");
  }

  console.log(
    "✅ [createTransporter] Variables de entorno encontradas, creando transportador..."
  );

  const transporter = nodemailer.createTransport({
    host: "teamandes-com.mail.protection.outlook.com",
    port: 25,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  } as nodemailer.TransportOptions);

  console.log("🔧 [createTransporter] Verificando conexión...");
  // Verificar la conexión antes de enviar
  await transporter.verify();

  console.log("✅ [createTransporter] Conexión verificada exitosamente");
  return transporter;
};

export const sendInterviewInvitation = async (
  candidateName: string,
  candidateEmail: string,
  jobTitle: string
) => {
  try {
    const emailHtml = await render(
      InterviewInvitationEmail({
        candidateName,
        jobTitle,
      })
    );

    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: "Andes Workforce <no-reply@teamandes.com>",
      to: [candidateEmail],
      subject: "Next Step in Your Application",
      html: emailHtml,
    });

    return {
      success: true,
      message: "Email sent successfully",
      data: info,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
};

export const sendPreliminaryInterviewInvitationEmail = async (
  candidateName: string,
  candidateEmail: string
) => {
  try {
    const emailHtml = await render(
      PreliminaryInterviewInvitation({
        candidateName,
      })
    );

    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: "Andes Workforce <no-reply@teamandes.com>",
      to: [candidateEmail],
      subject: "Andes Workforce | Schedule Your Preliminary Interview",
      html: emailHtml,
    });

    return {
      success: true,
      message: "Preliminary interview invitation sent successfully",
      data: info,
    };
  } catch (error) {
    console.error("Error sending preliminary interview email:", error);
    return { success: false, error };
  }
};

export const sendAdvanceNextStep = async (
  candidateName: string,
  candidateEmail: string
) => {
  try {
    // Stage 3: Schedule Second Interview
    const emailHtml = await render(
      AdvanceNextStep({
        candidateName,
      })
    );

    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: "Andes Workforce <no-reply@teamandes.com>",
      to: [candidateEmail],
      subject: "Congratulations! You've reached the final stage",
      html: emailHtml,
    });

    return {
      success: true,
      message: "Advance next step email sent successfully",
      data: info,
    };
  } catch (error) {
    console.error("Error sending advance next step email:", error);
    return { success: false, error };
  }
};

export const sendRejectionEmail = async (
  candidateName: string,
  candidateEmail: string
) => {
  try {
    // Stage 5: Reject Position Notification
    const emailHtml = await render(
      RejectPositionEmail({
        candidateName,
      })
    );

    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: "Andes Workforce <no-reply@teamandes.com>",
      to: [candidateEmail],
      subject: "Andes Workforce | Update on Your Application",
      html: emailHtml,
    });

    return {
      success: true,
      message: "Rejection email sent successfully",
      data: info,
    };
  } catch (error) {
    console.error("Error sending rejection email:", error);
    return { success: false, error };
  }
};

export const sendContractJobEmail = async (
  candidateName: string,
  candidateEmail: string,
  jobTitle: string
) => {
  console.log("🚀 [sendContractJobEmail] Iniciando envío de email:", {
    candidateName,
    candidateEmail,
    jobTitle,
  });

  try {
    console.log("📧 [sendContractJobEmail] Renderizando template de email...");
    // Stage 5: Contract Job Notification
    const emailHtml = await render(
      ContractJob({
        candidateName,
        jobTitle,
      })
    );

    console.log("📧 [sendContractJobEmail] Creando transportador...");
    const transporter = await createTransporter();

    console.log("📧 [sendContractJobEmail] Enviando email...");
    const info = await transporter.sendMail({
      from: "Andes Workforce <no-reply@teamandes.com>",
      to: [candidateEmail],
      subject: "Congratulations! You've reached the final stage",
      html: emailHtml,
    });

    console.log("✅ [sendContractJobEmail] Email enviado exitosamente:", info);

    return {
      success: true,
      message: "Contract job email sent successfully",
      data: info,
    };
  } catch (error) {
    console.error("💥 [sendContractJobEmail] Error enviando email:", error);
    return { success: false, error };
  }
};

export const sendAssignJobNotification = async (
  candidateName: string,
  candidateEmail: string,
  jobTitle: string
) => {
  try {
    const emailHtml = await render(
      AssignJobNotification({
        candidateName,
        jobTitle,
      })
    );

    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: "Andes Workforce <no-reply@teamandes.com>",
      to: [candidateEmail],
      subject: `Andes Workforce | Good News! You've Been Assigned to ${jobTitle}`,
      html: emailHtml,
    });

    return {
      success: true,
      message: "Assignment notification email sent successfully",
      data: info,
    };
  } catch (error) {
    console.error("Error sending assignment notification email:", error);
    return { success: false, error };
  }
};

export const sendBlacklistNotification = async (
  candidateName: string,
  candidateEmail: string
) => {
  console.log("🚀 [sendBlacklistNotification] Iniciando envío de email:", {
    candidateName,
    candidateEmail,
  });

  try {
    console.log("📧 [sendBlacklistNotification] Renderizando template...");
    const emailHtml = await render(
      BlacklistNotificationEmail({
        candidateName,
      })
    );

    console.log("🔧 [sendBlacklistNotification] Creando transportador...");
    const transporter = await createTransporter();

    console.log("📨 [sendBlacklistNotification] Enviando email...");
    const info = await transporter.sendMail({
      from: "Andes Workforce <no-reply@teamandes.com>",
      to: [candidateEmail],
      subject: "Access Restricted",
      html: emailHtml,
    });

    console.log(
      "✅ [sendBlacklistNotification] Email enviado exitosamente:",
      info
    );
    return {
      success: true,
      message: "Blacklist notification email sent successfully",
      data: info,
    };
  } catch (error) {
    console.error(
      "❌ [sendBlacklistNotification] Error sending blacklist notification email:",
      error
    );
    return { success: false, error };
  }
};

export const sendAccessRestoredNotification = async (
  candidateName: string,
  candidateEmail: string
) => {
  try {
    console.log(
      "🚀 [sendAccessRestoredNotification] Sending access restored notification:",
      {
        candidateName,
        candidateEmail,
      }
    );

    const emailHtml = await render(
      AccessRestoredNotificationEmail({
        candidateName,
      })
    );

    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: "Andes Workforce <no-reply@teamandes.com>",
      to: [candidateEmail],
      subject: "Access Restored – You're Welcome Back!",
      html: emailHtml,
    });

    console.log(
      "✅ [sendAccessRestoredNotification] Email sent successfully:",
      info
    );

    return {
      success: true,
      message: "Access restored notification email sent successfully",
      data: info,
    };
  } catch (error) {
    console.error(
      "❌ [sendAccessRestoredNotification] Error sending email:",
      error
    );
    return { success: false, error };
  }
};

export const sendRemovalNotification = async (
  candidateName: string,
  candidateEmail: string,
  offerName: string,
  reason?: string
) => {
  try {
    console.log("🚀 [sendRemovalNotification] Sending removal notification:", {
      candidateName,
      candidateEmail,
      offerName,
      reason,
    });

    // Stage 6: Removal Notification
    const emailHtml = await render(
      RemovalNotificationEmail({
        candidateName,
        offerName,
      })
    );

    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: "Andes Workforce <no-reply@teamandes.com>",
      to: [candidateEmail],
      subject: "Andes Workforce | Update on Your Application",
      html: emailHtml,
    });

    console.log("✅ [sendRemovalNotification] Email sent successfully:", info);

    return {
      success: true,
      message: "Removal notification email sent successfully",
      data: info,
    };
  } catch (error) {
    console.error("❌ [sendRemovalNotification] Error sending email:", error);
    return { success: false, error };
  }
};

export const sendCompanyWelcomeEmail = async (
  companyName: string,
  representativeName: string,
  email: string,
  temporaryPassword: string
) => {
  try {
    console.log("🚀 [sendCompanyWelcomeEmail] Sending welcome email:", {
      companyName,
      representativeName,
      email,
    });

    const emailHtml = await render(
      CompanyWelcomeEmail({
        companyName,
        representativeName,
        email,
        temporaryPassword,
      })
    );

    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: "Andes Workforce <no-reply@teamandes.com>",
      to: [email],
      subject: "Welcome to Andes Workforce - Company Account Created",
      html: emailHtml,
    });

    console.log("✅ [sendCompanyWelcomeEmail] Email sent successfully:", info);

    return {
      success: true,
      message: "Company welcome email sent successfully",
      data: info,
    };
  } catch (error) {
    console.error("❌ [sendCompanyWelcomeEmail] Error sending email:", error);
    return { success: false, error };
  }
};

export const sendEmployeeWelcomeEmail = async (
  employeeName: string,
  companyName: string,
  email: string,
  temporaryPassword: string,
  role: string = "Employee"
) => {
  try {
    console.log("🚀 [sendEmployeeWelcomeEmail] Sending welcome email:", {
      employeeName,
      companyName,
      email,
      role,
    });

    const emailHtml = await render(
      EmployeeWelcomeEmail({
        employeeName,
        companyName,
        email,
        temporaryPassword,
        role,
      })
    );

    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: "Andes Workforce <no-reply@teamandes.com>",
      to: [email],
      subject: "Welcome to Andes Workforce - Employee Account Created",
      html: emailHtml,
    });

    console.log("✅ [sendEmployeeWelcomeEmail] Email sent successfully:", info);

    return {
      success: true,
      message: "Employee welcome email sent successfully",
      data: info,
    };
  } catch (error) {
    console.error("❌ [sendEmployeeWelcomeEmail] Error sending email:", error);
    return { success: false, error };
  }
};

export const sendContractSentNotification = async (
  candidateName: string,
  candidateEmail: string
) => {
  try {
    console.log("📧 [sendContractSentNotification] Preparing email...");

    const emailHtml = await render(
      ContractSentEmail({
        candidateName,
      })
    );

    const transporter = await createTransporter();

    console.log("📧 [sendContractSentNotification] Sending email...");
    const info = await transporter.sendMail({
      from: "Andes Workforce <no-reply@teamandes.com>",
      to: [candidateEmail],
      subject: "You're Hired – Next Steps Inside!",
      html: emailHtml,
    });

    console.log(
      "✅ [sendContractSentNotification] Email sent successfully:",
      info
    );

    return {
      success: true,
      message: "Contract sent notification email sent successfully",
      data: info,
    };
  } catch (error) {
    console.error(
      "❌ [sendContractSentNotification] Error sending email:",
      error
    );
    return { success: false, error };
  }
};

// ========== CONTACT FORM FUNCTIONS ==========

export type ContactFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  smsConsent: boolean;
  service: "talent" | "job";
  message: string;
};

export const sendContactForm = async (data: ContactFormValues) => {
  try {
    console.log("📧 [sendContactForm] Preparing contact form email...");

    // Preparar contenido del correo
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Contact Message - Andes Workforce</h2>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 16px 0;">
          <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>SMS Consent:</strong> ${data.smsConsent ? "Yes" : "No"}</p>
          <p><strong>Service type:</strong> ${
            data.service === "talent"
              ? "Looking for talent"
              : "Service offering"
          }</p>
        </div>
        <div style="background-color: #fff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 16px 0;">
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${data.message}</p>
        </div>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="color: #64748b; font-size: 12px;">
          This message was sent from the Andes Workforce contact form.
        </p>
      </div>
    `;

    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: "Andes Workforce <no-reply@teamandes.com>",
      to: ["info@andes-workforce.com"],
      replyTo: data.email,
      subject: `New contact message - ${
        data.service === "talent" ? "Looking for talent" : "Service offering"
      }`,
      html: emailHtml,
    });

    console.log("✅ [sendContactForm] Email sent successfully:", info);

    return {
      success: true,
      message: "Thank you for your message! We will contact you soon.",
      data: info,
    };
  } catch (error) {
    console.error("❌ [sendContactForm] Error sending email:", error);
    return {
      success: false,
      error: "There was an error sending your message. Please try again.",
    };
  }
};

// ========== CONTRACT SIGNATURE FUNCTIONS ==========

export type ContractSignatureEmailData = {
  providerEmail: string;
  providerName: string;
  signatureUrl: string;
  contractId: string;
  isContractSigned: boolean;
};

export const sendContractSignatureEmail = async (
  data: ContractSignatureEmailData
) => {
  try {
    console.log("📧 [sendContractSignatureEmail] Preparing email...");

    // Validar que el contrato no esté firmado
    if (data.isContractSigned) {
      return {
        success: false,
        message: "Este contrato ya ha sido firmado y no se puede reenviar.",
      };
    }

    // Template del correo
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Contract Signature - Andes Workforce</h2>
        <p>Dear ${data.providerName},</p>
        <p>We are sending you this email to proceed with the contract signature to complete the hiring process.</p>
        <p>Please click on the link below to review and sign the contract:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.signatureUrl}" 
             style="background-color: #2563eb; 
                    color: white; 
                    padding: 12px 24px; 
                    text-decoration: none; 
                    border-radius: 6px;
                    display: inline-block;">
            Sign Contract
          </a>
        </div>
        <p style="color: #64748b; font-size: 14px;">
          If you have any questions or issues accessing the link, please contact us by replying to this email.
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="color: #64748b; font-size: 12px;">
          This is an automated email. Please do not reply directly to this address.
        </p>
      </div>
    `;

    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: "Andes Workforce <no-reply@teamandes.com>",
      to: [data.providerEmail],
      subject: "Contract Signature - Andes Workforce",
      html: emailHtml,
    });

    console.log(
      "✅ [sendContractSignatureEmail] Email sent successfully:",
      info
    );

    return {
      success: true,
      message: "The email with the signature link has been sent successfully.",
      data: info,
    };
  } catch (error) {
    console.error(
      "❌ [sendContractSignatureEmail] Error sending email:",
      error
    );
    return {
      success: false,
      error: "There was an error sending the email. Please try again.",
    };
  }
};

export const sendProviderContractEmail = async (contract: {
  id: string;
  nombreCompleto: string;
  signWellUrlProveedor?: string | null;
  fechaFirmaProveedor: Date | null;
  estadoContratacion: string;
  providerEmail?: string; // Agregamos el email del provider
}) => {
  try {
    console.log("📧 [sendProviderContractEmail] Iniciando envío de email...");
    console.log("📧 [sendProviderContractEmail] Datos del contrato:", {
      id: contract.id,
      nombreCompleto: contract.nombreCompleto,
      signWellUrlProveedor: contract.signWellUrlProveedor,
      fechaFirmaProveedor: contract.fechaFirmaProveedor,
      estadoContratacion: contract.estadoContratacion,
      providerEmail: contract.providerEmail,
    });

    // Determinar el enlace de firma correcto para el proveedor
    // PRIORIDAD: usar la URL pública de SignWell almacenada en la base de datos
    const providerSignUrl = contract.signWellUrlProveedor || null;

    if (!providerSignUrl) {
      console.error(
        "❌ [sendProviderContractEmail] Missing SignWell provider URL in contract"
      );
      return {
        success: false,
        message:
          "Contract does not have a provider SignWell URL. Cannot send signature email.",
      };
    }

    if (
      contract.fechaFirmaProveedor ||
      contract.estadoContratacion === "FIRMADO"
    ) {
      console.error(
        "❌ [sendProviderContractEmail] Contract has already been signed:",
        {
          fechaFirmaProveedor: contract.fechaFirmaProveedor,
          estadoContratacion: contract.estadoContratacion,
        }
      );
      return {
        success: false,
        message: "Contract has already been signed by the provider",
      };
    }

    console.log(
      "📧 [sendProviderContractEmail] Generando template del correo..."
    );

    // Template del correo (saludo genérico para el manager)
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Contract Signature - Andes Workforce</h2>
        <p>Dear Manager,</p>
        <p>We are sending you this email to proceed with the contract signature to complete the hiring process.</p>
        <p>Please click on the link below to review and sign the contract:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${providerSignUrl}" 
             style="background-color: #2563eb; 
                    color: white; 
                    padding: 12px 24px; 
                    text-decoration: none; 
                    border-radius: 6px;
                    display: inline-block;">
            Sign Contract
          </a>
        </div>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="color: #64748b; font-size: 12px;">
          This is an automated email. Please do not reply directly to this address.
        </p>
      </div>
    `;

    console.log("📧 [sendProviderContractEmail] Creando transportador...");
    const transporter = await createTransporter();

    // Lista de destinatarios: Miguel + respaldo a info
    const recipients = ["mrendon@teamandes.com", "info@andes-workforce.com"];

    // Si hay un email específico del provider (manager), agregarlo también
    if (contract.providerEmail) {
      recipients.push(contract.providerEmail);
    }

    console.log(
      "📧 [sendProviderContractEmail] Lista de destinatarios:",
      recipients
    );

    console.log("📧 [sendProviderContractEmail] Enviando email...");
    const info = await transporter.sendMail({
      from: "Andes Workforce <no-reply@teamandes.com>",
      to: recipients,
      subject: `Contract Signature - ${contract.nombreCompleto.toUpperCase()}`,
      html: emailHtml,
    });

    console.log("✅ [sendProviderContractEmail] Email sent successfully:", {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
      recipients: recipients,
      contractId: contract.id,
      nombreCompleto: contract.nombreCompleto,
    });

    return {
      success: true,
      message: `The email with the signature link has been sent successfully to ${
        recipients.length
      } recipients: ${recipients.join(", ")}.`,
      data: {
        ...info,
        recipients,
        contractId: contract.id,
      },
    };
  } catch (error) {
    console.error("❌ [sendProviderContractEmail] Error sending email:", error);
    console.error("❌ [sendProviderContractEmail] Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      contractId: contract.id,
      nombreCompleto: contract.nombreCompleto,
    });

    return {
      success: false,
      error: "There was an error sending the email. Please try again.",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// ========== WELCOME EMAIL FUNCTIONS ==========

export type WelcomeEmailData = {
  email: string;
  firstName: string;
  lastName: string;
  temporaryPassword: string;
};

export const sendWelcomeEmail = async (data: WelcomeEmailData) => {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://andesworkforce.com";
  try {
    console.log("📧 [sendWelcomeEmail] Preparing email...");

    // Template del correo
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to Andes Workforce!</h2>
        <p>Dear ${data.firstName} ${data.lastName},</p>
        <p>Welcome to Andes Workforce! Your account has been successfully created. For security reasons, we recommend that you change your password upon your first login.</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 24px 0;">
          <p style="margin: 0; font-weight: bold;">Your temporary login credentials:</p>
          <p style="margin: 8px 0;">Email: ${data.email}</p>
          <p style="margin: 8px 0;">Temporary Password: ${data.temporaryPassword}</p>
        </div>

        <p>To ensure the security of your account, please follow these steps:</p>
        <ol style="color: #475569; margin: 16px 0; padding-left: 24px;">
          <li>Visit <a href="${baseUrl}/auth/login" style="color: #2563eb;">our login page</a></li>
          <li>Sign in with your email and temporary password</li>
          <li>Go to "My Profile" section</li>
          <li>Click on "Change Password"</li>
          <li>Set your new secure password</li>
        </ol>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${baseUrl}/auth/login" 
             style="background-color: #2563eb; 
                    color: white; 
                    padding: 12px 24px; 
                    text-decoration: none; 
                    border-radius: 6px;
                    display: inline-block;">
            Login to Your Account
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="color: #64748b; font-size: 12px;">
          This is an automated email. Please do not reply directly to this address.
        </p>
      </div>
    `;

    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: "Andes Workforce <no-reply@teamandes.com>",
      to: [data.email],
      subject: "Welcome to Andes Workforce - Account Created",
      html: emailHtml,
    });

    console.log("✅ [sendWelcomeEmail] Email sent successfully:", info);

    return {
      success: true,
      message: "Welcome email sent successfully.",
      data: info,
    };
  } catch (error) {
    console.error("❌ [sendWelcomeEmail] Error sending email:", error);
    return {
      success: false,
      error: "There was an error sending the welcome email. Please try again.",
    };
  }
};
