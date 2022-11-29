import {
  Order,
  OrderMatching,
  OrderMatchingLog,
  WithId,
} from '@appjusto/types';
import { Box, Flex, HStack, Text } from '@chakra-ui/react';
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
import { OutsouceDelivery } from './OutsourceDelivery';

export type NotifiedCouriers = { id: string; name?: string };

interface MatchingProps {
  order?: WithId<Order> | null;
  matching?: OrderMatching | null;
  logs?: WithId<OrderMatchingLog>[];
  activeMatching(): void;
}

export const Matching = ({
  order,
  matching,
  logs,
  activeMatching,
}: MatchingProps) => {
  // context
  const { userAbility, isBackofficeSuperuser } = useContextFirebaseUser();
  const {
    updateCourierNotified,
    updateResult,
    restartMatching,
    restartResult,
  } = useOrderMatching(order?.id);
  const { courierManualAllocation, allocationResult } =
    useOrderCourierManualAllocation();
  // state
  const [attemps, setAttemps] = React.useState<number>(0);
  const [couriersNotified, setCouriersNotified] = React.useState<
    NotifiedCouriers[]
  >([]);
  const [courierRemoving, setCourierRemoving] = React.useState<string | null>(
    null
  );
  const [isRestarting, setIsRestarting] = React.useState<boolean>(false);
  // helpers
  const isOrderActive = order?.status
    ? ['confirmed', 'preparing', 'ready', 'dispatching'].includes(order.status)
    : false;
  const isNoMatch = order?.dispatchingStatus === 'no-match';
  const canAllocateCourierById =
    isBackofficeSuperuser &&
    (!order?.scheduledTo || isToday(order.scheduledTo)) &&
    userAbility?.can('update', { kind: 'orders', ...order }) &&
    !order?.courier;
  // handlers
  const removeCourierNotified = async (courierId: string) => {
    setCourierRemoving(courierId);
    const newArray = couriersNotified
      .filter((courier) => courier.id !== courierId)
      .map((courier) => courier.id);
    await updateCourierNotified(newArray);
    setCourierRemoving(null);
  };
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
    if (matching === undefined) return;
    if (matching === null) {
      setCouriersNotified([]);
      return;
    }
    setCouriersNotified(matching.notifiedCouriers);
    setAttemps(matching.attempt);
  }, [matching]);
  React.useEffect(() => {
    if (restartResult.isSuccess) setIsRestarting(false);
  }, [restartResult]);
  // UI
  return (
    <>
      <OutsouceDelivery order={order} />
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
              display={
                userAbility?.can('update', { kind: 'orders', ...order })
                  ? 'inline-block'
                  : 'none'
              }
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
              couriersNotified ? couriersNotified.length : 0
            }`
          )}
        </SectionTitle>
        {canAllocateCourierById && (
          <CourierManualAllocation
            allocateCourier={allocateCourier}
            isLoading={allocationResult.isLoading}
          />
        )}
        <Box
          mt="4"
          p="2"
          minH="200px"
          maxH="300px"
          overflowY="scroll"
          border="1px solid #ECF0E3"
          borderRadius="lg"
        >
          {!couriersNotified ? (
            <Text>{t('Carregando dados...')}</Text>
          ) : (
            couriersNotified.map((courier) => (
              <CourierNotifiedBox
                key={courier.id}
                order={order}
                isOrderActive={isOrderActive}
                courier={courier}
                dispatchingStatus={order?.dispatchingStatus}
                removeCourier={removeCourierNotified}
                allocateCourier={allocateCourier}
                courierRemoving={courierRemoving}
                isLoading={updateResult.isLoading || allocationResult.isLoading}
              />
            ))
          )}
        </Box>
        <SectionTitle>{t('Logs do pedido')}</SectionTitle>
        <Box
          mt="4"
          maxH="300px"
          overflowY="scroll"
          border="1px solid #ECF0E3"
          borderRadius="lg"
        >
          <LogsTable logs={matching?.logs ?? logs} />
        </Box>
      </Box>
    </>
  );
};
