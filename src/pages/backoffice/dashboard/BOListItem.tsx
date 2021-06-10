import { Box, Flex, Image, Link, Text } from '@chakra-ui/react';
import { Business, Order, WithId } from 'appjusto-types';
import foodIcon from 'common/img/bo-food.svg';
import p2pIcon from 'common/img/bo-p2p.svg';
import React from 'react';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import { formatCurrency } from 'utils/formatters';
import { getDateAndHour } from 'utils/functions';

interface CustomLinkProps {
  to: string;
  children: React.ReactNode | React.ReactNode[];
}

const CustomLink = ({ to, children }: CustomLinkProps) => {
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
    >
      {children}
    </Link>
  );
};

interface Props {
  data: WithId<Business> | WithId<Order>;
  listType: string;
}

export const BOListItem = ({ data, listType }: Props) => {
  // context
  const { url } = useRouteMatch();
  // state
  const [business, setBusiness] = React.useState<WithId<Business> | undefined>(undefined);
  const [order, setOrder] = React.useState<WithId<Order> | undefined>(undefined);
  // handlers

  // side effects
  React.useEffect(() => {
    if (listType === 'business') setBusiness(data as WithId<Business>);
    if (listType === 'orders') setOrder(data as WithId<Order>);
  }, [data, listType]);

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
      <CustomLink to={`${url}/order/${order?.id}`}>
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
        </Flex>
      </CustomLink>
    );
  }
  return <Box />;
};
