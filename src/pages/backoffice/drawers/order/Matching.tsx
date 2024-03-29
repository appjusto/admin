import {
  CourierOrderRequest,
  Order,
  OrderMatching,
  OrderMatchingLog,
  WithId,
} from '@appjusto/types';
import { Box, Button, Flex, HStack, Text } from '@chakra-ui/react';
import { useOrderCourierManualAllocation } from 'app/api/order/useOrderCourierManualAllocation';
import { useOrderMatching } from 'app/api/order/useOrderMatching';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { isToday } from 'pages/orders/utils';
import React from 'react';
import { t } from 'utils/i18n';
import { orderDispatchingStatusPTOptions } from '../../utils/index';
import { SectionTitle } from '../generics/SectionTitle';
import { CourierManualAllocation } from './CourierManualAllocation';
import CourierNotifiedBox from './matching/CourierNotifiedBox';
import { LogsTable } from './matching/LogsTable';
import { NotifiedCouriers } from './matching/NotifiedCouriers';
import { OutsouceDelivery } from './outsource/OutsourceDelivery';

interface MatchingProps {
  order?: WithId<Order> | null;
  matching?: OrderMatching | null;
  logs?: WithId<OrderMatchingLog>[];
  notifiedCouriers?: WithId<CourierOrderRequest>[];
  clearQueryLimit(): void;
  fetchNextMatchingLogs(): void;
  fetchNextOrderNotifiedCouriers(): void;
  activeMatching(): void;
}

export const Matching = ({
  order,
  matching,
  logs,
  notifiedCouriers,
  clearQueryLimit,
  fetchNextMatchingLogs,
  fetchNextOrderNotifiedCouriers,
  activeMatching,
}: MatchingProps) => {
  // context
  const { userAbility, isBackofficeSuperuser } = useContextFirebaseUser();
  const { restartMatching, restartResult } = useOrderMatching(order?.id);
  const { courierManualAllocation, allocationResult } =
    useOrderCourierManualAllocation();
  // state
  const [attemps, setAttemps] = React.useState<number>(0);
  const [isRestarting, setIsRestarting] = React.useState<boolean>(false);
  // helpers
  const isOrderActive = React.useMemo(
    () =>
      order?.status
        ? ['confirmed', 'preparing', 'ready', 'dispatching'].includes(
            order.status
          )
        : false,
    [order?.status]
  );
  const isNoMatch = React.useMemo(
    () => order?.dispatchingStatus === 'no-match',
    [order?.dispatchingStatus]
  );
  const isOrderStaff = React.useMemo(
    () =>
      userAbility?.can('update', {
        kind: 'orders',
        ...order,
      }),
    [userAbility, order]
  );
  const canAllocateCourierById = React.useMemo(
    () =>
      isOrderStaff &&
      isBackofficeSuperuser &&
      (!order?.scheduledTo || isToday(order.scheduledTo)) &&
      !order?.courier,
    [isOrderStaff, isBackofficeSuperuser, order?.scheduledTo, order?.courier]
  );
  const restartMatchingButtonDisplay = React.useMemo(
    () =>
      order?.dispatchingStatus !== 'outsourced' &&
      !order?.courier?.id &&
      isOrderStaff
        ? 'inline-block'
        : 'none',
    [order?.dispatchingStatus, order?.courier?.id, isOrderStaff]
  );
  // handlers
  const allocateCourier = (courierInfo: string, comment: string) => {
    if (!order?.id) return;
    let courierId = undefined;
    let courierCode = undefined;
    if (/^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{7}$/.exec(courierInfo)) {
      courierCode = courierInfo;
    } else {
      courierId = courierInfo;
    }
    return courierManualAllocation({
      orderId: order.id,
      courierId,
      courierCode,
      comment,
    });
  };
  // side effects
  React.useEffect(() => {
    if (logs && logs.length > 0) return;
    activeMatching();
  }, [activeMatching, logs]);
  React.useEffect(() => {
    if (!matching) return;
    setAttemps(matching.attempt);
  }, [matching]);
  React.useEffect(() => {
    if (restartResult.isSuccess) setIsRestarting(false);
  }, [restartResult]);
  // UI
  return (
    <>
      <OutsouceDelivery
        order={order}
        isOrderActive={isOrderActive}
        isOrderStaff={isOrderStaff}
      />
      <Flex mt="5" justifyContent="space-between">
        <SectionTitle mt="0">
          {t('Status:')}{' '}
          <Text as="span" color={isNoMatch ? 'red' : 'black'}>
            {order?.dispatchingStatus
              ? orderDispatchingStatusPTOptions[order.dispatchingStatus]
              : 'N/E'}
          </Text>
        </SectionTitle>
        {isOrderActive &&
          (isRestarting ? (
            <Flex
              w="60%"
              flexDir="column"
              bg="rgba(254, 215, 215, 0.3)"
              borderRadius="lg"
              py="2"
              px="4"
            >
              <Text textAlign="center">{t('Confirmar reinicialização?')}</Text>
              <HStack mt="2" spacing={2}>
                <CustomButton
                  mt="0"
                  h="30px"
                  size="sm"
                  variant="danger"
                  label="Cancelar"
                  onClick={() => setIsRestarting(false)}
                />
                <CustomButton
                  mt="0"
                  h="30px"
                  size="sm"
                  label="Confirmar"
                  onClick={() => restartMatching()}
                  isLoading={restartResult.isLoading}
                />
              </HStack>
            </Flex>
          ) : (
            <CustomButton
              display={restartMatchingButtonDisplay}
              mt="2"
              h="38px"
              size="sm"
              variant="dangerLight"
              label="Reiniciar matching"
              onClick={() => setIsRestarting(true)}
            />
          ))}
      </Flex>
      <SectionTitle mt={isNoMatch ? '2' : '4'}>
        {t('Tentativas: ') + attemps}
      </SectionTitle>
      <Box>
        <SectionTitle mt="4">
          {t(
            `Entregadores notificados: ${
              notifiedCouriers ? notifiedCouriers.length : 0
            }`
          )}
        </SectionTitle>
        {canAllocateCourierById && (
          <CourierManualAllocation
            allocateCourier={allocateCourier}
            isLoading={allocationResult.isLoading}
          />
        )}
        <NotifiedCouriers
          fetchNextOrderNotifiedCouriers={fetchNextOrderNotifiedCouriers}
        >
          {!notifiedCouriers ? (
            <Text>{t('Carregando dados...')}</Text>
          ) : (
            notifiedCouriers.map((request) => (
              <CourierNotifiedBox
                key={request.id}
                isOrderActive={isOrderActive}
                canUpdateOrder={isOrderStaff}
                request={request}
                dispatchingStatus={order?.dispatchingStatus}
                allocateCourier={allocateCourier}
                isLoading={allocationResult.isLoading}
              />
            ))
          )}
        </NotifiedCouriers>
        <SectionTitle>{t('Logs do pedido')}</SectionTitle>
        <LogsTable logs={logs} fetchNextLogs={fetchNextMatchingLogs} />
        <Button mt="4" variant="secondary" onClick={clearQueryLimit}>
          {t('Carregar todos')}
        </Button>
      </Box>
    </>
  );
};
