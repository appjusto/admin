import { Box, Flex, Image, Link, LinkProps, Text } from '@chakra-ui/react';
import { useOrderStatusTimestamp } from 'app/api/order/useOrderStatusTimestamp';
import { Business, Order, WithId } from 'appjusto-types';
import foodIcon from 'common/img/bo-food.svg';
import p2pIcon from 'common/img/bo-p2p.svg';
import React from 'react';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import { formatCurrency } from 'utils/formatters';
import { getDateAndHour, getTimeUntilNow } from 'utils/functions';

interface CustomLinkProps extends LinkProps {
  to: string;
  children: React.ReactNode | React.ReactNode[];
}

const CustomLink = ({ to, children, ...props }: CustomLinkProps) => {
  return (
    <Link
      as={RouterLink}
      to={to}
      p="4"
      w="100%"
      borderRadius="lg"
      border="1px solid #C8D7CB"
      color="black"
      _hover={{ textDecor: 'none', bg: 'gray.200' }}
      {...props}
    >
      {children}
    </Link>
  );
};

interface Props {
  data: WithId<Business> | WithId<Order>;
  listType: string;
  sortHandler?(orderId: string, confirmedAt: number): void;
}

const statusConfirmed = 'confirmed';

export const BOListItem = ({ data, listType, sortHandler }: Props) => {
  // context
  const { url } = useRouteMatch();
  const orderConfirmedTimestamp = useOrderStatusTimestamp(
    listType === 'orders' ? data?.id : undefined,
    statusConfirmed
  );
  // state
  const [business, setBusiness] = React.useState<WithId<Business>>();
  const [order, setOrder] = React.useState<WithId<Order>>();
  const [orderDT, setOrderDT] = React.useState<number>();
  // handlers

  // side effects
  React.useEffect(() => {
    if (listType === 'business') return setBusiness(data as WithId<Business>);
    setOrder(data as WithId<Order>);
    const setNewTime = () => {
      const time = orderConfirmedTimestamp?.seconds
        ? getTimeUntilNow(orderConfirmedTimestamp?.seconds * 1000)
        : null;
      if (time) setOrderDT(time);
    };
    setNewTime();
    const timeInterval = setInterval(setNewTime, 60000);
    return () => clearInterval(timeInterval);
  }, [data, listType, orderConfirmedTimestamp]);

  React.useEffect(() => {
    if (listType === 'business' || !data?.id) return;
    if (!orderConfirmedTimestamp || !sortHandler) return;
    sortHandler(data.id, orderConfirmedTimestamp.seconds);
  }, [orderConfirmedTimestamp, listType, data?.id, sortHandler]);

  // UI
  if (listType === 'business') {
    return (
      <CustomLink to={`${url}/business/${business?.id}`}>
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="sm" lineHeight="21px" color="black">
            {business?.name}
          </Text>
          <Text fontSize="sm" lineHeight="21px">
            {business?.createdOn &&
              getDateAndHour(business?.createdOn as firebase.firestore.Timestamp)}
          </Text>
        </Flex>
      </CustomLink>
    );
  }
  if (listType === 'orders') {
    return (
      <CustomLink
        to={`${url}/order/${order?.id}`}
        bg={orderDT && orderDT > 40 ? '#FBD7D7' : 'white'}
      >
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
            {order?.createdOn && getDateAndHour(order?.createdOn as firebase.firestore.Timestamp)}
          </Text>
          <Text fontSize="sm" lineHeight="21px">
            {orderDT ? `${orderDT}min` : '?'}
          </Text>
        </Flex>
      </CustomLink>
    );
  }
  return <Box />;
};
