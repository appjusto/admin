import { BusinessAlgolia, BusinessStatus } from '@appjusto/types';
import { ArrowDownIcon } from '@chakra-ui/icons';
import {
  Button,
  CheckboxGroup,
  Flex,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react';
import { BusinessesFilter } from 'app/api/search/types';
import { useBusinessesSearch } from 'app/api/search/useBusinessesSearch';
import { ClearFiltersButton } from 'common/components/backoffice/ClearFiltersButton';
import { FiltersScrollBar } from 'common/components/backoffice/FiltersScrollBar';
import CustomCheckbox from 'common/components/form/CustomCheckbox';
import { CustomInput } from 'common/components/form/input/CustomInput';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { getDateTime } from 'utils/functions';
import { t } from 'utils/i18n';
import PageHeader from '../../PageHeader';
import BusinessDrawer from '../drawers/business';
import { StateAndCityFilter } from '../StateAndCityFilter';
import { BusinessesTable } from './BusinessesTable';

const statusFilterOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'Aprovados', value: 'approved' },
  { label: 'Verificados', value: 'verified' },
  { label: 'Inválidos', value: 'invalid' },
  { label: 'Rejeitados', value: 'rejected' },
  { label: 'Pendentes', value: 'pending' },
  { label: 'Bloqueados', value: 'blocked' },
];

const BusinessesPage = () => {
  // context
  const { path } = useRouteMatch();
  const history = useHistory();
  // state
  const [dateTime, setDateTime] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [state, setState] = React.useState('');
  const [city, setCity] = React.useState('');
  const [filterBar, setFilterBar] = React.useState('all');
  const [filterCheck, setFilterCheck] = React.useState<BusinessStatus[]>([
    'open',
    'closed',
  ]);
  const [filters, setFilters] = React.useState<BusinessesFilter[]>([]);
  // search
  const {
    results: businesses,
    fetchNextPage,
    refetch,
  } = useBusinessesSearch<BusinessAlgolia>(true, 'businesses', filters, search);
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
  };
  const handleFilters = React.useCallback(() => {
    // state and city
    let stateArray = [] as BusinessesFilter[];
    let cityArray = [] as BusinessesFilter[];
    if (state !== '') {
      stateArray = [{ type: 'businessAddress.state', value: state }];
    }
    if (city !== '') {
      cityArray = [{ type: 'businessAddress.city', value: city }];
    }
    // situation
    let situationArray = [] as BusinessesFilter[];
    if (filterBar === 'pending')
      situationArray = [
        { type: 'situation', value: 'submitted' },
        { type: 'situation', value: 'pending' },
      ];
    else if (filterBar !== 'all')
      situationArray = [{ type: 'situation', value: filterBar }];
    // status
    let statusArray = filterCheck.map((str) => ({
      type: 'status',
      value: str,
    })) as BusinessesFilter[];
    // create filters
    setFilters([
      ...stateArray,
      ...cityArray,
      ...situationArray,
      ...statusArray,
    ]);
  }, [filterBar, state, city, filterCheck]);
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
      <PageHeader
        title={t('Restaurantes')}
        subtitle={t(`Atualizado ${dateTime}`)}
      />
      <Stack mt="8" spacing={4} direction={{ base: 'column', md: 'row' }}>
        <CustomInput
          mt="0"
          mr="0"
          w="100%"
          id="search-id"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          label={t('Buscar')}
          placeholder={t(
            'Buscar por ID, nome, CNPJ ou e-mail do administrador'
          )}
        />
        <StateAndCityFilter
          state={state}
          handleStateChange={setState}
          city={city}
          handleCityChange={setCity}
        />
      </Stack>
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
        <ClearFiltersButton clearFunction={clearSearchAndFilters} />
      </Flex>
      <Stack
        mt="6"
        spacing={8}
        color="black"
        direction={{ base: 'column', md: 'row' }}
      >
        <Text fontSize="lg" fontWeight="700" lineHeight="26px">
          {t(`${businesses?.length ?? '0'} itens na lista`)}
        </Text>
        <CheckboxGroup
          colorScheme="green"
          value={filterCheck}
          onChange={(values: BusinessStatus[]) => setFilterCheck(values)}
        >
          <HStack
            alignItems="flex-start"
            color="black"
            spacing={8}
            fontSize="16px"
            lineHeight="22px"
          >
            <CustomCheckbox value="open">{t('Aberto')}</CustomCheckbox>
            <CustomCheckbox value="closed">{t('Fechado')}</CustomCheckbox>
          </HStack>
        </CheckboxGroup>
      </Stack>
      <BusinessesTable businesses={businesses} />
      <Button mt="8" variant="secondary" onClick={fetchNextPage}>
        <ArrowDownIcon mr="2" />
        {t('Carregar mais')}
      </Button>
      <Switch>
        <Route path={`${path}/:businessId`}>
          <BusinessDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </>
  );
};

export default BusinessesPage;
