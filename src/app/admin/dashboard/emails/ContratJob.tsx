import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Text,
} from "@react-email/components";

interface ContractJobProps {
  candidateName: string;
  jobTitle: string;
}

// Stage 4: Contract Job Notification
export const ContractJob = ({ candidateName, jobTitle }: ContractJobProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        Congratulations! You have been selected for the offer: {jobTitle}.
      </Preview>
      <Body style={{ margin: 0, padding: 0 }}>
        <Container style={{ padding: 0, margin: 0, width: "100%" }}>
          <Text
            style={{ color: "#333", fontSize: "16px", margin: "0 0 20px 0" }}
          >
            Hi {candidateName},
          </Text>
          <Text
            style={{ color: "#333", fontSize: "16px", margin: "0 0 20px 0" }}
          >
            Congratulations! You have been selected for the offer: {jobTitle}.
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            We will be sending you a contract shortly outlining the details of
            our offer, along with further information about the onboarding
            process with Andes Workforce and our client.
            <br />
            We&#39;re excited to have you on board!
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            Warm regards,
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

export default ContractJob;
