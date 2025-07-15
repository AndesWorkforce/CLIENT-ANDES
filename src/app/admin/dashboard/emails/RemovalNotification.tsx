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
  reason?: string;
}

// Stage 6: Removal Notification
export const RemovalNotificationEmail = ({
  candidateName,
  offerName,
  reason,
}: RemovalNotificationEmailProps) => {
  const getReasonText = (reason?: string) => {
    switch (reason) {
      case "applied_by_mistake":
        return "due to an application submitted by mistake";
      case "position_unavailable":
        return "as the position is no longer available";
      case "candidate_not_interested":
        return "as you are no longer interested or available for this position";
      default:
        return "due to internal reasons or lack of available vacancies";
    }
  };
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
            <strong>{offerName}</strong> {getReasonText(reason)}.
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
