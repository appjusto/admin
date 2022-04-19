import { Box, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { ManagerWithRole } from 'app/api/manager/types';
import { useManagers } from 'app/api/manager/useManagers';
import React from 'react';
import { t } from 'utils/i18n';
import { TeamTableItem } from './TeamTableItem';

export const TeamTable = () => {
  // context
  const { managers: businessManagers, removeBusinessManager, createManager } = useManagers();
  // state
  const [managers, setManagers] = React.useState<ManagerWithRole[]>();
  const [isLoading, setIsLoading] = React.useState(false);
  // handlers
  const updateMember = async (managerEmail: string, isManager: boolean) => {
    setIsLoading(true);
    setManagers((prev) =>
      prev?.map((manager) => {
        if (manager.email === managerEmail) {
          return { ...manager, role: isManager ? 'manager' : 'collaborator' };
        }
        return manager;
      })
    );
    await createManager([{ email: managerEmail, role: isManager ? 'manager' : 'collaborator' }]);
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
              <Th>{t('Administrador')}</Th>
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
