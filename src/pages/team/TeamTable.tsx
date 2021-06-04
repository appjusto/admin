import { Box, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { BusinessManager } from 'app/api/manager/types';
import { WithId } from 'appjusto-types';
import React from 'react';
import { t } from 'utils/i18n';
import { TeamTableItem } from './TeamTableItem';

interface TeamTableProps {
  managers?: WithId<BusinessManager>[];
}

export const TeamTable = ({ managers }: TeamTableProps) => {
  // context

  // state

  // handlers
  const updateMember = (memberId: string, isManager: boolean) => {
    console.log('update', memberId, isManager);
  };

  const deleteMember = (memberId: string) => {
    console.log('delete', memberId);
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
            managers.map((manager: WithId<BusinessManager>) => {
              return (
                <TeamTableItem
                  key={manager.id}
                  manager={manager}
                  updateMember={updateMember}
                  deleteMember={deleteMember}
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
  );
};
