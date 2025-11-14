import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Text,
  Link,
  Button,
  Img,
} from "@react-email/components";

interface EmployeeWelcomeEmailProps {
  employeeName: string;
  companyName: string;
  email: string;
  temporaryPassword: string;
  role?: string;
}

export const EmployeeWelcomeEmail = ({
  employeeName,
  companyName,
  email,
  temporaryPassword,
  role = "Employee",
}: EmployeeWelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Andes Workforce - Employee Account Created</Preview>
      <Body style={{ margin: 0, padding: 0, backgroundColor: "#f3f4f6" }}>
        <Container style={{ padding: "24px 12px", margin: 0, width: "100%" }}>
          {/* Card */}
          <div
            style={{
              maxWidth: "640px",
              margin: "0 auto",
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow:
                "0 1px 2px rgba(16,24,40,0.05), 0 1px 1px rgba(16,24,40,0.03)",
            }}
          >
            {/* Header */}
            <div style={{ backgroundColor: "#08252A", padding: "20px 24px" }}>
              <div style={{ textAlign: "center" }}>
                <Img
                  src="https://appwiseinnovations.dev/Andes/logo-andes.png"
                  alt="Andes Workforce"
                  width="150"
                  height="60"
                  style={{ display: "inline-block", marginBottom: "4px" }}
                />
              </div>
            </div>

            {/* Body content */}
            <div style={{ padding: "28px 28px 8px 28px" }}>
              <Text style={{ color: "#111827", fontSize: "18px", margin: 0 }}>
                Dear {employeeName},
              </Text>

              <Text
                style={{
                  color: "#374151",
                  fontSize: "16px",
                  margin: "12px 0 16px 0",
                  lineHeight: "1.6",
                }}
              >
                Welcome to Andes Workforce! Your employee account for{" "}
                <strong>{companyName}</strong> has been created with the role of{" "}
                <strong>{role}</strong>.
              </Text>

              <Text
                style={{
                  color: "#374151",
                  fontSize: "16px",
                  margin: "0 0 16px 0",
                  lineHeight: "1.6",
                }}
              >
                You can access your dashboard, view assigned job offers, and
                manage applicants according to your permissions. For security,
                please change your password after the first login.
              </Text>

              {/* Credentials */}
              <div
                style={{
                  backgroundColor: "#F9FAFB",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  padding: "16px 18px",
                  margin: "20px 0 16px 0",
                }}
              >
                <Text style={{ margin: 0, color: "#111827", fontWeight: 600 }}>
                  Your login credentials
                </Text>
                <Text style={{ margin: "8px 0 0", color: "#111827" }}>
                  Email: <strong>{email}</strong>
                </Text>
                <Text style={{ margin: "6px 0", color: "#111827" }}>
                  Password: <strong>{temporaryPassword}</strong>
                </Text>
                <Text style={{ margin: "6px 0", color: "#111827" }}>
                  Company: <strong>{companyName}</strong>
                </Text>
                <Text style={{ margin: "6px 0", color: "#111827" }}>
                  Role: <strong>{role}</strong>
                </Text>
              </div>

              {/* Steps */}
              <Text
                style={{
                  color: "#111827",
                  fontWeight: 600,
                  margin: "16px 0 8px",
                }}
              >
                To access your dashboard and change your password
              </Text>
              <ol
                style={{ margin: "0 0 8px 18px", padding: 0, color: "#374151" }}
              >
                <li style={{ margin: "6px 0" }}>Visit our login page</li>
                <li style={{ margin: "6px 0" }}>
                  Sign in with your email and password
                </li>
                <li style={{ margin: "6px 0" }}>
                  Click your name in the top‑right corner
                </li>
                <li style={{ margin: "6px 0" }}>Select “My Account”</li>
                <li style={{ margin: "6px 0" }}>
                  Change your password for security
                </li>
              </ol>

              {/* Primary CTA */}
              <div style={{ textAlign: "center", margin: "22px 0 10px" }}>
                <Button
                  href="https://andesworkforce.com/auth/login"
                  style={{
                    backgroundColor: "#0097B2",
                    color: "#ffffff",
                    padding: "12px 22px",
                    borderRadius: "8px",
                    fontWeight: 600,
                    textDecoration: "none",
                    display: "inline-block",
                    cursor: "pointer",
                  }}
                >
                  Access Your Company Dashboard
                </Button>
              </div>

              {/* Fallback URL */}
              <Text
                style={{
                  color: "#6B7280",
                  fontSize: "13px",
                  textAlign: "center",
                  margin: "6px 0 18px",
                }}
              >
                If the button doesn’t work, copy and paste this link into your
                browser:
                <br />
                <Link
                  href="https://andesworkforce.com/auth/login"
                  style={{ color: "#0097B2" }}
                >
                  https://andesworkforce.com/auth/login
                </Link>
              </Text>

              {/* Support */}
              <Text
                style={{
                  color: "#374151",
                  fontSize: "15px",
                  margin: "0 0 12px 0",
                  lineHeight: "1.6",
                }}
              >
                Need help? Our team is here for you.
              </Text>

              <div
                style={{
                  borderTop: "1px solid #e5e7eb",
                  paddingTop: "14px",
                  marginTop: "8px",
                }}
              >
                <Text style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>
                  Best regards,
                  <br />
                  The Andes Workforce Team
                  <br />
                  <Link
                    href="mailto:info@teamandes.com"
                    style={{ color: "#0097B2" }}
                  >
                    info@teamandes.com
                  </Link>
                </Text>
              </div>

              <Img
                src="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/firma_laura.jpeg"
                alt="Signature"
                width="400"
                height="200"
                style={{ marginTop: "18px", width: "400px", height: "200px" }}
              />

              <Text
                style={{
                  color: "#9ca3af",
                  fontSize: "12px",
                  margin: "16px 0 0",
                  textAlign: "center",
                }}
              >
                This is an automated message. Please do not reply directly to
                this email.
              </Text>
            </div>
          </div>
        </Container>
      </Body>
    </Html>
  );
};
