import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Text,
} from "@react-email/components";

interface AssignJobNotificationProps {
  candidateName: string;
  jobTitle: string;
}

export const AssignJobNotification = ({
  candidateName: _candidateName,
  jobTitle,
}: AssignJobNotificationProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        Andes Workforce | Good News! You&apos;ve Been Assigned to {jobTitle}
      </Preview>
      <Body style={{ margin: 0, padding: 0 }}>
        <Container style={{ padding: 0, margin: 0, width: "100%" }}>
          <Text
            style={{ color: "#333", fontSize: "16px", margin: "0 0 20px 0" }}
          >
            Dear candidate,
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            We would like to inform you that you have been assigned to the{" "}
            <strong>{jobTitle}</strong> position.
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            At this stage, your profile will be reviewed by the client to
            determine whether you will move forward to the interview stage.
          </Text>

          <Text
            style={{
              color: "#333",
              fontSize: "16px",
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            We appreciate your interest and will keep you updated on any next
            steps.
          </Text>

          <Text
            style={{ color: "#333", fontSize: "16px", margin: "0 0 20px 0" }}
          >
            Best regards,
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

export default AssignJobNotification;
