import { Box, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { useManagers } from 'app/api/manager/useManagers';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import React from 'react';
import { t } from 'utils/i18n';
import { TeamTableItem } from './TeamTableItem';

export const TeamTable = () => {
  // context
  const { managers, removeBusinessManager, removeResult } = useManagers();
  const { isLoading, isSuccess, isError, error } = removeResult;

  // refs
  const submission = React.useRef(0);

  // handlers
  const updateMember = (memberId: string, isManager: boolean) => {
    submission.current += 1;
    console.log('update', memberId, isManager);
  };

  const deleteMember = async (managerEmail: string) => {
    console.log('delete', managerEmail);
    submission.current += 1;
    await removeBusinessManager(managerEmail);
  };

  // side effects

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
        isError={isError}
        error={error}
      />
    </Box>
  );
};
