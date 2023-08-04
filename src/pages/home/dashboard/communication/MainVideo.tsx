import { Box, Text } from '@chakra-ui/react';
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
      <Box w="full" h="500px">
        video
      </Box>
    </BaseAccordion>
  );
};
