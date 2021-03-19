import { Box } from '@chakra-ui/react';
import { ForYourBusiness } from './ForYourBusiness';
import { Hero } from './Hero';
import { LandingPageFooter } from './LandingPageFooter';
import { Transparency } from './Transparency';

const LandingPage = () => {
  return (
    <Box>
      <Hero />
      <Transparency />
      <ForYourBusiness />
      <LandingPageFooter />
    </Box>
  );
};

export default LandingPage;
