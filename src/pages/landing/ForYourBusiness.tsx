import { Box, BoxProps, Heading, HStack, Image, Text } from '@chakra-ui/react';
import Container from 'common/components/Container';
import { SectionHeading } from 'common/components/landing/SectionHeading';
import check from 'common/img/green-check.svg';
import { t } from 'utils/i18n';
import { Content } from './Content';
import { Section } from './Section';

interface TopicProps extends BoxProps {
  title: string;
  description: string;
}

const Topic = ({ title, description, ...props }: TopicProps) => {
  return (
    <HStack mt="4" spacing={4} alignItems="center" {...props}>
      <Image src={check} width="24px" height="48px" />
      <Box color="black">
        <Heading as="h2" fontSize="2xl" fontWeight="700" lineHeight="3xl">
          {title}
        </Heading>
        <Text fontSize={{ base: 'md', md: 'lg' }} lineHeight={{ base: '22px', md: '26px' }}>
          {description}
        </Text>
      </Box>
    </HStack>
  );
};

export const ForYourBusiness = () => {
  return (
    <Section>
      <Container pt="16" color="black">
        <Content>
          <SectionHeading>{t('Uma plataforma completa para o seu negócio')}</SectionHeading>
          <Text mb="2">
            {t('Entenda como o AppJusto vai ajudar o seu negócio a ser mais justo:')}
          </Text>
          <Topic
            title={t('Preço de cardápio')}
            description={t(
              'O seu restaurante pode praticar o preço de cardápio, pois não será mais necessário passar um custo extra ao cliente.'
            )}
          />
          <Topic
            title={t('Plataforma completa')}
            description={t(
              'Você terá disponível uma plataforma completa de acompanhamento de pedidos, lucros, recebimentos e mais.'
            )}
          />
          <Topic
            title={t('Melhor para entregadores')}
            description={t(
              'Os entregadores também ganham com o AppJusto, podendo criar frotas próprias e receber mais pelo serviço prestado.'
            )}
          />
          <Topic
            title={t('Clientes satisfeitos')}
            description={t(
              'Além de pagar o preço de cardápio, os clientes tem a satisfação de participar de uma sistema mais justo para todos.'
            )}
          />
        </Content>
      </Container>
    </Section>
  );
};
