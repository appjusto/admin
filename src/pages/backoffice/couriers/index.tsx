import { ArrowDownIcon } from '@chakra-ui/icons';
import { Button, CheckboxGroup, Flex, HStack, Stack, Text } from '@chakra-ui/react';
import { BasicUserFilter } from 'app/api/search/types';
import { useBasicUsersSearch } from 'app/api/search/useBasicUsersSearch';
import { CourierAlgolia, CourierStatus } from 'appjusto-types';
import { ClearFiltersButton } from 'common/components/backoffice/ClearFiltersButton';
import { FiltersScrollBar } from 'common/components/backoffice/FiltersScrollBar';
import { FilterText } from 'common/components/backoffice/FilterText';
import CustomCheckbox from 'common/components/form/CustomCheckbox';
import { CustomInput } from 'common/components/form/input/CustomInput';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../../PageHeader';
import { CourierDrawer } from '../drawers/courier';
import { StateAndCityFilter } from '../StateAndCityFilter';
import { CouriersTable } from './CouriersTable';

const CouriersPage = () => {
  // context
  const { path } = useRouteMatch();
  const history = useHistory();
  // state
  const [dateTime, setDateTime] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [state, setState] = React.useState('');
  const [city, setCity] = React.useState('');
  const [filterBar, setFilterBar] = React.useState('invalid');
  const [filterCheck, setFilterCheck] = React.useState<CourierStatus[]>([
    'available',
    'unavailable',
    'dispatching',
  ]);
  const [filters, setFilters] = React.useState<BasicUserFilter[]>([]);

  const { results: couriers, fetchNextPage, refetch } = useBasicUsersSearch<CourierAlgolia>(
    true,
    'couriers',
    filters,
    search
  );

  // handlers
  const closeDrawerHandler = () => {
    refetch();
    history.replace(path);
  };

  const clearSearchAndFilters = () => {
    setSearch('');
    setState('');
    setCity('');
    setFilterBar('all');
    setFilterCheck(['available', 'unavailable']);
  };

  const handleFilters = React.useCallback(() => {
    // state and city
    let stateArray = [] as BasicUserFilter[];
    let cityArray = [] as BasicUserFilter[];
    if (state !== '') {
      stateArray = [{ type: 'courierAddress.state', value: state }];
    }
    if (city !== '') {
      cityArray = [{ type: 'courierAddress.city', value: city }];
    }
    // situation
    let situationArray = [] as BasicUserFilter[];
    if (filterBar === 'pending')
      situationArray = [
        { type: 'situation', value: 'submitted' },
        { type: 'situation', value: 'pending' },
      ];
    else if (filterBar !== 'all') situationArray = [{ type: 'situation', value: filterBar }];
    // status
    let statusArray = filterCheck.map((str) => ({
      type: 'status',
      value: str,
    })) as BasicUserFilter[];
    // create filters
    setFilters([...stateArray, ...cityArray, ...situationArray, ...statusArray]);
  }, [state, city, filterBar, filterCheck]);

  // side effects
  React.useEffect(() => {
    const { date, time } = getDateTime();
    setDateTime(`${date} às ${time}`);
  }, []);

  React.useEffect(() => {
    handleFilters();
  }, [state, city, filterBar, filterCheck, handleFilters]);

  // UI
  return (
    <>
      <PageHeader title={t('Entregadores')} subtitle={t(`Atualizado ${dateTime}`)} />
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
              isActive={filterBar === 'approved' ? true : false}
              label={t('Aprovados')}
              onClick={() => setFilterBar('approved')}
            />
            <FilterText
              isActive={filterBar === 'verified' ? true : false}
              label={t('Verificados')}
              onClick={() => setFilterBar('verified')}
            />
            <FilterText
              isActive={filterBar === 'invalid' ? true : false}
              label={t('Inválidos')}
              onClick={() => setFilterBar('invalid')}
            />
            <FilterText
              isActive={filterBar === 'pending' ? true : false}
              label={t('Pendentes')}
              onClick={() => setFilterBar('pending')}
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
      <Stack mt="6" spacing={8} direction={{ base: 'column', md: 'row' }} color="black">
        <Text fontSize="lg" fontWeight="700" lineHeight="26px">
          {t(`${couriers?.length ?? '0'} itens na lista`)}
        </Text>
        <CheckboxGroup
          colorScheme="green"
          value={filterCheck}
          onChange={(values: CourierStatus[]) => setFilterCheck(values)}
        >
          <Stack
            direction={{ base: 'column', md: 'row' }}
            alignItems="flex-start"
            color="black"
            spacing={{ base: 4, md: 8 }}
            fontSize="16px"
            lineHeight="22px"
          >
            <CustomCheckbox value="available">{t('Disponível')}</CustomCheckbox>
            <CustomCheckbox value="unavailable">{t('Indisponível')}</CustomCheckbox>
            <CustomCheckbox value="dispatching">{t('Realizando entrega')}</CustomCheckbox>
          </Stack>
        </CheckboxGroup>
      </Stack>
      <CouriersTable couriers={couriers} />
      <Button mt="8" variant="secondary" onClick={fetchNextPage}>
        <ArrowDownIcon mr="2" />
        {t('Carregar mais')}
      </Button>
      <Switch>
        <Route path={`${path}/:courierId`}>
          <CourierDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </>
  );
};

export default CouriersPage;
