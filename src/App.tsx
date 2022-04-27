import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckToSlot } from '@fortawesome/free-solid-svg-icons';
import { GlobalStyle, TopNav, Page, PhaseBanner, Link, GridRow, GridCol, Panel, Paragraph, Heading } from 'govuk-react';
import Start from './pages/start';
import IsRegisteredForm from './pages/IsRegisteredForm';
import NeedsRegistration from './pages/NeedsRegistration';
import PostalVoteForm from './pages/PostalVoteForm';
import { Routes, Route, Link as ReactRouterLink, useNavigate } from 'react-router-dom';
import CountryForm from './pages/CountryForm';
import NorthernIreland from './pages/NorthernIreland';

const App = () => {
  const navigate = useNavigate()

  return (
    <>
      <GlobalStyle />
      <TopNav
        company={<TopNav.Anchor as={ReactRouterLink} to="/">
          <TopNav.IconTitle icon={<FontAwesomeIcon icon={faCheckToSlot} height={32} />}>
            eDemocracy
          </TopNav.IconTitle>
        </TopNav.Anchor>}
        serviceTitle={<TopNav.NavLink as={ReactRouterLink} to="/">
          Apply for a postal vote
        </TopNav.NavLink>}
      />
      <Page.WidthContainer>
        <PhaseBanner level="alpha">
          This is a new service – your <Link href="https://github.com/domdomegg/postal-vote">feedback</Link> will help us to improve it.
        </PhaseBanner>
        <Page.Main>
          <GridRow>
            <GridCol setDesktopWidth="two-thirds">
              <Routes>
                <Route path="/" element={
                  <Start onStart={() => navigate('/is-registered')} />
                } />
                <Route path="/is-registered" element={
                  <IsRegisteredForm onRegistered={() => navigate('/country')} onNotRegistered={() => navigate('/needs-registration')} />
                } />
                <Route path="/needs-registration" element={
                  <NeedsRegistration />
                } />
                <Route path="/country" element={
                  <CountryForm onNonNI={() => navigate('/postal-vote-form/your-details')} onNI={() => navigate('/northern-ireland')} />
                } />
                <Route path="/northern-ireland" element={
                  <NorthernIreland />
                } />
                <Route path="/postal-vote-form/*" element={
                  <PostalVoteForm onSuccess={() => navigate('/success')} />
                } />
                <Route path="/success" element={
                  <Success />
                } />
              </Routes>
            </GridCol>
          </GridRow>
        </Page.Main>
      </Page.WidthContainer>
    </>
  )
}

// TODO: should this live in the PostalVoteForm?
// because then we can more easily display things like who their
// ERO is, and know whether we actually did send them an email
const Success = () => {
  return (
    <>
      <Heading size="XLARGE">Sending your form</Heading>
      <Paragraph>We've opened your application form in your browser. Download it and email it to your local electoral registration office.</Paragraph>
      <Paragraph>They will contact you either to confirm your postal vote, or to ask for more information.</Paragraph>

      {/* TODO: uncomment once we have server-side version */}
      {/* <Panel title="Application complete" />
      <Paragraph mb={8}>If you provided your email address, we have sent you a confirmation.</Paragraph>
      <Heading size="LARGE">What happens next</Heading>
      <Paragraph>We’ve sent your application to your local electoral register office.</Paragraph>
      <Paragraph>They will contact you either to confirm your postal vote, or to ask for more information.</Paragraph> */}
    </>
  )
}

export default App;
