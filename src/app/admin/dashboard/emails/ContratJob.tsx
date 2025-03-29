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
}

export const ContractJob = ({ candidateName }: ContractJobProps) => {
  return (
    <Html>
      <Head />
      <Preview>Congratulations! You&apos;ve reached the final stage</Preview>
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
            Congratulations! You have successfully completed all stages of the
            process. We are very pleased with your performance and would like to
            discuss the next steps with you.
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            Please stay tuned as we will be contacting you in the coming days to
            discuss how to proceed.
          </Text>

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

export default ContractJob;
