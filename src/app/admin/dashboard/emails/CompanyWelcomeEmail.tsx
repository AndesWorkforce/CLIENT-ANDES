import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Text,
  Link,
} from "@react-email/components";

interface CompanyWelcomeEmailProps {
  companyName: string;
  representativeName: string;
  email: string;
  temporaryPassword: string;
}

export const CompanyWelcomeEmail = ({
  companyName,
  representativeName,
  email,
  temporaryPassword,
}: CompanyWelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Andes Workforce - Company Account Created</Preview>
      <Body style={{ margin: 0, padding: 0 }}>
        <Container style={{ padding: 0, margin: 0, width: "100%" }}>
          <Text
            style={{ color: "#333", fontSize: "16px", margin: "0 0 20px 0" }}
          >
            Dear {representativeName},
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            Welcome to Andes Workforce! Your company account for{" "}
            <strong>{companyName}</strong> has been successfully created.
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            Through your account, you will be able to view job offers assigned
            to your company and manage applicants who apply to those positions.
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

          <ol
            style={{ color: "#475569", margin: "16px 0", paddingLeft: "24px" }}
          >
            <li>
              Visit{" "}
              <Link
                href="https://andes-workforce.com/auth/login"
                style={{ color: "#0097B2", textDecoration: "underline" }}
              >
                our login page
              </Link>
            </li>
            <li>Sign in with your email and password</li>
            <li>Click on your name in the top right corner</li>
            <li>Select &quot;My Account&quot; from the dropdown menu</li>
            <li>Change your password for security</li>
          </ol>

          <div
            style={{
              textAlign: "center",
              margin: "30px 0",
            }}
          >
            <Link
              href="https://app.andes-workforce.com/auth/login"
              style={{
                backgroundColor: "#0097B2",
                color: "white",
                padding: "12px 24px",
                textDecoration: "none",
                borderRadius: "6px",
                display: "inline-block",
              }}
            >
              Access Your Company Dashboard
            </Link>
          </div>

          <Text
            style={{
              color: "#64748b",
              fontSize: "14px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            If you have any questions or need assistance accessing your assigned
            job offers, please don&apos;t hesitate to contact us at{" "}
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
            Best regards,
          </Text>

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
          <Text style={{ color: "#64748b", fontSize: "12px", margin: "0" }}>
            This is an automated email. Please do not reply directly to this
            address.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default CompanyWelcomeEmail;
