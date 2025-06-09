import * as React from "react";
import {
  Html,
  Body,
  Container,
  Text,
  Link,
  Preview,
} from "@react-email/components";

interface BlacklistNotificationEmailProps {
  candidateName: string;
}

export const BlacklistNotificationEmail = ({
  candidateName,
}: BlacklistNotificationEmailProps) => {
  return (
    <Html>
      <Preview>Access Restricted</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={paragraph}>Dear {candidateName},</Text>

          <Text style={paragraph}>
            Your account has been temporarily deactivated due to a change in
            your status.
          </Text>

          <Text style={paragraph}>
            Access to your profile and contract opportunities is currently
            restricted.
          </Text>

          <Text style={paragraph}>
            If you believe this is in error or require further information,
            please email us at{" "}
            <Link href="mailto:info@teamandes.com">info@teamandes.com</Link>.
          </Text>

          <Text style={paragraph}>
            Thank you for your attention to this matter.
          </Text>

          <Text style={paragraph}>Best regards,</Text>
          <Text style={paragraph}>Andes Workforce Team</Text>

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

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "580px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#333",
};
