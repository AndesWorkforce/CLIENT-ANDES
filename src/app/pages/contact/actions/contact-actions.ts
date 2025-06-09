"use server";

import { z } from "zod";
import { Resend } from "resend";

// Validation schema
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

// Nuevo schema para envío de correos con plantilla
const emailTemplateSchema = z.object({
  to: z.string().email("Invalid email"),
  subject: z.string().min(1, "Subject is required"),
  html: z.string().min(1, "HTML content is required"),
  replyTo: z.string().email("Invalid reply-to email").optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type EmailTemplateValues = z.infer<typeof emailTemplateSchema>;

export async function submitContactForm(data: ContactFormValues) {
  try {
    // Validate data
    const validatedData = contactFormSchema.parse(data);

    // Prepare email content
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

    return await sendEmail({
      to: "info@teamandes.com",
      subject: `New contact message - ${
        validatedData.service === "talent"
          ? "Looking for talent"
          : "Service offering"
      }`,
      html: emailHtml,
      replyTo: validatedData.email,
    });
  } catch (error) {
    console.error("[Email] Error sending form:", error);

    if (error instanceof Error) {
      console.error("[Email] Error details:", error.message);
      if (error.stack) {
        console.error("[Email] Error stack:", error.stack);
      }
    }

    return {
      success: false,
      message: "There was an error sending your message. Please try again.",
    };
  }
}

export async function sendEmail(data: EmailTemplateValues) {
  try {
    // Validate email data
    const validatedData = emailTemplateSchema.parse(data);

    const resend = new Resend(process.env.SECRET_KEY_RESEND);

    if (!process.env.SECRET_KEY_RESEND) {
      throw new Error("SECRET_KEY_RESEND not found in environment variables");
    }

    const { error } = await resend.emails.send({
      from: "Andes Workforce <no-reply@teamandes.com>",
      to: [validatedData.to],
      replyTo: validatedData.replyTo,
      subject: validatedData.subject,
      html: validatedData.html,
    });

    if (error) {
      console.error("[Email] Resend API error:", error);
      throw new Error(`Resend API error: ${error.message}`);
    }

    return {
      success: true,
      message: "Email sent successfully!",
    };
  } catch (error) {
    console.error("[Email] Error sending email:", error);
    return {
      success: false,
      message: "There was an error sending the email. Please try again.",
    };
  }
}
