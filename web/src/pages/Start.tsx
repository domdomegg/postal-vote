import { Button, ButtonArrow, Heading, Paragraph } from "govuk-react";

const Start = ({ onStart }: { onStart: () => void }) => (
  <>
    <Heading>Apply for a postal vote</Heading>
    <Paragraph mb={6}>You can use this service to apply to vote by post in England, Scotland and Wales.</Paragraph>
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