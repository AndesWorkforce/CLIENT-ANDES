export type GuideContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "ordered-list"; items: string[] }
  | { type: "unordered-list"; items: string[] }
  | { type: "note"; text: string };

export type GuideStep = {
  id: string;
  title: string;
  content: GuideContentBlock[];
};

export const GUIDE_WELCOME =
  "Welcome to Andes Workforce! 🎉 Once your contract has been signed, please follow the steps below to ensure everything is properly set up for payments and additional benefits.";

export const GUIDE_STEPS: GuideStep[] = [
  {
    id: "bank-information",
    title: "Verify your bank information",
    content: [
      {
        type: "paragraph",
        text: "It is very important that your bank details are correct to avoid payment delays.",
      },
      { type: "heading", text: "How to update:" },
      {
        type: "ordered-list",
        items: [
          "Click on your name (top right corner).",
          "Go to My Profile.",
          "Scroll to Bank Information.",
          "Click Edit.",
          "Update your information and save changes.",
        ],
      },
      { type: "heading", text: "Make sure:" },
      {
        type: "unordered-list",
        items: [
          "Account holder name matches your contract.",
          "Account number is correct.",
          "Bank name and country are accurate.",
          "If using DollarApp or another digital wallet, verify your ID details.",
        ],
      },
    ],
  },
  {
    id: "signed-contract",
    title: "Review your signed contract",
    content: [
      {
        type: "paragraph",
        text: "You can access your signed contract at any time.",
      },
      { type: "heading", text: "How to view/download:" },
      {
        type: "ordered-list",
        items: [
          "Click on your name.",
          "Go to Current Contract.",
          "Under Documentation, click Download next to Active Contract.",
        ],
      },
      {
        type: "note",
        text: "We recommend saving a copy for your records.",
      },
    ],
  },
  {
    id: "bonuses-incentives",
    title: "Review your bonuses & incentives",
    content: [
      {
        type: "paragraph",
        text: "Andes Workforce offers different types of bonuses depending on performance and eligibility.",
      },
      { type: "heading", text: "How to check:" },
      {
        type: "ordered-list",
        items: [
          "Click on your name.",
          "Go to Additional Incentives.",
          "There you will find:",
        ],
      },
      {
        type: "unordered-list",
        items: [
          "Referral Bonus",
          "Individual Performance Bonus",
          "Discretionary Bonus",
          "Seniority Bonus",
          "Recognition Bonus",
          "Non-Monetary Benefits",
        ],
      },
      {
        type: "note",
        text: "Important: Some bonuses depend on company performance, length of service, or specific goals.",
      },
    ],
  },
  {
    id: "monthly-proofs",
    title: "Upload monthly proofs",
    content: [
      {
        type: "paragraph",
        text: "To process payments, some contractors must upload monthly proofs.",
      },
      { type: "heading", text: "Who needs to upload planillas?" },
      {
        type: "unordered-list",
        items: [
          "Contractors who are residents of Colombia",
          "Contractors residing outside Colombia do NOT need to upload planillas.",
        ],
      },
      { type: "heading", text: "How to upload:" },
      {
        type: "ordered-list",
        items: [
          "Go to Current Contract.",
          "Scroll to Documents → Proofs.",
          "Select the month.",
          "Upload your file (PDF or image, up to 5MB).",
          "Click Upload Proof.",
        ],
      },
      {
        type: "note",
        text: "Once uploaded, the status will appear as Pending until reviewed.",
      },
    ],
  },
  {
    id: "monthly-invoice",
    title: "Generate your monthly invoice",
    content: [
      {
        type: "paragraph",
        text: "All contractors must generate their monthly invoice.",
      },
      { type: "heading", text: "How to generate:" },
      {
        type: "ordered-list",
        items: [
          "Go to Current Contract.",
          "Click on the Invoices tab.",
          "Select the month and year.",
          "Click Generate Invoice.",
        ],
      },
      { type: "heading", text: "After generating:" },
      {
        type: "unordered-list",
        items: [
          "You can click View to preview it.",
          "Click Download to save the PDF.",
        ],
      },
      {
        type: "note",
        text: "You can generate invoices for any past month of the current year.",
      },
    ],
  },
];

export const PAYMENT_CHECKLIST = [
  "Bank information updated",
  "Invoice generated",
  "Planilla uploaded (Colombia residents only)",
];

export const GUIDE_SUPPORT = {
  eyebrow: "Support",
  title: "Need Help?",
  description:
    "If you experience issues updating your information or uploading documents, our support team is ready to assist you.",
  ctaLabel: "Contact Support",
};
