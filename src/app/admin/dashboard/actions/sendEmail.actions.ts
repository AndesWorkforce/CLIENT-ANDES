"use server";

import nodemailer from "nodemailer";
import { InterviewInvitationEmail } from "../emails/InterviewInvitation";
import { RejectPositionEmail } from "../emails/RejectPosition";
import { render } from "@react-email/render";
import { ContractJob } from "../emails/ContratJob";
import { AdvanceNextStep } from "../emails/AdvanceNextStep";
import { AssignJobNotification } from "../emails/AssignJobNotification";
import { BlacklistNotificationEmail } from "../emails/BlacklistNotification";

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
  candidateEmail: string
) => {
  try {
    const bookingLink =
      "https://outlook.office.com/book/AndesWorkforceInterview@teamandes.com/?ismsaljsauthenabled";

    const emailHtml = await render(
      InterviewInvitationEmail({
        candidateName,
        bookingLink,
      })
    );

    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: "Andes Workforce <no-reply@teamandes.com>",
      to: [candidateEmail],
      subject: "Scheduling a Call to Discuss Opportunities at Andes Workforce",
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

export const sendAdvanceNextStep = async (
  candidateName: string,
  candidateEmail: string
) => {
  try {
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
    const emailHtml = await render(
      RejectPositionEmail({
        candidateName,
      })
    );

    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: "Andes Workforce <no-reply@teamandes.com>",
      to: [candidateEmail],
      subject: "Update on Your Application Status",
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
      subject: "You have been assigned to a new job opportunity",
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
  try {
    const emailHtml = await render(
      BlacklistNotificationEmail({
        candidateName,
      })
    );

    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: "Andes Workforce <no-reply@teamandes.com>",
      to: [candidateEmail],
      subject: "Access Restricted",
      html: emailHtml,
    });

    return {
      success: true,
      message: "Blacklist notification email sent successfully",
      data: info,
    };
  } catch (error) {
    console.error("Error sending blacklist notification email:", error);
    return { success: false, error };
  }
};
