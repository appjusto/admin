import { ArrowDownIcon, DeleteIcon } from '@chakra-ui/icons';
import { Button, Flex, HStack, Text } from '@chakra-ui/react';
import { BasicUserFilter } from 'app/api/search/types';
import { useBasicUsersSearch } from 'app/api/search/useBasicUsersSearch';
import { ConsumerAlgolia } from 'appjusto-types';
import { FilterText } from 'common/components/backoffice/FilterText';
import { CustomInput } from 'common/components/form/input/CustomInput';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../../PageHeader';
import { ConsumerDrawer } from '../drawers/consumer';
import { StateAndCityFilter } from '../StateAndCityFilter';
import { ConsumersTable } from './ConsumersTable';

const ConsumersPage = () => {
  // context
  const { path } = useRouteMatch();
  const history = useHistory();
  // state
  const [dateTime, setDateTime] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [state, setState] = React.useState('');
  const [city, setCity] = React.useState('');
  const [filterBar, setFilterBar] = React.useState('all');
  const [filters, setFilters] = React.useState<BasicUserFilter[]>([]);

  const { results: consumers, fetchNextPage } = useBasicUsersSearch<ConsumerAlgolia>(
    true,
    'consumers',
    filters,
    search
  );

  // handlers
  const closeDrawerHandler = () => history.replace(path);

  const clearSearchAndFilters = () => {
    setSearch('');
    setState('');
    setCity('');
    setFilterBar('all');
  };

  const handleFilters = React.useCallback(() => {
    // state and city
    let stateArray = [] as BasicUserFilter[];
    let cityArray = [] as BasicUserFilter[];
    if (state !== '') {
      stateArray = [{ type: 'state', value: state }];
    }
    if (city !== '') {
      cityArray = [{ type: 'city', value: city }];
    }
    // situation
    let situationArray = [] as BasicUserFilter[];
    if (filterBar === 'all') situationArray = [] as BasicUserFilter[];
    else situationArray = [{ type: 'situation', value: filterBar }];
    // create filters
    setFilters([...stateArray, ...cityArray, ...situationArray]);
  }, [state, city, filterBar]);

  // side effects
  React.useEffect(() => {
    const { date, time } = getDateTime();
    setDateTime(`${date} às ${time}`);
  }, []);

  React.useEffect(() => {
    handleFilters();
  }, [state, city, filterBar, handleFilters]);

  // UI
  return (
    <>
      <PageHeader title={t('Clientes')} subtitle={t(`Atualizado ${dateTime}`)} />
      <HStack mt="8" spacing={4}>
        <CustomInput
          mt="0"
          w="100%"
          id="search-id"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          label={t('Buscar')}
          placeholder={t('Buscar por ID, nome ou e-mail')}
        />
        <StateAndCityFilter
          state={state}
          handleStateChange={setState}
          city={city}
          handleCityChange={setCity}
        />
      </HStack>
      <Flex mt="8" w="100%" justifyContent="space-between" borderBottom="1px solid #C8D7CB">
        <HStack spacing={4}>
          <FilterText
            isActive={filterBar === 'all' ? true : false}
            onClick={() => setFilterBar('all')}
          >
            {t('Todos')}
          </FilterText>
          <FilterText
            isActive={filterBar === 'approved' ? true : false}
            onClick={() => setFilterBar('approved')}
          >
            {t('Aprovados')}
          </FilterText>
          <FilterText
            isActive={filterBar === 'blocked' ? true : false}
            onClick={() => setFilterBar('blocked')}
          >
            {t('Bloqueados')}
          </FilterText>
        </HStack>
        <HStack spacing={2} color="#697667" cursor="pointer" onClick={clearSearchAndFilters}>
          <DeleteIcon />
          <Text fontSize="15px" lineHeight="21px">
            {t('Limpar filtro')}
          </Text>
        </HStack>
      </Flex>
      <HStack mt="6" spacing={8} color="black">
        <Text fontSize="lg" fontWeight="700" lineHeight="26px">
          {t(`${consumers?.length ?? '0'} itens na lista`)}
        </Text>
      </HStack>
      <ConsumersTable consumers={consumers} />
      <Button mt="8" variant="secondary" onClick={fetchNextPage}>
        <ArrowDownIcon mr="2" />
        {t('Carregar mais')}
      </Button>
      <Switch>
        <Route path={`${path}/:consumerId`}>
          <ConsumerDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </>
  );
};

export default ConsumersPage;
