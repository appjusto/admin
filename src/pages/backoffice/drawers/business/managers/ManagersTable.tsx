import { AdminRole } from '@appjusto/types';
import { Box, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { ManagerWithPermissions } from 'app/api/manager/types';
import { useManagers } from 'app/api/manager/useManagers';
import React from 'react';
import { t } from 'utils/i18n';
import { ManagersTableItem } from './ManagersTableItem';

interface ManagersTableProps {
  businessManagers?: ManagerWithPermissions[];
  fetchManagers(): void;
}

export const ManagersTable = ({ businessManagers, fetchManagers }: ManagersTableProps) => {
  // context
  const { removeBusinessManager, createManager, createManagerResult } = useManagers();
  // state
  const [managers, setManagers] = React.useState<ManagerWithPermissions[]>();
  const [isLoading, setIsLoading] = React.useState(false);
  // handlers
  const updateMember = async (managerEmail: string, role: AdminRole) => {
    setIsLoading(true);
    setManagers((prev) =>
      prev?.map((manager) => {
        if (manager.email === managerEmail) {
          return { ...manager, role };
        }
        return manager;
      })
    );
    await createManager([{ email: managerEmail, permissions: role }]);
    setIsLoading(false);
  };
  const deleteMember = async (managerEmail: string) => {
    setIsLoading(true);
    await removeBusinessManager(managerEmail);
    setIsLoading(false);
  };
  // side effects
  React.useEffect(() => {
    if (!businessManagers) return;
    setManagers(businessManagers);
  }, [businessManagers]);
  React.useEffect(() => {
    if (!createManagerResult.isSuccess) return;
    fetchManagers();
  }, [createManagerResult.isSuccess, fetchManagers]);
  // UI
  if (!managers) {
    return (
      <Box mt="8">
        <Text fontSize="lg" color="black">
          {t('Carregando colaboradores...')}
        </Text>
      </Box>
    );
  }
  return (
    <Box mt="8">
      <Box overflowX="auto">
        <Table mt="4" size="sm" variant="simple" pos="relative" maxW="624px">
          <Thead>
            <Tr>
              <Th>{t('E-mail')}</Th>
              <Th>{t('Papel')}</Th>
              <Th>{t('Versão')}</Th>
              <Th minW="150px"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {managers.length > 0 ? (
              managers.map((manager) => {
                return (
                  <ManagersTableItem
                    key={manager.uid}
                    manager={manager}
                    updateMember={updateMember}
                    updateSuccess={createManagerResult.isSuccess}
                    deleteMember={deleteMember}
                    isLoading={isLoading}
                  />
                );
              })
            ) : (
              <Tr color="black" fontSize="xs" fontWeight="700">
                <Td>{t('Não há colaboradores adicionados.')}</Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};
