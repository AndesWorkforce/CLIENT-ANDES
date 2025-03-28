import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Text,
} from "@react-email/components";

interface AdvanceNextStepProps {
  candidateName: string;
}

export const AdvanceNextStep = ({ candidateName }: AdvanceNextStepProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        Congratulations! You've been selected for the next stage
      </Preview>
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
            Congratulations! We are pleased to inform you that you have been
            selected to advance to the next stage of the process. We would like
            to schedule a meeting to discuss the next steps.
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

export default AdvanceNextStep;
