import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Text,
  Link,
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
      <Body style={{ margin: 0, padding: 0 }}>
        <Container style={{ padding: 0, margin: 0, width: "100%" }}>
          <Text
            style={{ color: "#333", fontSize: "16px", margin: "0 0 20px 0" }}
          >
            Dear {employeeName},
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            Welcome to Andes Workforce! Your employee account for{" "}
            <strong>{companyName}</strong> has been successfully created with
            the role of <strong>{role}</strong>.
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            Through your account, you will be able to access your company&apos;s
            dashboard, view assigned job offers, and manage applicants according
            to your role permissions.
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            For security reasons, we recommend that you change your password
            upon your first login.
          </Text>

          <div
            style={{
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              padding: "16px",
              margin: "24px 0",
            }}
          >
            <Text style={{ margin: "0", fontWeight: "bold", color: "#333" }}>
              Your login credentials:
            </Text>
            <Text style={{ margin: "8px 0", color: "#333" }}>
              Email: <strong>{email}</strong>
            </Text>
            <Text style={{ margin: "8px 0", color: "#333" }}>
              Password: <strong>{temporaryPassword}</strong>
            </Text>
            <Text style={{ margin: "8px 0", color: "#333" }}>
              Company: <strong>{companyName}</strong>
            </Text>
            <Text style={{ margin: "8px 0", color: "#333" }}>
              Role: <strong>{role}</strong>
            </Text>
          </div>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            To access your company dashboard and change your password:
          </Text>

          <div style={{ textAlign: "center", margin: "32px 0" }}>
            <Link
              href="https://andes-workforce.com/auth/login"
              style={{
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "12px 24px",
                textDecoration: "none",
                borderRadius: "6px",
                display: "inline-block",
                fontWeight: "500",
              }}
            >
              Access Your Dashboard
            </Link>
          </div>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            If you have any questions or need assistance, please don&apos;t
            hesitate to contact our support team.
          </Text>

          <div
            style={{
              borderTop: "1px solid #e2e8f0",
              paddingTop: "20px",
              marginTop: "32px",
            }}
          >
            <Text
              style={{
                color: "#6b7280",
                fontSize: "14px",
                margin: "0",
                lineHeight: "1.5",
              }}
            >
              Best regards,
              <br />
              The Andes Workforce Team
              <br />
              <Link
                href="mailto:info@teamandes.com"
                style={{ color: "#0097B2", textDecoration: "underline" }}
              >
                info@teamandes.com
              </Link>
            </Text>
          </div>

          <img
            src="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/clientes/firma_laura.jpeg"
            alt="Signature"
            style={{ marginTop: "32px", width: "400px", height: "200px" }}
          />

          <hr
            style={{
              border: "none",
              borderTop: "1px solid #e2e8f0",
              margin: "20px 0",
            }}
          />

          <div style={{ marginTop: "32px" }}>
            <Text
              style={{
                color: "#9ca3af",
                fontSize: "12px",
                margin: "0",
                textAlign: "center",
              }}
            >
              This is an automated message. Please do not reply directly to this
              email.
            </Text>
          </div>
        </Container>
      </Body>
    </Html>
  );
};
