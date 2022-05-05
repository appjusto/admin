import { AdminRole } from '@appjusto/types';
import { Box, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { ManagerWithPermissions } from 'app/api/manager/types';
import { useManagers } from 'app/api/manager/useManagers';
import React from 'react';
import { t } from 'utils/i18n';
import { TeamTableItem } from './TeamTableItem';

interface TeamTableProps {
  businessManagers?: ManagerWithPermissions[];
}

export const TeamTable = ({ businessManagers }: TeamTableProps) => {
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
      <Text fontSize="lg" color="black">
        {t('Colaboradores adicionados')}
      </Text>
      <Box maxW="100vw" overflowX="auto">
        <Table mt="4" size="md" variant="simple" pos="relative" minW="800px">
          <Thead>
            <Tr>
              <Th>{t('E-mail do colaborador')}</Th>
              <Th>{t('Papel do usuário')}</Th>
              <Th>{t('Adicionado em')}</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {managers.length > 0 ? (
              managers.map((manager) => {
                return (
                  <TeamTableItem
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
