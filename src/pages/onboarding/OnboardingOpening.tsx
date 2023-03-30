import { Box, Button, Text } from '@chakra-ui/react';
import Container from 'common/components/Container';
import logo from 'common/img/logo.svg';
import { Link } from 'react-router-dom';
import { t } from 'utils/i18n';
import Image from '../../common/components/Image';
import { Checklist } from './checklist/Checklist';
import hands from './img/package-hands.svg';
import OnbFooter from './OnbFooter';

interface OpeningProps {
  path: string;
}

const OnboardingOpening = ({ path }: OpeningProps) => {
  return (
    <Box position="relative">
      <Box
        position="absolute"
        top="0"
        right="0"
        w="300px"
        h="240px"
        zIndex="-1"
        display={{ base: 'none', lg: 'block' }}
      >
        <Image src={hands} />
      </Box>
      <Container minH="100vh" zIndex="10">
        <Image src={logo} mb="8" />
        <Box color="black">
          <Text fontSize="2xl" mb="4">
            {t('Olá! 👋')}
          </Text>
          <Text fontSize="2xl" mb="4">
            {t('Boas-vindas ao AppJusto!')}
          </Text>
          <Text fontSize="xl" mb="6">
            {t(
              'Mais do que um delivery, somos um movimento por relações mais justas e transparentes.'
            )}
          </Text>
        </Box>
        <Text fontSize="md" mb="6">
          {'Estas são as etapas preliminares de cadastro:'}
        </Text>
        <Box mb="6">
          <Checklist disabled currentStepIndex={0} />
        </Box>
        <Text fontSize="md" mb="8">
          {
            'Ao final desse processo, a equipe do AppJusto estará pronta para te ajudar a concluir o seu cadastro. Vamos começar?'
          }
        </Text>
        <Link to={`${path}/1`}>
          <Button minW="200px" fontSize="sm" mb="10">
            {t('Começar!')}
          </Button>
        </Link>
      </Container>
      <OnbFooter />
    </Box>
  );
};

export default OnboardingOpening;
