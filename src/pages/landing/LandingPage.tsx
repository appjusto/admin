import { Box } from '@chakra-ui/react';
import { useContextBusiness } from 'app/state/business/context';
import { CookiesBar } from 'common/components/CookiesBar';
import React from 'react';
import { ForYourBusiness } from './ForYourBusiness';
import { Header } from './Header';
import { Hero } from './Hero';
import { LandingPageFooter } from './LandingPageFooter';
import { RegistrationForm } from './RegistrationForm';
import { Share } from './Share';
import { Transparency } from './Transparency';

const LandingPage = () => {
  // context
  //const { getAnalytics } = useMeasurement();
  const { isDeleted, setIsDeleted } = useContextBusiness();
  // side effects
  React.useEffect(() => {
    if (isDeleted) {
      setIsDeleted(false);
    }
  }, [isDeleted, setIsDeleted]);
  //React.useEffect(() => {
  //  async () => {};
  //}, []);
  // UI
  return (
    <Box>
      <Header />
      <Hero />
      <RegistrationForm />
      <Transparency />
      <ForYourBusiness />
      {/*<FAQs />*/}
      <Share />
      <CookiesBar />
      <LandingPageFooter />
    </Box>
  );
};

export default LandingPage;
