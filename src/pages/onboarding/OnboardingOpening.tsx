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
    <Box w="100vw" minH="100vh" position="relative">
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
        <Text fontSize="xl" color="black">
          {t('Olá, boas vindas ao seu cadastro no AppJusto.')}
        </Text>
        <Text fontSize="xl" color="black" mb="8">
          {t(
            'Mais do que um delivery, somos um movimento por relações mais justas e transparentes.'
          )}
        </Text>
        <Text fontSize="md" mb="8">
          {'Estas são as etapas preliminares de cadastro:'}
        </Text>
        <Box mb="8">
          <Checklist disabled currentStepIndex={0} />
        </Box>
        <Text fontSize="md" mb="8">
          {
            'Ao final desse processo, a equipe do AppJusto estará pronta para te ajudar a concluir o seu cadastro. Vamos começar?'
          }
        </Text>
        <Link to={`${path}/1`}>
          <Button
            size="lg"
            fontSize="sm"
            fontWeight="500"
            fontFamily="Barlow"
            mb="10"
          >
            {t('Começar')}
          </Button>
        </Link>
      </Container>
      <OnbFooter />
    </Box>
  );
};

export default OnboardingOpening;
