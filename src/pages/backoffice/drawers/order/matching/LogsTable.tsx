import { OrderMatchingLog, WithId } from '@appjusto/types';
import { Box, Table, Tbody, Td, Text, Tr } from '@chakra-ui/react';
import React from 'react';
import { getHourAndMinute } from 'utils/functions';
import { t } from 'utils/i18n';

interface LogsTableProps {
  logs?: string[] | WithId<OrderMatchingLog>[];
}

export const LogsTable = ({ logs }: LogsTableProps) => {
  // UI
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
          logs.map((log, index) => {
            if (typeof log === 'string')
              return (
                <Tr key={index} color="black" fontSize="xs" fontWeight="700">
                  <Td>{log}</Td>
                </Tr>
              );
            return (
              <Tr key={log.id} color="black" fontSize="xs" fontWeight="700">
                <Td>{getHourAndMinute(log.timestamp)}</Td>
                <Td>
                  <Box>
                    {log.info.map((info, index) => {
                      const isFunction = log.info.length === 2 && index === 0;
                      return (
                        <Text key={info} fontWeight={isFunction ? '700' : '500'}>
                          {info}
                        </Text>
                      );
                    })}
                  </Box>
                </Td>
              </Tr>
            );
          })
        ) : (
          <Tr color="black" fontSize="xs" fontWeight="700">
            <Td>{t('Não foram encontrados registros')}</Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  );
};
