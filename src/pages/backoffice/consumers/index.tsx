import { ConsumerAlgolia } from '@appjusto/types';
import { ArrowDownIcon } from '@chakra-ui/icons';
import { Button, Flex, HStack, Stack, Text } from '@chakra-ui/react';
import { BasicUserFilter } from 'app/api/search/types';
import { useBasicUsersSearch } from 'app/api/search/useBasicUsersSearch';
import { ClearFiltersButton } from 'common/components/backoffice/ClearFiltersButton';
import { FiltersScrollBar } from 'common/components/backoffice/FiltersScrollBar';
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
      <Stack mt="8" spacing={4} direction={{ base: 'column', md: 'row' }}>
        <CustomInput
          mt="0"
          w="100%"
          id="search-id"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          label={t('Buscar')}
          placeholder={t('Buscar por ID, nome, e-mail ou CPF')}
        />
        <StateAndCityFilter
          state={state}
          handleStateChange={setState}
          city={city}
          handleCityChange={setCity}
        />
      </Stack>
      <Flex mt="8" w="100%" justifyContent="space-between" borderBottom="1px solid #C8D7CB">
        <FiltersScrollBar>
          <HStack spacing={4}>
            <FilterText
              isActive={filterBar === 'all' ? true : false}
              label={t('Todos')}
              onClick={() => setFilterBar('all')}
            />
            <FilterText
              isActive={filterBar === 'submitted' ? true : false}
              label={t('Submetidos')}
              onClick={() => setFilterBar('submitted')}
            />
            <FilterText
              isActive={filterBar === 'approved' ? true : false}
              label={t('Aprovados')}
              onClick={() => setFilterBar('approved')}
            />
            <FilterText
              isActive={filterBar === 'rejected' ? true : false}
              label={t('Rejeitados')}
              onClick={() => setFilterBar('rejected')}
            />
            <FilterText
              isActive={filterBar === 'blocked' ? true : false}
              label={t('Bloqueados')}
              onClick={() => setFilterBar('blocked')}
            />
          </HStack>
        </FiltersScrollBar>
        <ClearFiltersButton clearFunction={clearSearchAndFilters} />
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
