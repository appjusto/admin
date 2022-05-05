import { Box } from '@chakra-ui/react';
import { useContextBusinessBackoffice } from 'app/state/business/businessBOContext';
import React from 'react';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';
import { ManagersTable } from './managers/ManagersTable';

export const BusinessManagers = () => {
  // context
  const { businessManagers, setIsGetManagersActive, fetchManagers } =
    useContextBusinessBackoffice();
  // side effects
  React.useEffect(() => {
    setIsGetManagersActive(true);
  }, []);
  // UI
  return (
    <Box>
      <SectionTitle>{t('Colaboradores adicionados')}</SectionTitle>
      <ManagersTable businessManagers={businessManagers} fetchManagers={fetchManagers} />
    </Box>
  );
};
