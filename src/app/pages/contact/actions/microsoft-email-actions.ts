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
      from: "Andes Team Contact Form <info@teamandes.com>",
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
