import { Table, Tbody, Td, Tr } from '@chakra-ui/react';
import React from 'react';
import { t } from 'utils/i18n';

interface LogsTableProps {
  logs?: string[];
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
          logs.map((log, index) => (
            <Tr key={`${log}-${index}`} color="black" fontSize="xs" fontWeight="700">
              <Td>{log}</Td>
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
