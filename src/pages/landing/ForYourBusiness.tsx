import { Box, BoxProps, Heading, Image, Stack, Text } from '@chakra-ui/react';
import Container from 'common/components/Container';
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
    <Stack mt="4" direction={{ base: 'column', md: 'row' }} spacing={4} {...props}>
      <Box minW="24px" textAlign="start">
        <Image src={check} width="24px" height="48px" />
      </Box>
      <Box color="black">
        <Heading as="h2" fontSize="2xl" fontWeight="700" lineHeight="3xl">
          {title}
        </Heading>
        <Text fontSize={{ base: 'md', md: 'lg' }} lineHeight={{ base: '22px', md: '26px' }}>
          {description}
        </Text>
      </Box>
    </Stack>
  );
};

export const ForYourBusiness = () => {
  return (
    <Section>
      <Container pt="16" color="black">
        <Content>
          <Topic
            title={t('Exibição igualitária')}
            description={t(
              'A organização da lista de restaurantes é primariamente por distância, sem que hajam beneficiados ou prejudicados.'
            )}
          />
          <Topic
            title={t('Logística inclusa')}
            description={t(
              'A operação logística é por nossa conta, e os entregadores são valorizados e bem remunerados.'
            )}
          />
          <Topic
            title={t('Acesso aos clientes')}
            description={t(
              'Pelo AppJusto os restaurantes voltam a ter acesso aos clientes, com dados como nome, endereço e telefone, sendo disponibilizados sempre que permitirem.'
            )}
          />
          <Topic
            title={t('Transparência e participação')}
            description={t(
              'Todas as regras da plataforma serão transparentes e haverá canais para que os integrantes participem de decisões sobre mudanças.'
            )}
          />
        </Content>
      </Container>
    </Section>
  );
};
