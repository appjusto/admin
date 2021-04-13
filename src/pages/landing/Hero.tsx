import { Box, BoxProps, Flex, Heading, HStack, Text } from '@chakra-ui/react';
import Container from 'common/components/Container';
import Image from 'common/components/Image';
import check from 'common/img/green-check.svg';
import heroBgMob from 'common/img/landing-hero-mobile.jpg';
import heroBg from 'common/img/landing-hero.jpg';
import logo from 'common/img/logo-white.svg';
import { t } from 'utils/i18n';
import { Content } from './Content';
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
        <Heading
          as="h2"
          fontSize={{ base: 'md', md: '2xl' }}
          fontWeight="700"
          lineHeight={{ base: '22px', md: '30px' }}
        >
          {title}
        </Heading>
        {ps && <Text fontSize={{ base: 'xs', md: 'sm' }}>{ps}</Text>}
      </Box>
    </HStack>
  );
};

export const Hero = () => {
  return (
    <Section h={{ base: '600px', md: '840px', lg: '720px' }} bg="black" overflow="hidden">
      <Container zIndex="100">
        <Flex justifyContent="space-between" alignItems="flex-start">
          <Image src={logo} width={{ base: '112px', md: '168px' }} eagerLoading />
        </Flex>
        <Content>
          <Flex mt="8" flexDir="column">
            <Heading
              as="h1"
              maxW="390px"
              color="white"
              fontSize={{ base: '32px', md: '5xl' }}
              fontWeight="700"
              lineHeight={{ base: '38.4px', md: '57.6px' }}
            >
              {t('Ganhe mais com seu restaurante no AppJusto')}
            </Heading>
            <HeroTopic mt="4" title={t('Menores taxas do mercado')} />
            <HeroTopic title={t('Exibição igualitária')} />
            <HeroTopic title={t('Logística inclusa')} />
            <HeroTopic title={t('Acesso direto ao cliente')} />
            <HeroTopic title={t('Transparência e participação')} />
          </Flex>
        </Content>
      </Container>
      <Box position="absolute" top="0" left="0" w="full" zIndex="0">
        <Image src={heroBg} srcMob={heroBgMob} w="full" eagerLoading />
      </Box>
    </Section>
  );
};
