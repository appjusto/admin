import { OrderStatus, OrderType } from '@appjusto/types';
import { ArrowDownIcon } from '@chakra-ui/icons';
import { Button, CheckboxGroup, Flex, HStack, Stack, Text } from '@chakra-ui/react';
import { useObserveOrdersHistory } from 'app/api/order/useObserveOrdersHistory';
import { ClearFiltersButton } from 'common/components/backoffice/ClearFiltersButton';
import { FiltersScrollBar } from 'common/components/backoffice/FiltersScrollBar';
import { FilterText } from 'common/components/backoffice/FilterText';
import CustomCheckbox from 'common/components/form/CustomCheckbox';
import { CustomDateFilter } from 'common/components/form/input/CustomDateFilter';
import { CustomInput } from 'common/components/form/input/CustomInput';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../../PageHeader';
import { BackofficeOrderDrawer } from '../drawers/order';
import { OrdersTable } from './OrdersTable';

const statuses = [
  'confirming',
  'declined',
  'rejected',
  'confirmed',
  'preparing',
  'ready',
  'dispatching',
  'delivered',
  'canceled',
] as OrderStatus[];

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
    statuses,
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
        <Stack spacing={4} direction={{ base: 'column', md: 'row' }}>
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
        </Stack>
      </Flex>
      <Flex mt="8" w="100%" justifyContent="space-between" borderBottom="1px solid #C8D7CB">
        <FiltersScrollBar>
          <HStack spacing={4}>
            <FilterText
              isActive={filterBar === 'all' ? true : false}
              label={t('Todos')}
              onClick={() => setFilterBar('all')}
            />
            <FilterText
              isActive={filterBar === 'confirming' ? true : false}
              label={t('Confirmando')}
              onClick={() => setFilterBar('confirming')}
            />
            <FilterText
              isActive={filterBar === 'preparing' ? true : false}
              label={t('Preparando')}
              onClick={() => setFilterBar('preparing')}
            />
            <FilterText
              isActive={filterBar === 'ready' ? true : false}
              label={t('Prontos')}
              onClick={() => setFilterBar('ready')}
            />
            <FilterText
              isActive={filterBar === 'dispatching' ? true : false}
              label={t('Despachando')}
              onClick={() => setFilterBar('dispatching')}
            />
            <FilterText
              isActive={filterBar === 'delivered' ? true : false}
              label={t('Entregues')}
              onClick={() => setFilterBar('delivered')}
            />
            <FilterText
              isActive={filterBar === 'declined' ? true : false}
              label={t('Recusados')}
              onClick={() => setFilterBar('declined')}
            />
            <FilterText
              isActive={filterBar === 'rejected' ? true : false}
              label={t('Rejeitados')}
              onClick={() => setFilterBar('rejected')}
            />
            <FilterText
              isActive={filterBar === 'canceled' ? true : false}
              label={t('Cancelados')}
              onClick={() => setFilterBar('canceled')}
            />
          </HStack>
        </FiltersScrollBar>
        <ClearFiltersButton clearFunction={clearFilters} />
      </Flex>
      <Stack mt="6" direction={{ base: 'column', md: 'row' }} spacing={8} color="black">
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
            <CustomCheckbox value="food">{t('Restaurantes')}</CustomCheckbox>
            <CustomCheckbox value="p2p">{t('Encomendas')}</CustomCheckbox>
          </HStack>
        </CheckboxGroup>
      </Stack>
      <OrdersTable orders={orders} isBackoffice />
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
