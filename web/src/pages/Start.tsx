import { Button, ButtonArrow, Heading, Paragraph } from "govuk-react";

const Start = ({ onStart }: { onStart: () => void }) => (
  <>
    <Heading>Apply for a postal vote</Heading>
    <Paragraph>You can use this service to apply to vote by post.</Paragraph>
    <Paragraph mb={6}>You'll need to email or post your completed form to your local electoral registration office. You do not need a printer to use this service.</Paragraph>
    <Heading size="MEDIUM">Deadline for applying for a postal vote</Heading>
    <Paragraph mb={6}>You must return your form to your local electoral registration office by 5pm, 11 working days before the poll.</Paragraph>
    <Heading size="MEDIUM">Apply online</Heading>
    <Paragraph>It usually takes about 3 minutes.</Paragraph>
    <Button icon={<ButtonArrow />} start onClick={onStart}>
      Start now
    </Button>
  </>
)

export default Start