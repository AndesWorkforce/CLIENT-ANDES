import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Text,
} from "@react-email/components";

interface RejectPositionEmailProps {
  candidateName: string;
}

export const RejectPositionEmail = ({
  candidateName: _candidateName,
}: RejectPositionEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Andes Workforce | Update on Your Application</Preview>
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
            Thank you for the time and effort you dedicated to the selection
            process.
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            After careful consideration, the client has decided not to move
            forward with your application for this specific opportunity.
            However, please note that your profile will remain active in our
            system at Andes Workforce and will continue to be considered for
            other current and future opportunities that align with your
            experience and skills.
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            We truly appreciate your interest and the time you invested in the
            process. Our team will reach out should another suitable opportunity
            become available.
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            Wishing you continued success, and we look forward to staying in
            touch.
          </Text>

          <Text
            style={{ color: "#333", fontSize: "16px", margin: "0 0 20px 0" }}
          >
            Best regards,
          </Text>

          <img
            src="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/firma_laura.jpeg"
            alt="Signature"
            style={{ marginTop: "32px", width: "200px", height: "auto" }}
          />
        </Container>
      </Body>
    </Html>
  );
};

export default RejectPositionEmail;
