import { ArrowDownIcon, DeleteIcon } from '@chakra-ui/icons';
import { Button, Flex, HStack, Radio, RadioGroup, Text } from '@chakra-ui/react';
import { useOrdersSearch } from 'app/api/search/useOrdersSearch';
import { OrderStatus, OrderType } from 'appjusto-types';
import { OrderAlgolia } from 'appjusto-types/algolia';
import { FilterText } from 'common/components/backoffice/FilterText';
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
  const [orderType, setOrderType] = React.useState<OrderType>('food');
  const [dateFilter, setDateFilter] = React.useState<number[] | undefined>(undefined);
  const [orderStatus, setOrderStatus] = React.useState<OrderStatus>();

  const { results: orders, fetchNextPage, refetch } = useOrdersSearch<OrderAlgolia>(
    true,
    'orders',
    orderType,
    orderStatus,
    dateFilter,
    searchId
  );

  // handlers
  const closeDrawerHandler = () => {
    refetch();
    history.replace(path);
  };

  const cleanFilters = () => {
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

  React.useEffect(() => {
    if (searchFrom && searchTo) {
      const from = new Date(searchFrom).getTime();
      const to = new Date(searchTo).getTime();
      setDateFilter([from, to]);
    } else setDateFilter(undefined);
  }, [searchFrom, searchTo]);

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
            placeholder={t('000')}
          />
          <CustomInput
            mt="0"
            type="date"
            id="search-name"
            value={searchFrom}
            onChange={(event) => setSearchFrom(event.target.value)}
            label={t('De')}
          />
          <CustomInput
            mt="0"
            type="date"
            id="search-name"
            value={searchTo}
            onChange={(event) => setSearchTo(event.target.value)}
            label={t('Até')}
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
            {t('Aguardando retirada')}
          </FilterText>
          <FilterText
            isActive={filterBar === 'dispatching' ? true : false}
            onClick={() => setFilterBar('dispatching')}
          >
            {t('À caminho')}
          </FilterText>
          <FilterText
            isActive={filterBar === 'delivered' ? true : false}
            onClick={() => setFilterBar('delivered')}
          >
            {t('Finalizados')}
          </FilterText>
        </HStack>
        <HStack spacing={2} color="#697667" cursor="pointer" onClick={cleanFilters}>
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
        <RadioGroup
          mt="4"
          onChange={(value) => setOrderType(value as OrderType)}
          value={orderType}
          defaultValue="1"
          colorScheme="green"
          color="black"
          fontSize="15px"
          lineHeight="21px"
        >
          <HStack
            alignItems="flex-start"
            color="black"
            spacing={8}
            fontSize="16px"
            lineHeight="22px"
          >
            <Radio value="food">{t('Restaurantes')}</Radio>
            <Radio value="p2p">{t('Encomendas')}</Radio>
          </HStack>
        </RadioGroup>
      </HStack>
      <OrdersTable orders={orders} />
      <Button mt="8" variant="grey" onClick={fetchNextPage}>
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
