import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Flex, FlexProps, Icon, Tooltip } from '@chakra-ui/react';
import { ReactComponent as Logo } from 'common/img/logo.svg';
import { Link, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { Checklist } from './checklist/Checklist';
import OnbFooter from './OnbFooter';

interface Props extends FlexProps {}

const OnboardingStep = ({ children }: Props) => {
  // context
  const { path } = useRouteMatch();
  const segments = path.split('/');
  const lastSegment = parseInt(segments.pop()!);
  const currentStepIndex = isNaN(lastSegment) ? 0 : lastSegment;
  // UI
  return (
    <Box minH="100vh">
      <Flex position="relative" flexDir={{ base: 'column', md: 'row' }}>
        <Box
          position={{ md: 'fixed' }}
          top="0"
          left="0"
          pt="20"
          px={{ base: '4', md: '8' }}
          pb="10"
          w={{ base: '100%', md: '296px', lg: '346px' }}
          minW={{ md: '296px', lg: '346px' }}
          minH={{ md: '100vh' }}
          bg="gray.50"
        >
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
          <Logo />
          <Checklist mt="8" currentStepIndex={currentStepIndex} />
        </Box>
        <Box
          ml={{ md: '296px', lg: '346px' }}
          w="full"
          pt={{ base: '10', md: '14' }}
          px={{ base: '4', md: '8', lg: '12' }}
        >
          {children}
        </Box>
      </Flex>
      <OnbFooter />
    </Box>
  );
};

export default OnboardingStep;
