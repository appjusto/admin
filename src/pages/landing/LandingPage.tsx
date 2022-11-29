import { Box } from '@chakra-ui/react';
import { useContextMeasurement } from 'app/state/measurement/context';
import { CookiesBar } from 'common/components/CookiesBar';
import React from 'react';
import { CalculatorCall } from './CalculatorCall';
import { ForYourBusiness } from './ForYourBusiness';
import { Header } from './Header';
import { Hero } from './Hero';
import { LandingPageFooter } from './LandingPageFooter';
import { RegistrationForm } from './RegistrationForm';
import { Share } from './Share';
import { Transparency } from './Transparency';

const LandingPage = () => {
  // context
  const { handlePixelEvent } = useContextMeasurement();
  // side effects
  React.useEffect(() => {
    handlePixelEvent('pageView');
  }, [handlePixelEvent]);
  // UI
  return (
    <Box>
      <Header />
      <Hero />
      <RegistrationForm />
      <Transparency />
      <ForYourBusiness />
      <CalculatorCall />
      <Share />
      <CookiesBar />
      <LandingPageFooter />
    </Box>
  );
};

export default LandingPage;
