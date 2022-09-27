import { Box } from '@chakra-ui/react';
import { AddMembersForm } from 'pages/team/AddMembersForm';
import { t } from 'utils/i18n';
import { SectionTitle } from '../generics/SectionTitle';
import { ManagersTable } from './managers/ManagersTable';

export const BusinessManagers = () => {
  // UI
  return (
    <Box>
      <SectionTitle>{t('Colaboradores adicionados')}</SectionTitle>
      <ManagersTable />
      <AddMembersForm isBackoffice />
    </Box>
  );
};
