import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckToSlot } from '@fortawesome/free-solid-svg-icons';
import { GlobalStyle, TopNav, Page, PhaseBanner, Link, GridRow, GridCol } from 'govuk-react';
import Start from './pages/Start';
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
            postal-vote
          </TopNav.IconTitle>
        </TopNav.Anchor>}
        serviceTitle={<TopNav.NavLink as={ReactRouterLink} to="/">
          Apply for a postal vote
        </TopNav.NavLink>}
      />
      <Page.WidthContainer>
        <PhaseBanner level="alpha">
          This is a new service – your <Link href="https://github.com/domdomegg/postal-vote" target="_blank" rel="noreferrer">feedback</Link> will help us to improve it.
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
                  <PostalVoteForm />
                } />
              </Routes>
            </GridCol>
          </GridRow>
        </Page.Main>
      </Page.WidthContainer>
    </>
  )
}

export default App;
