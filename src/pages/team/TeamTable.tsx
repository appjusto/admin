import {
  Box,
  Button,
  HStack,
  Switch,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
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

interface TeamTableItemProps {
  member: WithId<TeamMember>;
  updateMember(memberId: string, isManager: boolean): void;
  deleteMember(memberId: string): void;
}

const TeamTableItem = ({ member, updateMember, deleteMember }: TeamTableItemProps) => {
  // state
  const [isDeleting, setIsDeleting] = React.useState(false);
  // handlers

  // UI
  return (
    <Tr
      key={member.email}
      color="black"
      fontSize="sm"
      h="66px"
      bg={isDeleting ? 'rgba(254, 215, 215, 0.3)' : 'none'}
    >
      <Td>{member.email}</Td>
      {isDeleting ? (
        <>
          <Td>{t('Confirmar exclusão?')}</Td>
          <Td position="relative">
            <Box position="absolute" top="4">
              <HStack spacing={4}>
                <Button w="150px" size="sm" onClick={() => setIsDeleting(false)}>
                  {t('Manter')}
                </Button>
                <Button
                  w="150px"
                  size="sm"
                  variant="danger"
                  onClick={() => deleteMember(member.id)}
                >
                  {t('Excluir')}
                </Button>
              </HStack>
            </Box>
          </Td>
          <Td></Td>
        </>
      ) : (
        <>
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
            <Button size="sm" variant="dangerLight" onClick={() => setIsDeleting(true)}>
              {t('Excluir colaborador')}
            </Button>
          </Td>
        </>
      )}
    </Tr>
  );
};

export const TeamTable = ({ members }: TeamTableProps) => {
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
          {members && members.length > 0 ? (
            members.map((member) => {
              return (
                <TeamTableItem
                  key={member.id}
                  member={member}
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
