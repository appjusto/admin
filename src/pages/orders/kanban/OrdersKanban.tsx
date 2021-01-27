import { Box, Button, HStack, Stack, Switch, Text } from '@chakra-ui/react';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { splitByStatus } from 'app/api/order/selectors';
import { useOrders } from 'app/api/order/useOrders';
import { useContextBusiness } from 'app/state/business/context';
import { ReactComponent as EditIcon } from 'common/img/edit-icon.svg';
import React from 'react';
import { t } from 'utils/i18n';
import { OrdersKanbanList } from './OrdersKanbanList';

const fakeOrder = {};

export const OrdersKanban = () => {
  // context
  const business = useContextBusiness();
  //state
  const { updateBusinessProfile } = useBusinessProfile();
  const orders = useOrders(undefined, business!.id);
  const ordersByStatus = splitByStatus(orders);
  /*const ordersByStatus = {
    confirmed: [{ code: 'gascaksnc' }, { code: 'gas165216' }, { code: 'ga8ywfiewe' }],
  };*/
  // UI
  return (
    <Box pb="12">
      <Text fontSize="3xl" fontWeight="700" color="black">
        {t('Gerenciador de pedidos')}
      </Text>
      <Text fontSize="sm" color="grey.700">
        {t('Dados atualizados em 00/00/0000 às 00:00')}
      </Text>
      <HStack mt="6" spacing={4}>
        <Switch
          isChecked={business?.status === 'open'}
          onChange={(ev) => {
            ev.stopPropagation();
            updateBusinessProfile({ status: ev.target.checked ? 'open' : 'closed' });
          }}
        />
        <Text>{t('Aceitar pedidos automaticamente:')}</Text>
        <Button variant="outline" size="sm" borderColor="#F2F6EA" fontWeight="700" color="black">
          <EditIcon style={{ borderBottom: '1px solid black' }} />
          <Text ml="4">05 minutos</Text>
        </Button>
      </HStack>
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
