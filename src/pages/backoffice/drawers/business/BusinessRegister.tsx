import { Box } from '@chakra-ui/react';
import { useContextBusinessBackoffice } from 'app/state/business/businessBOContext';
import React from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';
import BOBankingInformation from './forms/BOBankingInformation';
import { BOManagerProfile } from './forms/BOManagerProfile';

export const BusinessRegister = () => {
  // context
  const {
    manager,
    bankAccount,
    handleManagerProfileChange,
    handleBankingInfoChange,
  } = useContextBusinessBackoffice();
  // UI
  return (
    <Box>
      <SectionTitle>{t('Dados pessoais')}</SectionTitle>
      <BOManagerProfile manager={manager} handleChange={handleManagerProfileChange} />
      <SectionTitle>{t('Dados bancários')}</SectionTitle>
      <BOBankingInformation bankAccount={bankAccount} handleChange={handleBankingInfoChange} />
    </Box>
  );
};
