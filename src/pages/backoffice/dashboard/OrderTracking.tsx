import { Box, Circle, HStack, Icon, Skeleton, Text } from '@chakra-ui/react';
import { useObserveOrderLogs } from 'app/api/order/useObserveOrderLogs';
import { DispatchingState, DispatchingStatus, OrderStatus } from 'appjusto-types';
import { last } from 'lodash';
import React from 'react';
import { MdInfoOutline } from 'react-icons/md';
import { getHourAndMinute } from 'utils/functions';
import { t } from 'utils/i18n';
import { orderDispatchingStatusPTOptions, orderStatusPTOptions } from '../utils';

interface OrderTrackingProps {
  orderId?: string;
  isCompact?: boolean;
}

export const OrderTracking = ({ orderId, isCompact }: OrderTrackingProps) => {
  // state
  const logs = useObserveOrderLogs(orderId);
  const [currentStatus, setCurrentStatus] = React.useState<OrderStatus>();
  const [
    currentDispatchingStatus,
    setCurrentDispatchingStatus,
  ] = React.useState<DispatchingStatus>();
  const [currentDispatchingState, setCurrentDispatchingState] = React.useState<DispatchingState>();
  const [currentTime, setCurrentTime] = React.useState<string>();
  // refs
  const trackingBoxRef = React.useRef<HTMLDivElement>(null);
  // helpers
  const matchingLabelColor =
    currentDispatchingStatus === 'no-match'
      ? '#DC3545'
      : currentDispatchingStatus === 'outsourced'
      ? '#FFBE00'
      : '#055AFF';
  // handlers
  const getMatchingLabel = () => {
    if (currentDispatchingStatus && !currentDispatchingState) {
      if (currentStatus === 'ready' || currentStatus === 'preparing')
        return `${orderDispatchingStatusPTOptions[currentDispatchingStatus].toUpperCase()} `;
    }
    if (currentDispatchingStatus === 'outsourced') return 'ENTREGA TERCEIRIZADA ';
    if (currentDispatchingState === 'going-pickup') return 'ENTREG. A CAMINHO DA RETIRADA ';
    if (currentDispatchingState === 'arrived-pickup') return 'ENTREG. NO LOCAL DA RETIRADA ';
    if (currentDispatchingState === 'going-destination') return 'ENTREG. A CAMINHO DA ENTREGA ';
    if (currentDispatchingState === 'arrived-destination') return 'ENTREG. NO LOCAL DA ENTREGA ';
    return '';
  };
  const getLogsLastStatus = (index: number) => {
    if (!logs) return 'N/E';
    const logsUsed = logs.slice(undefined, index);
    const lastLogWithStatus = last(logsUsed.filter((log) => log.after.status));
    const lastStatus = lastLogWithStatus?.after.status
      ? orderStatusPTOptions[lastLogWithStatus.after.status]
      : 'N/E';
    return lastStatus;
  };
  const getLogMatchingLabel = (status?: DispatchingStatus, state?: DispatchingState) => {
    if (status) return orderDispatchingStatusPTOptions[status];
    else if (state) {
      if (state === 'arrived-pickup') return 'Entreg. no local da retirada ';
      if (state === 'going-destination') return 'Entreg. a caminho da entrega ';
      if (state === 'arrived-destination') return 'Entreg. no local da entrega ';
    }
    return '';
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
    if (lastLog?.after.dispatchingState) setCurrentDispatchingState(lastLog.after.dispatchingState);
    if (trackingBoxRef.current) {
      trackingBoxRef.current.scroll({
        top: trackingBoxRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
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
  return (
    <Box w="100%">
      <Box>
        <HStack spacing={2} alignItems="center">
          <Text fontSize="12px" lineHeight="18px" fontWeight="700">
            {currentStatus ? orderStatusPTOptions[currentStatus].toUpperCase() : 'N/E'}
            {': '}
            <Text as="span" color={matchingLabelColor}>
              {getMatchingLabel()}
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
      {!isCompact && (
        <>
          <Box
            ref={trackingBoxRef}
            mt="4"
            maxH="198px"
            overflowY="scroll"
            p="4"
            bgColor="#F6F6F6"
            borderRadius="16px"
          >
            {logs?.map((log, index) => (
              <Text
                key={log.id}
                mt="2"
                fontSize="15px"
                lineHeight="21px"
                fontWeight="700"
                color="black"
              >
                {log.after.status
                  ? orderStatusPTOptions[log.after.status]
                  : getLogsLastStatus(index)}
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
                  {getLogMatchingLabel(log.after.dispatchingStatus, log.after.dispatchingState)}
                </Text>
                <Text as="span" fontWeight="500">
                  {t(' às ') + getHourAndMinute(log.timestamp)}
                </Text>
              </Text>
            ))}
          </Box>
          <Box mt="2" py="1" px="4" bgColor="#F6F6F6" borderRadius="16px">
            <HStack spacing={6}>
              <HStack>
                <Circle size="8px" bgColor="black" />
                <Text fontSize="15px" lineHeight="21px" fontWeight="700" color="black">
                  {t('Status')}
                </Text>
              </HStack>
              <HStack>
                <Circle size="8px" bgColor="#055AFF" />
                <Text fontSize="15px" lineHeight="21px" fontWeight="700" color="#055AFF">
                  {t('Matching')}
                </Text>
              </HStack>
            </HStack>
          </Box>
        </>
      )}
    </Box>
  );
};
