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
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z
    .string()
    .min(1, { message: "Phone number is required" })
    .regex(/^\+?[\d\s-()]+$/, { message: "Please enter a valid phone number" }),
  companyName: z
    .string()
    .min(2, { message: "Company name must be at least 2 characters" })
    .max(100, { message: "Company name cannot exceed 100 characters" }),
  supportTypes: z
    .array(z.string())
    .min(1, { message: "Please select at least one support type" }),
  teamSize: z.enum(["1", "2-5", "6-10", "+10"], {
    required_error: "Please select team size",
  }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(500, { message: "Message cannot exceed 500 characters" }),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
