import { Order, WithId } from '@appjusto/types';
import { Box, Flex, Text } from '@chakra-ui/react';
import { isEqual } from 'lodash';
import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { getHourAndMinute } from 'utils/functions';
import { t } from 'utils/i18n';
import { OrderBaseCard } from './OrderBaseCard';
import { OrderCodeBox } from './OrderCodeBox';

interface Props {
  order: WithId<Order>;
}

const OrderScheduledCard = ({ order }: Props) => {
  // context
  const { url } = useRouteMatch();
  // helpers
  const hasIssues = React.useMemo(() => {
    return order.flags?.includes('issue');
  }, [order.flags]);
  const consumerName = React.useMemo(
    () => (order.consumer.name ? order.consumer.name.split(' ')[0] : 'N/E'),
    [order.consumer.name]
  );
  // UI
  return (
    <Link to={`${url}/${order.id}`}>
      <OrderBaseCard
        p="4"
        borderColor={hasIssues ? 'red' : 'green.700'}
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
          <Box>
            <Text fontSize="sm" textAlign="end">
              {t('Preparo agendado')}
            </Text>
            <Text fontSize="sm" textAlign="end">
              {t('para às ')}
              <Text as="span" fontWeight="700">
                {order?.confirmedScheduledTo
                  ? getHourAndMinute(order.confirmedScheduledTo)
                  : 'N/E'}
              </Text>
            </Text>
          </Box>
        </Flex>
      </OrderBaseCard>
    </Link>
  );
};

const areEqual = (prevProps: Props, nextProps: Props) => {
  return isEqual(prevProps, nextProps);
};

export default React.memo(OrderScheduledCard, areEqual);
