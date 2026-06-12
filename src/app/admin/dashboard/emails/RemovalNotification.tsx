import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Text,
} from "@react-email/components";

interface RemovalNotificationEmailProps {
  candidateName: string;
  offerName: string;
}

export const RemovalNotificationEmail = ({
  candidateName: _candidateName,
  offerName,
}: RemovalNotificationEmailProps) => {
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
            Due to changes in the status of the opportunity, you have been
            removed from the <strong>{offerName}</strong> process.
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            Please note that this is not related to your profile or performance,
            and it does not reflect a rejection. The position itself did not
            move forward as expected.
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            Your profile remains active in our system, and you will continue to
            be considered for other current and future opportunities that align
            with your experience and skills.
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            We appreciate your interest and will keep you in mind for upcoming
            roles.
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

export default RemovalNotificationEmail;
