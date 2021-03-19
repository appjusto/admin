import { Box, BoxProps, Flex, Heading, HStack, Text } from '@chakra-ui/react';
import { CustomButton as Button } from 'common/components/buttons/CustomButton';
import Container from 'common/components/Container';
import Image from 'common/components/Image';
import check from 'common/img/green-check.svg';
import heroBgMob from 'common/img/landing-hero-mobile.jpg';
import heroBg from 'common/img/landing-hero.jpg';
import logo from 'common/img/logo-white.svg';
import { t } from 'utils/i18n';
import { Section } from './Section';

interface HeroTopicProps extends BoxProps {
  title: string;
  ps?: string;
}

const HeroTopic = ({ title, ps, ...props }: HeroTopicProps) => {
  return (
    <HStack spacing={4} alignItems="center" {...props}>
      <Image src={check} width="24px" height="48px" eagerLoading />
      <Box color="white">
        <Heading as="h2" fontSize="2xl" fontWeight="700">
          {title}
        </Heading>
        {ps && <Text fontSize="sm">{ps}</Text>}
      </Box>
    </HStack>
  );
};

export const Hero = () => {
  return (
    <Section h={['auto', null, null, '560px', '560px', '600px']}>
      <Container zIndex="100">
        <Flex justifyContent="space-between" alignItems="flex-start">
          <Image src={logo} width="168px" eagerLoading />
          <Button mt="0" variant="white" size="lg" link="/app" label={t('Entrar')} />
        </Flex>
        <Flex mt="8" flexDir="column">
          <Heading
            as="h1"
            maxW="390px"
            color="white"
            fontSize="5xl"
            fontWeight="700"
            lineHeight="57.6px"
          >
            {t('Ganhe mais com seu restaurante no AppJusto')}
          </Heading>
          <HeroTopic mt="4" title={t('Menores taxas do mercado')} />
          <HeroTopic
            title={t('Inclusão automática do cardápio*')}
            ps={t('*Sujeito a condições pré-estabelecidas no momento do cadastro')}
          />
          <HeroTopic title={t('Logística inclusa')} />
          <HeroTopic title={t('Acesso direto ao cliente')} />
        </Flex>
      </Container>
      <Box position="absolute" top="0" left="0" w="100%" zIndex="0">
        <Image src={heroBg} srcMob={heroBgMob} eagerLoading />
      </Box>
    </Section>
  );
};
