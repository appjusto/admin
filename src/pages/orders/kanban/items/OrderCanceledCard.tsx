import { Order, WithId } from '@appjusto/types';
import { Box, Flex, Text } from '@chakra-ui/react';
import { isEqual } from 'lodash';
import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';

interface Props {
  order: WithId<Order>;
}

const OrderCanceledCard = ({ order }: Props) => {
  // context
  const { url } = useRouteMatch();
  // helpers
  const consumerName = React.useMemo(
    () => (order.consumer.name ? order.consumer.name.split(' ')[0] : 'N/E'),
    [order.consumer.name]
  );
  // UI
  return (
    <Link to={`${url}/${order.id}`}>
      <Box
        px="4"
        py="2"
        borderRadius="lg"
        borderColor="gray"
        borderWidth="1px"
        color="gray"
        boxShadow="0px 8px 16px -4px rgba(105,118,103,0.1)"
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Box>
            <Text fontSize="lg" fontWeight="700">
              #{order.code}
            </Text>
            <Text fontSize="xs" lineHeight="lg" fontWeight="500">
              {`{${consumerName}}`}
            </Text>
          </Box>
          <Flex
            flexDir="column"
            color="gray.700"
            fontSize="xs"
            alignItems="flex-end"
          >
            <Text fontWeight="700">{t('Cancelado')}</Text>
            {/* <Text fontWeight="500">{cancelator}</Text> */}
          </Flex>
        </Flex>
      </Box>
    </Link>
  );
};

const areEqual = (prevProps: Props, nextProps: Props) => {
  return isEqual(prevProps, nextProps);
};

export default React.memo(OrderCanceledCard, areEqual);
