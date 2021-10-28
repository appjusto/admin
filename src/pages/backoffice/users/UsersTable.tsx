import { Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { User, WithId } from 'appjusto-types';
import { t } from 'utils/i18n';
import { UsersTableItem } from './UsersTableItem';

interface UsersTableProps {
  users?: WithId<User>[] | null;
}

export const UsersTable = ({ users }: UsersTableProps) => {
  // context

  // UI
  return (
    <Box mt="12" maxW="100vw" overflowX="auto">
      <Table mt="4" size="md" variant="simple" pos="relative">
        <Thead>
          <Tr>
            <Th>{t('Email')}</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {users && users.length > 0 ? (
            users.map((user) => {
              return <UsersTableItem key={user.id} user={user} />;
            })
          ) : (
            <Tr color="black" fontSize="xs" fontWeight="700">
              <Td>{t('Sem resultados para o número informado')}</Td>
              <Td></Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};
