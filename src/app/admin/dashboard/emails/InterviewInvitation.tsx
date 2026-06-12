import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Text,
} from "@react-email/components";

interface InterviewInvitationEmailProps {
  candidateName: string;
  jobTitle: string;
}

export const InterviewInvitationEmail = ({
  candidateName: _candidateName,
  jobTitle,
}: InterviewInvitationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Next Step in Your Application</Preview>
      <Body style={{ margin: 0, padding: 0 }}>
        <Container style={{ padding: 0, margin: 0, width: "100%" }}>
          <Text
            style={{ color: "#333", fontSize: "16px", margin: "0 0 20px 0" }}
          >
            Dear candidate,
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            We&apos;re pleased to inform you that you have been selected to
            move forward to the next stage of the process for the{" "}
            <strong>{jobTitle}</strong> position.
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            The next step will be an interview with the client. Our team will be
            contacting you shortly with further details and instructions to
            schedule your interview.
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            Please note that the interview will be an important step in the
            client&apos;s evaluation process.
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            We appreciate your interest and look forward to supporting you
            through the next steps.
          </Text>

          <Text
            style={{ color: "#333", fontSize: "16px", margin: "0 0 20px 0" }}
          >
            Best regards,
          </Text>

          <img
            src="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/firma_laura.jpeg"
            alt="Signature"
            style={{ marginTop: "32px", width: "400px", height: "200px" }}
          />
        </Container>
      </Body>
    </Html>
  );
};

export default InterviewInvitationEmail;
