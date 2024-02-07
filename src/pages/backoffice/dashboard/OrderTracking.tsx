import {
  DispatchingState,
  DispatchingStatus,
  OrderChangeLog,
  OrderInfoLog,
  OrderStatus,
  WithId,
} from '@appjusto/types';
import { Box, Circle, HStack, Icon, Skeleton, Text } from '@chakra-ui/react';
import { useObserveOrderTrackingLogs } from 'app/api/order/useObserveOrderTrackingLogs';
import { last } from 'lodash';
import React from 'react';
import { MdAccessTime, MdInfoOutline } from 'react-icons/md';
import { getFullTime } from 'utils/functions';
import { t } from 'utils/i18n';
import {
  orderDispatchingStatusPTOptions,
  orderStatusPTOptions,
} from '../utils';

interface OrderTrackingProps {
  orderId?: string;
  warning?: string | null;
  isCompact?: boolean;
}

type OrderTrakingLog = OrderChangeLog | OrderInfoLog;

export const OrderTracking = ({
  orderId,
  warning,
  isCompact,
}: OrderTrackingProps) => {
  // state
  const trackingLogs = useObserveOrderTrackingLogs(orderId);

  const [filteredLogs, setFilteredLogs] =
    React.useState<WithId<OrderTrakingLog>[]>();
  const [currentStatus, setCurrentStatus] = React.useState<OrderStatus>();
  const [currentDispatchingStatus, setCurrentDispatchingStatus] =
    React.useState<DispatchingStatus>();
  const [currentDispatchingState, setCurrentDispatchingState] =
    React.useState<DispatchingState>();
  const [currentTime, setCurrentTime] = React.useState<string>();
  // refs
  const trackingBoxRef = React.useRef<HTMLDivElement>(null);
  // handlers
  const getMatchingLabelColor = () => {
    let color = '#C8D7CB';
    if (currentDispatchingStatus === 'no-match') color = '#DC3545';
    else if (currentDispatchingStatus === 'outsourced') color = '#FFBE00';
    else if (
      (currentDispatchingStatus && currentDispatchingStatus !== 'scheduled') ||
      currentDispatchingState
    )
      color = '#055AFF';
    return color;
  };
  const getMatchingLabel = () => {
    if (currentDispatchingStatus && !currentDispatchingState) {
      if (currentStatus === 'ready' || currentStatus === 'preparing')
        if (currentDispatchingStatus !== 'scheduled')
          return `${orderDispatchingStatusPTOptions[
            currentDispatchingStatus
          ].toUpperCase()} `;
    }
    if (currentDispatchingStatus === 'outsourced')
      return 'ENTREGA TERCEIRIZADA ';
    if (currentDispatchingState === 'going-pickup')
      return 'ENTREG. A CAMINHO DA RETIRADA ';
    if (currentDispatchingState === 'arrived-pickup')
      return 'ENTREG. NO LOCAL DA RETIRADA ';
    if (currentDispatchingState === 'going-destination')
      return 'ENTREG. A CAMINHO DA ENTREGA ';
    if (currentDispatchingState === 'arrived-destination')
      return 'ENTREG. NO LOCAL DA ENTREGA ';
    return '';
  };
  const getLogsLastStatus = (index: number) => {
    if (!filteredLogs) return 'N/E';
    const logsUsed = filteredLogs.slice(undefined, index);
    const lastLogWithStatus = last(
      logsUsed.filter(
        (log) => 'after' in log && log.after.status
      ) as WithId<OrderChangeLog>[]
    );
    const lastStatus = lastLogWithStatus?.after.status
      ? orderStatusPTOptions[lastLogWithStatus.after.status]
      : 'N/E';
    return lastStatus;
  };
  const getLogMatchingLabel = (
    status?: DispatchingStatus,
    state?: DispatchingState | null
  ) => {
    if (status) return orderDispatchingStatusPTOptions[status];
    else if (state) {
      if (state === 'going-pickup') return 'Entreg. a caminho da retirada ';
      if (state === 'arrived-pickup') return 'Entreg. no local da retirada ';
      if (state === 'going-destination') return 'Entreg. a caminho da entrega ';
      if (state === 'arrived-destination')
        return 'Entreg. no local da entrega ';
    }
    return '';
  };
  // side effects
  React.useEffect(() => {
    if (!trackingLogs?.length) return;
    console.log(trackingLogs[0]);
    if (trackingLogs[0].type !== undefined) {
      console.log('New logs');
      const filtered = trackingLogs?.filter((log) => {
        if (log.type === 'change') {
          return (
            log.after.status ||
            log.after.dispatchingStatus ||
            log.after.dispatchingState
          );
        }
        if (log.type === 'info') {
          return log.info[0] === 'twilioHookHandler';
        }
        return false;
      }) as WithId<OrderTrakingLog>[];
      setFilteredLogs(filtered);
    } else {
      console.log('Old logs');
      setFilteredLogs(trackingLogs as WithId<OrderTrakingLog>[]);
    }
  }, [trackingLogs]);
  React.useEffect(() => {
    if (!filteredLogs) return;
    // get last logs
    const lastLog = last(filteredLogs);
    const lastLogWithStatus = last(
      filteredLogs.filter(
        (log) => 'after' in log && log.after.status
      ) as WithId<OrderChangeLog>[]
    );
    // set current time and status
    if (lastLog) setCurrentTime(getFullTime(lastLog.timestamp));
    if (lastLogWithStatus) setCurrentStatus(lastLogWithStatus.after.status);
    // set current dispatching state and status
    if (lastLog && 'after' in lastLog && lastLog?.after.dispatchingStatus) {
      if (lastLog.after.dispatchingStatus === 'matching')
        setCurrentDispatchingState(undefined);
      setCurrentDispatchingStatus(lastLog.after.dispatchingStatus);
    }
    if (lastLog && 'after' in lastLog && lastLog?.after.dispatchingState)
      setCurrentDispatchingState(lastLog.after.dispatchingState);
    // handle scroll
    if (trackingBoxRef.current) {
      trackingBoxRef.current.scroll({
        top: trackingBoxRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [filteredLogs]);
  // UI
  const matchingLabelColor = getMatchingLabelColor();
  if (filteredLogs === undefined) {
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
        <HStack spacing={4} alignItems="center">
          <HStack spacing={2} alignItems="center">
            <Text fontSize="12px" lineHeight="18px" fontWeight="700">
              {currentStatus
                ? orderStatusPTOptions[currentStatus].toUpperCase()
                : 'N/E'}
              {': '}
              <Text as="span" color={matchingLabelColor}>
                {getMatchingLabel()}
              </Text>
              <Text as="span" fontWeight="500">
                {t('às ') + currentTime}
              </Text>
            </Text>
            <Icon as={MdAccessTime} w="14px" h="14px" />
          </HStack>
          {warning && (
            <HStack spacing={2} alignItems="center" color="red">
              <Text fontSize="12px" lineHeight="18px" fontWeight="700">
                {warning ?? 'N/E'}
              </Text>
              <Icon as={MdInfoOutline} w="14px" h="14px" />
            </HStack>
          )}
        </HStack>
        <HStack mt="2" spacing={2}>
          <Box
            w="full"
            h="4px"
            borderRadius="lg"
            bgColor={
              currentStatus &&
              [
                'confirmed',
                'preparing',
                'ready',
                'dispatching',
                'delivered',
              ].includes(currentStatus)
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
              ['preparing', 'ready', 'dispatching', 'delivered'].includes(
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
              ['ready', 'dispatching', 'delivered'].includes(currentStatus)
                ? '#2F422C'
                : '#C8D7CB'
            }
          />
          {currentStatus &&
          !['preparing', 'ready', 'dispatching'].includes(currentStatus) ? (
            <Box
              w="full"
              h="4px"
              borderRadius="lg"
              bgColor={currentStatus === 'delivered' ? '#2F422C' : '#C8D7CB'}
            />
          ) : (
            <Box
              w="full"
              h="4px"
              borderRadius="lg"
              bgColor={matchingLabelColor}
            />
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
            {filteredLogs.map((log, index) => {
              if (log.type === 'change') {
                return (
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
                      {getLogMatchingLabel(
                        log.after.dispatchingStatus,
                        log.after.dispatchingState
                      )}
                    </Text>
                    <Text as="span" fontWeight="500">
                      {t(' às ') + getFullTime(log.timestamp)}
                    </Text>
                  </Text>
                );
              }
              return (
                <Text
                  key={log.id}
                  mt="2"
                  fontSize="15px"
                  lineHeight="21px"
                  fontWeight="700"
                  color="green.700"
                >
                  {log.info[1]}
                  {': '}
                  <Text as="span" fontWeight="500">
                    {t(' às ') + getFullTime(log.timestamp)}
                  </Text>
                </Text>
              );
            })}
          </Box>
          <Box mt="2" py="1" px="4" bgColor="#F6F6F6" borderRadius="16px">
            <HStack spacing={6}>
              <HStack>
                <Circle size="8px" bgColor="black" />
                <Text
                  fontSize="15px"
                  lineHeight="21px"
                  fontWeight="700"
                  color="black"
                >
                  {t('Status')}
                </Text>
              </HStack>
              <HStack>
                <Circle size="8px" bgColor="#055AFF" />
                <Text
                  fontSize="15px"
                  lineHeight="21px"
                  fontWeight="700"
                  color="#055AFF"
                >
                  {t('Matching')}
                </Text>
              </HStack>
              <HStack>
                <Circle size="8px" bgColor="green.700" />
                <Text
                  fontSize="15px"
                  lineHeight="21px"
                  fontWeight="700"
                  color="green.700"
                >
                  {t('Backend')}
                </Text>
              </HStack>
            </HStack>
          </Box>
        </>
      )}
    </Box>
  );
};
