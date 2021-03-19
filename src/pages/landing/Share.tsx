import { Box, Text } from '@chakra-ui/react';
import Container from 'common/components/Container';
import { SectionHeading } from 'common/components/landing/SectionHeading';
import SharingBar from 'common/components/landing/share/SharingBar';
import { t } from 'utils/i18n';
import { Section } from './Section';

export const Share = () => {
  return (
    <Section>
      <Container pt="16" pb="24" color="black">
        <Box maxW="656px">
          <SectionHeading>{t('Divulgue esse movimento')}</SectionHeading>
          <Text mb="6">
            {t(
              'Para chegar mais rápido a todas as cidades, o AppJusto precisa da sua ajuda. Divulgue nas suas rede e ajude o movimento a crescer:'
            )}
          </Text>
          <SharingBar />
        </Box>
      </Container>
    </Section>
  );
};
