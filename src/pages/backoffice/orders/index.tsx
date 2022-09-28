import { Fulfillment, OrderStatus, OrderType } from '@appjusto/types';
import { ArrowDownIcon } from '@chakra-ui/icons';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  HStack,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useObserveOrdersHistory } from 'app/api/order/useObserveOrdersHistory';
import { InQueryArray } from 'app/api/types';
import { ClearFiltersButton } from 'common/components/backoffice/ClearFiltersButton';
import { FiltersScrollBar } from 'common/components/backoffice/FiltersScrollBar';
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
  'scheduled',
  'declined',
  'rejected',
  'confirmed',
  'preparing',
  'ready',
  'dispatching',
  'delivered',
  'canceled',
] as InQueryArray<OrderStatus>;

const statusFilterOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'Agendados', value: 'scheduled' },
  { label: 'Confirmando', value: 'confirming' },
  { label: 'Preparando', value: 'preparing' },
  { label: 'Prontos', value: 'ready' },
  { label: 'Despachando', value: 'dispatching' },
  { label: 'Entregues', value: 'delivered' },
  { label: 'Recusados', value: 'declined' },
  { label: 'Rejeitados', value: 'rejected' },
  { label: 'Cancelados', value: 'canceled' },
];

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
  const [orderType, setOrderType] = React.useState<OrderType[]>([
    'food',
    'p2p',
  ]);
  const [fulfillment, setFulfillment] = React.useState<Fulfillment[]>([
    'delivery',
    'take-away',
  ]);
  const [orderStatus, setOrderStatus] = React.useState<OrderStatus>();

  const [clearDateNumber, setClearDateNumber] = React.useState(0);

  const { orders, fetchNextPage } = useObserveOrdersHistory(
    null,
    statuses,
    searchId,
    searchFrom,
    searchTo,
    orderStatus,
    orderType,
    fulfillment
  );

  // handlers
  const closeDrawerHandler = () => {
    history.replace(path);
  };

  const handleOrderType = (value: OrderType[]) => {
    if (value.length > 0) {
      setOrderType(value);
      if (value.length === 1 && value[0] === 'p2p') {
        setFulfillment(['delivery', 'take-away']);
      }
    }
  };

  const handleFulfillment = (value: Fulfillment[]) => {
    if (value.length > 0) {
      setFulfillment(value);
      if (value.length < 2) {
        setOrderType(['food']);
      }
    }
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
      <Flex
        mt="8"
        w="100%"
        justifyContent="space-between"
        borderBottom="1px solid #C8D7CB"
      >
        <FiltersScrollBar
          filters={statusFilterOptions}
          currentValue={filterBar}
          selectFilter={setFilterBar}
        />
        <ClearFiltersButton clearFunction={clearFilters} />
      </Flex>
      <Stack
        mt="6"
        direction={{ base: 'column', md: 'row' }}
        spacing={8}
        color="black"
      >
        <Text fontSize="lg" fontWeight="700" lineHeight="26px">
          {t(`${orders?.length ?? '0'} itens na lista`)}
        </Text>
        <CheckboxGroup
          colorScheme="green"
          value={orderType}
          onChange={(values: OrderType[]) => handleOrderType(values)}
        >
          <VStack alignItems="flex-start" color="black" spacing={4}>
            <Checkbox value="food">{t('Restaurantes')}</Checkbox>
            <Checkbox value="p2p">{t('Encomendas')}</Checkbox>
          </VStack>
        </CheckboxGroup>
        <CheckboxGroup
          colorScheme="green"
          size="sm"
          value={fulfillment}
          onChange={(values: Fulfillment[]) => handleFulfillment(values)}
          isDisabled={!orderType.includes('food')}
        >
          <HStack mt="4" alignItems="flex-start" color="black" spacing={8}>
            <Checkbox value="delivery">{t('Delivery')}</Checkbox>
            <Checkbox value="take-away">{t('Retirada')}</Checkbox>
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
