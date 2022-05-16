import { Order, OrderStatus, WithId } from '@appjusto/types';
import {
  Box,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import { splitByStatus } from 'app/api/order/selectors';
import { useOrdersContext } from 'app/state/order';
import { ReactComponent as SearchIcon } from 'common/img/searchIcon.svg';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import { ChatButton } from './ChatButton';
import { OrderSearchResult } from './OrderSearchResult';
import { OrdersKanbanList } from './OrdersKanbanList';
import { PrintSwitch } from './PrintSwitch';

const statuses = ['confirmed', 'preparing', 'ready', 'dispatching', 'canceled'] as OrderStatus[];

export const OrdersKanban = () => {
  // context
  //const { path } = useRouteMatch();
  const { business, orders, newChatMessages } = useOrdersContext();
  // state
  const ordersByStatus = splitByStatus(orders, statuses);
  const [dateTime, setDateTime] = React.useState('');
  const [orderSearch, setOrderSearch] = React.useState('');
  const [searchResult, setSearchResult] = React.useState<WithId<Order>[]>([]);
  // helpers
  const isNewChatMessage = newChatMessages.length > 0;
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
      <Flex
        justifyContent="flex-end"
        h="19.5px"
        mt="-19.5px"
        mb="2"
        display={{ base: 'none', lg: 'block' }}
      >
        {isNewChatMessage &&
          (newChatMessages.length > 1 ? (
            <Text fontSize="xs" fontWeight="700" lineHeight="lg" color="black" textAlign="end">
              {t(`Você tem ${newChatMessages.length} novas mensagens!`)}
            </Text>
          ) : (
            <Text fontSize="xs" fontWeight="700" lineHeight="lg" color="black" textAlign="end">
              {t(`Você tem ${newChatMessages.length} nova mensagen!`)}
            </Text>
          ))}
      </Flex>
      <Flex flexDir={{ base: 'column', md: 'row' }} justifyContent="space-between">
        <Flex flexDir="column">
          <Text mt="-10px" fontSize="3xl" fontWeight="700" color="black">
            {t('Gerenciador de pedidos')}
          </Text>
          <Text fontSize="xl" lineHeight="26px" color="black">
            {business?.name}
          </Text>
          {/*
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
          */}
          <PrintSwitch />
        </Flex>
        <Flex mt={{ base: '4', md: '0' }} flexDir="column" alignItems="flex-end">
          <Stack w="100%" direction={{ base: 'column', lg: 'row' }} spacing={4}>
            <InputGroup w="100%" maxW={{ md: '320px', lg: '360px' }}>
              <Input
                w="100%"
                minW={{ lg: '340px' }}
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
            <Link as={RouterLink} to="/app/chat" textAlign={{ base: 'end', lg: 'start' }}>
              <ChatButton key={Math.random()} isNewMessage={isNewChatMessage} />
            </Link>
          </Stack>
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
        <Stack w="100%" direction={{ base: 'column', lg: 'row' }} mt="8" spacing={4}>
          <Stack w="100%" direction={{ base: 'column', md: 'row' }} spacing={4}>
            <OrdersKanbanList
              title={t('Pedidos a confirmar')}
              orders={ordersByStatus['confirmed']}
              details={t('Aqui você verá os novos pedidos. Aceite-os para confirmar o preparo.')}
            />
            <OrdersKanbanList
              title={t('Em preparação')}
              orders={ordersByStatus['preparing']}
              details={t(
                'Aqui você verá os pedidos que estão sendo preparados por você. Quando clicar em "Pedido pronto” ou o tempo expirar, o entregador estará esperando para buscá-lo.'
              )}
            />
          </Stack>
          <Stack w="100%" direction={{ base: 'column', md: 'row' }} spacing={4}>
            <OrdersKanbanList
              title={t('Retirada/entrega')}
              orders={[...ordersByStatus['ready'], ...ordersByStatus['dispatching']]}
              details={t('Aqui você verá os pedidos aguardando retirada pelo entregador.')}
            />
            <OrdersKanbanList
              title={t('Pedidos cancelados')}
              orders={ordersByStatus['canceled']}
              details={t('Aqui você verá os pedidos cancelados.')}
            />
          </Stack>
        </Stack>
      )}
    </Box>
  );
};
