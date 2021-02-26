import { Box, Button, Flex, Stack, Text } from '@chakra-ui/react';
import { ReactComponent as EditIcon } from 'common/img/edit-icon.svg';
import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import { useOrdersContext } from '../context';
import { OrdersKanbanList } from './OrdersKanbanList';

export const OrdersKanban = () => {
  // context
  const { path } = useRouteMatch();
  const { business, ordersByStatus } = useOrdersContext();
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
      <Flex mt="4" alignItems="center">
        <Text mr="4" fontSize="sm" fontWeight="700" color="black">
          {t('Aceitar pedidos automaticamente:')}
        </Text>
        <Link to={`${path}/acceptance-time`}>
          <Button
            variant="outline"
            minW="130px"
            size="sm"
            borderColor="#F2F6EA"
            fontWeight="700"
            color="black"
          >
            <EditIcon style={{ borderBottom: '1px solid black' }} />
            <Text ml="4">{business?.orderAcceptanceTime + ' minutos' ?? t('Não aceitar')}</Text>
          </Button>
        </Link>
      </Flex>
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
