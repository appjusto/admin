import { Box, Button, Switch, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { WithId } from 'appjusto-types';
import React from 'react';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';

interface TeamMember {
  email: string;
  isManager: boolean;
  createdOn: firebase.firestore.Timestamp;
}

interface TeamTableProps {
  members: WithId<TeamMember>[];
}

export const TeamTable = ({ members }: TeamTableProps) => {
  // context

  // state

  // handlers
  const updateMember = (memberId: string, isManager: boolean) => {
    console.log(memberId, isManager);
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
          {members && members.length > 0 ? (
            members.map((member) => {
              return (
                <Tr key={member.email} color="black" fontSize="sm">
                  <Td>{member.email}</Td>
                  <Td textAlign="center">
                    <Switch
                      isChecked={member.isManager}
                      onChange={(ev) => {
                        ev.stopPropagation();
                        updateMember(member.id, ev.target.checked);
                      }}
                    />
                  </Td>
                  <Td>{getDateAndHour(member.createdOn as firebase.firestore.Timestamp)}</Td>
                  <Td>
                    <Button size="sm" variant="dangerLight">
                      {t('Excluir colaborador')}
                    </Button>
                  </Td>
                </Tr>
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
