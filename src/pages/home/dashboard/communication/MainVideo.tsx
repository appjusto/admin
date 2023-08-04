import { AspectRatio, Box, Text } from '@chakra-ui/react';
import { t } from 'utils/i18n';
import { BaseAccordion } from './BaseAccordion';

export const MainVideo = () => {
  return (
    <BaseAccordion
      title={t(
        'Nosso propósito: gerar impacto social positivo na economia de plataforma'
      )}
      description={
        <Text textAlign="start">
          {t('Conheça nossa ')}
          <Text as="span" fontWeight="semibold">
            {t('história e motivação')}
          </Text>
          {t(' com o Rog, co-fundador do AppJusto')}
        </Text>
      }
      defaultIndex={[0]}
    >
      <Box mt="6" w="full" borderRadius="lg" overflow="hidden">
        <AspectRatio ratio={9 / 5}>
          <iframe
            title="AppJusto é o app de delivery bom pra todos"
            src="https://www.youtube.com/embed/BaEiVN7OZWE"
            allowFullScreen
          />
        </AspectRatio>
      </Box>
    </BaseAccordion>
  );
};
