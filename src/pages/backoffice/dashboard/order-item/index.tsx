import { Order, WithId } from '@appjusto/types';
import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useContextServerTime } from 'app/state/server-time';
import foodIcon from 'common/img/bo-food.svg';
import p2pIcon from 'common/img/bo-p2p.svg';
import { Timestamp } from 'firebase/firestore';
import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { getTimestampMilliseconds, getTimeUntilNow } from 'utils/functions';
import { ListType } from '../BOList';
import { CustomLink } from '../CustomLink';
import { getIconsConfig } from '../utils';
import { OrderItemIcons } from './OrderItemIcons';

interface Props {
  listType: ListType;
  order: WithId<Order>;
}

export const OrderListItem = ({ listType, order }: Props) => {
  // context
  const { url } = useRouteMatch();
  const { getServerTime } = useContextServerTime();
  const { isBackofficeSuperuser } = useContextFirebaseUser();
  // state
  const [orderDT, setOrderDT] = React.useState<number>();
  // refs
  const itemRef = React.useRef<HTMLDivElement>(null);
  // helpers
  const iconsConfig = React.useMemo(
    () =>
      getIconsConfig(
        isBackofficeSuperuser,
        listType,
        order.staff?.id,
        order.type,
        order.flags,
        order.fare,
        order.dispatchingStatus,
        order.courier?.id
      ),
    [
      isBackofficeSuperuser,
      listType,
      order.staff?.id,
      order.type,
      order.flags,
      order.fare,
      order.dispatchingStatus,
      order.courier?.id,
    ]
  );
  // side effects
  React.useEffect(() => {
    const setNewTime = () => {
      const now = getServerTime().getTime();
      const comparisonTime = order.timestamps.confirmed;
      const confirmedAt = getTimestampMilliseconds(comparisonTime as Timestamp);
      const time = confirmedAt ? getTimeUntilNow(now, confirmedAt) : null;
      if (time) setOrderDT(time);
    };
    setNewTime();
    const timeInterval = setInterval(setNewTime, 60000);
    return () => clearInterval(timeInterval);
  }, [getServerTime, order]);
  // UI
  return (
    <CustomLink
      to={`${url}/order/${order?.id}`}
      bg={orderDT && orderDT > 40 ? '#FBD7D7' : 'white'}
      py="4"
    >
      <Flex ref={itemRef} flexDir="row" justifyContent="space-between">
        <Box>
          <Image
            src={order?.type === 'food' ? foodIcon : p2pIcon}
            w="24px"
            h="24px"
          />
        </Box>
        <Text fontSize="sm" lineHeight="21px" color="black" mr="2">
          #{order?.code}
        </Text>
        <Text fontSize="sm" lineHeight="21px">
          {orderDT ? `${orderDT}min` : 'Agora'}
        </Text>
        <OrderItemIcons config={iconsConfig} />
      </Flex>
    </CustomLink>
  );
};
