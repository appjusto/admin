import { Box } from '@chakra-ui/react';
import React from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';
import BOBankingInformation from './forms/BOBankingInformation';
import { BOManagerProfile } from './forms/BOManagerProfile';

export const BusinessRegister = () => {
  // UI
  return (
    <Box>
      <SectionTitle>{t('Dados pessoais')}</SectionTitle>
      <BOManagerProfile />
      <SectionTitle>{t('Dados bancários')}</SectionTitle>
      <BOBankingInformation />
    </Box>
  );
};
