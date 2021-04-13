import { Text } from '@chakra-ui/react';
import Container from 'common/components/Container';
import { SectionHeading } from 'common/components/landing/SectionHeading';
import SharingBar from 'common/components/landing/share/SharingBar';
import { t } from 'utils/i18n';
import { Content } from './Content';
import { Section } from './Section';

export const Share = () => {
  return (
    <Section id="shareSection">
      <Container pt="16" pb="24" color="black">
        <Content>
          <SectionHeading>{t('Precisamos da força dos restaurantes!')}</SectionHeading>
          <Text mb="6">
            {t(
              'Para nos tornarmos uma alternativa viável, precisamos alcançar todas as pessoas interessadas em um delivery mais justo. Nos ajude divulgando nossa proposta nas redes:'
            )}
          </Text>
          <SharingBar />
        </Content>
      </Container>
    </Section>
  );
};
