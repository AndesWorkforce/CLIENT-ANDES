"use server";

import nodemailer from "nodemailer";
import { ConfidentialClientApplication } from "@azure/msal-node";
import { z } from "zod";

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

export type ContactFormValues = z.infer<typeof contactFormSchema>;

// Configure OAuth2 client for Office 365
const getAccessToken = async () => {
  try {
    const msalConfig = {
      auth: {
        clientId: process.env.OFFICE365MAIL_CLIENT_ID || "",
        clientSecret: process.env.OFFICE365MAIL_CLIENT_SECRET || "",
        authority: `https://login.microsoftonline.com/${process.env.OFFICE365MAIL_TENANT}/`,
      }
    };

    const tokenRequest = {
      scopes: ["https://outlook.office.com/.default"],
    };

    const cca = new ConfidentialClientApplication(msalConfig);
    const result = await cca.acquireTokenByClientCredential(tokenRequest);
    
    return result?.accessToken;
  } catch (error) {
    console.error("Error getting token:", error);
    throw error;
  }
};

export async function submitContactForm(data: ContactFormValues) {
  try {
    // Validate data
    const validatedData = contactFormSchema.parse(data);
    console.log("[Email] Data validated successfully:", JSON.stringify(validatedData));

    // Get access token for Office 365
    console.log("[Email] Getting access token for Office 365...");
    const accessToken = await getAccessToken();
    console.log("[Email] Access token obtained successfully");

    if (!accessToken) {
      throw new Error("Could not obtain access token for Office 365");
    }

    // Configure mail transporter using OAuth2
    console.log("[Email] Configuring mail transporter...");
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        type: "OAuth2",
        user: process.env.MAIL_FROM_ADDRESS || "mrendon@teamandes.com",
        accessToken,
      },
    });

    // Create email content
    const mailOptions = {
      from: process.env.MAIL_FROM_ADDRESS || "mrendon@teamandes.com",
      to: "info@andes-workforce.com", // Main recipient
      replyTo: validatedData.email, // So they can reply directly to the applicant
      subject: `New contact message - ${validatedData.service === "talent" ? "Looking for talent" : "Service offering"}`,
      html: `
        <h2>New contact message</h2>
        <p><strong>Name:</strong> ${validatedData.firstName} ${validatedData.lastName}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Phone:</strong> ${validatedData.phone}</p>
        <p><strong>SMS Consent:</strong> ${validatedData.smsConsent ? "Yes" : "No"}</p>
        <p><strong>Service type:</strong> ${validatedData.service === "talent" ? "Looking for talent" : "Service offering"}</p>
        <p><strong>Message:</strong></p>
        <p>${validatedData.message}</p>
      `,
    };

    console.log("[Email] Trying to send email to:", mailOptions.to);
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("[Email] Email sent successfully:", JSON.stringify({
      messageId: info.messageId,
      response: info.response,
      envelope: info.envelope
    }));

    return {
      success: true,
      message: "Thank you for your message! We will contact you soon.",
    };
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
