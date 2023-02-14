import { Box } from '@chakra-ui/react';
import { useContextBusinessBackoffice } from 'app/state/business/businessBOContext';
import { AddMembersForm } from 'pages/team/AddMembersForm';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';
import { ManagersTable } from './managers/ManagersTable';

export const BusinessManagers = () => {
  // context
  const { business } = useContextBusinessBackoffice();
  // UI
  return (
    <Box>
      <SectionTitle>{t('Colaboradores adicionados')}</SectionTitle>
      <ManagersTable />
      <AddMembersForm
        businessId={business?.id}
        businessManagers={business?.managers}
        isBackoffice
      />
    </Box>
  );
};
