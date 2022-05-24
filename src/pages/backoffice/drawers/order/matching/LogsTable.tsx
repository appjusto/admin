import { OrderMatchingLog, WithId } from '@appjusto/types';
import { Table, Tbody, Td, Tr } from '@chakra-ui/react';
import React from 'react';
import { getDateAndHour } from 'utils/functions';
import { t } from 'utils/i18n';

interface LogsTableProps {
  logs?: WithId<OrderMatchingLog>[];
}

export const LogsTable = ({ logs }: LogsTableProps) => {
  if (!logs)
    return (
      <Table mt="4" size="md" variant="simple">
        <Tbody>
          <Tr color="black" fontSize="xs" fontWeight="700">
            <Td>{t('Carregando registros...')}</Td>
          </Tr>
        </Tbody>
      </Table>
    );
  return (
    <Table mt="4" size="md" variant="simple">
      <Tbody>
        {logs && logs.length > 0 ? (
          logs.map((log) => (
            <Tr key={log.id} color="black" fontSize="xs" fontWeight="700">
              <Td>{getDateAndHour(log.timestamp)}</Td>
              <Td>{JSON.stringify(log.info)}</Td>
            </Tr>
          ))
        ) : (
          <Tr color="black" fontSize="xs" fontWeight="700">
            <Td>{t('Não foram encontrados registros')}</Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  );
};
