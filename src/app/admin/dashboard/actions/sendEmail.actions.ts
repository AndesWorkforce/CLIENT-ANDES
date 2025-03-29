"use server";

import { Resend } from "resend";
import { InterviewInvitationEmail } from "../emails/InterviewInvitation";
import { RejectPositionEmail } from "../emails/RejectPosition";
import { render } from "@react-email/render";
import { ContractJob } from "../emails/ContratJob";
import { AdvanceNextStep } from "../emails/AdvanceNextStep";

const resend = new Resend(process.env.SECRET_KEY_RESEND);

export const sendInterviewInvitation = async (
  candidateName: string,
  candidateEmail: string
) => {
  try {
    const bookingLink =
      "https://outlook.office365.com/book/Interviews@teamandes.com/";

    const emailHtml = await render(
      InterviewInvitationEmail({
        candidateName,
        bookingLink,
      })
    );

    const { error, data } = await resend.emails.send({
      from: "Andes Workforce <no-reply@teamandes.com>",
      to: [candidateEmail],
      subject: "Scheduling a Call to Discuss Opportunities at Andes Workforce",
      html: emailHtml,
    });

    if (error) {
      console.error("[Email] Resend API error:", error);
      throw new Error(`Resend API error: ${error.message}`);
    }

    return {
      success: true,
      message: "Email sent successfully",
      data,
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

    const { error, data } = await resend.emails.send({
      from: "Andes Workforce <no-reply@teamandes.com>",
      to: [candidateEmail],
      subject: "Congratulations! You've reached the final stage",
      html: emailHtml,
    });

    if (error) {
      console.error("[Email] Resend API error:", error);
      throw new Error(`Resend API error: ${error.message}`);
    }

    return {
      success: true,
      message: "Advance next step email sent successfully",
      data,
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

    const { error, data } = await resend.emails.send({
      from: "Andes Workforce <no-reply@teamandes.com>",
      to: [candidateEmail],
      subject: "Update on Your Application Status",
      html: emailHtml,
    });

    if (error) {
      console.error("[Email] Resend API error:", error);
      throw new Error(`Resend API error: ${error.message}`);
    }

    return {
      success: true,
      message: "Rejection email sent successfully",
      data,
    };
  } catch (error) {
    console.error("Error sending rejection email:", error);
    return { success: false, error };
  }
};

export const sendContractJobEmail = async (
  candidateName: string,
  candidateEmail: string
) => {
  try {
    const emailHtml = await render(
      ContractJob({
        candidateName,
      })
    );

    const { error, data } = await resend.emails.send({
      from: "Andes Workforce <no-reply@teamandes.com>",
      to: [candidateEmail],
      subject: "Congratulations! You've reached the final stage",
      html: emailHtml,
    });

    if (error) {
      console.error("[Email] Resend API error:", error);
      throw new Error(`Resend API error: ${error.message}`);
    }

    return {
      success: true,
      message: "Contract job email sent successfully",
      data,
    };
  } catch (error) {
    console.error("Error sending contract job email:", error);
    return { success: false, error };
  }
};
