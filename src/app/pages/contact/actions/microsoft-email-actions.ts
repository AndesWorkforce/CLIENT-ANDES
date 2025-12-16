"use server";

import nodemailer from "nodemailer";
import { z } from "zod";

// Reutilizamos el mismo schema de validación
const contactFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^[+]?[\d\s()-]+$/, {
    message: "Phone number can only contain digits, spaces, and +()-",
  }),
  smsConsent: z.boolean(),
  service: z.enum(["talent", "job"]),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export async function submitContactFormMicrosoft(data: ContactFormValues) {
  try {
    // Validar datos
    const validatedData = contactFormSchema.parse(data);

    // Verificar variables de entorno
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error("Missing required environment variables for email");
    }

    // Crear transportador de nodemailer con autenticación básica (usuario y contraseña)
    const transporter = nodemailer.createTransport({
      host: "teamandes-com.mail.protection.outlook.com",
      port: 25,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    } as nodemailer.TransportOptions);

    // Verificar la conexión antes de enviar
    await transporter.verify();

    // Preparar contenido del correo
    const emailHtml = `
      <h2>New contact message</h2>
      <p><strong>Name:</strong> ${validatedData.firstName} ${
      validatedData.lastName
    }</p>
      <p><strong>Email:</strong> ${validatedData.email}</p>
      <p><strong>Phone:</strong> ${validatedData.phone}</p>
      <p><strong>SMS Consent:</strong> ${
        validatedData.smsConsent ? "Yes" : "No"
      }</p>
      <p><strong>Service type:</strong> ${
        validatedData.service === "talent"
          ? "Looking for talent"
          : "Service offering"
      }</p>
      <p><strong>Message:</strong></p>
      <p>${validatedData.message}</p>
    `;

    // Enviar correo
    await transporter.sendMail({
      from: "Andes Workforce <no-reply@teamandes.com>",
      to: "info@andes-workforce.com",
      replyTo: validatedData.email,
      subject: `New contact message - ${
        validatedData.service === "talent"
          ? "Looking for talent"
          : "Service offering"
      }`,
      html: emailHtml,
    });

    return {
      success: true,
      message: "Thank you for your message! We will contact you soon.",
    };
  } catch (error) {
    console.error("[Microsoft Email] Error sending form:", error);

    if (error instanceof Error) {
      console.error("[Microsoft Email] Error details:", error.message);
      if (error.stack) {
        console.error("[Microsoft Email] Error stack:", error.stack);
      }
    }

    return {
      success: false,
      message: "There was an error sending your message. Please try again.",
    };
  }
}

// Tipo para los datos del correo de firma de contrato
export type ContractSignatureEmailData = {
  providerEmail: string;
  providerName: string;
  signatureUrl: string;
  contractId: string;
  isContractSigned: boolean;
};

export async function sendContractSignatureEmail(
  data: ContractSignatureEmailData
) {
  try {
    // Validar que el contrato no esté firmado
    if (data.isContractSigned) {
      return {
        success: false,
        message: "Este contrato ya ha sido firmado y no se puede reenviar.",
      };
    }

    // Verificar variables de entorno
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error("Missing required environment variables for email");
    }

    // Crear transportador de nodemailer
    const transporter = nodemailer.createTransport({
      host: "teamandes-com.mail.protection.outlook.com",
      port: 25,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    } as nodemailer.TransportOptions);

    // Verificar la conexión
    await transporter.verify();

    // Template del correo
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Contract Signature - Andes Workforce</h2>
        <p>Dear Miguel Rendon,</p>
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

    // Enviar correo
    await transporter.sendMail({
      from: "Andes Workforce <no-reply@teamandes.com>",
      to: "mrendon@teamandes.com",
      subject: "Contract Signature - Andes Workforce",
      html: emailHtml,
    });

    return {
      success: true,
      message: "The email with the signature link has been sent successfully.",
    };
  } catch (error) {
    console.error("[Contract Signature Email] Error sending email:", error);

    if (error instanceof Error) {
      console.error("[Contract Signature Email] Error details:", error.message);
      if (error.stack) {
        console.error("[Contract Signature Email] Error stack:", error.stack);
      }
    }

    return {
      success: false,
      message: "There was an error sending the email. Please try again.",
    };
  }
}

export async function sendProviderContractEmail(contract: {
  id: string;
  nombreCompleto: string;
  signWellUrlProveedor: string | null;
  fechaFirmaProveedor: Date | null;
  estadoContratacion: string;
}) {
  try {
    // Validar que el contrato tenga URL de firma y no esté firmado
    if (!contract.signWellUrlProveedor) {
      return {
        success: false,
        message: "Contract does not have a provider signature URL",
      };
    }

    if (
      contract.fechaFirmaProveedor ||
      contract.estadoContratacion === "FIRMADO"
    ) {
      return {
        success: false,
        message: "Contract has already been signed by the provider",
      };
    }

    // Verificar variables de entorno
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error("Missing required environment variables for email");
    }

    // Crear transportador de nodemailer
    const transporter = nodemailer.createTransport({
      host: "teamandes-com.mail.protection.outlook.com",
      port: 25,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    } as nodemailer.TransportOptions);

    // Verificar la conexión
    await transporter.verify();

    // Template del correo
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Contract Signature - Andes Workforce</h2>
        <p>Dear ${contract.nombreCompleto},</p>
        <p>We are sending you this email to proceed with the contract signature to complete the hiring process.</p>
        <p>Please click on the link below to review and sign the contract:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${contract.signWellUrlProveedor}" 
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

    // Enviar correo
    await transporter.sendMail({
      from: "Andes Workforce <no-reply@teamandes.com>",
      to: "mrendon@teamandes.com",
      subject: "Contract Signature - Andes Workforce",
      html: emailHtml,
    });

    return {
      success: true,
      message: "The email with the signature link has been sent successfully.",
    };
  } catch (error) {
    console.error("[Contract Signature Email] Error sending email:", error);

    if (error instanceof Error) {
      console.error("[Contract Signature Email] Error details:", error.message);
      if (error.stack) {
        console.error("[Contract Signature Email] Error stack:", error.stack);
      }
    }

    return {
      success: false,
      message: "There was an error sending the email. Please try again.",
    };
  }
}

export type WelcomeEmailData = {
  email: string;
  firstName: string;
  lastName: string;
  temporaryPassword: string;
};

export async function sendWelcomeEmail(data: WelcomeEmailData) {
  try {
    // Verificar variables de entorno
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error("Missing required environment variables for email");
    }

    // Crear transportador de nodemailer
    const transporter = nodemailer.createTransport({
      host: "teamandes-com.mail.protection.outlook.com",
      port: 25,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    } as nodemailer.TransportOptions);

    // Verificar la conexión
    await transporter.verify();
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://andesworkforce.com";

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

        <p style="color: #64748b; font-size: 14px;">
          If you have any questions or need assistance, please don't hesitate to contact our support team.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="color: #64748b; font-size: 12px;">
          This is an automated email. Please do not reply directly to this address.
        </p>
      </div>
    `;

    // Enviar correo
    await transporter.sendMail({
      from: "Andes Team <no-reply@teamandes.com>",
      to: data.email,
      subject: "Welcome to Andes Workforce - Account Created",
      html: emailHtml,
    });

    return {
      success: true,
      message: "Welcome email sent successfully.",
    };
  } catch (error) {
    console.error("[Welcome Email] Error sending email:", error);

    if (error instanceof Error) {
      console.error("[Welcome Email] Error details:", error.message);
      if (error.stack) {
        console.error("[Welcome Email] Error stack:", error.stack);
      }
    }

    return {
      success: false,
      message:
        "There was an error sending the welcome email. Please try again.",
    };
  }
}
