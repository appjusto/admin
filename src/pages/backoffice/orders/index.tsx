import { ArrowDownIcon, DeleteIcon } from '@chakra-ui/icons';
import { Button, Checkbox, CheckboxGroup, Flex, HStack, Text } from '@chakra-ui/react';
import { useObserveOrdersHistory } from 'app/api/order/useObserveOrdersHistory';
import { OrderStatus, OrderType } from 'appjusto-types';
import { FilterText } from 'common/components/backoffice/FilterText';
import { CustomDateFilter } from 'common/components/form/input/CustomDateFilter';
import { CustomInput } from 'common/components/form/input/CustomInput';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../../PageHeader';
import { BackofficeOrderDrawer } from '../drawers/order';
import { OrdersTable } from './OrdersTable';

const OrdersPage = () => {
  // context
  const { path } = useRouteMatch();
  const history = useHistory();
  // state
  const [dateTime, setDateTime] = React.useState('');
  const [searchId, setSearchId] = React.useState('');
  const [searchFrom, setSearchFrom] = React.useState('');
  const [searchTo, setSearchTo] = React.useState('');

  const [filterBar, setFilterBar] = React.useState('all');
  const [orderType, setOrderType] = React.useState<OrderType[]>(['food', 'p2p']);
  const [orderStatus, setOrderStatus] = React.useState<OrderStatus>();

  const [clearDateNumber, setClearDateNumber] = React.useState(0);

  const { orders, fetchNextPage } = useObserveOrdersHistory(
    null,
    null,
    searchId,
    searchFrom,
    searchTo,
    orderStatus,
    orderType
  );

  // handlers
  const closeDrawerHandler = () => {
    history.replace(path);
  };

  const clearFilters = () => {
    setClearDateNumber((prev) => prev + 1);
    setSearchId('');
    setFilterBar('all');
    setSearchFrom('');
    setSearchTo('');
  };

  // side effects
  React.useEffect(() => {
    const { date, time } = getDateTime();
    setDateTime(`${date} às ${time}`);
  }, []);

  React.useEffect(() => {
    if (filterBar === 'all') setOrderStatus(undefined);
    else setOrderStatus(filterBar as OrderStatus);
  }, [filterBar]);

  // UI
  return (
    <>
      <PageHeader title={t('Pedidos')} subtitle={t(`Atualizado ${dateTime}`)} />
      <Flex mt="8">
        <HStack spacing={4}>
          <CustomInput
            mt="0"
            maxW="212px"
            id="search-id"
            value={searchId}
            onChange={(event) => setSearchId(event.target.value)}
            label={t('ID')}
            placeholder={t('ID do pedido')}
          />
          <CustomDateFilter
            getStart={setSearchFrom}
            getEnd={setSearchTo}
            clearNumber={clearDateNumber}
          />
        </HStack>
      </Flex>
      <Flex mt="8" w="100%" justifyContent="space-between" borderBottom="1px solid #C8D7CB">
        <HStack spacing={4}>
          <FilterText
            isActive={filterBar === 'all' ? true : false}
            onClick={() => setFilterBar('all')}
          >
            {t('Todos')}
          </FilterText>
          <FilterText
            isActive={filterBar === 'preparing' ? true : false}
            onClick={() => setFilterBar('preparing')}
          >
            {t('Em preparação')}
          </FilterText>
          <FilterText
            isActive={filterBar === 'ready' ? true : false}
            onClick={() => setFilterBar('ready')}
          >
            {t('Prontos')}
          </FilterText>
          <FilterText
            isActive={filterBar === 'dispatching' ? true : false}
            onClick={() => setFilterBar('dispatching')}
          >
            {t('A caminho')}
          </FilterText>
          <FilterText
            isActive={filterBar === 'delivered' ? true : false}
            onClick={() => setFilterBar('delivered')}
          >
            {t('Entregues')}
          </FilterText>
          <FilterText
            isActive={filterBar === 'declined' ? true : false}
            onClick={() => setFilterBar('declined')}
          >
            {t('Recusados')}
          </FilterText>
          <FilterText
            isActive={filterBar === 'canceled' ? true : false}
            onClick={() => setFilterBar('canceled')}
          >
            {t('Cancelados')}
          </FilterText>
        </HStack>
        <HStack spacing={2} color="#697667" cursor="pointer" onClick={clearFilters}>
          <DeleteIcon />
          <Text fontSize="15px" lineHeight="21px">
            {t('Limpar filtro')}
          </Text>
        </HStack>
      </Flex>
      <HStack mt="6" spacing={8} color="black">
        <Text fontSize="lg" fontWeight="700" lineHeight="26px">
          {t(`${orders?.length ?? '0'} itens na lista`)}
        </Text>
        <CheckboxGroup
          colorScheme="green"
          value={orderType}
          onChange={(values: OrderType[]) => setOrderType(values)}
        >
          <HStack
            alignItems="flex-start"
            color="black"
            spacing={8}
            fontSize="16px"
            lineHeight="22px"
          >
            <Checkbox iconColor="white" value="food">
              {t('Restaurantes')}
            </Checkbox>
            <Checkbox iconColor="white" value="p2p">
              {t('Encomendas')}
            </Checkbox>
          </HStack>
        </CheckboxGroup>
      </HStack>
      <OrdersTable orders={orders} />
      <Button mt="8" variant="secondary" onClick={fetchNextPage}>
        <ArrowDownIcon mr="2" />
        {t('Carregar mais')}
      </Button>
      <Switch>
        <Route path={`${path}/:orderId`}>
          <BackofficeOrderDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </>
  );
};

export default OrdersPage;
