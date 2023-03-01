import { AdminRole, ManagerWithRole } from '@appjusto/types';
import {
  Box,
  HStack,
  Icon,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useManagers } from 'app/api/manager/useManagers';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextBusiness } from 'app/state/business/context';
import { useContextAppRequests } from 'app/state/requests/context';
import React from 'react';
import { t } from 'utils/i18n';
import { TeamTableItem } from './TeamTableItem';

export const TeamTable = () => {
  // context
  const { minVersion } = useContextFirebaseUser();
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { business, businessManagers } = useContextBusiness();
  const {
    updateBusinessManager,
    createManager,
    createManagerResult,
    updateManagersResult,
  } = useManagers(business?.id);
  // state
  const [managers, setManagers] = React.useState<ManagerWithRole[]>();
  const [isLoading, setIsLoading] = React.useState(false);
  // handlers
  const updateMember = (managerEmail: string, role: AdminRole) => {
    setManagers((prev) =>
      prev?.map((manager) => {
        if (manager.email === managerEmail) {
          return { ...manager, role };
        }
        return manager;
      })
    );
    createManager([{ email: managerEmail, permissions: role }]);
  };
  const deleteMember = (managerEmail: string) => {
    if (!business?.managers) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'ManagersTable-deleteMember-error',
        message: {
          title: 'Não foi possível encontrar os dados dos colaboradores.',
          description:
            'Recarregue a página, para tentar novamente, ou contate nosso suporte.',
        },
      });
    }
    const managers = business.managers.filter(
      (email) => email !== managerEmail
    );
    updateBusinessManager(managers);
  };
  // side effects
  React.useEffect(() => {
    if (!businessManagers) return;
    setManagers(businessManagers);
  }, [businessManagers]);
  React.useEffect(() => {
    if (!createManagerResult.isLoading && !updateManagersResult.isLoading)
      setIsLoading(false);
    else if (createManagerResult.isLoading || updateManagersResult.isLoading)
      setIsLoading(true);
  }, [createManagerResult.isLoading, updateManagersResult.isLoading]);
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
              <Th>{t('Versão (web)/(mob)')}</Th>
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
