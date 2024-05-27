import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckToSlot } from '@fortawesome/free-solid-svg-icons';
import {
  GlobalStyle, TopNav, Page, PhaseBanner, Link, GridRow, GridCol, Footer,
} from 'govuk-react';
import {
  Routes, Route, Link as ReactRouterLink, useNavigate,
} from 'react-router-dom';
import Start from './pages/Start';
import IsRegisteredForm from './pages/IsRegisteredForm';
import NeedsRegistration from './pages/NeedsRegistration';
import PostalVoteForm from './pages/PostalVoteForm';
import CountryForm from './pages/CountryForm';
import NorthernIreland from './pages/NorthernIreland';
import env from './env/env';

const App = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <GlobalStyle />
      <TopNav
        company={(
          <TopNav.Anchor as={ReactRouterLink} to="/">
            <TopNav.IconTitle icon={<FontAwesomeIcon icon={faCheckToSlot} height={32} />}>
              postal-vote
            </TopNav.IconTitle>
          </TopNav.Anchor>
)}
        serviceTitle={(
          <TopNav.NavLink as={ReactRouterLink} to="/">
            Apply for a postal vote
          </TopNav.NavLink>
)}
      />
      <div style={{ flex: '1' }}>
        <Page.WidthContainer>
          <PhaseBanner level="alpha">
            This is a new service – your <Link href="https://github.com/domdomegg/postal-vote/issues/new" target="_blank" rel="noreferrer">feedback</Link> will help us to improve it.
          </PhaseBanner>
          {env.STAGE !== 'prod' && (
          <PhaseBanner level={env.STAGE}>
            This is the {env.STAGE} version of postal-vote.
          </PhaseBanner>
          )}
          <Page.Main>
            <GridRow>
              <GridCol setDesktopWidth="two-thirds">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <Start onStart={() => navigate('/is-registered')} />
                  }
                  />
                  <Route
                    path="/is-registered"
                    element={
                      <IsRegisteredForm onRegistered={() => navigate('/country')} onNotRegistered={() => navigate('/needs-registration')} />
                  }
                  />
                  <Route
                    path="/needs-registration"
                    element={
                      <NeedsRegistration />
                  }
                  />
                  <Route
                    path="/country"
                    element={
                      <CountryForm onNonNI={() => navigate('/postal-vote-form/your-details')} onNI={() => navigate('/northern-ireland')} />
                  }
                  />
                  <Route
                    path="/northern-ireland"
                    element={
                      <NorthernIreland />
                  }
                  />
                  <Route
                    path="/postal-vote-form/*"
                    element={
                      <PostalVoteForm />
                  }
                  />
                </Routes>
              </GridCol>
            </GridRow>
          </Page.Main>
        </Page.WidthContainer>
      </div>
      <Footer meta={<Footer.MetaCustom>Built by Adam Jones with source code available on <Footer.Link href="https://github.com/domdomegg/postal-vote">GitHub</Footer.Link></Footer.MetaCustom>} />
    </div>
  );
};

export default App;
