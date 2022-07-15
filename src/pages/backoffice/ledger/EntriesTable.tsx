import { LedgerEntry, WithId } from '@appjusto/types';
import { Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { t } from 'utils/i18n';
import { EntriesTableItem } from './EntriesTableItem';

interface EntriesTableProps {
  entries?: WithId<LedgerEntry>[] | null;
}

export const EntriesTable = ({ entries }: EntriesTableProps) => {
  // UI
  return (
    <Box mt="6" maxW="100vw" overflowX="auto">
      <Table mt="4" size="md" variant="simple" pos="relative">
        <Thead>
          <Tr>
            <Th>{t('ID do pedido')}</Th>
            <Th>{t('Data')}</Th>
            <Th>{t('Status')}</Th>
            <Th>{t('Valor')}</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {!entries ? (
            <Tr color="black" fontSize="xs" fontWeight="700">
              <Td>{t('Carregando faturas...')}</Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
            </Tr>
          ) : entries.length > 0 ? (
            entries.map((entry) => {
              return <EntriesTableItem key={entry.id} entry={entry} />;
            })
          ) : (
            <Tr color="black" fontSize="xs" fontWeight="700">
              <Td>{t('Não foram encontrados resultados')}</Td>
              <Td></Td>
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
