import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Text,
  Link,
} from "@react-email/components";

interface RemovalNotificationEmailProps {
  candidateName: string;
  offerName: string;
}

// Stage 6: Removal Notification
export const RemovalNotificationEmail = ({
  candidateName,
  offerName,
}: RemovalNotificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Update on your application status</Preview>
      <Body style={{ margin: 0, padding: 0 }}>
        <Container style={{ padding: 0, margin: 0, width: "100%" }}>
          <Text
            style={{ color: "#333", fontSize: "16px", margin: "0 0 20px 0" }}
          >
            Hi {candidateName},
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            We wanted to inform you that you have been removed from the offer{" "}
            <strong>{offerName}</strong>. This may be due to a lack of available
            vacancies or other internal reasons.
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            If you have any questions or concerns, please feel free to contact
            us at:{" "}
            <Link
              href="mailto:info@teamandes.com"
              style={{ color: "#0097B2", textDecoration: "underline" }}
            >
              info@teamandes.com
            </Link>
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            Thank you for your interest, and we encourage you to stay connected
            for future opportunities.
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
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

export default RemovalNotificationEmail;
