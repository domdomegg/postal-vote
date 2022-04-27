import { Button, Heading, Paragraph } from "govuk-react"

const NeedsRegistration = () => {
    return (
        <>
            <Heading size="XLARGE">You need to register to vote</Heading>
            <Paragraph>You must register before applying for a postal vote. The deadline to register to vote is midnight, 12 working days before the poll.</Paragraph>
            <Paragraph>If you're not sure if you are registered to vote, you should register again.</Paragraph>
            <Paragraph>You can come back to this service once you have registered to vote.</Paragraph>
            <Button as='a' href="https://www.gov.uk/register-to-vote" target="_blank" rel="noopener" style={{ display: 'inline-flex' }}>
                Register to vote
            </Button>
        </>
    )
}

export default NeedsRegistration