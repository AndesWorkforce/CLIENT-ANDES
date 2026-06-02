export type FaqAnswerBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "note"; text: string };

export type FaqItem = {
  id: string;
  question: string;
  answer: FaqAnswerBlock[];
};

export type FaqSection = {
  id: string;
  title: string;
  items: FaqItem[];
};

export const FAQ_SECTIONS: FaqSection[] = [
  {
    id: "access-platform",
    title: "Access to the Platform",
    items: [
      {
        id: "cant-log-in",
        question: "What do I do if I can't log in?",
        answer: [
          { type: "paragraph", text: "Verification: www.andesworkforce.com" },
          { type: "list", items: ["Enter your credentials", 'Use "Forgot Password"'] },
          {
            type: "paragraph",
            text: "If it keeps failing?\nContact Mateo Castro (Mcastro@teamandes.com) from IT.",
          },
        ],
      },
    ],
  },
  {
    id: "invoice-proof",
    title: "Invoice and Proof",
    items: [
      {
        id: "when-generate-invoice",
        question: "When should I generate my invoice?",
        answer: [
          {
            type: "paragraph",
            text: "Around the 20th of each month, before payroll closing.",
          },
        ],
      },
      {
        id: "invoice-late",
        question: "What happens if I don't do it in time?",
        answer: [
          { type: "paragraph", text: "This may result in payment delays." },
        ],
      },
      {
        id: "invoice-monthly",
        question: "Is it necessary to do it monthly?",
        answer: [
          { type: "paragraph", text: "Yes, it is a mandatory monthly requirement." },
        ],
      },
      {
        id: "upload-proof",
        question: "Should I upload proof?",
        answer: [
          {
            type: "paragraph",
            text: "This requirement applies only to contractors in Colombia.",
          },
        ],
      },
      {
        id: "edit-proof",
        question: "Can I edit the proof if I make a mistake?",
        answer: [
          {
            type: "paragraph",
            text: "Yes, you just need to select the month, edit the document, and save it.",
          },
        ],
      },
    ],
  },
  {
    id: "invoice-values",
    title: "Invoice values (we're working on it)",
    items: [
      {
        id: "invoice-value-mismatch",
        question: "Why doesn't the invoice value match my current compensation?",
        answer: [
          {
            type: "paragraph",
            text: "The value generated in the invoice corresponds to the initial contract, without considering variables (if applicable).",
          },
        ],
      },
      {
        id: "invoice-raise",
        question: "What if I had a raise?",
        answer: [
          {
            type: "paragraph",
            text: "It is not yet reflected on the platform (we are working on it).",
          },
        ],
      },
      {
        id: "correct-payment-value",
        question: "Where do I see the correct value of my payment?",
        answer: [
          {
            type: "paragraph",
            text: "In the paystub that you receive at the end of the month in your email.",
          },
        ],
      },
    ],
  },
  {
    id: "payments",
    title: "Payments",
    items: [
      {
        id: "when-payment",
        question: "When do I receive my payment?",
        answer: [
          {
            type: "paragraph",
            text: "Payment is made on the last business day of the month, as long as you have submitted the invoice and proof (if applicable).",
          },
        ],
      },
      {
        id: "late-invoice-payment",
        question: "What happens if I generate the invoice and/or proof late?",
        answer: [
          {
            type: "paragraph",
            text: "Sending the invoice and/or proof late may result in a delay in your payment.",
          },
        ],
      },
      {
        id: "withhold-payments",
        question: "Can they withhold payments?",
        answer: [
          {
            type: "paragraph",
            text: "Yes, in the event of repeated breaches.",
          },
        ],
      },
    ],
  },
  {
    id: "overtime",
    title: "Overtime (OT)",
    items: [
      {
        id: "ot-deadline",
        question: "By when can I report them?",
        answer: [
          { type: "paragraph", text: "Until the 20th of each month." },
        ],
      },
      {
        id: "ot-late",
        question: "What happens if I send them late?",
        answer: [
          {
            type: "paragraph",
            text: "If you send them late, they won't be included in the current payment cycle and will be processed in the following month.",
          },
        ],
      },
    ],
  },
  {
    id: "holidays",
    title: "Holidays",
    items: [
      {
        id: "country-holidays",
        question: "Are public holidays in my country paid?",
        answer: [
          {
            type: "paragraph",
            text: 'It depends on the specifications of your contract. If you work on an official holiday in your country, you will be paid according to local law. See "Additional Incentives & Holidays" in your profile for more details.',
          },
        ],
      },
      {
        id: "us-holidays",
        question: "Are US holidays paid?",
        answer: [
          {
            type: "paragraph",
            text: "If you work on an official holiday in the USA, you will be paid at the regular rate.",
          },
        ],
      },
      {
        id: "work-anywhere",
        question: "Can I work from anywhere in the world?",
        answer: [
          {
            type: "paragraph",
            text: "Almost anywhere except from the United States. And you must inform IT rromero@teamandes.com and administration vquintero@teamandes.com by mail to enable access.",
          },
        ],
      },
    ],
  },
  {
    id: "days-off",
    title: "Days Off",
    items: [
      {
        id: "request-days-off",
        question: "How do I request days off?",
        answer: [
          {
            type: "paragraph",
            text: "For most contractors, you must send written notice to the team leader and/or Human Resources. (Note: If you are a WHG member read the information in the next question).",
          },
          {
            type: "paragraph",
            text: "Include in copy the email to: vquintero@teamandes.com and/or mvargas@teamandes.com.",
          },
        ],
      },
      {
        id: "whg-days-off",
        question: "How do I apply for days off if I belong to WHG?",
        answer: [
          {
            type: "paragraph",
            text: "Send email with the requested dates and include the following recipients:",
          },
          {
            type: "list",
            items: [
              "Team Leader, Karen Meadows – KMeadows@wernerhoffman.com",
              "Laura Chica – LChica@wernerhoffman.com",
            ],
          },
        ],
      },
      {
        id: "advance-notice",
        question: "How far in advance should I request days off?",
        answer: [
          { type: "paragraph", text: "Minimum 1 week before." },
        ],
      },
      {
        id: "emergency-days-off",
        question: "What if it's an emergency?",
        answer: [
          {
            type: "paragraph",
            text: "You must report it immediately to any of our communication channels.",
          },
          {
            type: "note",
            text: "Remember that you have 12 days off 2026, they are deducted in the month you take them, and 6 days are reimbursed in June and 6 in December. If you take all 12 days before December 31, 2026, you will receive an additional 3 paid days in December, for a total of 9 days that month.",
          },
        ],
      },
    ],
  },
  {
    id: "pto",
    title: "PTO (contractors linked before October 1, 2025)",
    items: [
      {
        id: "pto-until-when",
        question: "Until when can I use PTO 2025?",
        answer: [
          { type: "list", items: ["If you have less than 10 days: until June 30, 2026", "If you have 10 days or more: until December 31, 2026"] },
        ],
      },
      {
        id: "pto-not-used",
        question: "What happens if I don't use it?",
        answer: [
          {
            type: "paragraph",
            text: "If you don't use it, the time you have accumulated is lost.",
          },
        ],
      },
      {
        id: "pto-remaining",
        question: "How do I know how many days of PTO 2025 I have left?",
        answer: [
          {
            type: "paragraph",
            text: "Send an email to the administration team (VQuintero@teamandes.com and/or AVargas@teamandes.com).",
          },
        ],
      },
    ],
  },
  {
    id: "referrals",
    title: "Referred",
    items: [
      {
        id: "referral-minimum-time",
        question: "How long do I need to be employed before I can refer someone?",
        answer: [
          {
            type: "paragraph",
            text: "There is no minimum time, from the day you enter you can submit referrals.",
          },
        ],
      },
      {
        id: "how-to-refer",
        question: "How do I refer someone?",
        answer: [
          {
            type: "paragraph",
            text: "Ask the person you want to refer to follow the steps below:",
          },
          {
            type: "list",
            items: [
              "Create your profile on Andes and fill in all the information (including video)",
              "Then send an email to the HR department Laura Chica (LChica@teamandes.com) and Daniela Ramírez (DRamirez@teamandes.com) indicating that they are your referral.",
            ],
          },
        ],
      },
      {
        id: "referral-next",
        question: "What happens next?",
        answer: [
          {
            type: "paragraph",
            text: "If you are selected for the next stage, you must complete the assessment. Only those who pass it will go to the interview with Andes. Candidates will receive all the information about the process by email.",
          },
        ],
      },
    ],
  },
  {
    id: "service-certification",
    title: "Service Certification & Paystub",
    items: [
      {
        id: "request-paystub",
        question: "How do I request a Paystub Service certification or history?",
        answer: [
          {
            type: "paragraph",
            text: "Send an email with your request to the Administration team Violeta (VQuintero@teamandes.com) or Alejandra (AVargas@teamandes.com).",
          },
        ],
      },
    ],
  },
  {
    id: "personal-information",
    title: "Personal Information",
    items: [
      {
        id: "keep-data-updated",
        question: "Do I need to keep my data up to date?",
        answer: [
          {
            type: "paragraph",
            text: "Yes, it is necessary to ensure that your payments and communications are correct.",
          },
        ],
      },
      {
        id: "what-to-report",
        question: "What information should I report?",
        answer: [
          {
            type: "paragraph",
            text: "Changes in residence, cell phone, bank account or any relevant data.",
          },
        ],
      },
      {
        id: "why-important",
        question: "Why is it important?",
        answer: [
          {
            type: "paragraph",
            text: "To avoid administrative errors and payment delays.",
          },
        ],
      },
    ],
  },
  {
    id: "organizational-agility",
    title: "Organizational Agility Area",
    items: [
      {
        id: "agility-what-does",
        question: "What does the Organizational Agility area do?",
        answer: [
          {
            type: "paragraph",
            text: "It supports individuals, leaders, and teams in improving collaboration, communication, leadership, and operational performance.",
          },
        ],
      },
      {
        id: "agility-support",
        question: "What kind of support is available?",
        answer: [
          {
            type: "list",
            items: [
              "Team building sessions",
              "Leadership and professional development",
              "One-to-one support",
              "Continuous improvement initiatives",
              "Emotional wellbeing support",
              "Process optimization",
            ],
          },
        ],
      },
      {
        id: "agility-who",
        question: "Who can access these services?",
        answer: [
          {
            type: "paragraph",
            text: "All Andes Workforce team members, depending on the need and, when applicable, client approval.",
          },
        ],
      },
      {
        id: "agility-cost",
        question: "Do these services have a cost?",
        answer: [
          {
            type: "paragraph",
            text: "No cost for internal areas. Psychological support includes the first session covered by the company; additional sessions are paid by the individual.",
          },
        ],
      },
      {
        id: "agility-access",
        question: "How can I access these services?",
        answer: [
          {
            type: "paragraph",
            text: "Through your Agile Coach, Team Lead request, or when the Agility team identifies an improvement opportunity.",
          },
        ],
      },
      {
        id: "agility-confidential",
        question: "Are these sessions confidential?",
        answer: [
          {
            type: "paragraph",
            text: "Yes. One-to-one sessions and psychological support are completely confidential.",
          },
        ],
      },
      {
        id: "agility-mandatory",
        question: "Are the sessions mandatory?",
        answer: [
          {
            type: "list",
            items: [
              "Team building sessions: mandatory for the team",
              "One-to-one and psychological support: voluntary",
            ],
          },
        ],
      },
      {
        id: "agility-duration",
        question: "How long do sessions last?",
        answer: [
          {
            type: "list",
            items: [
              "Team building: 1 hour 30 minutes",
              "First one-to-one/psychological session: 60 minutes",
              "Follow-up sessions: approximately 30 minutes",
            ],
          },
        ],
      },
      {
        id: "agility-topics",
        question: "What topics can be addressed?",
        answer: [
          {
            type: "list",
            items: [
              "Communication and teamwork",
              "Leadership development",
              "Conflict management",
              "Productivity and performance",
              "Emotional wellbeing, stress, or anxiety",
              "Workplace and personal challenges",
            ],
          },
        ],
      },
      {
        id: "agility-progress",
        question: "How is progress measured?",
        answer: [
          {
            type: "paragraph",
            text: "Through follow-up sessions, action plans, and observed improvements in communication, performance, and team results.",
          },
        ],
      },
      {
        id: "agility-reschedule",
        question: "Can sessions be rescheduled?",
        answer: [{ type: "paragraph", text: "Yes, with prior notice." }],
      },
      {
        id: "agility-critical",
        question: "What happens in critical situations?",
        answer: [
          {
            type: "paragraph",
            text: "The Agility team prioritizes urgent cases and activates support protocols when necessary.",
          },
        ],
      },
    ],
  },
];
