import { Box, Flex, Image, Stack, Text } from '@chakra-ui/react';
import { useObserveOrderIssues } from 'app/api/order/useObserveOrderIssues';
import { useContextServerTime } from 'app/state/server-time';
import { Order, WithId } from 'appjusto-types';
import foodIcon from 'common/img/bo-food.svg';
import p2pIcon from 'common/img/bo-p2p.svg';
import firebase from 'firebase/app';
import React from 'react';
import { MdErrorOutline } from 'react-icons/md';
import { useRouteMatch } from 'react-router-dom';
import { getTimeUntilNow } from 'utils/functions';
import { CustomLink } from './CustomLink';
import { OrderTracking } from './OrderTracking';

interface Props {
  order: WithId<Order>;
}

export const BOOrderListItem = ({ order }: Props) => {
  // context
  const { url } = useRouteMatch();
  const { getServerTime } = useContextServerTime();
  const issues = useObserveOrderIssues(order.id);
  // state
  const [orderDT, setOrderDT] = React.useState<number>();
  // helpers
  const issuesFound = issues && issues.length > 0 ? true : false;
  // side effects
  React.useEffect(() => {
    const setNewTime = () => {
      const now = getServerTime().getTime();
      const confirmedOn = (order.confirmedOn as firebase.firestore.Timestamp) ?? undefined;
      const time = confirmedOn ? getTimeUntilNow(now, confirmedOn.seconds * 1000) : null;
      if (time) setOrderDT(time);
    };
    setNewTime();
    const timeInterval = setInterval(setNewTime, 60000);
    return () => clearInterval(timeInterval);
  }, [getServerTime, order]);
  // UI
  return (
    <CustomLink to={`${url}/order/${order?.id}`} bg={orderDT && orderDT > 40 ? '#FBD7D7' : 'white'}>
      <Stack w="100%" spacing={{ base: 4, lg: 10 }} direction={{ base: 'column', lg: 'row' }}>
        <Flex w={{ base: '100%', lg: '70%' }} justifyContent="space-between" alignItems="center">
          <Box>
            <Image src={order?.type === 'food' ? foodIcon : p2pIcon} w="24px" h="24px" />
          </Box>
          <Text fontSize="sm" lineHeight="21px" color="black">
            #{order?.code}
          </Text>
          <Text fontSize="sm" lineHeight="21px">
            {orderDT ? `${orderDT}min` : 'Agora'}
          </Text>
          <Flex
            w="24px"
            h="24px"
            justifyContent="center"
            alignItems="center"
            bg={issuesFound ? 'red' : 'none'}
            borderRadius="lg"
          >
            <MdErrorOutline color={issuesFound ? 'white' : '#C8D7CB'} />
          </Flex>
        </Flex>
        <OrderTracking orderId={order.id} isCompact />
      </Stack>
    </CustomLink>
  );
};
