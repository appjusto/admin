import { Fulfillment, OrderStatus } from '@appjusto/types';
import { ArrowDownIcon } from '@chakra-ui/icons';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  HStack,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { useObserveBusinessOrdersHistory } from 'app/api/order/useObserveBusinessOrdersHistory';
import { useContextBusinessId } from 'app/state/business/context';
import { ClearFiltersButton } from 'common/components/backoffice/ClearFiltersButton';
import { FiltersScrollBar } from 'common/components/backoffice/FiltersScrollBar';
import Container from 'common/components/Container';
import { CustomDateFilter } from 'common/components/form/input/CustomDateFilter';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { isEqual } from 'lodash';
import React from 'react';
import { CSVLink } from 'react-csv';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import PageHeader from '../../PageHeader';
import { OrderDrawer } from '../drawers/orderdrawer';
import { BusinessOrdersTable } from './BusinessOrdersTable';
import { getOrdersCsvData } from './utils';

const statuses = [
  'scheduled',
  'confirmed',
  'preparing',
  'ready',
  'dispatching',
  'delivered',
  'canceled',
] as OrderStatus[];

const statusFilterOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'Agendados', value: 'scheduled' },
  { label: 'Entregues', value: 'delivered' },
  { label: 'Cancelados', value: 'canceled' },
];

const initialFulfillment = ['delivery', 'take-away'] as Fulfillment[];

const OrdersHistoryPage = () => {
  // context
  const { path } = useRouteMatch();
  const history = useHistory();
  const businessId = useContextBusinessId();
  // state
  const [searchId, setSearchId] = React.useState('');
  const [searchFrom, setSearchFrom] = React.useState('');
  const [searchTo, setSearchTo] = React.useState('');
  const [clearDateNumber, setClearDateNumber] = React.useState(0);
  const [filterBar, setFilterBar] = React.useState('all');
  const [orderStatus, setOrderStatus] = React.useState<OrderStatus>();
  const [fulfillment, setFulfillment] =
    React.useState<Fulfillment[]>(initialFulfillment);
  const { orders, fetchNextPage } = useObserveBusinessOrdersHistory(
    businessId,
    statuses,
    searchId,
    searchFrom,
    searchTo,
    orderStatus,
    fulfillment
  );
  // helpers
  const ordersCsv = getOrdersCsvData(orders);
  // handlers
  const closeDrawerHandler = () => {
    history.replace(path);
  };
  const clearFilters = (exceptId?: boolean) => {
    setClearDateNumber((prev) => prev + 1);
    if (!exceptId) setSearchId('');
    setSearchFrom('');
    setSearchTo('');
    setFilterBar('all');
  };
  const handleFulfillment = (values: Fulfillment[]) => {
    if (values.length > 0) {
      setFulfillment(values);
    }
  };
  // side effects
  React.useEffect(() => {
    if (filterBar === 'all') setOrderStatus(undefined);
    else setOrderStatus(filterBar as OrderStatus);
  }, [filterBar]);
  React.useEffect(() => {
    if (searchId.length > 0) {
      clearFilters(true);
    }
  }, [searchId]);
  React.useEffect(() => {
    if (
      searchFrom.length > 0 ||
      searchTo.length > 0 ||
      orderStatus ||
      !isEqual(fulfillment, initialFulfillment)
    ) {
      setSearchId('');
    }
  }, [searchFrom, searchTo, orderStatus, fulfillment]);
  // UI
  return (
    <>
      <Container maxW={{ base: '100%', md: '740px', lg: '1260px' }}></Container>
      <PageHeader
        title={t('Histórico de pedidos')}
        subtitle={t(
          'Veja aqui os pedidos feitos em seu restaurante. Nesta página você pode também cancelar pedidos.'
        )}
        maxW="700px"
      />
      <Flex mt="8">
        <Stack
          alignItems={{ md: 'end' }}
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
        >
          <CustomInput
            mt="0"
            maxW="212px"
            id="search-id"
            value={searchId}
            onChange={(event) => setSearchId(event.target.value)}
            label={t('ID')}
            placeholder={t('000')}
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
      <HStack mt="6" spacing={8} color="black">
        <Text fontSize="lg" fontWeight="700" lineHeight="26px">
          {t(`${orders?.length ?? '0'} itens na lista`)}
        </Text>
        <CheckboxGroup
          colorScheme="green"
          value={fulfillment}
          onChange={(values: Fulfillment[]) => handleFulfillment(values)}
        >
          <HStack
            alignItems="flex-start"
            color="black"
            spacing={8}
            fontSize="16px"
            lineHeight="22px"
          >
            <Checkbox value="delivery">{t('Delivery')}</Checkbox>
            <Checkbox value="take-away">{t('Retirada')}</Checkbox>
          </HStack>
        </CheckboxGroup>
      </HStack>
      {businessId ? (
        <BusinessOrdersTable orders={orders} />
      ) : (
        <Text>{t('Carregando...')}</Text>
      )}
      <Flex mt="8" justifyContent="space-between">
        <Button variant="secondary" onClick={fetchNextPage}>
          <ArrowDownIcon mr="2" />
          {t('Carregar mais')}
        </Button>
        <CSVLink
          filename="pedidos-appjusto.csv"
          data={ordersCsv.data}
          headers={ordersCsv.headers}
        >
          <Tooltip
            label={t(
              'Certifique-se de ter filtrado e carregado a lista completa dos pedidos que deseja exportar'
            )}
          >
            <Button variant="outline">{t('Exportar .csv')}</Button>
          </Tooltip>
        </CSVLink>
      </Flex>
      <Switch>
        <Route path={`${path}/:orderId`}>
          <OrderDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </>
  );
};

export default OrdersHistoryPage;
