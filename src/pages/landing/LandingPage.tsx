import { Box } from '@chakra-ui/react';
import { CookiesBar } from 'common/components/CookiesBar';
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
  // const { userConsent } = useContextMeasurement();
  // side effects
  // React.useEffect(() => {
  //   if (!userConsent) return;
  //   if (process.env.NODE_ENV !== 'production') return;
  //   ReactPixel.pageView();
  // }, [userConsent]);
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
