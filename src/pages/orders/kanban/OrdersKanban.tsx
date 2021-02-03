import { Box, Stack, Text } from '@chakra-ui/react';
import React from 'react';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import { useOrdersContext } from '../context';
import { OrderAcceptanceBar } from './OrderAcceptanceBar';
import { OrdersKanbanList } from './OrdersKanbanList';

export const OrdersKanban = () => {
  // context
  const { ordersByStatus } = useOrdersContext();
  // state
  const [dateTime, setDateTime] = React.useState('');
  // side effects
  React.useEffect(() => {
    const { date, time } = getDateTime();
    setDateTime(`${date} ${time}`);
  }, [ordersByStatus]);
  // UI
  return (
    <Box pb="12">
      <Text fontSize="3xl" fontWeight="700" color="black">
        {t('Gerenciador de pedidos')}
      </Text>
      <Text fontSize="sm" color="grey.700">
        {t('Dados atualizados em ')}
        <Text as="span" letterSpacing="0.2px">
          {dateTime}
        </Text>
      </Text>
      <OrderAcceptanceBar />
      <Stack direction={['column', 'column', 'row']} mt="8" spacing="4">
        <OrdersKanbanList
          title={t('Pedidos à confirmar')}
          orders={ordersByStatus['confirming']}
          details={t('Aqui você verá os novos pedidos. Aceite-os para confirmar o preparo.')}
        />
        {/*<OrdersKanbanList
          title={t('Confirmados')}
          orders={ordersByStatus['confirmed']}
          details={t(
            'Aqui você verá os pedidos confirmados que ainda não começaram a ser preparados.'
          )}
          />*/}
        <OrdersKanbanList
          title={t('Em preparação')}
          orders={ordersByStatus['preparing']}
          details={t(
            'Aqui você verá os pedidos que estão sendo preparados por você. Quando clicar em "Pedido pronto” ou o tempo expirar, o entregador estará esperando para buscá-lo.'
          )}
        />
        <OrdersKanbanList
          title={t('Aguardando retirada')}
          orders={ordersByStatus['ready']}
          details={t('Aqui você verá os pedidos aguardando retirada pelo entregador.')}
        />
        <OrdersKanbanList
          title={t('À caminho')}
          orders={ordersByStatus['dispatching']}
          details={t('Aqui você verá os pedidos que estão à caminho da entrega pela entregador.')}
        />
      </Stack>
    </Box>
  );
};
