import { OrderMatchingLog, WithId } from '@appjusto/types';
import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { getFullTime } from 'utils/functions';
import { t } from 'utils/i18n';

const renderList = (logs?: string[] | WithId<OrderMatchingLog>[]) => {
  // UI
  if (!logs)
    return (
      <Flex flexDir="column">
        <Box p="2" minH="60px" color="black" fontSize="xs" fontWeight="700">
          <Text>{t('Carregando registros...')}</Text>
        </Box>
      </Flex>
    );
  return (
    <Flex flexDir="column">
      <Box>
        {logs && logs.length > 0 ? (
          logs.map((log, index) => {
            if (typeof log === 'string')
              return (
                <Box key={`${log}-${index}`} px="4" py="2" minH="60px">
                  <Text color="black" fontSize="xs" fontWeight="700">
                    {log}
                  </Text>
                </Box>
              );
            return (
              <Flex
                key={log.id}
                flexDir="row"
                color="black"
                fontSize="xs"
                fontWeight="700"
                px="4"
                py="2"
                minH="60px"
                // mb="2"
                borderBottom="1px solid #ECF0E3"
              >
                <Box minW="80px">
                  <Text>{getFullTime(log.timestamp)}</Text>
                </Box>
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
              </Flex>
            );
          })
        ) : (
          <Box px="4" py="2" minH="60px">
            <Text color="black" fontSize="xs" fontWeight="700">
              {t('Não foram encontrados registros')}
            </Text>
          </Box>
        )}
      </Box>
    </Flex>
  );
};

interface LogsTableProps {
  logs?: string[] | WithId<OrderMatchingLog>[];
  fetchNextLogs?: () => void;
}

export const LogsTable = ({ logs, fetchNextLogs }: LogsTableProps) => {
  // refs
  const listRef = React.useRef<HTMLDivElement>(null);
  // side effects
  React.useEffect(() => {
    if (!listRef.current || !fetchNextLogs) return;
    const handleScrollTop = () => {
      if (listRef.current) {
        let shouldLoad =
          listRef.current.scrollHeight - listRef.current.scrollTop < 350;
        if (shouldLoad) {
          fetchNextLogs();
        }
      }
    };
    listRef.current.addEventListener('scroll', handleScrollTop);
    return () => document.removeEventListener('scroll', handleScrollTop);
  }, [listRef, fetchNextLogs]);
  // UI
  return (
    <Box
      ref={listRef}
      mt="4"
      minH="200px"
      maxH="300px"
      overflowY="scroll"
      border="1px solid #ECF0E3"
      borderRadius="lg"
    >
      {renderList(logs)}
    </Box>
  );
};
