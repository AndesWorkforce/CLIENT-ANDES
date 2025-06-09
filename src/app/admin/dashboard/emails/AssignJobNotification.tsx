import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Text,
} from "@react-email/components";

interface AssignJobNotificationProps {
  candidateName: string;
  jobTitle: string;
}

export const AssignJobNotification = ({
  candidateName,
  jobTitle,
}: AssignJobNotificationProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        You have been assigned to a new job opportunity at Andes Workforce
      </Preview>
      <Body style={{ margin: 0, padding: 0 }}>
        <Container style={{ padding: 0, margin: 0, width: "100%" }}>
          <Text
            style={{ color: "#333", fontSize: "16px", margin: "0 0 20px 0" }}
          >
            Hello {candidateName},
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            We are pleased to inform you that you have been assigned to the job
            opportunity <strong>{jobTitle}</strong>. Our team will be in touch
            with you soon to discuss the next steps in the selection process.
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            Thank you for being part of Andes Workforce.
          </Text>

          <img
            src="https://appwiseinnovations.dev/Andes/firma_nicole.png"
            alt="Signature"
            style={{ marginTop: "32px", width: "400px", height: "200px" }}
          />
        </Container>
      </Body>
    </Html>
  );
};

export default AssignJobNotification;
