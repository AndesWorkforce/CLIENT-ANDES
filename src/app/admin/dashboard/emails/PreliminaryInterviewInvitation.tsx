import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";

const BOOKING_URL =
  "https://outlook.office.com/book/AndesWorkforceInterview@teamandes.com/?ismsaljsauthenabled";

interface PreliminaryInterviewInvitationProps {
  candidateName: string;
}

export const PreliminaryInterviewInvitation = ({
  candidateName,
}: PreliminaryInterviewInvitationProps) => {
  return (
    <Html>
      <Head />
      <Preview>Schedule your preliminary interview with Andes Workforce</Preview>
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
            Thank you for expressing interest in offering your services to Andes
            Workforce! We&apos;ve had the chance to review your application for
            remote positions, and we may have an opportunity that aligns with
            your experience. We&apos;d like to schedule a brief call to discuss
            your background further.
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            Please schedule your call using this link:
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            <Link href={BOOKING_URL} style={{ color: "#0097B2" }}>
              {BOOKING_URL}
            </Link>
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

export default PreliminaryInterviewInvitation;
