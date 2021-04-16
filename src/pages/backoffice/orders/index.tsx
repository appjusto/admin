import { DeleteIcon } from '@chakra-ui/icons';
import { Checkbox, CheckboxGroup, Flex, HStack, Text } from '@chakra-ui/react';
import { Order, WithId } from 'appjusto-types';
import { FilterText } from 'common/components/backoffice/FilterText';
import { CustomButton } from 'common/components/buttons/CustomButton';
import { CustomInput } from 'common/components/form/input/CustomInput';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../../PageHeader';
import { BusinessDrawer } from '../drawers/business';
import { OrdersTable } from './OrdersTable';

const OrdersPage = () => {
  // context
  const { path } = useRouteMatch();
  const history = useHistory();
  const orders = [] as WithId<Order>[];
  // state
  const [dateTime, setDateTime] = React.useState('');
  const [searchId, setSearchId] = React.useState('');
  const [searchFrom, setSearchFrom] = React.useState('');
  const [searchTo, setSearchTo] = React.useState('');

  const [filterText, setFilterText] = React.useState('all');
  const [filters, setFilters] = React.useState<string[]>([]);

  // handlers
  const closeDrawerHandler = () => history.replace(path);

  const handleFilterTexts = (value: string) => {
    setFilterText(value);
  };

  // side effects
  React.useEffect(() => {
    const { date, time } = getDateTime();
    setDateTime(`${date} às ${time}`);
  }, []);
  // UI
  return (
    <>
      <PageHeader title={t('Pedidos')} subtitle={t(`Atualizado ${dateTime}`)} />
      <Flex mt="8" justifyContent="space-between">
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
            w="180px"
            id="search-name"
            value={searchFrom}
            onChange={(event) => setSearchFrom(event.target.value)}
            label={t('De')}
          />
          <CustomInput
            mt="0"
            type="date"
            w="180px"
            id="search-name"
            value={searchTo}
            onChange={(event) => setSearchTo(event.target.value)}
            label={t('Até')}
          />
        </HStack>
        <CustomButton mt="0" maxW="200px" label={t('Filtrar resultados')} />
      </Flex>
      <Flex mt="8" w="100%" justifyContent="space-between" borderBottom="1px solid #C8D7CB">
        <HStack spacing={4}>
          <FilterText
            isActive={filterText === 'all' ? true : false}
            onClick={() => handleFilterTexts('all')}
          >
            {t('Todos')}
          </FilterText>
          <FilterText
            isActive={filterText === 'preparing' ? true : false}
            onClick={() => handleFilterTexts('preparing')}
          >
            {t('Em preparação')}
          </FilterText>
          <FilterText
            isActive={filterText === 'ready' ? true : false}
            onClick={() => handleFilterTexts('ready')}
          >
            {t('Aguardando retirada')}
          </FilterText>
          <FilterText
            isActive={filterText === 'dispatching' ? true : false}
            onClick={() => handleFilterTexts('dispatching')}
          >
            {t('À caminho')}
          </FilterText>
          <FilterText
            isActive={filterText === 'delivered' ? true : false}
            onClick={() => handleFilterTexts('delivered')}
          >
            {t('Finalizados')}
          </FilterText>
        </HStack>
        <HStack spacing={2} color="#697667" cursor="pointer" onClick={() => {}}>
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
          value={filters}
          onChange={(value) => setFilters(value as string[])}
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
      <Switch>
        <Route path={`${path}/:orderId`}>
          <BusinessDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </>
  );
};

export default OrdersPage;
