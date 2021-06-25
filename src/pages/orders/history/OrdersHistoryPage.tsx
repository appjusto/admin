import { ArrowDownIcon } from '@chakra-ui/icons';
import { Button, Flex, HStack, Stack, Text } from '@chakra-ui/react';
import { useOrdersSearch } from 'app/api/search/useOrdersSearch';
import { useContextBusinessId } from 'app/state/business/context';
import { OrderAlgolia } from 'appjusto-types/algolia';
import Container from 'common/components/Container';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { OrdersTable } from 'pages/backoffice/orders/OrdersTable';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import PageHeader from '../../PageHeader';
import { OrderDrawer } from '../drawers/orderdrawer';

const OrdersHistoryPage = () => {
  // context
  const { path } = useRouteMatch();
  const history = useHistory();
  const businessId = useContextBusinessId();

  // state
  const [searchId, setSearchId] = React.useState('');
  const [searchFrom, setSearchFrom] = React.useState('');
  const [searchTo, setSearchTo] = React.useState('');

  const [dateFilter, setDateFilter] = React.useState<number[] | undefined>(undefined);

  const { results: orders, fetchNextPage, refetch } = useOrdersSearch<OrderAlgolia>(
    true,
    'orders',
    'food',
    businessId,
    undefined,
    dateFilter,
    searchId
  );

  // handlers
  const closeDrawerHandler = () => {
    refetch();
    history.replace(path);
  };

  // side effects
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
      <Container maxW={{ base: '100%', md: '740px', lg: '1260px' }}></Container>
      <PageHeader
        title={t('Histórico de pedidos')}
        subtitle={t(
          'Veja aqui os pedidos feitos em seu restaurante. Nesta página você pode também cancelar pedidos.'
        )}
        maxW="700px"
      />
      <Flex mt="8">
        <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
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
        </Stack>
      </Flex>
      <HStack mt="6" spacing={8} color="black">
        <Text fontSize="lg" fontWeight="700" lineHeight="26px">
          {t(`${orders?.length ?? '0'} itens na lista`)}
        </Text>
      </HStack>
      {businessId ? <OrdersTable orders={orders} /> : <Text>{t('Carregando...')}</Text>}
      <Button mt="8" variant="grey" onClick={fetchNextPage}>
        <ArrowDownIcon mr="2" />
        {t('Carregar mais')}
      </Button>
      <Switch>
        <Route path={`${path}/:orderId`}>
          <OrderDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </>
  );
};

export default OrdersHistoryPage;
