import { Order, WithId } from '@appjusto/types';
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
import { useFetchOrderByCode } from 'app/api/order/useFetchOrderByCode';
import { useOrdersContext } from 'app/state/order';
import { ReactComponent as SearchIcon } from 'common/img/searchIcon.svg';
import { isEqual } from 'lodash';
import React, { KeyboardEvent } from 'react';
import { IoIosWarning } from 'react-icons/io';
import { Link as RouterLink } from 'react-router-dom';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import { ChatButton } from './ChatButton';
import { OrderSearchResult } from './OrderSearchResult';
import { OrdersKanbanList } from './OrdersKanbanList';
import { PrintSwitch } from './PrintSwitch';

export const OrdersKanban = () => {
  // context
  const {
    business,
    scheduledOrders,
    scheduledOrdersNumber,
    orders,
    canceledOrders,
    newChatMessages,
    fetchNextScheduledOrders,
    fetchNextCanceledOrders,
  } = useOrdersContext();
  // state
  const [dateTime, setDateTime] = React.useState('');
  const [confirmedOrders, setConfirmedOrders] = React.useState<WithId<Order>[]>(
    []
  );
  const [preparingOrders, setPreparingOrders] = React.useState<WithId<Order>[]>(
    []
  );
  const [readyAndDispatchingOrders, setReadyAndDispatchingOrders] =
    React.useState<WithId<Order>[]>([]);
  const [orderSearch, setOrderSearch] = React.useState('');
  const { orders: searchedOrder, fetchOrdersByCode } = useFetchOrderByCode(
    orderSearch,
    business?.id
  );
  // helpers
  const isNewChatMessage = newChatMessages.length > 0;
  // handlers
  const handleSearch = () => {
    if (orderSearch.length === 0) return;
    fetchOrdersByCode();
  };
  const handleUserKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSearch();
    }
  };
  // side effects
  React.useEffect(() => {
    const { date, time } = getDateTime();
    setDateTime(`${date} às ${time}`);
  }, [orders]);
  React.useEffect(() => {
    const confirmed = orders.filter((o) => o.status === 'confirmed');
    const preparing = orders.filter((o) => o.status === 'preparing');
    const readyAndDispatching = orders.filter(
      (o) => o.status === 'ready' || o.status === 'dispatching'
    );
    setConfirmedOrders((prev) => {
      if (isEqual(prev, confirmed)) return prev;
      else return confirmed;
    });
    setPreparingOrders((prev) => {
      if (isEqual(prev, preparing)) return prev;
      else return preparing;
    });
    setReadyAndDispatchingOrders((prev) => {
      if (isEqual(prev, readyAndDispatching)) return prev;
      else return readyAndDispatching;
    });
  }, [orders]);
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
            <Text
              fontSize="xs"
              fontWeight="700"
              lineHeight="lg"
              color="black"
              textAlign="end"
            >
              {t(`Você tem ${newChatMessages.length} novas mensagens!`)}
            </Text>
          ) : (
            <Text
              fontSize="xs"
              fontWeight="700"
              lineHeight="lg"
              color="black"
              textAlign="end"
            >
              {t(`Você tem ${newChatMessages.length} nova mensagen!`)}
            </Text>
          ))}
      </Flex>
      <Flex
        flexDir={{ base: 'column', md: 'row' }}
        justifyContent="space-between"
      >
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
        <Flex
          mt={{ base: '4', md: '0' }}
          flexDir="column"
          alignItems="flex-end"
        >
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
                onKeyDown={handleUserKeyPress}
              />
              <InputRightElement
                mt="10px"
                mr="8px"
                cursor="pointer"
                onClick={handleSearch}
                children={<Icon w="22px" h="22px" as={SearchIcon} />}
              />
            </InputGroup>
            <Link
              as={RouterLink}
              to="/app/chat"
              textAlign={{ base: 'end', lg: 'start' }}
            >
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
      <Flex
        mt="6"
        alignItems="center"
        border="1px solid #FFBE00"
        borderRadius="lg"
        bgColor="#FFF6D9"
        px="6"
        py="5"
      >
        <Icon as={IoIosWarning} w="6" h="6" color="#FFBE00" />
        <Box ml="4">
          <Text color="black">
            {t(
              'Em breve você precisará migrar para o novo gestor de pedidos, uma aplicação mais leve, criada para melhorar sua experiência com o appjusto.'
            )}
          </Text>
          <Text color="black">
            {t('Para acessar o novo gestor e fazer o seu login, ')}
            <Link
              fontWeight="semibold"
              textDecor="underline"
              href="https://pedidos.appjusto.com.br/"
              target="_blank"
            >
              {t('clique aqui.')}
            </Link>
          </Text>
        </Box>
      </Flex>
      {searchedOrder ? (
        <OrderSearchResult orders={searchedOrder} />
      ) : (
        <Stack
          w="100%"
          direction={{ base: 'column', lg: 'row' }}
          mt="8"
          spacing={4}
        >
          {scheduledOrders.length > 0 && (
            <OrdersKanbanList
              type="scheduled"
              title={t('Agendados para hoje')}
              orders={scheduledOrders}
              dataLength={scheduledOrdersNumber}
              details={t('Aqui você verá os pedidos agendados.')}
              maxW={{ lg: '280px' }}
              infiniteScroll
              loadData={fetchNextScheduledOrders}
            />
          )}
          <Stack w="100%" direction={{ base: 'column', md: 'row' }} spacing={4}>
            <OrdersKanbanList
              type="confirmed"
              title={t('Pedidos a confirmar')}
              orders={confirmedOrders}
              details={t(
                'Aqui você verá os novos pedidos. Aceite-os para confirmar o preparo.'
              )}
            />
            <OrdersKanbanList
              type="preparing"
              title={t('Em preparação')}
              orders={preparingOrders}
              details={t(
                'Aqui você verá os pedidos que estão sendo preparados por você. Quando clicar em "Pedido pronto” ou o tempo expirar, o entregador estará esperando para buscá-lo.'
              )}
            />
          </Stack>
          <Stack w="100%" direction={{ base: 'column', md: 'row' }} spacing={4}>
            <OrdersKanbanList
              type="ready"
              title={t('Retirada/entrega')}
              orders={readyAndDispatchingOrders}
              details={t(
                'Aqui você verá os pedidos aguardando retirada pelo entregador e os pedidos que estão a caminho da entrega.'
              )}
            />
            <OrdersKanbanList
              type="canceled"
              title={t('Pedidos cancelados')}
              orders={canceledOrders}
              details={t('Aqui você verá os pedidos cancelados.')}
              infiniteScroll
              loadData={fetchNextCanceledOrders}
            />
          </Stack>
        </Stack>
      )}
    </Box>
  );
};
