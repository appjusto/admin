import { Box } from '@chakra-ui/react';
import BankingInformation from 'pages/business-profile/BankingInformation';
import { ManagerProfile } from 'pages/manager-profile/ManagerProfile';
import React from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../SectionTitle';

export const BusinessRegister = () => {
  // context

  // UI
  return (
    <Box>
      <SectionTitle>{t('Dados pessoais')}</SectionTitle>
      <ManagerProfile backoffice />
      <SectionTitle>{t('Dados bancários')}</SectionTitle>
      <BankingInformation backoffice />
    </Box>
  );
};
