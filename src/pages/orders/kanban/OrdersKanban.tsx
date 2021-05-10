import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
} from '@chakra-ui/react';
import { splitByStatus } from 'app/api/order/selectors';
import { Order, WithId } from 'appjusto-types';
import { ReactComponent as ChatIcon } from 'common/img/chat.svg';
import { ReactComponent as EditIcon } from 'common/img/edit-icon.svg';
import { ReactComponent as SearchIcon } from 'common/img/searchIcon.svg';
import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import { useOrdersContext } from '../context';
import { OrderSearchResult } from './OrderSearchResult';
import { OrdersKanbanList } from './OrdersKanbanList';

export const OrdersKanban = () => {
  // context
  const isDev = process.env.NODE_ENV === 'development';
  const { path } = useRouteMatch();
  const { business, orders, statuses, createFakeOrder } = useOrdersContext();
  // state
  const ordersByStatus = splitByStatus(orders, statuses);
  const [dateTime, setDateTime] = React.useState('');
  const [orderSearch, setOrderSearch] = React.useState('');
  const [searchResult, setSearchResult] = React.useState<WithId<Order>[]>([]);
  // side effects
  React.useEffect(() => {
    const { date, time } = getDateTime();
    setDateTime(`${date} às ${time}`);
  }, [orders]);

  React.useEffect(() => {
    if (orderSearch) {
      const regexp = new RegExp(orderSearch, 'i');
      const result = orders.filter((order) => regexp.test(order.code as string));
      setSearchResult(result);
    }
  }, [orders, orderSearch]);
  // UI
  return (
    <Box pb="12">
      <Flex justifyContent="space-between">
        <Flex flexDir="column">
          <Text fontSize="3xl" fontWeight="700" color="black">
            {t('Gerenciador de pedidos')}
          </Text>
          <Text fontSize="xl" lineHeight="26px" color="black">
            {business?.name}
          </Text>
          <Flex mt="2" alignItems="center">
            <Text mr="4" fontSize="sm" fontWeight="700" color="black">
              {t('Aceitar pedidos automaticamente:')}
            </Text>
            <Link to={`${path}/acceptance-time`}>
              <Button
                variant="outline"
                minW="140px"
                size="sm"
                borderColor="#F2F6EA"
                fontWeight="700"
                color="black"
              >
                <EditIcon style={{ borderBottom: '1px solid black' }} />
                <Text ml="4">
                  {business?.orderAcceptanceTime
                    ? business.orderAcceptanceTime / 60 + ' minutos'
                    : t('Não aceitar')}
                </Text>
              </Button>
            </Link>
          </Flex>
        </Flex>
        {isDev && <Button onClick={createFakeOrder}>Criar Ordem</Button>}
        <Flex flexDir="column" alignItems="flex-end">
          <HStack spacing={4}>
            <InputGroup maxW="360px">
              <Input
                minW="340px"
                height="60px"
                borderColor="black"
                _hover={{ borderColor: 'black' }}
                value={orderSearch}
                placeholder={t('Pesquisar por nº do pedido')}
                onChange={(ev) => setOrderSearch(ev.target.value)}
              />
              <InputRightElement
                mt="10px"
                mr="8px"
                children={<Icon w="22px" h="22px" as={SearchIcon} />}
              />
            </InputGroup>
            <Link to={`${path}/`}>
              <Button
                variant="outline"
                minW="100px"
                height="60px"
                borderColor="#F2F6EA"
                fontWeight="700"
                color="black"
              >
                <ChatIcon />
                <Text ml="4">{t('Chat')}</Text>
              </Button>
            </Link>
          </HStack>
          <Text mt="4" fontSize="sm" color="grey.700">
            {t('Dados atualizados em ')}
            <Text as="span" letterSpacing="0.2px">
              {dateTime}
            </Text>
          </Text>
        </Flex>
      </Flex>
      {orderSearch.length > 0 ? (
        <OrderSearchResult orders={searchResult} />
      ) : (
        <Stack direction={['column', 'column', 'row']} mt="8" spacing="4">
          <OrdersKanbanList
            title={t('Pedidos à confirmar')}
            orders={ordersByStatus['confirmed']}
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
            title={t('Retirada/entrega')}
            orders={[...ordersByStatus['ready'], ...ordersByStatus['dispatching']]}
            details={t('Aqui você verá os pedidos aguardando retirada pelo entregador.')}
          />
          <OrdersKanbanList
            title={t('Pedidos cancelados')}
            orders={ordersByStatus['canceled']}
            details={t('Aqui você verá os pedidos que estão à caminho da entrega pela entregador.')}
          />
        </Stack>
      )}
    </Box>
  );
};
