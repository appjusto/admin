import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Flex, FlexProps, Icon, Tooltip } from '@chakra-ui/react';
import Container from 'common/components/Container';
import { ReactComponent as Logo } from 'common/img/logo.svg';
import { Link, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { Checklist } from './checklist/Checklist';
import OnbFooter from './OnbFooter';
import { Summary } from './Summary';

interface Props extends FlexProps {}

const OnboardingStep = ({ children }: Props) => {
  // context
  const { path } = useRouteMatch();
  const segments = path.split('/');
  const lastSegment = parseInt(segments.pop()!);
  const currentStepIndex = isNaN(lastSegment) ? 0 : lastSegment;
  const showSummary = [5, 6].includes(currentStepIndex);
  // UI
  return (
    <Box minH="100vh">
      {currentStepIndex > 1 && (
        <Link to={`/onboarding/${currentStepIndex - 1}`}>
          <Tooltip label={t('Voltar tela')}>
            <Icon
              as={ArrowBackIcon}
              position={{ base: 'absolute', md: 'fixed' }}
              top="6"
              left="6"
              w="26px"
              h="26px"
            />
          </Tooltip>
        </Link>
      )}
      <Box
        position="absolute"
        top="0"
        left="0"
        w={{ base: '100%', md: '38%', lg: '45%' }}
        minH={{ base: '446px', md: '100%' }}
        bg="gray.50"
        zIndex="-1"
      />
      <Container py="12">
        <Flex w="100%" flexDir={{ base: 'column', md: 'row' }}>
          <Box
            position="relative"
            w={{ md: '38%', lg: '45%' }}
            mt="4"
            pr={{ md: '4' }}
          >
            <Box position={{ md: 'fixed' }} maxW={{ md: '240px', lg: '400px' }}>
              <Logo />
              <Checklist mt="8" currentStepIndex={currentStepIndex} />
              {showSummary && <Summary />}
            </Box>
          </Box>
          <Flex
            direction="column"
            w={{ md: '62%', lg: '55%' }}
            minH={{ base: 'auto', md: '100vh' }}
            mt={{ base: '14', md: '0' }}
          >
            <Box
              w={{ base: '100%', md: '460px', lg: '600px' }}
              pl={{ md: '10', lg: '16' }}
            >
              {children}
            </Box>
          </Flex>
        </Flex>
      </Container>
      <OnbFooter />
    </Box>
  );
};

export default OnboardingStep;
