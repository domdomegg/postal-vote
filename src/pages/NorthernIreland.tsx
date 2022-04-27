import { Button, Heading, Paragraph } from "govuk-react"

const NorthernIreland = () => {
    return (
        <>
            <Heading size="XLARGE">You need to contact EONI</Heading>
            <Paragraph>The Electoral Office for Northern Ireland (EONI) handles postal vote applications for voters in Northern Ireland.</Paragraph>
            <Paragraph>The EONI website has more details on eligibility criteria and how to apply.</Paragraph>
            <Button as='a' href="https://www.eoni.org.uk/Vote/Voting-by-post-or-proxy" target="_blank" rel="noopener" style={{ display: 'inline-flex' }}>
                Go to EONI website
            </Button>
        </>
    )
}

export default NorthernIreland