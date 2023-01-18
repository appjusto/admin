import { Order, WithId } from '@appjusto/types';
import { Box, Flex, Text } from '@chakra-ui/react';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useOrdersContext } from 'app/state/order';
import { useContextServerTime } from 'app/state/server-time';
import dayjs from 'dayjs';
import { Timestamp } from 'firebase/firestore';
import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { OrderBaseCard } from './OrderBaseCard';
import { OrderCodeBox } from './OrderCodeBox';

interface Props {
  order: WithId<Order>;
}

export const OrderConfirmedCard = ({ order }: Props) => {
  // context
  const { url } = useRouteMatch();
  const { getServerTime } = useContextServerTime();
  const { business, changeOrderStatus } = useOrdersContext();
  const { isBackofficeUser } = useContextFirebaseUser();
  // state
  const [elapsedTime, setElapsedTime] = React.useState<number | null>(0);
  // helpers
  const hasIssues = React.useMemo(() => {
    return order.flags?.includes('issue');
  }, [order.flags]);
  const confirmedAt = React.useMemo(() => {
    return order.timestamps.confirmed
      ? (order.timestamps.confirmed as Timestamp).toDate()
      : null;
  }, [order.timestamps.confirmed]);
  const consumerName = React.useMemo(
    () => (order.consumer.name ? order.consumer.name.split(' ')[0] : 'N/E'),
    [order.consumer.name]
  );
  // side effects
  React.useEffect(() => {
    const setNewTime = () => {
      if (confirmedAt) {
        const time = dayjs().diff(confirmedAt, 'minute');
        setElapsedTime(time);
      } else {
        setElapsedTime(null);
      }
    };
    setNewTime();
    const timeInterval = setInterval(setNewTime, 60000);
    return () => clearInterval(timeInterval);
  }, [getServerTime, confirmedAt]);
  React.useEffect(() => {
    // disabled for backoffice users
    if (isBackofficeUser) return;
    // automatic order status change
    const orderAcceptanceTime = business?.orderAcceptanceTime
      ? business?.orderAcceptanceTime / 60
      : undefined;
    if (
      elapsedTime &&
      orderAcceptanceTime &&
      orderAcceptanceTime <= elapsedTime
    ) {
      changeOrderStatus(order.id, 'preparing');
    }
  }, [
    order,
    elapsedTime,
    business?.orderAcceptanceTime,
    changeOrderStatus,
    isBackofficeUser,
  ]);
  // UI
  return (
    <Link to={`${url}/${order.id}`}>
      <OrderBaseCard
        p="4"
        bg="green.300"
        borderRadius="lg"
        borderColor={hasIssues ? 'red' : 'black'}
        borderWidth="2px"
        color="black"
        cursor="pointer"
        flags={order.flags}
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Box maxW="90px">
            <OrderCodeBox code={order.code} hasIssues={hasIssues} />
            <Text fontSize="xs" lineHeight="lg">
              {`{${consumerName}}`}
            </Text>
          </Box>
          {elapsedTime && elapsedTime > 0 ? (
            <Text fontSize="sm">{t(`${elapsedTime} min. atrás`)}</Text>
          ) : (
            <Text fontSize="sm">{t(`Agora`)}</Text>
          )}
        </Flex>
      </OrderBaseCard>
    </Link>
  );
};
