import { AdminRole } from '@appjusto/types';
import { Box, HStack, Icon, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { ManagerWithRole } from 'app/api/manager/types';
import { useManagers } from 'app/api/manager/useManagers';
import { useContextBusiness } from 'app/state/business/context';
import React from 'react';
import { t } from 'utils/i18n';
import { TeamTableItem } from './TeamTableItem';

export const TeamTable = () => {
  // context
  const { businessManagers, platformAccess } = useContextBusiness();
  const { removeBusinessManager, createManager, createManagerResult } = useManagers();
  // state
  const [managers, setManagers] = React.useState<ManagerWithRole[]>();
  const [isLoading, setIsLoading] = React.useState(false);
  // helpers
  const minVersion = platformAccess?.minVersions?.businessWeb;
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
        <Table mt="4" size="sm" variant="simple" pos="relative" minW="800px">
          <Thead>
            <Tr>
              <Th>{t('E-mail do colaborador')}</Th>
              <Th>{t('Papel do usuário')}</Th>
              <Th>{t('Adicionado em')}</Th>
              <Th>{t('Versão')}</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {managers.length > 0 ? (
              managers.map((manager) => {
                return (
                  <TeamTableItem
                    key={manager.id}
                    manager={manager}
                    minVersion={minVersion}
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
        <HStack mt="8" fontSize="13px">
          <Text>{t('Legenda da versão:')}</Text>
          <HStack>
            <Text>{t('Ativa')}</Text>
            <Icon mt="-2px" viewBox="0 0 200 200" color="black">
              <path
                fill="currentColor"
                d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
              />
            </Icon>
          </HStack>
          <HStack>
            <Text>{t('Inativa')}</Text>
            <Icon mt="-2px" viewBox="0 0 200 200" color="red">
              <path
                fill="currentColor"
                d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
              />
            </Icon>
          </HStack>
        </HStack>
      </Box>
    </Box>
  );
};
