import { Box, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { ManagerWithRole } from 'app/api/manager/types';
import { useManagers } from 'app/api/manager/useManagers';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import { initialError } from 'common/components/error/utils';
import React from 'react';
import { t } from 'utils/i18n';
import { TeamTableItem } from './TeamTableItem';

export const TeamTable = () => {
  // context
  const {
    managers: businessManagers,
    removeBusinessManager,
    removeResult,
    createManager,
    createResult,
  } = useManagers();

  // state
  const [managers, setManagers] = React.useState<ManagerWithRole[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState(initialError);

  // refs
  const submission = React.useRef(0);

  // handlers
  const clearStates = () => {
    setIsSuccess(false);
    setError(initialError);
  };
  const updateMember = async (managerEmail: string, isManager: boolean) => {
    submission.current += 1;
    clearStates();
    setIsLoading(true);
    setManagers((prev) =>
      prev.map((manager) => {
        if (manager.email === managerEmail) {
          return { ...manager, role: isManager ? 'manager' : 'collaborator' };
        }
        return manager;
      })
    );
    await createManager({ email: managerEmail, role: isManager ? 'manager' : 'collaborator' });
    setIsLoading(false);
  };

  const deleteMember = async (managerEmail: string) => {
    submission.current += 1;
    clearStates();
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
    if (removeResult.isSuccess || createResult.isSuccess) setIsSuccess(true);
  }, [removeResult.isSuccess, createResult.isSuccess]);

  React.useEffect(() => {
    if (removeResult.isError)
      setError({
        status: true,
        error: removeResult.error,
      });
    else if (createResult.isError)
      setError({
        status: true,
        error: createResult.error,
      });
  }, [removeResult.isError, removeResult.error, createResult.isError, createResult.error]);

  // UI
  return (
    <Box mt="8">
      <Text fontSize="lg" color="black">
        {t('Colaboradores adicionados')}
      </Text>
      <Table mt="4" size="md" variant="simple">
        <Thead>
          <Tr>
            <Th>{t('E-mail do colaborador')}</Th>
            <Th>{t('Administrador')}</Th>
            <Th>{t('Adicionado em')}</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {managers && managers.length > 0 ? (
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
      <SuccessAndErrorHandler
        submission={submission.current}
        isSuccess={isSuccess}
        isError={error.status}
        error={error.error}
      />
    </Box>
  );
};
