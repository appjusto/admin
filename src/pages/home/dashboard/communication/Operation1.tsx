import { Box } from '@chakra-ui/react';
import { t } from 'utils/i18n';
import { BaseAccordion } from './BaseAccordion';

export const Operation1 = () => {
  return (
    <BaseAccordion
      title={t('🚩 Passo 1')}
      description={t(
        'Configure o administrador geral do restaurante (acesso completo)'
      )}
    >
      <Box></Box>
    </BaseAccordion>
  );
};
