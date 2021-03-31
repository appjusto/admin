import { Box, Flex, Link, Text } from '@chakra-ui/react';
import { Business, Order, WithId } from 'appjusto-types';
import React from 'react';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';

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
  const [createdOn, setCreatedOn] = React.useState('');
  // handlers

  // side effects
  React.useEffect(() => {
    if (listType === 'business') setBusiness(data as WithId<Business>);
    if (listType === 'orders') setOrder(data as WithId<Order>);
  }, [data, listType]);

  React.useEffect(() => {
    if (data) {
    }
  }, [data]);
  // UI
  if (listType === 'business') {
    return (
      <Link
        as={RouterLink}
        to={`${url}/${business?.id}`}
        p="4"
        w="100%"
        borderRadius="lg"
        borderColor="black"
        borderWidth="2px"
        color="black"
        _hover={{ textDecor: 'none' }}
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="sm" lineHeight="21px">
            {business?.name}
          </Text>
        </Flex>
      </Link>
    );
  }
  return (
    <Link to={`${url}/${order?.id}`}>
      <Box
        p="4"
        borderRadius="lg"
        borderColor="black"
        borderWidth="2px"
        color="black"
        cursor="pointer"
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="lg" fontWeight="700">
            #{order?.code}
          </Text>
        </Flex>
      </Box>
    </Link>
  );
};
