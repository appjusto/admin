import { Box } from '@chakra-ui/react';
import { t } from 'utils/i18n';
import { BaseAccordion } from './BaseAccordion';

export const Operation3 = () => {
  return (
    <BaseAccordion
      title={t('🚩 Passo 3')}
      description={t(
        'Divulgue que seu restaurante agora faz parte de uma plataforma de impacto social!'
      )}
    >
      <Box></Box>
    </BaseAccordion>
  );
};
