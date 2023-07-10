import { Complaint, WithId } from '@appjusto/types';
import { Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { t } from 'utils/i18n';
import { ComplaintsTableItem } from './ComplaintsTableItem';

interface ComplaintsTableProps {
  complaints?: WithId<Complaint>[] | null;
}

export const ComplaintsTable = ({ complaints }: ComplaintsTableProps) => {
  // helpers
  const isLoading = complaints === undefined;
  const isEmpty = !complaints || complaints.length === 0;
  // UI
  return (
    <Box mt="6" maxW="100vw" overflowX="auto">
      <Table mt="4" size="md" variant="simple" pos="relative">
        <Thead>
          <Tr>
            <Th>{t('ID do pedido')}</Th>
            <Th>{t('Criada em')}</Th>
            <Th>{t('Autor')}</Th>
            <Th>{t('Nome')}</Th>
            <Th>{t('Status')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {isLoading && (
            <Tr color="black" fontSize="xs" fontWeight="700">
              <Td>{t('Carregando faturas...')}</Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
            </Tr>
          )}
          {isEmpty && (
            <Tr color="black" fontSize="xs" fontWeight="700">
              <Td>{t('Não foram encontrados resultados')}</Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
            </Tr>
          )}
          {complaints &&
            complaints.map((complaint) => {
              return (
                <ComplaintsTableItem key={complaint.id} data={complaint} />
              );
            })}
        </Tbody>
      </Table>
    </Box>
  );
};
