import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { useObserveOrderIssues } from 'app/api/order/useObserveOrderIssues';
import { Order, WithId } from 'appjusto-types';
import foodIcon from 'common/img/bo-food.svg';
import p2pIcon from 'common/img/bo-p2p.svg';
import firebase from 'firebase/app';
import React from 'react';
import { MdInfoOutline } from 'react-icons/md';
import { useRouteMatch } from 'react-router-dom';
import { getTimeUntilNow } from 'utils/functions';
import { orderStatusPTOptions } from '../utils';
import { CustomLink } from './CustomLink';

interface Props {
  order: WithId<Order>;
}

export const BOOrderListItem = ({ order }: Props) => {
  // context
  const { url } = useRouteMatch();
  const issues = useObserveOrderIssues(order.id);
  // state
  const [orderDT, setOrderDT] = React.useState<number>();
  // helpers
  const issuesFound = issues && issues.length > 0 ? true : false;
  const getOrderStatus = () => {
    if (!order.status) return 'N/E';
    if (order.dispatchingState === 'arrived-destination') return 'Entreg. no local de entrega';
    if (orderStatusPTOptions[order.status].includes('-')) {
      return orderStatusPTOptions[order.status].split('-')[0];
    }
    return orderStatusPTOptions[order.status];
  };
  // side effects
  React.useEffect(() => {
    const setNewTime = () => {
      const confirmedOn = (order.confirmedOn as firebase.firestore.Timestamp) ?? undefined;
      const time = confirmedOn ? getTimeUntilNow(confirmedOn.seconds * 1000) : null;
      if (time) setOrderDT(time);
    };
    setNewTime();
    const timeInterval = setInterval(setNewTime, 60000);
    return () => clearInterval(timeInterval);
  }, [order]);
  // UI
  return (
    <CustomLink to={`${url}/order/${order?.id}`} bg={orderDT && orderDT > 40 ? '#FBD7D7' : 'white'}>
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          <Image src={order?.type === 'food' ? foodIcon : p2pIcon} w="24px" h="24px" />
        </Box>
        <Text fontSize="sm" lineHeight="21px" color="black">
          #{order?.code}
        </Text>
        <Text fontSize="sm" lineHeight="21px" color="black">
          {getOrderStatus()}
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
          <MdInfoOutline color={issuesFound ? 'white' : '#C8D7CB'} />
        </Flex>
      </Flex>
    </CustomLink>
  );
};
