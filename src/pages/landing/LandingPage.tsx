import { Box } from '@chakra-ui/react';
import { useContextMeasurement } from 'app/state/measurement/context';
import Container from 'common/components/Container';
import { CookiesBar } from 'common/components/CookiesBar';
import { CrowdfundingCard } from 'common/components/CrowdfundingCard';
import React from 'react';
import ReactPixel from 'react-facebook-pixel';
import { CalculatorCall } from './CalculatorCall';
import { Content } from './Content';
import { ForYourBusiness } from './ForYourBusiness';
import { Header } from './Header';
import { Hero } from './Hero';
import { LandingPageFooter } from './LandingPageFooter';
import { RegistrationForm } from './RegistrationForm';
import { Section } from './Section';
import { Share } from './Share';
import { Transparency } from './Transparency';

const LandingPage = () => {
  // context
  const { userConsent } = useContextMeasurement();
  // side effects
  React.useEffect(() => {
    if (!userConsent) return;
    if (process.env.NODE_ENV !== 'production') return;
    ReactPixel.pageView();
  }, [userConsent]);
  // UI
  return (
    <Box>
      <Header />
      <Hero />
      <RegistrationForm />
      <Section>
        <Container pt="16">
          <Content>
            <CrowdfundingCard isExternal />
          </Content>
        </Container>
      </Section>
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
