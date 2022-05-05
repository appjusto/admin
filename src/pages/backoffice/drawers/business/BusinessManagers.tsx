import { Box } from '@chakra-ui/react';
import { useContextBusinessBackoffice } from 'app/state/business/businessBOContext';
import React from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';
import { ManagersTable } from './managers/ManagersTable';

export const BusinessManagers = () => {
  // context
  const { setIsGetManagersActive } = useContextBusinessBackoffice();
  // side effects
  React.useEffect(() => {
    setIsGetManagersActive(true);
  }, [setIsGetManagersActive]);
  // UI
  return (
    <Box>
      <SectionTitle>{t('Colaboradores adicionados')}</SectionTitle>
      <ManagersTable />
    </Box>
  );
};
