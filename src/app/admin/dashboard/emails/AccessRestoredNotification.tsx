import * as React from "react";
import {
  Html,
  Body,
  Container,
  Text,
  Link,
  Preview,
} from "@react-email/components";

interface AccessRestoredNotificationEmailProps {
  candidateName: string;
}

export const AccessRestoredNotificationEmail = ({
  candidateName,
}: AccessRestoredNotificationEmailProps) => {
  return (
    <Html>
      <Preview>Access Restored – You&apos;re Welcome Back!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={paragraph}>Hello {candidateName},</Text>

          <Text style={paragraph}>
            We&apos;re reaching out to let you know that your access to our
            website has been successfully restored. You can now log in, explore
            our platform, and apply to available offers as usual.
          </Text>

          <Text style={paragraph}>
            Welcome back, and we look forward to working with you again!
          </Text>

          <Text style={paragraph}>
            If you have any questions or need assistance, please don&apos;t
            hesitate to contact us at{" "}
            <Link href="mailto:info@teamandes.com">info@teamandes.com</Link>.
          </Text>

          <Text style={paragraph}>Best regards,</Text>
          <Text style={paragraph}>Andes Workforce Team</Text>

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
