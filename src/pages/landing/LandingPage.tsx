import { Box } from '@chakra-ui/react';
import Container from 'common/components/Container';
import { FAQs } from './FAQs';
import { ForYourBusiness } from './ForYourBusiness';
import { Hero } from './Hero';
import { LandingPageFooter } from './LandingPageFooter';
import { RegistrationForm } from './RegistrationForm';
import { Share } from './Share';
import { Transparency } from './Transparency';

const LandingPage = () => {
  return (
    <Box>
      <Hero />
      <Container position="relative">
        <RegistrationForm />
        <Transparency />
        <ForYourBusiness />
      </Container>
      <FAQs />
      <Share />
      <LandingPageFooter />
    </Box>
  );
};

export default LandingPage;
