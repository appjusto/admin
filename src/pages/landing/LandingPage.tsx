import { Box } from '@chakra-ui/react';
import { useContextBusiness } from 'app/state/business/context';
import { useContextMeasurement } from 'app/state/measurement/context';
import { CookiesBar } from 'common/components/CookiesBar';
import React from 'react';
import ReactPixel from 'react-facebook-pixel';
import { ForYourBusiness } from './ForYourBusiness';
import { Header } from './Header';
import { Hero } from './Hero';
import { LandingPageFooter } from './LandingPageFooter';
import { RegistrationForm } from './RegistrationForm';
import { Share } from './Share';
import { Transparency } from './Transparency';

const LandingPage = () => {
  // context
  const { isDeleted, setIsDeleted } = useContextBusiness();
  const { userConsent } = useContextMeasurement();
  // side effects
  React.useEffect(() => {
    if (isDeleted) {
      setIsDeleted(false);
    }
  }, [isDeleted, setIsDeleted]);
  React.useEffect(() => {
    if (!userConsent) return;
    ReactPixel.pageView();
  }, [userConsent]);
  // UI
  return (
    <Box>
      <Header />
      <Hero />
      <RegistrationForm />
      <Transparency />
      <ForYourBusiness />
      <Share />
      <CookiesBar />
      <LandingPageFooter />
    </Box>
  );
};

export default LandingPage;
