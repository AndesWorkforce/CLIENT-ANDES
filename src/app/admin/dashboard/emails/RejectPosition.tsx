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
  candidateName,
}: RejectPositionEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Update on your application</Preview>
      <Body style={{ margin: 0, padding: 0 }}>
        <Container style={{ padding: 0, margin: 0, width: "100%" }}>
          <Text
            style={{ color: "#333", fontSize: "16px", margin: "0 0 20px 0" }}
          >
            Dear {candidateName},
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            Thank you for taking the time to participate in our selection
            process. We truly appreciate your interest in the position and the
            effort you put into your application.
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            After careful consideration, we regret to inform you that you were
            not selected for the role. This decision was not easy, as we had
            many strong candidates, including yourself.
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            We wish you all the best in your job search and future professional
            endeavors. Please don&#39;t hesitate to apply for future
            opportunities with us—we&#39;d be happy to consider your profile
            again.
          </Text>

          <Text
            style={{ color: "#333", fontSize: "16px", margin: "0 0 20px 0" }}
          >
            Warm regards,
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
