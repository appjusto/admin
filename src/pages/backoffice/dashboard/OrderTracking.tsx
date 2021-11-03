import { Box, HStack, Icon, Skeleton, Text } from '@chakra-ui/react';
import { useObserveOrderLogs } from 'app/api/order/useObserveOrderLogs';
import { DispatchingStatus, OrderStatus } from 'appjusto-types';
import { last } from 'lodash';
import React from 'react';
import { MdInfoOutline } from 'react-icons/md';
import { getHourAndMinute } from 'utils/functions';
import { t } from 'utils/i18n';
import { orderStatusPTOptions } from '../utils';

interface OrderTrackingProps {
  orderId?: string;
  type?: 'full' | 'compact' | 'mini';
}

export const OrderTracking = ({ orderId, type = 'full' }: OrderTrackingProps) => {
  // state
  const logs = useObserveOrderLogs(orderId);
  const [currentStatus, setCurrentStatus] = React.useState<OrderStatus>();
  const [
    currentDispatchingStatus,
    setCurrentDispatchingStatus,
  ] = React.useState<DispatchingStatus>();
  const [currentTime, setCurrentTime] = React.useState<string>();
  // helpers
  const matchingLabel =
    currentDispatchingStatus && (currentStatus === 'ready' || currentStatus === 'preparing')
      ? `${currentDispatchingStatus?.toUpperCase()} ` ?? ''
      : '';
  const matchingLabelColor =
    currentDispatchingStatus === 'no-match'
      ? '#DC3545'
      : currentDispatchingStatus === 'outsourced'
      ? '#FFBE00'
      : '#055AFF';
  // handlers
  const getLogsLastStatus = (index: number) => {
    if (!logs) return 'N/E';
    const logsUsed = logs.slice(undefined, index);
    const lastLogWithStatus = last(logsUsed.filter((log) => log.after.status));
    const lastStatus = lastLogWithStatus?.after.status
      ? orderStatusPTOptions[lastLogWithStatus.after.status]
      : 'N/E';
    return lastStatus;
  };
  // side effects
  React.useEffect(() => {
    if (!logs) return;
    const lastLog = last(logs);
    const lastLogWithStatus = last(logs.filter((log) => log.after.status));
    if (lastLog) setCurrentTime(getHourAndMinute(lastLog.timestamp));
    if (lastLogWithStatus) setCurrentStatus(lastLogWithStatus.after.status);
    if (lastLog?.after.dispatchingStatus)
      setCurrentDispatchingStatus(lastLog.after.dispatchingStatus);
  }, [logs]);
  // UI
  if (logs === undefined) {
    return (
      <Box w="100%" pb="2">
        <Skeleton height="20px" maxW="260px" />
        <Skeleton mt="2" height="20px" />
      </Box>
    );
  }
  if (logs === null) {
    return (
      <Box>
        <Text>{t('Não foi possível carregar os logs deste pedido.! =/')}</Text>
      </Box>
    );
  }
  if (type === 'mini') {
    return (
      <HStack mt="2" spacing={2}>
        <Box
          w="full"
          h="4px"
          borderRadius="lg"
          bgColor={
            currentStatus &&
            ['confirmed', 'preparing', 'ready', 'dispatching', 'delivered'].includes(currentStatus)
              ? '#2F422C'
              : '#C8D7CB'
          }
        />
        <Box
          w="full"
          h="4px"
          borderRadius="lg"
          bgColor={
            currentStatus &&
            ['preparing', 'ready', 'dispatching', 'delivered'].includes(currentStatus)
              ? '#2F422C'
              : '#C8D7CB'
          }
        />
        <Box
          w="full"
          h="4px"
          borderRadius="lg"
          bgColor={
            currentStatus && ['ready', 'dispatching', 'delivered'].includes(currentStatus)
              ? '#2F422C'
              : '#C8D7CB'
          }
        />
        {currentStatus && !['preparing', 'ready', 'dispatching'].includes(currentStatus) ? (
          <Box
            w="full"
            h="4px"
            borderRadius="lg"
            bgColor={currentStatus === 'delivered' ? '#2F422C' : '#C8D7CB'}
          />
        ) : (
          <Box w="full" h="4px" borderRadius="lg" bgColor={matchingLabelColor} />
        )}
        <Box
          w="full"
          h="4px"
          borderRadius="lg"
          bgColor={currentStatus === 'delivered' ? '#2F422C' : '#C8D7CB'}
        />
      </HStack>
    );
  }
  return (
    <Box w="100%">
      <Box>
        <HStack spacing={2} alignItems="center">
          <Text fontSize="12px" lineHeight="18px" fontWeight="700">
            {currentStatus ? orderStatusPTOptions[currentStatus].toUpperCase() : 'N/E'}
            {': '}
            <Text as="span" color={matchingLabelColor}>
              {matchingLabel}
            </Text>
            <Text as="span" fontWeight="500">
              {t('às ') + currentTime}
            </Text>
          </Text>
          <Icon as={MdInfoOutline} w="14px" h="14px" />
        </HStack>
        <HStack mt="2" spacing={2}>
          <Box
            w="full"
            h="4px"
            borderRadius="lg"
            bgColor={
              currentStatus &&
              ['confirmed', 'preparing', 'ready', 'dispatching', 'delivered'].includes(
                currentStatus
              )
                ? '#2F422C'
                : '#C8D7CB'
            }
          />
          <Box
            w="full"
            h="4px"
            borderRadius="lg"
            bgColor={
              currentStatus &&
              ['preparing', 'ready', 'dispatching', 'delivered'].includes(currentStatus)
                ? '#2F422C'
                : '#C8D7CB'
            }
          />
          <Box
            w="full"
            h="4px"
            borderRadius="lg"
            bgColor={
              currentStatus && ['ready', 'dispatching', 'delivered'].includes(currentStatus)
                ? '#2F422C'
                : '#C8D7CB'
            }
          />
          {currentStatus && !['preparing', 'ready', 'dispatching'].includes(currentStatus) ? (
            <Box
              w="full"
              h="4px"
              borderRadius="lg"
              bgColor={currentStatus === 'delivered' ? '#2F422C' : '#C8D7CB'}
            />
          ) : (
            <Box w="full" h="4px" borderRadius="lg" bgColor={matchingLabelColor} />
          )}
          <Box
            w="full"
            h="4px"
            borderRadius="lg"
            bgColor={currentStatus === 'delivered' ? '#2F422C' : '#C8D7CB'}
          />
        </HStack>
      </Box>
      {type === 'full' && (
        <Box mt="4" maxH="198px" overflowY="scroll" p="4" bgColor="#F6F6F6" borderRadius="16px">
          {logs?.map((log, index) => (
            <Text
              key={log.id}
              mt="2"
              fontSize="15px"
              lineHeight="21px"
              fontWeight="700"
              color="black"
            >
              {log.after.status ? orderStatusPTOptions[log.after.status] : getLogsLastStatus(index)}
              {': '}
              <Text
                as="span"
                color={
                  log.after.dispatchingStatus === 'no-match'
                    ? '#DC3545'
                    : log.after.dispatchingStatus === 'outsourced'
                    ? '#FFBE00'
                    : '#055AFF'
                }
              >
                {log.after.dispatchingStatus ?? ''}
              </Text>
              <Text as="span" fontWeight="500">
                {t(' às ') + getHourAndMinute(log.timestamp)}
              </Text>
            </Text>
          ))}
        </Box>
      )}
    </Box>
  );
};
