import { Box, Flex, Image, Link, Text } from '@chakra-ui/react';
import * as Sentry from '@sentry/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useContextBusiness } from 'app/state/business/context';
import logo from 'common/img/logo.svg';
import React, { ErrorInfo } from 'react';
import { Redirect } from 'react-router-dom';
import { t } from 'utils/i18n';

const FallbackErrorComponent = () => {
  // context
  const { business } = useContextBusiness();
  const { updateBusinessProfile } = useBusinessProfile();
  // state
  const [businessExists, setBusinessExists] = React.useState<boolean>();
  // side effects
  React.useEffect(() => {
    if (business === undefined) return;
    if (business) {
      if (business.onboarding !== 'completed') {
        updateBusinessProfile({ onboarding: 'completed' });
      } else setTimeout(() => setBusinessExists(true), 4000);
    } else setBusinessExists(false);
  }, [business, updateBusinessProfile]);
  console.log('FBE business', business);
  // UI
  if (businessExists === true) return <Redirect to="/app" />;
  if (businessExists === false) {
    return (
      <Flex w="100vw" h="100vh" flexDir="column" justifyContent="center" alignItems="center">
        <Box>
          <Image src={logo} eagerLoading height="60px" />
        </Box>
        <Box mt="8" color="black" textAlign="center">
          <Text fontSize="24px" lineHeight="22px">
            {t('Ocorreu um erro no seu cadastro')}
          </Text>
          <Text mt="4" fontSize="15px" lineHeight="18px">
            {t('Caso seja a primeira vez, você pode tentar recarregar a página.')}
          </Text>
          <Text mt="2" fontSize="15px" lineHeight="18px">
            {t('Caso já tenha tentado, infelizmente não poderemos continuar agora =/')}
          </Text>
          <Text mt="2" fontSize="15px" lineHeight="18px">
            {t('Entra em contato com a gente e informa o que aconteceu?')}
          </Text>
          <Link mt="2" href="mailto:contato@appjusto.com.br">
            contato@appjusto.com.br
          </Link>
        </Box>
      </Flex>
    );
  }
  return (
    <Flex w="100vw" h="100vh" flexDir="column" justifyContent="center" alignItems="center">
      <Box>
        <Image src={logo} eagerLoading height="60px" />
      </Box>
      <Box mt="8" color="black" textAlign="center">
        <Text fontSize="24px" lineHeight="22px">
          {t('Ocorreu um erro no seu cadastro =/')}
        </Text>
        <Text mt="4" fontSize="15px" lineHeight="18px">
          {t('Em breve você será redirecionado')}
        </Text>
        <Text mt="2" fontSize="15px" lineHeight="18px">
          {t('Buscando informações...')}
        </Text>
      </Box>
    </Flex>
  );
};

export class OnboardingErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Sentry.captureException({ error, errorInfo });
  }

  render() {
    const { error } = this.state;
    if (error) {
      // alternative UI
      return <FallbackErrorComponent />;
    }
    // regular UI
    return this.props.children;
  }
}
