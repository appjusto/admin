import { Order, WithId } from '@appjusto/types';
import { Box, Flex, Icon, Image, Stack, Text } from '@chakra-ui/react';
import { useObserveOrderChatMessages } from 'app/api/chat/useObserveOrderChatMessages';
import { useObserveOrderIssues } from 'app/api/order/useObserveOrderIssues';
import { useContextServerTime } from 'app/state/server-time';
import foodIcon from 'common/img/bo-food.svg';
import p2pIcon from 'common/img/bo-p2p.svg';
import { Timestamp } from 'firebase/firestore';
import React from 'react';
import { MdErrorOutline, MdMoped, MdPolicy } from 'react-icons/md';
import { RiChat3Line, RiUserSearchLine } from 'react-icons/ri';
import { useRouteMatch } from 'react-router-dom';
import { getTimestampMilliseconds, getTimeUntilNow } from 'utils/functions';
import { CustomLink } from './CustomLink';
import { OrderTracking } from './OrderTracking';
import { getOrderMatchingColor } from './utils';

interface Props {
  order: WithId<Order>;
}

export const BOOrderListItem = ({ order }: Props) => {
  // context
  const { url } = useRouteMatch();
  const { getServerTime } = useContextServerTime();
  const { chatMessages } = useObserveOrderChatMessages(order.id, 1);
  const issues = useObserveOrderIssues(order.id);
  // state
  const [orderDT, setOrderDT] = React.useState<number>();
  // helpers
  const isStaff = typeof order.staff?.id === 'string';
  const isMessages = chatMessages ? chatMessages?.length > 0 : false;
  const issuesFound = issues && issues.length > 0 ? true : false;
  const isFlagged = order.status === 'charged' && order.flagged;
  const courierIconStatus = getOrderMatchingColor(
    order.fulfillment,
    order.status,
    order.dispatchingStatus,
    order.courier?.id
  );
  // side effects
  React.useEffect(() => {
    const setNewTime = () => {
      const now = getServerTime().getTime();
      const chargedOn = getTimestampMilliseconds(order.timestamps.charged as Timestamp);
      const time = chargedOn ? getTimeUntilNow(now, chargedOn) : null;
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
            bg={isStaff ? '#6CE787' : 'none'}
            borderRadius="lg"
          >
            <RiUserSearchLine color={isStaff ? 'black' : '#C8D7CB'} />
          </Flex>
          <Flex
            w="24px"
            h="24px"
            justifyContent="center"
            alignItems="center"
            borderRadius="12px"
            border="2px solid"
            borderColor={isFlagged ? 'red' : 'transparent'}
          >
            <MdPolicy color={isFlagged ? 'red' : '#C8D7CB'} />
          </Flex>
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
          <Flex
            w="24px"
            h="24px"
            justifyContent="center"
            alignItems="center"
            bg={isMessages ? '#6CE787' : 'none'}
            borderRadius="lg"
          >
            <Icon as={RiChat3Line} color={isMessages ? 'black' : '#C8D7CB'} />
          </Flex>
          <Flex
            w="24px"
            h="24px"
            position="relative"
            justifyContent="center"
            alignItems="center"
            bg={courierIconStatus.bg}
            borderRadius="lg"
          >
            {order.fulfillment !== 'delivery' && (
              <Box
                w="100%"
                h="2px"
                position="absolute"
                bgColor="#C8D7CB"
                transform="rotate(45deg)"
              />
            )}
            <Icon as={MdMoped} w="20px" h="20px" color={courierIconStatus.color} />
          </Flex>
        </Flex>
        <OrderTracking orderId={order.id} isCompact />
      </Stack>
    </CustomLink>
  );
};
