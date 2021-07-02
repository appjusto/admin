import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { Order, WithId } from 'appjusto-types';
import foodIcon from 'common/img/bo-food.svg';
import p2pIcon from 'common/img/bo-p2p.svg';
import firebase from 'firebase';
import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { formatCurrency } from 'utils/formatters';
import { getDateAndHour, getTimeUntilNow } from 'utils/functions';
import { CustomLink } from './CustomLink';

interface Props {
  order: WithId<Order>;
}

export const BOOrderListItem = ({ order }: Props) => {
  // context
  const { url } = useRouteMatch();

  // state
  const [orderDT, setOrderDT] = React.useState<number>();
  // handlers

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
          {formatCurrency(order?.fare?.total ?? 0)}
        </Text>
        <Text fontSize="sm" lineHeight="21px">
          {getDateAndHour(order?.confirmedOn)}
        </Text>
        <Text fontSize="sm" lineHeight="21px">
          {orderDT ? `${orderDT}min` : 'Agora'}
        </Text>
      </Flex>
    </CustomLink>
  );
};
