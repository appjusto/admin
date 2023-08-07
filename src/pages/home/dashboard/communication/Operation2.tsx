import { Box } from '@chakra-ui/react';
import { t } from 'utils/i18n';
import { BaseAccordion } from './BaseAccordion';

export const Operation2 = () => {
  return (
    <BaseAccordion
      title={t('🚩 Passo 2')}
      description={t(
        'Configure os acessos de diferentes níveis e oriente sua equipe'
      )}
    >
      <Box></Box>
    </BaseAccordion>
  );
};
