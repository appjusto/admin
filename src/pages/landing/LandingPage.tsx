import { Box } from '@chakra-ui/react';
import { ForYourBusiness } from './ForYourBusiness';
import { Header } from './Header';
import { Hero } from './Hero';
import { LandingPageFooter } from './LandingPageFooter';
import { RegistrationForm } from './RegistrationForm';
import { Share } from './Share';
import { Transparency } from './Transparency';

const LandingPage = () => {
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
      <LandingPageFooter />
    </Box>
  );
};

export default LandingPage;
