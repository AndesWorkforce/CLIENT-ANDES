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
      <Preview>Update on Your Application Status</Preview>
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
            We want to express our sincere appreciation for your interest and
            for taking the time to participate in our selection process. We have
            carefully reviewed your profile and experience.
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            Although we were impressed with your background, we have decided to
            move forward with other candidates at this time. We would like to
            keep your information in our database for future opportunities that
            might better align with your profile.
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            We encourage you to stay connected with us, as new opportunities may
            arise in the future that could be a better match.
          </Text>

          <Text
            style={{ color: "#333", fontSize: "16px", margin: "0 0 20px 0" }}
          >
            Thank you again for your interest. We wish you success in your
            future endeavors.
          </Text>

          <Text
            style={{ color: "#333", fontSize: "16px", margin: "0 0 20px 0" }}
          >
            Best regards.
          </Text>

          <img
            src="https://appwiseinnovations.dev/Andes/firma_nicole.png"
            alt="Signature"
            style={{ marginTop: "32px", width: "200px", height: "auto" }}
          />
        </Container>
      </Body>
    </Html>
  );
};

export default RejectPositionEmail;
