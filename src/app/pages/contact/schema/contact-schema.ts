import { z } from "zod";

export const contactFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" })
    .max(50, { message: "First name cannot exceed 50 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .max(50, { message: "Last name cannot exceed 50 characters" }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address" }),
  phone: z
    .string()
    .regex(/^[+]?[\d\s()-]+$/, {
      message: "Phone number can only contain digits, spaces, and +()-",
    })
    .default(""),
  smsConsent: z.boolean().default(false),
  service: z.enum(["talent", "job"], {
    required_error: "Please select a service",
  }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(500, { message: "Message cannot exceed 500 characters" }),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
