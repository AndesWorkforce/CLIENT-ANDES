import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Text,
} from "@react-email/components";

interface ContractSentEmailProps {
  candidateName: string;
}

// Stage 7: Contract Sent Notification
export const ContractSentEmail = ({
  candidateName,
}: ContractSentEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>You&#39;re Hired – Next Steps Inside!</Preview>
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
            Congratulations! You&#39;ve officially reached the &quot;Hired&quot;
            stage — we&#39;re excited to move forward with you!
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 10px 0",
              fontWeight: "600",
            }}
          >
            Next Step:
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            Please check your profile under your current applications. Your
            service contract has been sent and is ready for your review and
            signature.
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              fontWeight: "600",
            }}
          >
            Welcome aboard!
          </Text>

          <Text
            style={{ color: "#333", fontSize: "16px", margin: "0 0 20px 0" }}
          >
            Best regards,
          </Text>

          <img
            src="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/firma_laura.jpeg"
            alt="Laura&#39;s Signature"
            style={{ marginTop: "32px", width: "200px", height: "auto" }}
          />
        </Container>
      </Body>
    </Html>
  );
};

export default ContractSentEmail;
